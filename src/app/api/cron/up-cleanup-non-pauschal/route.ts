import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Cancella offerte pending generate da deal NON pauschalreisen (hotels-only/fluege/etc).
 * User vuole solo PACCHETTI volo+hotel.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Find UpDeal published with category != pauschalreisen
  const nonPauschal = await prisma.upDeal.findMany({
    where: {
      published: true,
      category: { not: 'pauschalreisen' },
    },
    select: { id: true, publishedOfferId: true },
  })

  let offersDeleted = 0
  for (const d of nonPauschal) {
    if (d.publishedOfferId) {
      try {
        await prisma.offer.delete({ where: { id: d.publishedOfferId } })
        offersDeleted++
      } catch {/* ignore */}
    }
  }

  // Reset those UpDeal entries
  const reset = await prisma.upDeal.updateMany({
    where: { category: { not: 'pauschalreisen' } },
    data: {
      matched: false,
      published: false,
      publishedOfferId: null,
      check24Url: null,
      matchedAt: null,
      matchStrategy: null,
      skipReason: 'not_pauschalreisen',
      rewrittenTitle: null,
      rewrittenDesc: null,
      publishedAtBu: null,
    },
  })

  return NextResponse.json({
    ok: true,
    nonPauschalFound: nonPauschal.length,
    offersDeleted,
    upDealsReset: reset.count,
  })
}
