'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { ratgeberArticles } from '@/lib/ratgeber-data'

export function RatgeberCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>(':scope > a, :scope > div')?.offsetWidth ?? 300
    const gap = 16
    const distance = (cardWidth + gap) * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: distance, behavior: 'smooth' })
  }

  return (
    <section id="ratgeber" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#2e75fa]" />
            <span className="text-xs font-semibold text-[#2e75fa] uppercase tracking-wider">
              Ratgeber
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight">
            Reise-Ratgeber
          </h2>
          <p className="text-sm text-[#0a1a3a]/50 mt-1 max-w-lg">
            Inspiration &amp; Insider-Tipps f&uuml;r deinen n&auml;chsten Urlaub
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Vorherige Artikel"
            className="w-10 h-10 rounded-full bg-white border border-[#0a1a3a]/10 flex items-center justify-center text-[#0a1a3a]/60 hover:text-[#2e75fa] hover:border-[#2e75fa]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Nächste Artikel"
            className="w-10 h-10 rounded-full bg-white border border-[#0a1a3a]/10 flex items-center justify-center text-[#0a1a3a]/60 hover:text-[#2e75fa] hover:border-[#2e75fa]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {ratgeberArticles.map((article, idx) => (
          <Link
            key={article.slug}
            href={`/ratgeber/${article.slug}`}
            className="group flex-none w-[82%] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] snap-start"
          >
            {/* Mobile: blog-post style card with image on top + content below */}
            <article className="sm:hidden bg-white rounded-2xl overflow-hidden shadow-[0_6px_24px_-8px_rgba(10,26,58,0.2)] border border-[#0a1a3a]/5 group-active:scale-[0.98] transition-transform">
              <div className="relative aspect-[16/10] bg-[#0a1a3a]/5">
                <Image
                  src={article.heroImage}
                  alt={article.destination}
                  fill
                  className="object-cover"
                  sizes="82vw"
                />
                <span className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-[11px] font-bold text-[#0a1a3a] shadow-md">
                  {article.country}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#ff6b35] font-bold">Reise-Ratgeber</span>
                  <span className="text-[10px] text-[#0a1a3a]/40">·</span>
                  <span className="text-[10px] text-[#0a1a3a]/50">{3 + (idx % 4)} Min. Lesezeit</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-[#0a1a3a] leading-snug tracking-tight mb-1.5">
                  {article.title}
                </h3>
                <p className="text-[13px] text-[#0a1a3a]/55 leading-snug line-clamp-2 mb-3">
                  {article.destination} entdecken: Insider-Tipps, die besten Strände, lokale Highlights.
                </p>
                <div className="inline-flex items-center gap-1 text-[13px] font-bold text-[#2e75fa]">
                  Weiterlesen
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>

            {/* Desktop: compact image-with-overlay card (unchanged) */}
            <div className="hidden sm:block relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a1a3a]/5">
              <Image
                src={article.heroImage}
                alt={article.destination}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a3a]/80 via-[#0a1a3a]/20 to-transparent" />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1a3a]">
                {article.country}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-base font-bold text-white leading-snug line-clamp-2 drop-shadow group-hover:text-[#ff6b35] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-white/60 mt-1">{article.destination}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* "Mehr" card */}
        <Link
          href="/ratgeber"
          className="group flex-none w-[82%] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] snap-start"
        >
          {/* Mobile: matches blog-post layout */}
          <article className="sm:hidden bg-gradient-to-br from-[#2e75fa] to-[#0a1a3a] rounded-2xl overflow-hidden shadow-[0_6px_24px_-8px_rgba(46,117,250,0.4)] h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <ChevronRight className="w-7 h-7 text-white" />
            </div>
            <p className="text-white font-extrabold text-lg">Alle Ratgeber</p>
            <p className="text-white/60 text-xs mt-1">19 Reiseziele entdecken</p>
          </article>

          {/* Desktop (unchanged) */}
          <div className="hidden sm:flex relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2e75fa] to-[#0a1a3a] flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-bold text-lg">Alle Ratgeber</p>
            <p className="text-white/50 text-xs mt-1">19 Reiseziele entdecken</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
