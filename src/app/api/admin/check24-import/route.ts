import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Manual Check24 sales import — use when user pastes JSON from the Partner
 * dashboard directly (no reliable API endpoint yet).
 *
 * POST /api/admin/check24-import
 *   Headers: Authorization: Bearer <CRON_SECRET>
 *   Body: { "status_code": 200, "data": [ ...rows ] }  (raw Check24 JSON)
 *
 * Same persistence + matching + TikTok firing as the cron, just input-driven.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rows: Array<Record<string, unknown>> = Array.isArray(payload)
    ? (payload as Array<Record<string, unknown>>)
    : Array.isArray(payload?.data)
      ? (payload.data as Array<Record<string, unknown>>)
      : []

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No rows in data[]' }, { status: 400 })
  }

  let persisted = 0
  let fired = 0
  const unmatched: string[] = []

  for (const row of rows) {
    const id = String(row.id ?? '')
    if (!id) continue
    const subid = String(row.tracking_id ?? '')
    const product = String(row.product_name ?? '')
    const status = String(row.paymentstatus ?? 'unknown')
    const commission = parseFloat(String(row.amount_net ?? '0').replace(',', '.')) || null
    const revenue = parseFloat(String(row.base_amount_net ?? '0').replace(',', '.')) || null
    const createdStr = String(row.created ?? '')
    const created = createdStr ? new Date(createdStr.replace(' ', 'T')) : new Date()

    const click = subid
      ? await prisma.affiliateClick.findUnique({ where: { eventId: subid } })
      : null
    const matched = Boolean(click)

    const existing = await prisma.check24Sale.findUnique({ where: { id } })

    await prisma.check24Sale.upsert({
      where: { id },
      create: {
        id,
        subid: subid || null,
        product,
        status,
        revenue,
        commission,
        currency: 'EUR',
        createdAtC24: created,
        matched,
        firedToTiktok: false,
        raw: row as never,
      },
      update: {
        status,
        revenue,
        commission,
        matched,
        raw: row as never,
      },
    })
    persisted++

    if (!click) {
      if (subid) unmatched.push(subid)
      continue
    }

    await prisma.affiliateClick.update({
      where: { eventId: subid },
      data: {
        converted: status === 'paid',
        convValue: revenue,
        convAt: created,
      },
    })

    if (status !== 'paid') continue
    if (existing?.firedToTiktok) continue

    await sendTikTokEvent({
      event: 'CompletePayment',
      eventId: `${subid}-cp`,
      url: click.landingUrl || `https://www.bestenurlaub.com/angebot/${click.offerId || 'unknown'}`,
      contentId: click.offerId || undefined,
      value: revenue || undefined,
      currency: 'EUR',
      externalId: click.externalId || undefined,
      ttclid: click.ttclid || undefined,
      userAgent: click.userAgent || undefined,
    })

    await prisma.check24Sale.update({
      where: { id },
      data: { firedToTiktok: true },
    })
    fired++
  }

  return NextResponse.json({
    ok: true,
    persisted,
    fired,
    unmatched: unmatched.slice(0, 20),
  })
}
