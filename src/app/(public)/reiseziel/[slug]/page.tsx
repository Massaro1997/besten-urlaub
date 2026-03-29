import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PublicOfferCard } from '@/components/public/public-offer-card'
import { CATEGORY_DE_MAP, CATEGORY_GRADIENTS } from '@/lib/public-constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dest = await prisma.destination.findUnique({ where: { slug } })

  if (!dest) {
    return { title: 'Reiseziel nicht gefunden | Besten Urlaub' }
  }

  return {
    title: `${dest.name} Urlaub — Angebote | Besten Urlaub`,
    description:
      dest.description || `Die besten Urlaubsangebote f\u00fcr ${dest.name}.`,
    openGraph: {
      title: `${dest.name} Urlaub — Angebote`,
      description:
        dest.description ||
        `Urlaubsangebote f\u00fcr ${dest.name}, ${dest.country}.`,
      type: 'website',
      locale: 'de_DE',
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params

  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      offers: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!destination) {
    notFound()
  }

  const gradient =
    CATEGORY_GRADIENTS[destination.category] || 'from-gray-500 to-gray-400'
  const categoryLabel = CATEGORY_DE_MAP[destination.category]

  // Shape each offer to match what PublicOfferCard expects
  const offersForCards = destination.offers.map((offer) => ({
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

  return (
    <>
      {/* ---- Breadcrumb ---- */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      >
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li>
            <Link href="/" className="hover:text-[#2e75fa] transition-colors">
              Startseite
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 inline" />
          </li>
          <li>
            <Link
              href="/#reiseziele"
              className="hover:text-[#2e75fa] transition-colors"
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
      <section
        className={`bg-gradient-to-br ${gradient} py-14 sm:py-20 px-4`}
      >
        <div className="max-w-5xl mx-auto text-center">
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

      {/* ---- Back link ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2e75fa] hover:text-[#1a5fe0] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Zur&uuml;ck zur Startseite
        </Link>
      </div>
    </>
  )
}
