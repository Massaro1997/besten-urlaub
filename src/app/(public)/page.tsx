// Static data — no DB queries, page is statically rendered + cached by Next
import Link from 'next/link'
import Image from 'next/image'
import { HeroSection } from '@/components/public/hero-section'
import { HeroCtaBar } from '@/components/public/hero-cta-bar'
import { DestinationGrid } from '@/components/public/destination-grid'
import { TikTokFeed } from '@/components/public/tiktok-feed'
import { RatgeberCarousel } from '@/components/public/ratgeber-carousel'
import { NewsletterInlineBanner } from '@/components/public/newsletter-inline-banner'
import { CategoryChipRow } from '@/components/public/category-chip-row'
import { FaqSection } from '@/components/public/faq-section'
import { LogoMarquee } from '@/components/public/logo-marquee'
import { TrackedOfferLink } from '@/components/public/tracked-offer-link'
import { PhoneCtaSection } from '@/components/public/phone-cta-section'
import { TopSeitenLinks } from '@/components/public/top-seiten-links'
import { CallbackModal } from '@/components/public/callback-modal'
import { JsonLd } from '@/components/public/json-ld'
import { extractOfferDates, formatOfferDateRange } from '@/lib/offer-dates'
import { getFeaturedOffers } from '@/data/offers'
import { getAllOffersMerged } from '@/lib/offers-merged'
import { destinations as ALL_DESTINATIONS } from '@/data/destinations'
import { organizationJsonLd, websiteJsonLd, faqJsonLd } from '@/lib/seo-jsonld'
import { HOMEPAGE_FAQ } from '@/lib/faq-data'
import { formatRelativeTime, getDeterministicPublishedAt } from '@/lib/utils'

export default async function HomePage() {
  const ALL_OFFERS = await getAllOffersMerged()
  // Featured = (auto-imported da UP pipeline, sempre fresh) + TUTTE statiche featured (no tronca)
  const autoImported = ALL_OFFERS.filter((o) => o.notes?.includes('Auto-imported'))
  const staticFeatured = getFeaturedOffers()
  // Auto-imported PRIMA (più freschi), poi TUTTE le statiche featured
  const featured = [...autoImported, ...staticFeatured]

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

  // Destinations with multiple webp variants — used to render different
  // images when the homepage shows several offers in the same destination.
  const DEST_VARIANTS: Record<string, string[]> = {
    kreta: ['/destinations/kreta.webp', '/destinations/creta.webp'],
  }
  const slugCounter = new Map<string, number>()
  const typedFeatured = featured
    .filter((o) => o.destination.slug !== null)
    .map((o) => {
      const slug = o.destination.slug as string
      const variants = DEST_VARIANTS[slug]
      let cardImage = `/destinations/${slug}.webp`
      if (variants && variants.length > 0) {
        const i = slugCounter.get(slug) ?? 0
        cardImage = variants[i % variants.length]
        slugCounter.set(slug, i + 1)
      }
      return {
        id: o.id,
        title: o.title,
        priceFrom: o.priceFrom,
        affiliateLink: o.affiliateLink,
        description: o.description,
        cardImage,
        destination: {
          name: o.destination.name,
          country: o.destination.country,
          category: o.destination.category,
          slug,
        },
      }
    })

  const typedDestinations = popularDestinations.map((d) => ({
    name: d.name,
    country: d.country,
    category: d.category,
    slug: d.slug as string,
    _count: { offers: counts.get(d.slug!) || 0 },
  }))

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), faqJsonLd(HOMEPAGE_FAQ)]} />
      <CallbackModal source="homepage" />
      <HeroSection />
      <HeroCtaBar />
      <CategoryChipRow />

      {/* Handverlesene Reise-Deals */}
      {typedFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-16">
          <div className="flex flex-col items-center text-center mb-5 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#ff6b35] mb-2">
              Handverlesen · Täglich aktualisiert
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-[2rem] font-extrabold text-[#0a1a3a] tracking-tight">
              Die besten Reise-Deals der Woche
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-12 auto-rows-[10rem] sm:auto-rows-[14rem] gap-3 sm:gap-4">
            {typedFeatured.map((offer, idx) => {
              const dateRange = formatOfferDateRange(extractOfferDates(offer.affiliateLink))
              const publishedAt = getDeterministicPublishedAt(offer.id)
              const relativeTime = formatRelativeTime(publishedAt)
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
                    src={offer.cardImage}
                    alt={offer.destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={isLarge ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                  {relativeTime && (
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#0a1a3a] font-semibold rounded-full shadow-sm ${isLarge ? 'text-[11px] px-2.5 py-1' : 'text-[10px] px-2 py-0.5'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse" />
                        {relativeTime}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 right-20">
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
                    <div className="absolute bottom-4 right-4 text-right">
                      <span className="text-white/70 text-xs drop-shadow">ab</span>{' '}
                      <span className={`text-white font-extrabold drop-shadow ${isLarge ? 'text-2xl' : 'text-xl'}`}>{Math.round(offer.priceFrom)} €</span>
                      <span className="text-white/70 text-xs drop-shadow ml-0.5">p.P.</span>
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

      {/* Meistgesuchte Seiten (interne Links auf GSC-Top-Seiten) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <TopSeitenLinks />
      </section>

      {/* Reise-Ratgeber */}
      <RatgeberCarousel />

      {/* Newsletter inline touchpoint #2 (footer = #1) */}
      <NewsletterInlineBanner source="newsletter-homepage-inline" />

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

        <div className="flex flex-col items-center text-center mb-5 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#ff6b35] mb-2">
            Schnäppchen-Alarm · Nur diese Woche
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-[2rem] font-extrabold text-[#0a1a3a] tracking-tight leading-tight">
            Urlaubsdeals zum Bestpreis sichern 🔥
          </h2>
          <p className="text-sm sm:text-base text-[#0a1a3a]/55 mt-2 max-w-2xl">
            Bis zu 250 € sparen auf handverlesene Hotel-Schnäppchen. Frei stornierbar.
          </p>
        </div>

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
