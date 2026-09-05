'use client'

import Link from 'next/link'

/**
 * Horizontal scrollable category chip row — pattern preso da urlaubspiraten.de.
 * Sticky bar di entry-point veloci alle macro-categorie. Mobile swipe, desktop overflow.
 */
const CHIPS: { label: string; emoji: string; href: string }[] = [
  { label: 'Pauschalreisen', emoji: '🏝️', href: '/pauschalreisen' },
  { label: 'All Inclusive', emoji: '🍹', href: '/all-inclusive' },
  { label: 'Last Minute', emoji: '🔥', href: '/lastminute' },
  { label: 'Frühbucher', emoji: '🐦', href: '/fruehbucher' },
  { label: 'Familienurlaub', emoji: '👨‍👩‍👧', href: '/alle-angebote?cat=familie' },
  { label: 'Wellness', emoji: '🧖', href: '/alle-angebote?cat=wellness' },
  { label: 'Strand', emoji: '🌊', href: '/alle-angebote?cat=strand' },
  { label: 'Städtereisen', emoji: '🌆', href: '/alle-angebote?cat=staedte' },
  { label: 'Kreuzfahrten', emoji: '🚢', href: '/alle-angebote?cat=kreuzfahrt' },
  { label: 'Mietwagen', emoji: '🚗', href: '/mietwagen' },
]

export function CategoryChipRow() {
  return (
    <section className="bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-4 pb-6 sm:pt-6 sm:pb-8">
        <div
          className="bu-scroll-fade flex xl:flex-wrap xl:justify-center gap-2.5 sm:gap-3 overflow-x-auto xl:overflow-visible scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="shrink-0 inline-flex items-center gap-2.5 pl-3 pr-5 py-2.5 rounded-full bg-white text-[#0a1a3a] text-sm sm:text-[15px] font-semibold whitespace-nowrap
                         border border-[#0a1a3a]/10 shadow-[0_1px_2px_rgba(10,26,58,0.05)]
                         transition-all hover:border-[#2e75fa]/40 hover:shadow-[0_6px_18px_-6px_rgba(10,26,58,0.25)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f2f5fa] text-lg leading-none">
                {chip.emoji}
              </span>
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        :global(.scrollbar-hide::-webkit-scrollbar) { display: none; }
      `}</style>
    </section>
  )
}
