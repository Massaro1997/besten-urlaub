import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { videoSchema } from '@/lib/validations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        destination: true,
        videoOffers: {
          include: {
            offer: {
              include: {
                destination: true,
              },
            },
          },
        },
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video non trovato' },
        { status: 404 },
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('GET /api/contenuti/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero del video' },
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
    const parsed = videoSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { offerIds, ...videoData } = parsed.data

    // Check if status is changing to "pubblicato"
    const existing = await prisma.video.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Video non trovato' },
        { status: 404 },
      )
    }

    const isPublishing = videoData.status === 'pubblicato' && existing.status !== 'pubblicato'

    const video = await prisma.video.update({
      where: { id },
      data: {
        title: videoData.title,
        description: videoData.description || null,
        status: videoData.status,
        plannedDate: videoData.plannedDate ? new Date(videoData.plannedDate) : null,
        hashtags: videoData.hashtags || null,
        tiktokUrl: videoData.tiktokUrl || null,
        notes: videoData.notes || null,
        destinationId: videoData.destinationId || null,
        ...(isPublishing ? { publishedDate: new Date() } : {}),
      },
      include: {
        destination: true,
        videoOffers: {
          include: {
            offer: {
              include: {
                destination: true,
              },
            },
          },
        },
      },
    })

    // Handle offer links if offerIds provided
    if (offerIds !== undefined) {
      // Get current linked offer IDs
      const currentLinks = await prisma.videoOffer.findMany({
        where: { videoId: id },
        select: { offerId: true },
      })
      const currentOfferIds = currentLinks.map((l: { offerId: string }) => l.offerId)

      // Delete old links
      await prisma.videoOffer.deleteMany({ where: { videoId: id } })

      // Create new links
      if (offerIds.length > 0) {
        await prisma.videoOffer.createMany({
          data: offerIds.map((offerId) => ({ videoId: id, offerId })),
        })
      }

      // Update usedInVideo flags: unmark removed, mark added
      const removedOfferIds = currentOfferIds.filter((oid: string) => !offerIds.includes(oid))
      const addedOfferIds = offerIds.filter((oid: string) => !currentOfferIds.includes(oid))

      if (removedOfferIds.length > 0) {
        // Check if these offers are still linked to other videos before unmarking
        for (const offerId of removedOfferIds) {
          const otherLinks = await prisma.videoOffer.count({
            where: { offerId, videoId: { not: id } },
          })
          if (otherLinks === 0) {
            await prisma.offer.update({
              where: { id: offerId },
              data: { usedInVideo: false },
            })
          }
        }
      }

      if (addedOfferIds.length > 0) {
        await prisma.offer.updateMany({
          where: { id: { in: addedOfferIds } },
          data: { usedInVideo: true },
        })
      }
    }

    // Re-fetch with updated relations
    const updated = await prisma.video.findUnique({
      where: { id },
      include: {
        destination: true,
        videoOffers: {
          include: {
            offer: {
              include: {
                destination: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/contenuti/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del video' },
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

    // Get linked offers before deletion
    const videoOffers = await prisma.videoOffer.findMany({
      where: { videoId: id },
      select: { offerId: true },
    })
    const linkedOfferIds = videoOffers.map((vo: { offerId: string }) => vo.offerId)

    // Delete the video (cascade deletes VideoOffer records)
    await prisma.video.delete({ where: { id } })

    // Update usedInVideo for offers that were linked
    for (const offerId of linkedOfferIds) {
      const remainingLinks = await prisma.videoOffer.count({
        where: { offerId },
      })
      if (remainingLinks === 0) {
        await prisma.offer.update({
          where: { id: offerId },
          data: { usedInVideo: false },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/contenuti/[id] error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del video' },
      { status: 500 },
    )
  }
}
