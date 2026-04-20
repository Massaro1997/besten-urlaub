export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/hero-section'
import { DestinationGrid } from '@/components/public/destination-grid'
import { TikTokFeed } from '@/components/public/tiktok-feed'
import { RatgeberCarousel } from '@/components/public/ratgeber-carousel'
import { FaqSection } from '@/components/public/faq-section'
import { LogoMarquee } from '@/components/public/logo-marquee'
import { TrackedOfferLink } from '@/components/public/tracked-offer-link'
import { PhoneCtaSection } from '@/components/public/phone-cta-section'
import { CallbackModal } from '@/components/public/callback-modal'
import { extractOfferDates, formatOfferDateRange } from '@/lib/offer-dates'

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
      <CallbackModal source="homepage" />
      <HeroSection />

      {/* Urlaubsregionen entdecken */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-16">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight text-center mb-5 sm:mb-8">
            Bester Urlaub
          </h2>

          {/* Row 1: 2 large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {typedFeatured.slice(0, 2).map((offer) => {
              const dateRange = formatOfferDateRange(extractOfferDates(offer.affiliateLink))
              return (
                <TrackedOfferLink
                  key={offer.id}
                  offerId={offer.id}
                  offerTitle={offer.title}
                  priceFrom={offer.priceFrom}
                  href={`/angebot/${offer.id}`}
                  className="group relative rounded-2xl overflow-hidden h-48 sm:h-72 block"
                >
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                  <div className="absolute top-4 left-4 right-4">
                    <p className="text-white font-bold text-lg drop-shadow">
                      {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                    </p>
                    <p className="text-white/80 text-sm drop-shadow">7 Tage, 2 Erw., inkl. Flug</p>
                  </div>
                  {dateRange && (
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#ff3333]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {dateRange}
                      </span>
                    </div>
                  )}
                  {offer.priceFrom && (
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-sm drop-shadow">ab </span>
                      <span className="text-white font-extrabold text-2xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                    </div>
                  )}
                </TrackedOfferLink>
              )
            })}
          </div>

          {/* Row 2: 3 smaller cards */}
          {typedFeatured.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {typedFeatured.slice(2, 5).map((offer) => {
                const dateRange = formatOfferDateRange(extractOfferDates(offer.affiliateLink))
                return (
                  <TrackedOfferLink
                    key={offer.id}
                    offerId={offer.id}
                    offerTitle={offer.title}
                    priceFrom={offer.priceFrom}
                    href={`/angebot/${offer.id}`}
                    className="group relative rounded-2xl overflow-hidden h-40 sm:h-56 block"
                  >
                    <Image
                      src={`/destinations/${offer.destination.slug}.webp`}
                      alt={offer.destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                    <div className="absolute top-4 left-4 right-4">
                      <p className="text-white font-bold text-base drop-shadow">
                        {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                      </p>
                      <p className="text-white/80 text-xs drop-shadow">6 Tage, 2 Erw., inkl. Flug</p>
                    </div>
                    {dateRange && (
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1 bg-[#ff3333]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {dateRange}
                        </span>
                      </div>
                    )}
                    {offer.priceFrom && (
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white/70 text-sm drop-shadow">ab </span>
                        <span className="text-white font-extrabold text-xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                      </div>
                    )}
                  </TrackedOfferLink>
                )
              })}
            </div>
          )}

          {/* Row 3+: remaining featured in 3-column grid (matching Row 2 size) */}
          {typedFeatured.length > 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {typedFeatured.slice(5).map((offer) => {
                const dateRange = formatOfferDateRange(extractOfferDates(offer.affiliateLink))
                return (
                  <TrackedOfferLink
                    key={offer.id}
                    offerId={offer.id}
                    offerTitle={offer.title}
                    priceFrom={offer.priceFrom}
                    href={`/angebot/${offer.id}`}
                    className="group relative rounded-2xl overflow-hidden h-40 sm:h-56 block"
                  >
                    <Image
                      src={`/destinations/${offer.destination.slug}.webp`}
                      alt={offer.destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                    <div className="absolute top-4 left-4 right-4">
                      <p className="text-white font-bold text-base drop-shadow">
                        {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                      </p>
                      <p className="text-white/80 text-xs drop-shadow">6 Tage, 2 Erw., inkl. Flug</p>
                    </div>
                    {dateRange && (
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1 bg-[#ff3333]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {dateRange}
                        </span>
                      </div>
                    )}
                    {offer.priceFrom && (
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white/70 text-sm drop-shadow">ab </span>
                        <span className="text-white font-extrabold text-xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                      </div>
                    )}
                  </TrackedOfferLink>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Top Hotel Award Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <Link href="/alle-angebote" className="block rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
          <Image
            src="/Banner Orizzontale Angebot 2.png"
            alt="Jetzt unsere Top Hotels entdecken — Top Hotel Award 2026"
            width={1400}
            height={120}
            className="w-full h-auto"
          />
        </Link>
      </section>

      {/* Beliebte Reiseziele */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <DestinationGrid destinations={typedDestinations} />
      </section>

      {/* Reise-Ratgeber */}
      <RatgeberCarousel />

      {/* Urlaubsdeals Banner + Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Banner */}
        <Link href="/alle-angebote" className="block rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-shadow mb-5 sm:mb-8">
          <Image
            src="/Banner orizzontale Angebot 1.png"
            alt="Die besten Urlaubsdeals zum Bestpreis sichern — Bis zu 250€ sparen"
            width={1400}
            height={100}
            className="w-full h-auto"
          />
        </Link>

        <h2 className="text-lg sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight text-center mb-5 sm:mb-8">
          Die besten Urlaubsdeals zum Bestpreis sichern
        </h2>

        {/* 4 cards: 1 promo + 3 destinations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Promo card */}
          <Link href="/alle-angebote" className="group relative rounded-2xl overflow-hidden h-48 sm:h-72">
            <Image
              src="/destinations/mallorca.webp"
              alt="Urlaubsdeals"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2e75fa]/70 via-[#2e75fa]/40 to-[#2e75fa]/70" />
            <span className="absolute top-4 left-4 bg-[#ff3333] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Bis zu 250 &euro; sparen
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-bold text-base leading-tight">
                Mit <span className="font-extrabold">Urlaubsdeals</span> in vielen beliebten Hotels sparen!
              </p>
            </div>
          </Link>

          {/* 3 popular destination cards (non-featured, by offer count) */}
          {typedDestinations
            .filter((d) => !typedFeatured.some((f) => f.destination.slug === d.slug))
            .slice(0, 3)
            .map((dest) => (
              <Link key={dest.slug} href={`/reiseziel/${dest.slug}`} className="group relative rounded-2xl overflow-hidden h-48 sm:h-72">
                <Image
                  src={`/destinations/${dest.slug}.webp`}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg drop-shadow">{dest.name}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Reiseveranstalter Logos */}
      <LogoMarquee />

      {/* TikTok Feed */}
      <TikTokFeed />

      {/* FAQ */}
      <FaqSection />

      {/* Phone CTA before footer */}
      <PhoneCtaSection />
    </>
  )
}
