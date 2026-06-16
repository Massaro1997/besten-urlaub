import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * One-shot cleanup: rimuove offerte pubblicate senza GIATA + reset UpDeal a skipped.
 * Also: reset deal skipped per 'no_destination_match' per ri-tentativo dopo country mapping fix.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const upDealsToReset = await prisma.upDeal.findMany({
    where: { matched: true, giataId: null },
    select: { id: true, publishedOfferId: true },
  })

  let offersDeleted = 0
  for (const d of upDealsToReset) {
    if (d.publishedOfferId) {
      try {
        await prisma.offer.delete({ where: { id: d.publishedOfferId } })
        offersDeleted++
      } catch { /* not exist */ }
    }
  }

  const reset = await prisma.upDeal.updateMany({
    where: { matched: true, giataId: null },
    data: {
      matched: false,
      published: false,
      publishedOfferId: null,
      check24Url: null,
      check24Price: null,
      matchedAt: null,
      matchStrategy: null,
      skipReason: 'no_giata',
      rewrittenTitle: null,
      rewrittenDesc: null,
      publishedAtBu: null,
    },
  })

  // Reset deal skipped per no_destination_match (per ri-tentativo)
  const resetDestMiss = await prisma.upDeal.updateMany({
    where: { skipReason: 'no_destination_match' },
    data: { skipReason: null },
  })

  return NextResponse.json({
    ok: true,
    upDealsFound: upDealsToReset.length,
    offersDeleted,
    upDealsReset: reset.count,
    destMissReset: resetDestMiss.count,
  })
}
