import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { CATEGORY_DE_MAP } from '@/lib/public-constants'

const CATEGORY_IMAGES: Record<string, string> = {
  mare: '/maldives.png',
  montagna: '/alps.png',
  avventura: '/bali.png',
  citta: '/santorini.png',
  crociera: '/maldives.png',
  wellness: '/alps.png',
}

interface PublicOffer {
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

export function PublicOfferCard({ offer }: { offer: PublicOffer }) {
  const categoryLabel = CATEGORY_DE_MAP[offer.destination.category]
  const image = CATEGORY_IMAGES[offer.destination.category] || '/maldives.png'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
      {/* Image header */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <Image
          src={image}
          alt={offer.destination.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category badge */}
        {categoryLabel && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1a3a]">
            {categoryLabel}
          </span>
        )}

        {/* Destination name on image */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-semibold text-sm drop-shadow">
            {offer.destination.name}, {offer.destination.country}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-[#0a1a3a] line-clamp-2">
          {offer.title}
        </h3>

        {/* Description */}
        {offer.description && (
          <p className="text-sm text-[#0a1a3a]/60 line-clamp-2 mt-1.5">
            {offer.description}
          </p>
        )}

        {/* Bottom: price + CTA */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#0a1a3a]/8">
          {offer.priceFrom ? (
            <div>
              <span className="text-xs text-[#0a1a3a]/50">ab</span>
              <span className="text-xl font-bold text-[#2e75fa] ml-1">
                {formatPrice(offer.priceFrom)}
              </span>
            </div>
          ) : (
            <span />
          )}

          <a
            href={offer.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ff6b35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e55a2b] active:scale-95 transition-all inline-block shadow-sm shadow-[#ff6b35]/25"
          >
            Zum Angebot
          </a>
        </div>
      </div>
    </div>
  )
}
