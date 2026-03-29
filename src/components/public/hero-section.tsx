'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin } from 'lucide-react'

interface Destination {
  name: string
  country: string
  slug: string
  category: string
}

export function HeroSection() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Destination[]>([])
  const [allDestinations, setAllDestinations] = useState<Destination[]>([])
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/destinazioni')
      .then((r) => r.json())
      .then((data) => {
        setAllDestinations(
          data.map((d: { name: string; country: string; slug: string; category: string }) => ({
            name: d.name,
            country: d.country,
            slug: d.slug,
            category: d.category,
          })),
        )
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    setResults(
      allDestinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q),
      ).slice(0, 6),
    )
  }, [query, allDestinations])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <Image
        src="/santorini.png"
        alt="Urlaubsparadies"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/50 to-[#0a1a3a]/80" />

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/60 font-medium mb-4">Dein Urlaub. Dein Preis. Dein Moment.</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-[1.1]">
          Traumurlaub<br className="hidden sm:block" /> zum besten Preis.
        </h1>

        <p className="text-base sm:text-lg text-white/70 mt-5 max-w-xl mx-auto drop-shadow leading-relaxed">
          Wir finden die Deals, die andere &uuml;bersehen.<br className="hidden sm:block" /> Vergleiche. Buche. Flieg.
        </p>

        {/* Search bar */}
        <div className="max-w-md mx-auto mt-8 relative" ref={wrapperRef}>
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-5 py-3.5 shadow-xl shadow-black/20">
            <Search className="w-5 h-5 text-[#0a1a3a]/40 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Wohin soll es gehen?"
              className="ml-3 flex-1 bg-transparent text-[#0a1a3a] text-sm sm:text-base outline-none placeholder:text-[#0a1a3a]/40"
            />
          </div>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl shadow-black/15 overflow-hidden z-50">
              {results.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/reiseziel/${dest.slug}`}
                  onClick={() => { setShowResults(false); setQuery('') }}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#2e75fa]/5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#2e75fa] shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#0a1a3a]">{dest.name}</p>
                    <p className="text-xs text-[#0a1a3a]/50">{dest.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
