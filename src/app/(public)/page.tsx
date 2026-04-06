export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/hero-section'
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

      {/* Trust Badges */}
      <section className="bg-white border-b border-[#0a1a3a]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#0a1a3a]" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Flug &amp; Hotel, alles in einem</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#0a1a3a]" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7A1.5 1.5 0 017 5.5 1.5 1.5 0 015.5 7z"/></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Top-Angebote ohne versteckte Kosten</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#0a1a3a]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm7 11a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.92V22H8a1 1 0 000 2h8a1 1 0 000-2h-3v-3.08A7 7 0 0019 12z"/></svg>
              <span className="text-sm font-medium text-[#0a1a3a]">Flexible Optionen von Top-Marken</span>
            </div>
          </div>
        </div>
      </section>

      {/* Urlaubsregionen entdecken */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight text-center mb-8">
            Urlaubsregionen entdecken
          </h2>

          {/* Row 1: 2 large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {typedFeatured.slice(0, 2).map((offer) => (
              <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-64 sm:h-72">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {typedFeatured.slice(2, 5).map((offer) => (
              <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-52 sm:h-56">
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
        </section>
      )}

      {/* Top Hotel Award Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Link href="/alle-angebote" className="block rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
          <Image
            src="/Banner Orizzontale Angebot 2.png"
            alt="Jetzt unsere Top Hotels entdecken — Top Hotel Award 2026"
            width={1400}
            height={120}
            className="w-full h-auto"
          />
        </Link>
      </section>

      {/* Urlaubsdeals Banner + Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Banner */}
        <Link href="/alle-angebote" className="block rounded-2xl overflow-hidden hover:shadow-lg transition-shadow mb-8">
          <Image
            src="/Banner orizzontale Angebot 1.png"
            alt="Die besten Urlaubsdeals zum Bestpreis sichern — Bis zu 250€ sparen"
            width={1400}
            height={100}
            className="w-full h-auto"
          />
        </Link>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight text-center mb-8">
          Die besten Urlaubsdeals zum Bestpreis sichern
        </h2>

        {/* 4 cards: 1 promo + 3 destinations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Promo card */}
          <Link href="/alle-angebote" className="group relative rounded-2xl overflow-hidden h-64 sm:h-72">
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

          {/* 3 destination cards from remaining featured */}
          {typedFeatured.slice(5, 8).length > 0
            ? typedFeatured.slice(5, 8).map((offer) => (
                <Link key={offer.id} href={`/angebot/${offer.id}`} className="group relative rounded-2xl overflow-hidden h-64 sm:h-72">
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-lg drop-shadow">{offer.destination.name}</p>
                  </div>
                </Link>
              ))
            : /* Fallback static destinations if not enough featured */
              ['creta', 'hurghada', 'antalya'].map((slug) => (
                <Link key={slug} href={`/reiseziel/${slug}`} className="group relative rounded-2xl overflow-hidden h-64 sm:h-72">
                  <Image
                    src={`/destinations/${slug}.webp`}
                    alt={slug}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-lg drop-shadow capitalize">{slug}</p>
                  </div>
                </Link>
              ))
          }
        </div>
      </section>

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
