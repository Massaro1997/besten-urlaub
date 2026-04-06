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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#0a1a3a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Flug &amp; Hotel, alles in einem</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#0a1a3a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Top-Angebote ohne versteckte Kosten</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#0a1a3a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Flexible Optionen von Top-Marken</span>
            </div>
          </div>
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
