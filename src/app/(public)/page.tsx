import Link from 'next/link'
import Image from 'next/image'
import { Car, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/hero-section'
import { OffersSection } from '@/components/public/offers-section'
import { DestinationGrid } from '@/components/public/destination-grid'
import { CtaSection } from '@/components/public/cta-section'
import { TikTokFeed } from '@/components/public/tiktok-feed'

export default async function HomePage() {
  const [offers, popularDestinations] = await Promise.all([
    prisma.offer.findMany({
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
      where: { slug: { not: null } },
      include: { _count: { select: { offers: true } } },
      orderBy: { popularity: 'desc' },
      take: 8,
    }),
  ])

  // Narrow slug to string for the public components (DB has slug as String?)
  const typedOffers = offers
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

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/lastminute"
            className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group h-40 sm:h-48 flex items-end"
          >
            <Image src="/destinations/lastminute.png" alt="Last Minute" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b35] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">Last Minute Angebote</p>
                <p className="text-xs text-white/70">Pauschalreisen vergleichen und sparen</p>
              </div>
            </div>
          </Link>
          <Link
            href="/mietwagen"
            className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group h-40 sm:h-48 flex items-end"
          >
            <Image src="/destinations/mietwagen.png" alt="Mietwagen" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2e75fa] flex items-center justify-center shrink-0">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">Mietwagen vergleichen</p>
                <p className="text-xs text-white/70">Weltweit den besten Preis finden</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Aktuelle Angebote */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-[#0a1a3a]">
          Aktuelle Angebote
        </h2>
        <p className="text-sm text-[#0a1a3a]/60 mt-1">
          Unsere neuesten Urlaubsschn&auml;ppchen
        </p>

        <div className="mt-6">
          <OffersSection offers={typedOffers} />
        </div>
      </section>

      {/* Beliebte Reiseziele */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <DestinationGrid destinations={typedDestinations} />
      </section>

      {/* TikTok Feed */}
      <TikTokFeed />

      {/* CTA */}
      <CtaSection />
    </>
  )
}
