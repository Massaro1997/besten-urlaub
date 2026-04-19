import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Lead capture endpoint.
 *
 * Accepts email (required) + optional phone/name/source. Persists to DB and
 * fires TikTok Lead event server-side with hashed match parameters (email,
 * phone) to improve Event Match Quality score.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, name, source, ttclid, externalId } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    const ttp = request.cookies.get('_ttp')?.value || ''
    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Persist lead to DB
    await prisma.lead.create({
      data: {
        email: email.trim().toLowerCase(),
        phone: phone || null,
        name: name || null,
        source: source || 'unknown',
        ttclid: ttclid || null,
        externalId: externalId || null,
        userAgent,
        ip,
        referrer,
        url: referrer,
      },
    })

    // Fire TikTok Lead event with hashed match params
    await sendTikTokEvent({
      event: 'Lead',
      eventId,
      url: referrer || 'https://www.bestenurlaub.com/',
      contentName: source || 'unknown',
      ip,
      userAgent,
      ttp,
      ttclid: ttclid || undefined,
      externalId: externalId || undefined,
      email,
      phone: phone || undefined,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
