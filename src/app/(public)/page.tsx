// Static data — no DB queries, page is statically rendered + cached by Next
import Link from 'next/link'
import Image from 'next/image'
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
import { getFeaturedOffers, offers as ALL_OFFERS } from '@/data/offers'
import { destinations as ALL_DESTINATIONS } from '@/data/destinations'

export default function HomePage() {
  const featured = getFeaturedOffers()

  // Count offers per destination slug
  const counts = new Map<string, number>()
  for (const o of ALL_OFFERS) {
    const slug = o.destination.slug
    if (slug) counts.set(slug, (counts.get(slug) || 0) + 1)
  }

  // Top 8 destinations by offer count (only those with a slug + at least 1 offer)
  const popularDestinations = ALL_DESTINATIONS
    .filter((d) => d.slug && (counts.get(d.slug) || 0) > 0)
    .sort((a, b) => (counts.get(b.slug!) || 0) - (counts.get(a.slug!) || 0))
    .slice(0, 8)

  const typedFeatured = featured
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

  const typedDestinations = popularDestinations.map((d) => ({
    name: d.name,
    country: d.country,
    category: d.category,
    slug: d.slug as string,
    _count: { offers: counts.get(d.slug!) || 0 },
  }))

  return (
    <>
      <CallbackModal source="homepage" />
      <HeroSection />

      {/* Urlaubsregionen entdecken */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-12 auto-rows-[10rem] sm:auto-rows-[14rem] gap-3 sm:gap-4">
            {typedFeatured.map((offer, idx) => {
              const dateRange = formatOfferDateRange(extractOfferDates(offer.affiliateLink))
              // Mosaic pattern repeating every 5 cards on desktop:
              //   0: wide tall (8 cols, 2 rows)   1: tall (4 cols, 2 rows)
              //   2: small (4 cols, 1 row)       3: small (4 cols, 1 row)   4: small (4 cols, 1 row)
              const mod = idx % 5
              const span =
                mod === 0
                  ? 'col-span-2 sm:col-span-8 sm:row-span-2'
                  : mod === 1
                  ? 'col-span-2 sm:col-span-4 sm:row-span-2'
                  : 'col-span-2 sm:col-span-4 sm:row-span-1'
              const isLarge = mod === 0 || mod === 1
              return (
                <TrackedOfferLink
                  key={offer.id}
                  offerId={offer.id}
                  offerTitle={offer.title}
                  priceFrom={offer.priceFrom}
                  href={`/angebot/${offer.id}`}
                  className={`group relative rounded-2xl overflow-hidden block ${span}`}
                >
                  <Image
                    src={`/destinations/${offer.destination.slug}.webp`}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={isLarge ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                  <div className="absolute top-4 left-4 right-4">
                    <p className={`text-white font-bold drop-shadow ${isLarge ? 'text-lg' : 'text-base'}`}>
                      {offer.destination.name}, <span className="font-normal">{offer.destination.country}</span>
                    </p>
                    <p className={`text-white/80 drop-shadow ${isLarge ? 'text-sm' : 'text-xs'}`}>7 Tage, 2 Erw., inkl. Flug</p>
                  </div>
                  {dateRange && (
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 bg-[#ff3333]/90 backdrop-blur-sm text-white font-bold rounded-full ${isLarge ? 'text-[11px] px-2.5 py-1' : 'text-[10px] px-2 py-0.5'}`}>
                        <svg className={isLarge ? 'w-3 h-3' : 'w-2.5 h-2.5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {dateRange}
                      </span>
                    </div>
                  )}
                  {offer.priceFrom && (
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-sm drop-shadow">ab </span>
                      <span className={`text-white font-extrabold drop-shadow ${isLarge ? 'text-2xl' : 'text-xl'}`}>{Math.round(offer.priceFrom)} &euro;</span>
                    </div>
                  )}
                </TrackedOfferLink>
              )
            })}
          </div>
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
