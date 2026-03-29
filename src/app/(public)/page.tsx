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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Last Minute */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="relative h-44 overflow-hidden">
              <Image src="/destinations/lastminute.png" alt="Last Minute" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="px-6 pb-6 -mt-6 relative">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-xs font-semibold text-[#ff6b35] uppercase tracking-wider">Last Minute</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a1a3a]">Pauschalreisen vergleichen</h3>
              <p className="text-sm text-[#0a1a3a]/50 mt-1">Finde die besten Deals und spare bei deinem Traumurlaub</p>
              <Link
                href="/lastminute"
                className="mt-4 inline-flex items-center gap-2 bg-[#ff6b35] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#e55a2b] active:scale-95 transition-all shadow-md shadow-[#ff6b35]/20"
              >
                Jetzt Angebote finden
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>

          {/* Mietwagen */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="relative h-44 overflow-hidden">
              <Image src="/destinations/mietwagen.png" alt="Mietwagen" fill className="object-cover object-[center_calc(50%-25px)] group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="px-6 pb-6 -mt-6 relative">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-[#2e75fa]" />
                <span className="text-xs font-semibold text-[#2e75fa] uppercase tracking-wider">Mietwagen</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a1a3a]">Mietwagen weltweit vergleichen</h3>
              <p className="text-sm text-[#0a1a3a]/50 mt-1">Finde den besten Preis und starte dein Abenteuer</p>
              <Link
                href="/mietwagen"
                className="mt-4 inline-flex items-center gap-2 bg-[#2e75fa] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a5fe0] active:scale-95 transition-all shadow-md shadow-[#2e75fa]/20"
              >
                Jetzt vergleichen
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>
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
