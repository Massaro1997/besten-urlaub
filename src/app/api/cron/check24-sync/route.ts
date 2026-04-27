import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchCheck24Sales } from '@/lib/check24-api'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Cron: poll Check24 Partner API for new sales, match back to our
 * AffiliateClick rows via subid == eventId, mark converted, fire TikTok
 * CompletePayment server-side.
 *
 * Configure as Vercel Cron in vercel.json (every 10 min):
 *   { "path": "/api/cron/check24-sync", "schedule": "*\/10 * * * *" }
 *
 * Protected by CRON_SECRET header — Vercel cron automatically sends it if
 * env var is set.
 */
export async function GET(request: NextRequest) {
  // Verify cron auth
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Default: look back 24h to catch anything recent
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()

  let sales
  try {
    sales = await fetchCheck24Sales(since)
  } catch (e) {
    console.error('Check24 API fetch failed:', e)
    return NextResponse.json({ error: 'fetch_failed', message: String(e) }, { status: 500 })
  }

  let persisted = 0
  let matched = 0
  let fired = 0
  const unmatched: string[] = []

  for (const sale of sales) {
    if (!sale.id) continue

    // 1. Persist/upsert Check24 sale row
    const click = sale.subid
      ? await prisma.affiliateClick.findUnique({ where: { eventId: sale.subid } })
      : null
    const isMatched = Boolean(click)

    const created = sale.timestamp ? new Date(sale.timestamp.replace(' ', 'T')) : new Date()

    const existing = await prisma.check24Sale.findUnique({ where: { id: sale.id } })

    await prisma.check24Sale.upsert({
      where: { id: sale.id },
      create: {
        id: sale.id,
        subid: sale.subid || null,
        product: sale.product,
        status: sale.status || 'unknown',
        revenue: sale.revenue || null,
        commission: sale.commission || null,
        currency: sale.currency || 'EUR',
        createdAtC24: created,
        matched: isMatched,
        firedToTiktok: false,
        raw: sale.raw as never,
      },
      update: {
        status: sale.status || 'unknown',
        revenue: sale.revenue || null,
        commission: sale.commission || null,
        matched: isMatched,
        raw: sale.raw as never,
      },
    })
    persisted++

    // 2. If matched and not yet fired and not cancelled, fire TikTok CompletePayment
    if (!click) {
      if (sale.subid) unmatched.push(sale.subid)
      continue
    }

    // Already fired + no status change? skip
    if (existing?.firedToTiktok && existing.status === sale.status) continue

    // Update click row (mark converted)
    await prisma.affiliateClick.update({
      where: { eventId: sale.subid },
      data: {
        converted: sale.status === 'paid',
        convValue: sale.revenue || null,
        convAt: created,
      },
    })
    matched++

    // Skip firing for cancelled
    if (sale.status !== 'paid') continue

    await sendTikTokEvent({
      event: 'CompletePayment',
      eventId: `${sale.subid}-cp`,
      url: click.landingUrl || `https://www.besterurlaub.com/angebot/${click.offerId || 'unknown'}`,
      contentId: click.offerId || undefined,
      value: sale.revenue || undefined,
      currency: sale.currency || 'EUR',
      externalId: click.externalId || undefined,
      ttclid: click.ttclid || undefined,
      userAgent: click.userAgent || undefined,
    })

    await prisma.check24Sale.update({
      where: { id: sale.id },
      data: { firedToTiktok: true },
    })
    fired++
  }

  return NextResponse.json({
    ok: true,
    polled: sales.length,
    persisted,
    matched,
    fired,
    unmatched: unmatched.slice(0, 20),
  })
}
