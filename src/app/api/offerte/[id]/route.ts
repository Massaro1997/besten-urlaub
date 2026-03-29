import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { offerSchema } from '@/lib/validations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        destination: true,
        videoOffers: {
          include: {
            video: { select: { id: true, title: true, status: true, tiktokUrl: true } },
          },
        },
      },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offerta non trovata' }, { status: 404 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('GET /api/offerte/[id] error:', error)
    return NextResponse.json({ error: "Errore nel recupero dell'offerta" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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

    const offer = await prisma.offer.update({
      where: { id },
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

    return NextResponse.json(offer)
  } catch (error) {
    console.error('PUT /api/offerte/[id] error:', error)
    return NextResponse.json({ error: "Errore nell'aggiornamento dell'offerta" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.offer.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/offerte/[id] error:', error)
    return NextResponse.json({ error: "Errore nell'eliminazione dell'offerta" }, { status: 500 })
  }
}
