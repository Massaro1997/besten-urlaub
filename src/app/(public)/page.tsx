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

      {/* Trust Badges */}
      <section className="bg-[#0a1a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3">
          {/* Desktop: inline row */}
          <div className="hidden sm:flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              <span className="text-xs font-medium text-white/80">Flug &amp; Hotel inklusive</span>
            </div>
            <span className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
              <span className="text-xs font-medium text-white/80">Mietwagen dazu buchen</span>
            </div>
            <span className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2e75fa] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-xs font-medium text-white/80">Flexible Top-Marken</span>
            </div>
          </div>
          {/* Mobile: 3 compact chips in a row */}
          <div className="flex sm:hidden items-center justify-center gap-2 py-1">
            <div className="flex items-center gap-1.5 bg-white/[0.08] rounded-full px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-[#ff6b35] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              <span className="text-[10px] font-semibold text-white/90 whitespace-nowrap">Flug + Hotel</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.08] rounded-full px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-[#ff6b35] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
              <span className="text-[10px] font-semibold text-white/90 whitespace-nowrap">Mietwagen</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.08] rounded-full px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-[#ff6b35] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-[10px] font-semibold text-white/90 whitespace-nowrap">Top-Marken</span>
            </div>
          </div>
        </div>
      </section>

      {/* Urlaubsregionen entdecken */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-16">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight text-center mb-5 sm:mb-8">
            Urlaubsregionen entdecken
          </h2>

          {/* Row 1: 2 large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {typedFeatured.slice(0, 2).map((offer) => (
              <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-48 sm:h-72">
                <Image
                  src={`/destinations/${offer.destination.slug}.webp`}
                  alt={offer.destination.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
                <div className="absolute top-4 left-4">
                  <p className="text-white font-bold text-lg drop-shadow">
                    {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                  </p>
                  <p className="text-white/80 text-sm drop-shadow">7 Tage, 2 Erw., inkl. Flug</p>
                </div>
                {offer.priceFrom && (
                  <div className="absolute bottom-4 right-4">
                    <span className="text-white/70 text-sm drop-shadow">ab </span>
                    <span className="text-white font-extrabold text-2xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Row 2: 3 smaller cards */}
          {typedFeatured.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {typedFeatured.slice(2, 5).map((offer) => (
                <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-40 sm:h-56">
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
                  <div className="absolute top-4 left-4">
                    <p className="text-white font-bold text-base drop-shadow">
                      {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                    </p>
                    <p className="text-white/80 text-xs drop-shadow">6 Tage, 2 Erw., inkl. Flug</p>
                  </div>
                  {offer.priceFrom && (
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-sm drop-shadow">ab </span>
                      <span className="text-white font-extrabold text-xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Row 3+: remaining featured in 3-column grid (matching Row 2 size) */}
          {typedFeatured.length > 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {typedFeatured.slice(5).map((offer) => (
                <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-40 sm:h-56">
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
                  <div className="absolute top-4 left-4">
                    <p className="text-white font-bold text-base drop-shadow">
                      {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                    </p>
                    <p className="text-white/80 text-xs drop-shadow">6 Tage, 2 Erw., inkl. Flug</p>
                  </div>
                  {offer.priceFrom && (
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-sm drop-shadow">ab </span>
                      <span className="text-white font-extrabold text-xl drop-shadow">{Math.round(offer.priceFrom)} &euro;</span>
                    </div>
                  )}
                </Link>
              ))}
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
    </>
  )
}
