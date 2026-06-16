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
    <section className="border-b border-[#0a1a3a]/5 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f5f6f8] hover:bg-[#0a1a3a] hover:text-white text-[#0a1a3a] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap border border-transparent hover:border-[#0a1a3a]"
            >
              <span className="text-sm sm:text-base">{chip.emoji}</span>
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
