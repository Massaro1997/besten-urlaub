import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { offerSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const destinationId = url.searchParams.get('destinationId')
    const usedInVideo = url.searchParams.get('usedInVideo')
    const sort = url.searchParams.get('sort')

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { notes: { contains: search } },
        { destination: { name: { contains: search } } },
      ]
    }

    if (destinationId) {
      where.destinationId = destinationId
    }

    if (usedInVideo === 'true') {
      where.usedInVideo = true
    } else if (usedInVideo === 'false') {
      where.usedInVideo = false
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { priceFrom: 'asc' }
    else if (sort === 'price_desc') orderBy = { priceFrom: 'desc' }
    else if (sort === 'name') orderBy = { title: 'asc' }

    const offers = await prisma.offer.findMany({
      where,
      include: {
        destination: {
          select: { id: true, name: true, country: true, category: true },
        },
      },
      orderBy,
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('GET /api/offerte error:', error)
    return NextResponse.json({ error: 'Errore nel recupero delle offerte' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = offerSchema.safeParse({
      ...body,
      priceFrom: body.priceFrom ? (typeof body.priceFrom === 'string' ? parseFloat(body.priceFrom) : body.priceFrom) : undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const offer = await prisma.offer.create({
      data: {
        destinationId: parsed.data.destinationId,
        title: parsed.data.title,
        priceFrom: parsed.data.priceFrom ?? null,
        affiliateLink: parsed.data.affiliateLink,
        description: parsed.data.description || null,
        notes: parsed.data.notes || null,
      },
      include: {
        destination: {
          select: { id: true, name: true, country: true, category: true },
        },
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('POST /api/offerte error:', error)
    return NextResponse.json({ error: "Errore nella creazione dell'offerta" }, { status: 500 })
  }
}
