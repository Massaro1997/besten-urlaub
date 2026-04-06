import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { destinationSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (category && category !== 'tutte') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        _count: {
          select: {
            offers: true,
            videos: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(destinations)
  } catch (error) {
    console.error('GET /api/destinazioni error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle destinazioni' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = destinationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const destination = await prisma.destination.create({
      data: {
        name: parsed.data.name,
        country: parsed.data.country,
        category: parsed.data.category,
        slug: body.slug || null,
        imageUrl: parsed.data.imageUrl || null,
        description: parsed.data.description || null,
      },
    })

    return NextResponse.json(destination, { status: 201 })
  } catch (error) {
    console.error('POST /api/destinazioni error:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione della destinazione' },
      { status: 500 },
    )
  }
}
