import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Update Offer affiliateLink (manual user input from Check24 partner tool),
 * mark affiliateLinkPending=false → offer va live.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, affiliateLink } = body
    if (!offerId || typeof offerId !== 'string') {
      return NextResponse.json({ error: 'Missing offerId' }, { status: 400 })
    }
    if (!affiliateLink || typeof affiliateLink !== 'string' || !affiliateLink.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid affiliateLink (must be http url)' }, { status: 400 })
    }

    await prisma.offer.update({
      where: { id: offerId },
      data: {
        affiliateLink: affiliateLink.trim(),
        affiliateLinkPending: false,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
