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

  let matched = 0
  let fired = 0
  const unmatched: string[] = []

  for (const sale of sales) {
    if (!sale.subid) continue

    // Find the click row
    const click = await prisma.affiliateClick.findUnique({
      where: { eventId: sale.subid },
    })
    if (!click) {
      unmatched.push(sale.subid)
      continue
    }

    // Skip if already processed (idempotent)
    if (click.converted && click.convValue === (sale.revenue || null)) continue

    // Update click row
    await prisma.affiliateClick.update({
      where: { eventId: sale.subid },
      data: {
        converted: true,
        convValue: sale.revenue || null,
        convAt: new Date(sale.timestamp || Date.now()),
      },
    })
    matched++

    // Fire CompletePayment only for new conversions (not already converted)
    // Skip cancelled sales
    if (sale.status === 'cancelled') continue

    await sendTikTokEvent({
      event: 'CompletePayment',
      eventId: `${sale.subid}-cp`,
      url: click.landingUrl || `https://www.bestenurlaub.com/angebot/${click.offerId || 'unknown'}`,
      contentId: click.offerId || undefined,
      value: sale.revenue || undefined,
      currency: sale.currency || 'EUR',
      externalId: click.externalId || undefined,
      ttclid: click.ttclid || undefined,
      userAgent: click.userAgent || undefined,
    })
    fired++
  }

  return NextResponse.json({
    ok: true,
    polled: sales.length,
    matched,
    fired,
    unmatched: unmatched.slice(0, 20),
  })
}
