'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { CATEGORY_DE_MAP } from '@/lib/public-constants'
import { trackViewContent, trackClickButton, trackAddToCart } from '@/lib/tiktok-pixel'

const DESTINATION_IMAGES: Record<string, string> = {
  mallorca: '/destinations/mallorca.webp',
  antalya: '/destinations/antalya.webp',
  creta: '/destinations/creta.webp',
  hurghada: '/destinations/hurghada.webp',
  'sharm-el-sheikh': '/destinations/sharm-el-sheikh.webp',
  sardegna: '/destinations/sardegna.webp',
  sicilia: '/destinations/sicilia.webp',
  canarie: '/destinations/canarie.webp',
  mauritius: '/destinations/mauritius.webp',
  thailandia: '/destinations/thailandia.webp',
  istanbul: '/destinations/istanbul.webp',
  marbella: '/destinations/marbella.webp',
  santorini: '/destinations/santorini.webp',
  'bad-griesbach': '/destinations/bad-griesbach.webp',
  nordkroatien: '/destinations/nordkroatien.webp',
  chalkidiki: '/destinations/chalkidiki.webp',
  'lago-di-garda': '/destinations/lago-di-garda.webp',
  fuessen: '/destinations/fuessen.webp',
  'playa-del-carmen': '/destinations/playa-del-carmen.webp',
  rodi: '/destinations/rodi.webp',
  'mont-saint-michel': '/destinations/mont-saint-michel.webp',
  holland: '/destinations/holland.webp',
  'punta-cana': '/destinations/punta-cana.webp',
  corf: '/destinations/corf.webp',
  zypern: '/destinations/zypern.webp',
  sansibar: '/destinations/sansibar.webp',
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
  const cardRef = useRef<HTMLDivElement>(null)
  const tracked = useRef(false)
  const categoryLabel = CATEGORY_DE_MAP[offer.destination.category]
  const image = DESTINATION_IMAGES[offer.destination.slug] || '/maldives.png'

  // ViewContent — when card scrolls into view
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true
          trackViewContent(offer)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [offer])

  return (
    <div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
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

        {categoryLabel && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1a3a]">
            {categoryLabel}
          </span>
        )}

        <div className="absolute bottom-3 left-3">
          <p className="text-white font-semibold text-sm drop-shadow">
            {offer.destination.name}, {offer.destination.country}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#0a1a3a] line-clamp-2">
          {offer.title}
        </h3>

        {offer.description && (
          <p className="text-sm text-[#0a1a3a]/60 line-clamp-2 mt-1.5">
            {offer.description}
          </p>
        )}

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

          <Link
            href={`/angebot/${offer.id}`}
            onClick={() => {
              trackClickButton(offer)
              trackAddToCart(offer)
            }}
            className="bg-[#ff6b35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e55a2b] active:scale-95 transition-all inline-block shadow-sm shadow-[#ff6b35]/25"
          >
            Zum Angebot
          </Link>
        </div>
      </div>
    </div>
  )
}
