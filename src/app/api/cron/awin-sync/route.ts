import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAwinTransactions } from '@/lib/awin-api'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Cron: pull Awin transactions for the last 31 days, match clickref back to
 * AffiliateClick.eventId, mark converted, fire TikTok CompletePayment
 * server-side (with ttclid/externalId from the original click).
 *
 * This runs even if the S2S postback URL is not yet configured on Awin —
 * the Awin transactions API is the source of truth.
 *
 * vercel.json:
 *   { "path": "/api/cron/awin-sync", "schedule": "0 6 * * *" }
 *
 * Hobby plan = daily max. For faster feedback, trigger manually:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/cron/awin-sync
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Awin caps windows at 31 days
  const now = new Date()
  const start = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
  const startISO = start.toISOString().slice(0, 19)
  const endISO = now.toISOString().slice(0, 19)

  let txs
  try {
    txs = await fetchAwinTransactions(startISO, endISO)
  } catch (e) {
    console.error('Awin API failed:', e)
    return NextResponse.json({ error: 'awin_fetch_failed', message: String(e) }, { status: 500 })
  }

  let persisted = 0
  let matched = 0
  let fired = 0
  const unmatched: string[] = []

  for (const tx of txs) {
    const subid = tx.clickRefs?.clickRef?.trim() || ''
    if (!subid) continue

    const revenue = tx.saleAmount?.amount
    const commission = tx.commissionAmount?.amount
    const currency = tx.saleAmount?.currency || 'EUR'
    const status = tx.commissionStatus
    const txDate = tx.transactionDate ? new Date(tx.transactionDate) : new Date()

    // 1. Upsert Check24Sale row so /sales dashboard reflects Awin feed too
    const existing = await prisma.check24Sale.findUnique({ where: { id: String(tx.id) } })
    await prisma.check24Sale.upsert({
      where: { id: String(tx.id) },
      create: {
        id: String(tx.id),
        subid,
        product: 'Pauschalreise',
        status,
        revenue,
        commission,
        currency,
        createdAtC24: txDate,
        matched: false,
        firedToTiktok: false,
        raw: tx as never,
      },
      update: {
        status,
        revenue,
        commission,
        raw: tx as never,
      },
    })
    persisted++

    // 2. Match back to AffiliateClick
    const click = await prisma.affiliateClick.findUnique({ where: { eventId: subid } })
    if (!click) {
      unmatched.push(subid)
      continue
    }

    // Mark click row matched + converted if status = approved
    await prisma.affiliateClick.update({
      where: { eventId: subid },
      data: {
        converted: status === 'approved',
        convValue: revenue || null,
        convAt: txDate,
      },
    })

    await prisma.check24Sale.update({
      where: { id: String(tx.id) },
      data: { matched: true },
    })
    matched++

    // 3. Fire TikTok CompletePayment only for approved + not-yet-fired
    if (status !== 'approved') continue
    if (existing?.firedToTiktok) continue

    await sendTikTokEvent({
      event: 'CompletePayment',
      eventId: `${subid}-cp`,
      url: click.landingUrl || `https://www.bestenurlaub.com/angebot/${click.offerId || 'unknown'}`,
      contentId: click.offerId || undefined,
      value: revenue || undefined,
      currency,
      externalId: click.externalId || undefined,
      ttclid: click.ttclid || undefined,
      userAgent: click.userAgent || undefined,
    })

    await prisma.check24Sale.update({
      where: { id: String(tx.id) },
      data: { firedToTiktok: true },
    })
    fired++
  }

  return NextResponse.json({
    ok: true,
    polled: txs.length,
    persisted,
    matched,
    fired,
    unmatched: unmatched.slice(0, 20),
  })
}
