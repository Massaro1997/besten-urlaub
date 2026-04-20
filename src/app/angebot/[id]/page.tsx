import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AngebotTrackingPixel } from '@/components/public/angebot-redirect'
import { CallbackModal } from '@/components/public/callback-modal'
import { generateEventId, buildAffiliateLinkWithSubid } from '@/lib/affiliate-link'
import { OfferDetailView } from '@/components/public/offer-detail/OfferDetailView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { destination: true },
  })
  if (!offer) return { title: 'Angebot nicht gefunden' }
  return {
    title: `${offer.hotelName || offer.title} | Bester Urlaub`,
    description: offer.description || `Urlaubsangebot: ${offer.title} — jetzt buchen auf Check24`,
  }
}

export default async function AngebotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { destination: true },
  })

  if (!offer) notFound()

  const eventId = generateEventId()
  const affiliateLinkWithSubid = buildAffiliateLinkWithSubid(offer.affiliateLink, eventId)

  // All offers now use the rich landing view (no more Check24 iframe embed).
  // Iframe was bounced by X-Frame-Options on Check24 and burned affiliate attribution.
  const related = await prisma.offer.findMany({
    where: {
      featured: true,
      id: { not: offer.id },
      hotelName: { not: null },
    },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <>
      <AngebotTrackingPixel
        offerId={offer.id}
        offerTitle={offer.title}
        priceFrom={offer.priceFrom}
        eventId={eventId}
      />
      <CallbackModal offerId={offer.id} offerTitle={offer.title} />
      <OfferDetailView
        offer={{
          id: offer.id,
          title: offer.title,
          hotelName: offer.hotelName,
          hotelStars: offer.hotelStars,
          board: offer.board,
          nights: offer.nights,
          adultsCount: offer.adultsCount,
          departureFrom: offer.departureFrom,
          dateFrom: offer.dateFrom,
          dateTo: offer.dateTo,
          region: offer.region,
          rating: offer.rating,
          reviews: offer.reviews,
          priceFrom: offer.priceFrom,
          priceStrike: offer.priceStrike,
          discount: offer.discount,
          limitedText: offer.limitedText,
          gallery: offer.gallery || [],
          amenities: offer.amenities || [],
          description: offer.description,
          longDescription: offer.longDescription,
          destination: {
            name: offer.destination.name,
            country: offer.destination.country,
            slug: offer.destination.slug,
          },
          affiliateLink: offer.affiliateLink,
        }}
        affiliateLinkWithSubid={affiliateLinkWithSubid}
        related={related.map((r) => ({
          id: r.id,
          hotelName: r.hotelName,
          title: r.title,
          board: r.board,
          nights: r.nights,
          priceFrom: r.priceFrom,
          priceStrike: r.priceStrike,
          discount: r.discount,
          destination: {
            name: r.destination.name,
            country: r.destination.country,
            slug: r.destination.slug,
          },
        }))}
      />
    </>
  )
}
