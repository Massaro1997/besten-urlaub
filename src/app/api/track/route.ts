import { NextRequest, NextResponse } from 'next/server'
import { sendTikTokEvent } from '@/lib/tiktok-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, eventId, contentId, contentName, value, currency, url, externalId, ttclid } = body

    if (!event || !eventId) {
      return NextResponse.json({ error: 'Missing event or eventId' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const userAgent = request.headers.get('user-agent') || ''

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
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
