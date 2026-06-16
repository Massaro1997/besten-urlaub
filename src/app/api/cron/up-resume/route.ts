import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Reset paused UpDeals so they can be re-matched + published.
 * Use after pipeline policy change (es. da GIATA-only a manual-link workflow).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const reset = await prisma.upDeal.updateMany({
    where: {
      OR: [
        { skipReason: 'paused_giata_unreliable' },
        { skipReason: 'no_giata' },
        { skipReason: 'insufficient_data' },
        { skipReason: 'no_destination_match' },
      ],
    },
    data: { skipReason: null, matchAttempts: 0 },
  })

  return NextResponse.json({ ok: true, reset: reset.count })
}
