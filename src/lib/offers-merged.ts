import { prisma } from '@/lib/prisma'
import { offers as STATIC_OFFERS, getOfferById as getStaticOfferById, type OfferData } from '@/data/offers'

/**
 * Merge static offers.ts + DB Offer rows (auto-imported from UP pipeline).
 *
 * Static: hand-curated, rich data (gallery, amenities, long description).
 * DB: auto-imported from urlaubspiraten via cron, minimal fields.
 *
 * Pattern: DB rows take precedence (newer), static fills gaps (always shown).
 * Solo Offer linkate a una Destination valida vengono mostrate.
 */
export async function getAllOffersMerged(): Promise<OfferData[]> {
  let dbOffers: OfferData[] = []
  try {
    const rows = await prisma.offer.findMany({
      where: {
        // Solo offer create via pipeline UP (notes contiene "Auto-imported")
        notes: { contains: 'Auto-imported from urlaubspiraten' },
        // Escludi offerte pending (affiliate link non ancora generato manualmente)
        affiliateLinkPending: false,
      },
      include: { destination: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    dbOffers = rows.map((r): OfferData => ({
      id: r.id,
      destinationId: r.destinationId,
      title: r.title,
      priceFrom: r.priceFrom,
      affiliateLink: r.affiliateLink,
      description: r.description,
      notes: r.notes,
      usedInVideo: r.usedInVideo,
      featured: r.featured,
      hotelName: r.hotelName,
      hotelStars: r.hotelStars,
      board: r.board,
      nights: r.nights,
      adultsCount: r.adultsCount,
      departureFrom: r.departureFrom,
      dateFrom: r.dateFrom ? r.dateFrom.toISOString() : null,
      dateTo: r.dateTo ? r.dateTo.toISOString() : null,
      region: r.region,
      rating: r.rating,
      reviews: r.reviews,
      priceStrike: r.priceStrike,
      discount: r.discount,
      limitedText: r.limitedText,
      gallery: Array.isArray(r.gallery) ? r.gallery as string[] : [],
      amenities: Array.isArray(r.amenities) ? r.amenities as string[] : [],
      longDescription: r.longDescription,
      destination: {
        id: r.destination.id,
        name: r.destination.name,
        country: r.destination.country,
        slug: r.destination.slug,
        category: r.destination.category,
      },
    }))
  } catch (err) {
    console.error('getAllOffersMerged: DB query failed, falling back to static only', err)
  }

  // DB first (newer), static appended (de-duped by id)
  const seen = new Set(dbOffers.map(o => o.id))
  const merged = [...dbOffers]
  for (const s of STATIC_OFFERS) {
    if (!seen.has(s.id)) merged.push(s)
  }
  return merged
}

/** Lookup offer by id — static first (build-time fast), DB fallback (auto-imported). */
export async function getOfferByIdMerged(id: string): Promise<OfferData | null> {
  const staticHit = getStaticOfferById(id)
  if (staticHit) return staticHit

  try {
    const r = await prisma.offer.findUnique({
      where: { id },
      include: { destination: true },
    })
    if (!r) return null
    return {
      id: r.id,
      destinationId: r.destinationId,
      title: r.title,
      priceFrom: r.priceFrom,
      affiliateLink: r.affiliateLink,
      description: r.description,
      notes: r.notes,
      usedInVideo: r.usedInVideo,
      featured: r.featured,
      hotelName: r.hotelName,
      hotelStars: r.hotelStars,
      board: r.board,
      nights: r.nights,
      adultsCount: r.adultsCount,
      departureFrom: r.departureFrom,
      dateFrom: r.dateFrom ? r.dateFrom.toISOString() : null,
      dateTo: r.dateTo ? r.dateTo.toISOString() : null,
      region: r.region,
      rating: r.rating,
      reviews: r.reviews,
      priceStrike: r.priceStrike,
      discount: r.discount,
      limitedText: r.limitedText,
      gallery: Array.isArray(r.gallery) ? r.gallery as string[] : [],
      amenities: Array.isArray(r.amenities) ? r.amenities as string[] : [],
      longDescription: r.longDescription,
      destination: {
        id: r.destination.id,
        name: r.destination.name,
        country: r.destination.country,
        slug: r.destination.slug,
        category: r.destination.category,
      },
    }
  } catch (err) {
    console.error('getOfferByIdMerged DB lookup failed', id, err)
    return null
  }
}
