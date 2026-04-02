import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { slug: { not: null } },
      include: {
        _count: { select: { offers: true } },
        offers: {
          select: {
            id: true,
            title: true,
            priceFrom: true,
            affiliateLink: true,
            description: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { offers: { _count: 'desc' } },
    })

    const data = destinations.map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      category: d.category,
      slug: d.slug as string,
      description: d.description,
      bestSeason: d.bestSeason,
      offerCount: d._count.offers,
      offers: d.offers.map((o) => ({
        id: o.id,
        title: o.title,
        priceFrom: o.priceFrom,
        affiliateLink: o.affiliateLink,
        description: o.description,
      })),
    }))

    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}
