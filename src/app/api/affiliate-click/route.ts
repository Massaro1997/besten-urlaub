import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

/**
 * Persists a click-out to the DB so we can later match a Check24 conversion
 * postback back to the original TikTok Pixel event. The `eventId` is the
 * join key; it's also the `subid` we attach to the Check24 deep link.
 *
 * Called fire-and-forget from <AngebotRedirect /> — failures are silent,
 * tracking degradation is acceptable (the pixel still fired).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, offerId, ttclid, externalId, referrer, landingUrl } = body

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const ipHash = ip
      ? crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32)
      : null
    const userAgent = request.headers.get('user-agent') || ''

    await prisma.affiliateClick.upsert({
      where: { eventId },
      create: {
        eventId,
        offerId: offerId || null,
        ttclid: ttclid || null,
        externalId: externalId || null,
        ipHash,
        userAgent: userAgent.slice(0, 500),
        referrer: (referrer || '').slice(0, 500),
        landingUrl: (landingUrl || '').slice(0, 500),
      },
      // Idempotent: if the client retries (keepalive double-fire) just no-op.
      update: {},
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('affiliate-click error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
