import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { destinationSchema } from '@/lib/validations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        offers: {
          orderBy: { createdAt: 'desc' },
        },
        videos: {
          orderBy: { createdAt: 'desc' },
        },
        creatives: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!destination) {
      return NextResponse.json(
        { error: 'Destinazione non trovata' },
        { status: 404 },
      )
    }

    return NextResponse.json(destination)
  } catch (error) {
    console.error('GET /api/destinazioni/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero della destinazione' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = destinationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name: parsed.data.name,
        country: parsed.data.country,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl || null,
        description: parsed.data.description || null,
      },
    })

    return NextResponse.json(destination)
  } catch (error) {
    console.error('PUT /api/destinazioni/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della destinazione' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    await prisma.destination.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/destinazioni/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della destinazione' },
      { status: 500 },
    )
  }
}
