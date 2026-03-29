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
          {filteredOffers.slice(0, 5).map((offer) => (
            <PublicOfferCard key={offer.id} offer={offer} />
          ))}

          {/* Check24 banner styled as a regular offer card */}
          {filteredOffers.length > 5 && (
            <a
              href="https://a.check24.net/misc/click.php?pid=1168044&aid=258&deep=pauschalreisen-vergleich&cat=9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="h-48 sm:h-56 bg-gradient-to-br from-[#003c78] to-[#0071c7] flex items-center justify-center p-4">
                <img
                  src="https://a.check24.net/misc/view.php?pid=1168044&aid=258&cat=9"
                  width={300}
                  height={250}
                  alt="Check24"
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-[#0a1a3a]/40 uppercase tracking-wider">Anzeige</p>
                <h3 className="text-base font-semibold text-[#0a1a3a] mt-1">Pauschalreisen vergleichen</h3>
                <p className="text-sm text-[#0a1a3a]/60 mt-1.5">Flug + Hotel zum besten Preis auf Check24</p>
                <div className="flex justify-end items-center mt-4 pt-3 border-t border-[#0a1a3a]/8">
                  <span className="bg-[#ff6b35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    Jetzt vergleichen
                  </span>
                </div>
              </div>
            </a>
          )}

          {filteredOffers.slice(5).map((offer) => (
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
