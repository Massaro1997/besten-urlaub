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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredOffers.map((offer, i) => (
            <span key={offer.id}>
              <PublicOfferCard offer={offer} />
              {/* Insert Check24 banner card after 6th offer */}
              {i === 5 && (
                <a
                  href="https://a.check24.net/misc/click.php?pid=1168044&aid=258&deep=pauschalreisen-vergleich&cat=9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex items-center justify-center p-4"
                >
                  <img
                    src="https://a.check24.net/misc/view.php?pid=1168044&aid=258&cat=9"
                    width={300}
                    height={250}
                    alt="Check24 Pauschalreisen"
                    className="rounded-xl max-w-full h-auto"
                  />
                </a>
              )}
            </span>
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
