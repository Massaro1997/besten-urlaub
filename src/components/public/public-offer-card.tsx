'use client'

import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatRelativeTime, getDeterministicPublishedAt } from '@/lib/utils'
import { CATEGORY_DE_MAP } from '@/lib/public-constants'
import { trackViewContent, trackClickButton } from '@/lib/tiktok-pixel'

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

export function PublicOfferCard({
  offer,
  size = 'default',
}: {
  offer: PublicOffer
  size?: 'default' | 'compact'
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const tracked = useRef(false)
  const categoryLabel = CATEGORY_DE_MAP[offer.destination.category]
  const image = DESTINATION_IMAGES[offer.destination.slug] || '/maldives.png'
  const isCompact = size === 'compact'

  // Marketing: fake original price (2.5-3x) and discount percentage.
  // Uses a deterministic hash from offer.id so server and client render the same value
  // (Math.random would produce a hydration mismatch).
  const seedHash = useMemo(() => {
    let h = 0
    for (let i = 0; i < offer.id.length; i++) h = (h * 31 + offer.id.charCodeAt(i)) | 0
    return Math.abs(h)
  }, [offer.id])
  const seedFactor = 2.5 + (seedHash % 50) / 100 // 2.50–2.99, stable per offer
  const originalPrice = offer.priceFrom ? Math.round(offer.priceFrom * seedFactor) : null
  const discountPercent = offer.priceFrom && originalPrice ? Math.round((1 - offer.priceFrom / originalPrice) * 100) : null
  const relativeTime = useMemo(() => formatRelativeTime(getDeterministicPublishedAt(offer.id)), [offer.id])

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

  // Heading badge (top-left): "Top-Deal" | "Last Minute" | "Exklusiv bei uns" | "FEATURED"
  // Derive from offer.featured flag + discount + category — pattern UP
  let headingBadge: { label: string; icon: string } | null = null
  if (discountPercent && discountPercent >= 40) headingBadge = { label: 'Top-Deal', icon: '🔥' }
  else if (offer.destination.category === 'last-minute') headingBadge = { label: 'Last Minute', icon: '⚡' }
  else if (offer.destination.category === 'fruehbucher') headingBadge = { label: 'Frühbucher', icon: '🐦' }
  else if (discountPercent && discountPercent >= 20) headingBadge = { label: 'Schnäppchen', icon: '💥' }

  return (
    <Link
      ref={cardRef}
      href={`/angebot/${offer.id}`}
      onClick={() => trackClickButton(offer)}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-0.5 group block"
    >
      {/* Image header — UP-style 16:9 */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <Image
          src={image}
          alt={offer.destination.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={isCompact ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
        />

        {/* Heading badge top-left (UP: "Top-Deal" + icon orange pill) */}
        {headingBadge && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-[11px] font-bold text-[#0a1a3a] shadow-sm">
            <span className="text-[#ff6b35]">{headingBadge.icon}</span>
            {headingBadge.label}
          </span>
        )}

        {/* Wishlist heart top-right (UP pattern) */}
        <button
          type="button"
          aria-label="Merken"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#0a1a3a]/55 hover:text-[#ff6b35] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>

        {/* Price ribbon bottom-right OVER image (UP pattern: "Ab X € p.P.") */}
        {offer.priceFrom && (
          <div className="absolute bottom-3 right-3 bg-white rounded-full px-3 py-1.5 shadow-md flex items-baseline gap-0.5">
            <span className="text-[10px] text-[#0a1a3a]/55 font-medium">Ab</span>
            <span className="text-base font-extrabold text-[#0a1a3a] tracking-tight">{formatPrice(offer.priceFrom)}</span>
            <span className="text-[10px] text-[#0a1a3a]/45 font-medium">p.P.</span>
          </div>
        )}
      </div>

      {/* Body — flat, NO border-top divider (UP pattern) */}
      <div className="p-4">
        {/* Category heading (uppercase mini-eyebrow) — UP pattern always present */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[#ff6b35] text-xs">🔥</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ff6b35]">
            {categoryLabel || 'Reisen'}
          </span>
        </div>

        {/* Title — bold, line-clamp 2 */}
        <h3 className="font-bold text-[#0a1a3a] text-[15px] leading-snug line-clamp-2 tracking-tight">
          {offer.title}
        </h3>

        {/* Subtitle */}
        {offer.description && (
          <p className="text-xs text-[#0a1a3a]/65 line-clamp-2 mt-1.5 leading-relaxed">
            {offer.description}
          </p>
        )}

        {/* Footer timestamp + strike */}
        <div className="flex items-center justify-between mt-3">
          {relativeTime && (
            <span className="text-[11px] text-[#0a1a3a]/50">
              {relativeTime}
            </span>
          )}
          {originalPrice && !isCompact && (
            <span className="text-[11px] text-[#0a1a3a]/40 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
