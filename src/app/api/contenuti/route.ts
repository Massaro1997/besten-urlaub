import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { videoSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        destination: true,
        _count: {
          select: { videoOffers: true },
        },
      },
      orderBy: [
        { plannedDate: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('GET /api/contenuti error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei video' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = videoSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { offerIds, ...videoData } = parsed.data

    const video = await prisma.video.create({
      data: {
        title: videoData.title,
        description: videoData.description || null,
        status: videoData.status,
        plannedDate: videoData.plannedDate ? new Date(videoData.plannedDate) : null,
        hashtags: videoData.hashtags || null,
        tiktokUrl: videoData.tiktokUrl || null,
        notes: videoData.notes || null,
        destinationId: videoData.destinationId || null,
        ...(offerIds && offerIds.length > 0
          ? {
              videoOffers: {
                create: offerIds.map((offerId) => ({ offerId })),
              },
            }
          : {}),
      },
      include: {
        destination: true,
        _count: {
          select: { videoOffers: true },
        },
      },
    })

    // Mark linked offers as used in video
    if (offerIds && offerIds.length > 0) {
      await prisma.offer.updateMany({
        where: { id: { in: offerIds } },
        data: { usedInVideo: true },
      })
    }

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('POST /api/contenuti error:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione del video' },
      { status: 500 },
    )
  }
}
