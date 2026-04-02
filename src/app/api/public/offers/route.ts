import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        destination: {
          select: { id: true, name: true, country: true, category: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const data = offers
      .filter((o) => o.destination.slug !== null)
      .map((o) => ({
        id: o.id,
        title: o.title,
        priceFrom: o.priceFrom,
        affiliateLink: o.affiliateLink,
        description: o.description,
        destination: {
          name: o.destination.name,
          country: o.destination.country,
          category: o.destination.category,
          slug: o.destination.slug as string,
        },
      }))

    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}
