import type { Metadata } from 'next'
import { OffersSection } from '@/components/public/offers-section'
import { offers as ALL_OFFERS } from '@/data/offers'

export const metadata: Metadata = {
  title: 'Alle Angebote | Bester Urlaub',
  description: 'Alle Urlaubsangebote im Überblick. Vergleiche Pauschalreisen und buche direkt.',
}

export default function AlleAngebotePage() {
  const typedOffers = ALL_OFFERS
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight">
        Alle Angebote
      </h1>
      <p className="text-sm text-[#0a1a3a]/50 mt-2 max-w-lg mb-8">
        St&ouml;bere durch unsere gesamte Auswahl an Reisezielen.
      </p>

      <OffersSection offers={typedOffers} size="compact" />
    </div>
  )
}
