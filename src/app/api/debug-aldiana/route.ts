import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const deal = await prisma.upDeal.findFirst({
    where: { giataId: { not: null } },
    select: {
      id: true, upUrl: true, giataId: true, destinationCountry: true,
      hotelName: true, upSlug: true, matched: true, published: true,
      publishedOfferId: true, rewrittenTitle: true, skipReason: true,
      check24Url: true, priceFromUp: true, rawTitle: true,
    },
  })

  const destinations = await prisma.destination.findMany({
    where: {
      OR: [
        { country: { contains: 'Egitto' } },
        { country: { contains: 'Ägypten' } },
        { name: { contains: 'Hurghada' } },
      ],
    },
    select: { id: true, name: true, country: true, slug: true },
  })

  return NextResponse.json({ deal, destinations })
}
