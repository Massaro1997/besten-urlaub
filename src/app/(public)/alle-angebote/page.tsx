import type { Metadata } from 'next'
import { OffersSection } from '@/components/public/offers-section'
import { offers as ALL_OFFERS } from '@/data/offers'
import { JsonLd } from '@/components/public/json-ld'
import { SITE_URL, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo-jsonld'

export const metadata: Metadata = {
  title: 'Alle Angebote | Bester Urlaub',
  description: 'Alle Urlaubsangebote im Überblick. Vergleiche Pauschalreisen und buche direkt.',
  alternates: { canonical: `${SITE_URL}/alle-angebote` },
  openGraph: {
    title: 'Alle Angebote | Bester Urlaub',
    description: 'Alle Urlaubsangebote im Überblick.',
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/alle-angebote`,
    siteName: 'Bester Urlaub',
  },
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

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Alle Angebote', url: '/alle-angebote' },
  ])
  const itemList = itemListJsonLd({
    name: 'Alle Urlaubsangebote',
    url: `${SITE_URL}/alle-angebote`,
    items: typedOffers.slice(0, 50).map((o) => ({
      url: `/angebot/${o.id}`,
      name: o.title,
      price: o.priceFrom,
    })),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <JsonLd data={[breadcrumb, itemList]} />
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
