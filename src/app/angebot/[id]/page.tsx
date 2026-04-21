import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AngebotTrackingPixel } from '@/components/public/angebot-redirect'
import { CallbackModal } from '@/components/public/callback-modal'
import { generateEventId, buildAffiliateLinkWithSubid } from '@/lib/affiliate-link'
import { OfferDetailView } from '@/components/public/offer-detail/OfferDetailView'
import { getOfferById, offers as ALL_OFFERS } from '@/data/offers'

// Static data — no DB. Every offer becomes a statically-generated page.
export function generateStaticParams() {
  return ALL_OFFERS.map((o) => ({ id: o.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const offer = getOfferById(id)
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
  const offer = getOfferById(id)
  if (!offer) notFound()

  const eventId = generateEventId()
  const affiliateLinkWithSubid = buildAffiliateLinkWithSubid(offer.affiliateLink, eventId)

  // Related — up to 4 featured offers in same country, excluding self
  const related = ALL_OFFERS.filter(
    (o) =>
      o.id !== offer.id &&
      o.featured &&
      o.hotelName &&
      (o.destination.country === offer.destination.country || true),
  ).slice(0, 4)

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
          dateFrom: offer.dateFrom ? new Date(offer.dateFrom) : null,
          dateTo: offer.dateTo ? new Date(offer.dateTo) : null,
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
