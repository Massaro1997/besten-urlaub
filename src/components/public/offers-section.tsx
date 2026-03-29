'use client'

import { useState } from 'react'
import { PUBLIC_CATEGORIES } from '@/lib/public-constants'
import { CategoryTabs } from '@/components/public/category-tabs'
import { PublicOfferCard } from '@/components/public/public-offer-card'

interface OfferWithDestination {
  id: string
  title: string
  priceFrom: number | null
  affiliateLink: string
  description: string | null
  destination: {
    name: string
    country: string
    category: string
    slug: string
  }
}

export function OffersSection({ offers }: { offers: OfferWithDestination[] }) {
  const [activeCategory, setActiveCategory] = useState('alle')

  const activeCategoryDef = PUBLIC_CATEGORIES.find((c) => c.value === activeCategory)
  const filterValue = activeCategoryDef?.filter ?? null

  const filteredOffers = filterValue
    ? offers.filter((o) => o.destination.category === filterValue)
    : offers

  return (
    <section>
      <CategoryTabs
        categories={PUBLIC_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filteredOffers.map((offer) => (
            <PublicOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#0a1a3a]/50 text-sm">
            Keine Angebote in dieser Kategorie
          </p>
        </div>
      )}
    </section>
  )
}
