export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/hero-section'
import { OffersSection } from '@/components/public/offers-section'
import { DestinationGrid } from '@/components/public/destination-grid'
import { CtaSection } from '@/components/public/cta-section'
import { TikTokFeed } from '@/components/public/tiktok-feed'
import { RatgeberCarousel } from '@/components/public/ratgeber-carousel'
import { FaqSection } from '@/components/public/faq-section'

export default async function HomePage() {
  const [featuredOffers, otherOffers, popularDestinations] = await Promise.all([
    prisma.offer.findMany({
      where: { featured: true },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            country: true,
            category: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.offer.findMany({
      where: { featured: false },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            country: true,
            category: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 24,
    }),
    prisma.destination.findMany({
      where: { slug: { not: null }, offers: { some: {} } },
      include: { _count: { select: { offers: true } } },
      orderBy: { offers: { _count: 'desc' } },
      take: 8,
    }),
  ])

  // Narrow slug to string for the public components (DB has slug as String?)
  const toTyped = (o: (typeof featuredOffers)[number]) => ({
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
  })

  const typedFeatured = featuredOffers
    .filter((o) => o.destination.slug !== null)
    .map(toTyped)
  const typedOthers = otherOffers
    .filter((o) => o.destination.slug !== null)
    .map(toTyped)

  const typedDestinations = popularDestinations
    .filter((d) => d.slug !== null)
    .map((d) => ({
      name: d.name,
      country: d.country,
      category: d.category,
      slug: d.slug as string,
      _count: d._count,
    }))

  return (
    <>
      <HeroSection />

      {/* Trust Badges */}
      <section className="bg-white border-b border-[#0a1a3a]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kostenlose Stornierung */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full border-2 border-[#0a1a3a]/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0a1a3a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a1a3a]">Kostenlose Stornierung</h3>
                <p className="text-sm text-[#0a1a3a]/55 mt-1 leading-relaxed">Viele Angebote bis 24h vor Anreise kostenlos stornieren oder umbuchen.</p>
              </div>
            </div>
            {/* Bestpreis-Garantie */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full border-2 border-[#0a1a3a]/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0a1a3a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a1a3a]">Bestpreis-Garantie</h3>
                <p className="text-sm text-[#0a1a3a]/55 mt-1 leading-relaxed">Hier buchen Sie immer zum besten Preis &mdash; garantiert durch unseren Anbietervergleich.</p>
              </div>
            </div>
            {/* Rund um die Uhr */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full border-2 border-[#0a1a3a]/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2e75fa]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a1a3a]">Rund um die Uhr f&uuml;r Sie da</h3>
                <p className="text-sm text-[#0a1a3a]/55 mt-1 leading-relaxed">Mit Ihren Anliegen, Fragen und Anregungen erreichen Sie uns zu jeder Zeit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reiseveranstalter Logos */}
      <section className="bg-white border-b border-[#0a1a3a]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h3 className="text-lg sm:text-xl font-bold text-[#0a1a3a] text-center mb-6">
            Alle Top Reiseveranstalter im Vergleich
          </h3>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
            {[
              { src: '/LOGHI/operatorTuifalse.svg', alt: 'TUI' },
              { src: '/LOGHI/operatorAurumToursfalse.svg', alt: 'AurumTours' },
              { src: '/LOGHI/operatorSchauinslandReisenfalse.svg', alt: 'Schauinsland Reisen' },
              { src: '/LOGHI/operatorDertourfalse.svg', alt: 'DERTOUR' },
              { src: '/LOGHI/operatorCoralTravelfalse.svg', alt: 'Coral Travel' },
              { src: '/LOGHI/operatorVtoursfalse.svg', alt: 'vtours' },
              { src: '/LOGHI/operatorLturfalse.svg', alt: 'ltur' },
              { src: '/LOGHI/operatorItsfalse.svg', alt: 'ITS' },
            ].map((logo) => (
              <Image key={logo.alt} src={logo.src} alt={logo.alt} width={100} height={36} className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
            ))}
          </div>
          <p className="text-xs text-[#0a1a3a]/40 text-center mt-4">Teilnehmende Veranstalter</p>
        </div>
      </section>

      {/* Top Deals — Günstige Traumziele */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight">
            G&uuml;nstige Traumziele entdecken
          </h2>
          <p className="text-sm text-[#0a1a3a]/50 mt-2 max-w-lg mb-8">
            Anderen Reisenden gefallen diese Pauschalreisen. W&auml;hle aus den beliebtesten Angeboten.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {typedFeatured.slice(0, 4).map((offer) => (
              <Link key={offer.id} href={`/angebot/${offer.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#0a1a3a]">{offer.destination.name}</h3>
                  <p className="text-sm text-[#0a1a3a]/50 mt-1 line-clamp-2">{offer.title}</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-[#0a1a3a] text-white px-5 py-2.5 rounded-lg font-semibold text-sm group-hover:bg-[#2e75fa] transition-colors">
                    Jetzt buchen
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Weitere Angebote — small grid with category filter */}
      {typedOthers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-[#0a1a3a]/8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight">
            Weitere Angebote
          </h2>
          <p className="text-sm text-[#0a1a3a]/50 mt-2 max-w-lg">
            St&ouml;bere durch unsere gesamte Auswahl an Reisezielen.
          </p>

          <div className="mt-6">
            <OffersSection offers={typedOthers} size="compact" />
          </div>
        </section>
      )}

      {/* Beliebte Reiseziele */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <DestinationGrid destinations={typedDestinations} />
      </section>

      {/* Reise-Ratgeber */}
      <RatgeberCarousel />

      {/* TikTok Feed */}
      <TikTokFeed />

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaSection />
    </>
  )
}
