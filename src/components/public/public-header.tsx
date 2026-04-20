'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, Phone } from 'lucide-react'
import { trackLead } from '@/lib/tiktok-pixel'

const navLinks = [
  { label: 'Pauschalreisen', href: '/pauschalreisen' },
  { label: 'Last Minute', href: '/lastminute' },
  { label: 'All Inclusive', href: '/all-inclusive' },
  { label: 'Frühbucher', href: '/fruehbucher' },
  { label: 'Mietwagen', href: '/mietwagen' },
  { label: 'Ratgeber', href: '/ratgeber' },
]

const SEARCH_DESTINATIONS = [
  { name: 'Mallorca', country: 'Spanien', slug: 'mallorca' },
  { name: 'Antalya', country: 'Türkei', slug: 'antalya' },
  { name: 'Creta', country: 'Griechenland', slug: 'creta' },
  { name: 'Hurghada', country: 'Ägypten', slug: 'hurghada' },
  { name: 'Sardegna', country: 'Italien', slug: 'sardegna' },
  { name: 'Marbella', country: 'Spanien', slug: 'marbella' },
  { name: 'Santorini', country: 'Griechenland', slug: 'santorini' },
  { name: 'Mauritius', country: 'Mauritius', slug: 'mauritius' },
  { name: 'Sansibar', country: 'Tansania', slug: 'sansibar' },
  { name: 'Sicilia', country: 'Italien', slug: 'sicilia' },
  { name: 'Lago di Garda', country: 'Italien', slug: 'lago-di-garda' },
  { name: 'Korfu', country: 'Griechenland', slug: 'korfu' },
]

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [mobileVisible, setMobileVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 8)
      setMobileVisible(y > window.innerHeight * 0.4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close search on click outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }, [])

  const filtered = searchQuery.length > 0
    ? SEARCH_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_DESTINATIONS.slice(0, 6)

  return (
    <header
      className={`fixed sm:sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300
        sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto sm:block
        ${mobileVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}
      `}
      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/noBgColor.png"
              alt="Bester Urlaub"
              width={140}
              height={36}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#0a1a3a] hover:text-[#2e75fa] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Search + Contact + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search button */}
            <div ref={searchRef} className="relative">
              <button
                type="button"
                onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#0a1a3a]/70 hover:bg-[#2e75fa]/5 hover:text-[#2e75fa] transition-colors"
                aria-label="Suchen"
              >
                <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] border border-[#0a1a3a]/5 overflow-hidden z-50">
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a1a3a]/30" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Reiseziel suchen..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a1a3a]/[0.03] border border-[#0a1a3a]/8 text-sm text-[#0a1a3a] placeholder:text-[#0a1a3a]/35 outline-none focus:border-[#2e75fa] focus:ring-1 focus:ring-[#2e75fa]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto">
                    {filtered.length > 0 ? (
                      <div className="px-1.5 pb-2">
                        {!searchQuery && (
                          <p className="text-[10px] uppercase tracking-wider text-[#0a1a3a]/30 font-semibold px-3 py-1.5">
                            Beliebte Reiseziele
                          </p>
                        )}
                        {filtered.map((dest) => (
                          <Link
                            key={dest.slug}
                            href={`/reiseziel/${dest.slug}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2e75fa]/5 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#2e75fa]/8 flex items-center justify-center shrink-0">
                              <span className="text-sm">✈</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#0a1a3a]">{dest.name}</p>
                              <p className="text-xs text-[#0a1a3a]/40">{dest.country}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#0a1a3a]/40 text-center py-6">
                        Kein Reiseziel gefunden
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact button */}
            <a
              href="tel:+4917682405507"
              onClick={() => trackLead('header-desktop')}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#0a1a3a]/70 hover:bg-[#2e75fa]/5 hover:text-[#2e75fa] transition-colors"
              aria-label="Anrufen"
            >
              <Phone className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#0a1a3a]/70 hover:bg-[#0a1a3a]/5 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Menu schliessen' : 'Menu oeffnen'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#0a1a3a]/6 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#0a1a3a] hover:text-[#2e75fa] hover:bg-[#2e75fa]/5 px-3 py-2.5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#0a1a3a]/6 mt-2 pt-2">
              <a
                href="tel:+4917682405507"
                onClick={() => trackLead('header-mobile')}
                className="flex items-center gap-2 text-sm font-medium text-[#2e75fa] px-3 py-2.5 rounded-lg hover:bg-[#2e75fa]/5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                0176 824 055 07
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
