import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * One-shot: cancella TUTTE le Offer auto-imported + reset TUTTI gli UpDeal.
 * Necessario dopo scoperta che GIATA UP ≠ Check24 hotel_id catalog
 * (false match: Aldiana Naga Bay UP → Suot Brattas Svizzera Check24).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Delete tutte Offer create via pipeline
  const deleted = await prisma.offer.deleteMany({
    where: { notes: { contains: 'Auto-imported from urlaubspiraten' } },
  })

  // Reset tutti UpDeal
  const reset = await prisma.upDeal.updateMany({
    data: {
      matched: false,
      published: false,
      publishedOfferId: null,
      check24Url: null,
      check24Price: null,
      matchedAt: null,
      matchStrategy: null,
      skipReason: 'paused_giata_unreliable',
      rewrittenTitle: null,
      rewrittenDesc: null,
      publishedAtBu: null,
    },
  })

  return NextResponse.json({
    ok: true,
    offersDeleted: deleted.count,
    upDealsReset: reset.count,
  })
}
