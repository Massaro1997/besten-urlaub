import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildCheck24Deeplink, matchScore } from '@/lib/up-pipeline/check24-deeplink'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Stage 2/3: per ogni UpDeal non ancora matchato, costruisci affiliate deeplink
 * Check24 (no search API → deeplink diretto con params catalogo).
 *
 * Skipping logic:
 *  - flights only (Ryanair/Eurowings) → skip
 *  - prezzo <100€ (probabilmente ticket-only) → skip
 *  - no GIATA + no destination → skip ('insufficient_data')
 *
 * Match: salva check24Url + check24Price (= priceFromUp) + strategia usata.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const stats = { processed: 0, matched: 0, skipped: 0, byStrategy: {} as Record<string, number> }

  const unmatched = await prisma.upDeal.findMany({
    where: {
      matched: false,
      skipReason: null,
      matchAttempts: { lt: 3 },
    },
    take: 200,
    orderBy: { publishedAt: 'desc' },
  })

  for (const deal of unmatched) {
    stats.processed++
    const score = matchScore({
      giataId: deal.giataId,
      hotelName: deal.hotelName,
      destinationCountry: deal.destinationCountry,
      priceFromUp: deal.priceFromUp,
      nights: deal.nights,
      partnerName: deal.partnerName,
    })

    stats.byStrategy[score.strategy] = (stats.byStrategy[score.strategy] || 0) + 1

    if (score.skip) {
      await prisma.upDeal.update({
        where: { id: deal.id },
        data: {
          skipReason: score.skip,
          matchAttempts: { increment: 1 },
        },
      })
      stats.skipped++
      continue
    }

    const deeplink = buildCheck24Deeplink({
      giataId: deal.giataId,
      destination: deal.destinationCountry,
      nights: deal.nights,
      priceFrom: deal.priceFromUp,
      tid: `up-${deal.upSlug.slice(0, 40)}`,
    })

    await prisma.upDeal.update({
      where: { id: deal.id },
      data: {
        matched: true,
        matchStrategy: score.strategy,
        check24Url: deeplink,
        check24Price: deal.priceFromUp,
        matchedAt: new Date(),
        matchAttempts: { increment: 1 },
      },
    })
    stats.matched++
  }

  return NextResponse.json({ ok: true, stats })
}
