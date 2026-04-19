import { NextRequest, NextResponse } from 'next/server'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Lead capture endpoint.
 *
 * Accepts email (required) + optional phone/name/source. Fires TikTok Lead
 * event server-side with hashed match parameters (email, phone) to improve
 * Event Match Quality score.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, source } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const userAgent = request.headers.get('user-agent') || ''
    const ttp = request.cookies.get('_ttp')?.value || ''
    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    await sendTikTokEvent({
      event: 'Lead',
      eventId,
      url: request.headers.get('referer') || 'https://www.bestenurlaub.com/',
      contentName: source || 'unknown',
      ip,
      userAgent,
      ttp,
      email,
      phone: phone || undefined,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
