import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { PublicOfferCard } from '@/components/public/public-offer-card'
import { JsonLd } from '@/components/public/json-ld'
import { CATEGORY_DE_MAP } from '@/lib/public-constants'
import { destinations as ALL_DESTINATIONS, getDestinationBySlug } from '@/data/destinations'
import { getOffersByDestinationSlug } from '@/data/offers'
import {
  SITE_URL,
  breadcrumbJsonLd,
  itemListJsonLd,
  touristDestinationJsonLd,
} from '@/lib/seo-jsonld'
import { reiseKlima, MONAT_NAMEN, MONAT_SLUGS } from '@/data/reise-klima'
import { getBesteMonate, getGuenstigsterMonat, isPublishableMonth } from '@/lib/reisemonat'
import { ratgeberArticles } from '@/lib/ratgeber-data'
import { getAllFragenParams, getFrage } from '@/lib/fragen'

export function generateStaticParams() {
  return ALL_DESTINATIONS
    .filter((d) => d.slug)
    .map((d) => ({ slug: d.slug! }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

/**
 * Ein Destination-Hub ist "thin", wenn er weder Klimadaten noch Angebote noch
 * einen Ratgeber hat — dann ist die Seite ein near-duplicate Gerüst (forge.py
 * blockt sie). Solche Hubs bleiben erreichbar, aber auf noindex + raus aus der
 * Sitemap, damit sie die Site-Qualität nicht runterziehen.
 */
export function isThinHub(slug: string): boolean {
  const hasKlima = reiseKlima.some((z) => z.slug === slug)
  const hasOffers = getOffersByDestinationSlug(slug).length > 0
  const hasRatgeber = ratgeberArticles.some((r) => r.slug === slug)
  return !hasKlima && !hasOffers && !hasRatgeber
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)

  if (!dest) {
    return { title: 'Reiseziel nicht gefunden | Bester Urlaub' }
  }

  const url = `${SITE_URL}/reiseziel/${slug}`
  const heroImage = `/destinations/${slug}.webp`
  const thin = isThinHub(slug)

  return {
    title: `${dest.name} Urlaub — Angebote | Bester Urlaub`,
    description:
      dest.description || `Die besten Urlaubsangebote f\u00fcr ${dest.name}.`,
    alternates: { canonical: url },
    ...(thin ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${dest.name} Urlaub — Angebote`,
      description:
        dest.description ||
        `Urlaubsangebote f\u00fcr ${dest.name}, ${dest.country}.`,
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Bester Urlaub',
      images: [{ url: heroImage, width: 1200, height: 630, alt: dest.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dest.name} Urlaub — Angebote`,
      description:
        dest.description || `Urlaubsangebote f\u00fcr ${dest.name}.`,
      images: [heroImage],
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params

  const destination = getDestinationBySlug(slug)
  if (!destination) notFound()

  const destOffers = getOffersByDestinationSlug(slug)

  const categoryLabel = CATEGORY_DE_MAP[destination.category]
  const heroImage = `/destinations/${destination.slug}.webp`

  // Shape each offer to match what PublicOfferCard expects
  const offersForCards = destOffers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    priceFrom: offer.priceFrom,
    affiliateLink: offer.affiliateLink,
    description: offer.description,
    destination: {
      name: destination.name,
      country: destination.country,
      category: destination.category,
      slug: destination.slug as string,
    },
  }))

  /* ---- JSON-LD: TouristDestination + ItemList of offers + Breadcrumb ---- */
  const pageUrl = `${SITE_URL}/reiseziel/${slug}`
  const destinationSchema = touristDestinationJsonLd({
    name: destination.name,
    country: destination.country,
    description:
      destination.description ||
      `Urlaubsangebote für ${destination.name}, ${destination.country}.`,
    image: heroImage,
    url: pageUrl,
  })
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Reiseziele', url: '/alle-angebote' },
    { name: destination.name, url: `/reiseziel/${slug}` },
  ])
  const itemListSchema = offersForCards.length > 0
    ? itemListJsonLd({
        name: `Angebote für ${destination.name}`,
        url: pageUrl,
        items: offersForCards.map((o) => ({
          url: `/angebot/${o.id}`,
          name: o.title,
          price: o.priceFrom,
        })),
      })
    : null

  return (
    <>
      <JsonLd
        data={
          itemListSchema
            ? [destinationSchema, breadcrumbSchema, itemListSchema]
            : [destinationSchema, breadcrumbSchema]
        }
      />
      {/* ---- Breadcrumb ---- */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      >
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li>
            <Link href="/" className="hover:text-[#006AF9] transition-colors">
              Startseite
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 inline" />
          </li>
          <li>
            <Link
              href="/#reiseziele"
              className="hover:text-[#006AF9] transition-colors"
            >
              Reiseziele
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 inline" />
          </li>
          <li className="text-[#0a1a3a] font-medium">{destination.name}</li>
        </ol>
      </nav>

      {/* ---- Hero banner ---- */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <Image
          src={heroImage}
          alt={destination.name}
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/60 via-[#0a1a3a]/40 to-[#0a1a3a]/70" />
        <div className="relative max-w-5xl mx-auto text-center">
          {categoryLabel && (
            <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-4">
              {categoryLabel}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="text-white/80 text-lg mt-2">{destination.country}</p>

          {destination.description && (
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {destination.description}
            </p>
          )}

          {destination.bestSeason && (
            <p className="text-white/60 text-sm mt-3">
              Beste Reisezeit: {destination.bestSeason}
            </p>
          )}
        </div>
      </section>

      {/* ---- Klima-Überblick (divergente Realdaten je Destination) ---- */}
      {(() => {
        const klima = reiseKlima.find((z) => z.slug === slug)
        if (!klima) return null
        const beste = getBesteMonate(klima)
        const guenstig = getGuenstigsterMonat(klima)
        const buchbar = klima.monate.filter((m) => m.preisAb > 0)
        const peak = [...klima.monate].sort((a, b) => b.wasser - a.wasser)[0]
        const minPreis = Math.min(...buchbar.map((m) => m.preisAb))
        const maxPreis = Math.max(...buchbar.map((m) => m.preisAb))
        const topHighlights = [...new Set(klima.monate.flatMap((m) => m.highlights))].slice(0, 4)
        const istBinnen = peak.wasser <= 0
        const fakten = [
          { k: 'Beste Reisezeit', v: beste.map((mi) => MONAT_NAMEN[mi - 1]).join(', ') },
          { k: 'Günstigster Monat', v: `${MONAT_NAMEN[guenstig.monat - 1]} (ab ${guenstig.preisAb} €)` },
          ...(istBinnen ? [] : [{ k: 'Wassertemperatur', v: `bis ${peak.wasser}°C im ${MONAT_NAMEN[peak.monat - 1]}` }]),
          { k: 'Preisspanne', v: `${minPreis}–${maxPreis} € p. P.` },
          { k: 'Flugzeit', v: `${klima.flugStunden} h ab Deutschland` },
          { k: 'Flughafen', v: klima.flughafen },
        ]
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
            <h2 className="text-2xl font-bold text-[#0a1a3a]">{destination.name} im Überblick</h2>
            <p className="text-[#0a1a3a]/75 mt-3 max-w-3xl leading-relaxed">
              {destination.name} in {klima.land}: Die beste Reisezeit sind {beste.map((mi) => MONAT_NAMEN[mi - 1]).join(', ')}.
              {!istBinnen && ` Das Meer erreicht bis zu ${peak.wasser}°C im ${MONAT_NAMEN[peak.monat - 1]}.`}{' '}
              Pauschalreisen starten ab {guenstig.preisAb} € pro Person, der Flug dauert rund {klima.flugStunden} Stunden zum Flughafen {klima.flughafen}.{' '}
              Alle ab-Preise pro Monat: <Link href={`/pauschalreise/${slug}`} className="text-[#006AF9] hover:underline font-medium">Pauschalreise {destination.name} Preistabelle</Link>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {fakten.map((f) => (
                <div key={f.k} className="rounded-2xl border border-[#0a1a3a]/10 bg-white p-4">
                  <div className="text-xs text-[#0a1a3a]/55">{f.k}</div>
                  <div className="text-sm font-semibold text-[#0a1a3a] mt-0.5">{f.v}</div>
                </div>
              ))}
            </div>
            {topHighlights.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#0a1a3a] mb-2">Highlights in {destination.name}</h3>
                <ul className="space-y-1.5">
                  {topHighlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#0a1a3a]/80">
                      <span className="text-[#006AF9] mt-0.5 shrink-0">●</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )
      })()}

      {/* ---- Offers grid ---- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-[#0a1a3a]">
          Angebote f&uuml;r {destination.name}
        </h2>
        <p className="text-sm text-[#0a1a3a]/60 mt-1">
          {offersForCards.length}{' '}
          {offersForCards.length === 1 ? 'Angebot' : 'Angebote'} verf&uuml;gbar
        </p>

        {offersForCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {offersForCards.map((offer) => (
              <PublicOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl mt-6">
            <p className="text-lg font-medium text-[#0a1a3a]/70">
              Noch keine Angebote f&uuml;r {destination.name}.
            </p>
            <p className="text-sm text-[#0a1a3a]/50 mt-2">
              Schau bald wieder vorbei!
            </p>
          </div>
        )}
      </section>

      {/* ---- Cross-axis internal links (Reisezeit / Fragen / Ratgeber) ---- */}
      {(() => {
        const klima = reiseKlima.find((z) => z.slug === slug)
        const ratgeber = ratgeberArticles.find((r) => r.slug === slug)
        // ALLE Fragen-Seiten dieser Destination (nicht nur 3), damit der
        // programmatische Fragen-Baum nicht intern verwaist.
        const fragen = getAllFragenParams()
          .filter((p) => p.slug.endsWith(`-${slug}`))
          .map((p) => ({ slug: p.slug, frage: getFrage(p.slug)?.frage }))
          .filter((x): x is { slug: string; frage: string } => Boolean(x.frage))
        const beste = klima ? getBesteMonate(klima) : []
        const guenstig = klima ? getGuenstigsterMonat(klima) : null
        // ALLE buchbaren Monate (preisAb > 0) verlinken, damit jede generierte
        // /reise/[ziel]/[monat]-Seite mindestens einen internen Link bekommt.
        const monatLinks = klima
          ? klima.monate
              .filter((mm) => isPublishableMonth(mm))
              .map((mm) => {
                const istBeste = beste.includes(mm.monat)
                const istGuenstig = guenstig ? mm.monat === guenstig.monat : false
                const zusatz = istBeste
                  ? ' (beste Reisezeit)'
                  : istGuenstig
                    ? ` (günstigster Monat, ab ${mm.preisAb} €)`
                    : ''
                return {
                  href: `/reise/${slug}/${MONAT_SLUGS[mm.monat - 1]}`,
                  label: `${destination.name} im ${MONAT_NAMEN[mm.monat - 1]}${zusatz}`,
                }
              })
          : []
        const links: { href: string; label: string }[] = []
        links.push(...monatLinks)
        for (const f of fragen) links.push({ href: `/fragen/${f.slug}`, label: f.frage })
        if (ratgeber) links.push({ href: `/ratgeber/${slug}`, label: `${destination.name} Reiseführer: ${ratgeber.title}` })
        if (links.length === 0) return null
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
            <h2 className="text-xl font-bold text-[#0a1a3a] mb-4">Mehr zu {destination.name}</h2>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-start gap-1.5 text-[#006AF9] hover:underline text-sm">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {l.label}
                  </Link>
                </li>
              ))}
              {klima && (
                <li>
                  <Link href="/reise" className="flex items-start gap-1.5 text-[#006AF9] hover:underline text-sm">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Klima &amp; beste Reisezeit Monat für Monat
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )
      })()}

      {/* ---- Back link ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#006AF9] hover:text-[#004DE9] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Zur&uuml;ck zur Startseite
        </Link>
      </div>
    </>
  )
}
