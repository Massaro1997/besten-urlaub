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
import { LogoMarquee } from '@/components/public/logo-marquee'

export default async function HomePage() {
  const [featuredOffers, popularDestinations] = await Promise.all([
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

      {/* Trust Badges — clean single row */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm text-[#0a1a3a]/70">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Kostenlose Stornierung
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Bestpreis-Garantie
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Rund um die Uhr f&uuml;r Sie da
            </span>
          </div>
        </div>
      </section>

      {/* Top Deals — featured offers (original large cards) */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#ff6b35] mb-2">
                Top Deals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight">
                Deals, die nicht lange bleiben.
              </h2>
              <p className="text-sm text-[#0a1a3a]/50 mt-2 max-w-lg">
                Handverlesen, preisgepr&uuml;ft, sofort buchbar. Greif zu, bevor es andere tun.
              </p>
            </div>
          </div>

          <OffersSection offers={typedFeatured} size="default" showCategoryTabs={false} />
        </section>
      )}

      {/* Link to all offers page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <Link
          href="/alle-angebote"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e75fa] hover:text-[#1a5fe0] transition-colors"
        >
          Alle Angebote ansehen
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
        </Link>
      </div>

      {/* Beliebte Reiseziele */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <DestinationGrid destinations={typedDestinations} />
      </section>

      {/* Reise-Ratgeber */}
      <RatgeberCarousel />

      {/* Reiseveranstalter Logos */}
      <LogoMarquee />

      {/* TikTok Feed */}
      <TikTokFeed />

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaSection />
    </>
  )
}
