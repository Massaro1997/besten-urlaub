import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/hero-section'
import { OffersSection } from '@/components/public/offers-section'
import { DestinationGrid } from '@/components/public/destination-grid'
import { CtaSection } from '@/components/public/cta-section'

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

      {/* CTA */}
      <CtaSection />
    </>
  )
}
