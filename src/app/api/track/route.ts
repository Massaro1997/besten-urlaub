import { NextRequest, NextResponse } from 'next/server'
import { sendTikTokEvent } from '@/lib/tiktok-server'

export async function POST(request: NextRequest) {
  try {
    // Skip internal traffic (cookie set via ?no-track=1)
    if (request.cookies.get('bu_no_track')?.value === '1') {
      return NextResponse.json({ ok: true, skipped: 'internal' })
    }

    const body = await request.json()
    const { event, eventId, contentId, contentName, value, currency, url, externalId, ttclid, email, phone } = body

    if (!event || !eventId) {
      return NextResponse.json({ error: 'Missing event or eventId' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const userAgent = request.headers.get('user-agent') || ''
    const ttp = request.cookies.get('_ttp')?.value || ''

    await sendTikTokEvent({
      event,
      eventId,
      url: url || request.headers.get('referer') || '',
      contentId,
      contentName,
      value,
      currency,
      ip,
      userAgent,
      externalId,
      ttclid,
      ttp,
      email,
      phone,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
