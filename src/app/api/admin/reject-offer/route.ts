import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Delete pending Offer + reset UpDeal source.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId } = body
    if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 })

    // Reset UpDeal that produced this offer
    await prisma.upDeal.updateMany({
      where: { publishedOfferId: offerId },
      data: {
        published: false,
        publishedOfferId: null,
        skipReason: 'manually_rejected',
      },
    })

    await prisma.offer.delete({ where: { id: offerId } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
