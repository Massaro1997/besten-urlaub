'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Phone } from 'lucide-react'
import { trackLead } from '@/lib/tiktok-pixel'

const navLinks = [
  { label: 'Pauschalreisen', href: '/pauschalreisen' },
  { label: 'Last Minute', href: '/lastminute' },
  { label: 'All Inclusive', href: '/all-inclusive' },
  { label: 'Frühbucher', href: '/fruehbucher' },
  { label: 'Mietwagen', href: '/mietwagen' },
  { label: 'Beste Reisezeit', href: '/reise' },
  { label: 'Reise-Tipps', href: '/fragen' },
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
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
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

  // Close search on click outside (desktop field + mobile panel)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node
      const inDesktop = searchRef.current?.contains(target)
      const inMobile = mobileSearchRef.current?.contains(target)
      if (!inDesktop && !inMobile) setSearchOpen(false)
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

  // Transparent overlay only over the homepage hero, before the first scroll
  const transparent = isHome && !scrolled && !mobileOpen

  const results = (
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#006AF9]/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#006AF9]/8 flex items-center justify-center shrink-0">
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
  )

  return (
    <header
      className={`${isHome ? 'fixed' : 'fixed sm:sticky'} top-0 left-0 right-0 z-50 w-full transition-all duration-300
        sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto sm:block
        ${mobileVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
        ${transparent ? 'bg-transparent' : scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}
      `}
      style={{ borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(0, 0, 0, 0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={transparent ? '/noBgWhite.png' : '/noBgColor.png'}
              alt="Bester Urlaub"
              width={140}
              height={36}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </Link>

          {/* Search — centered */}
          <div ref={searchRef} className="relative flex-1 hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
                  transparent ? 'text-white/70' : 'text-[#0a1a3a]/35'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Reiseziel suchen..."
                aria-label="Reiseziel suchen"
                className={`w-full h-10 pl-10 pr-4 rounded-full text-sm outline-none transition-all ${
                  transparent
                    ? 'bg-white/15 border border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm focus:bg-white/25 focus:border-white/50'
                    : 'bg-[#0a1a3a]/[0.04] border border-[#0a1a3a]/8 text-[#0a1a3a] placeholder:text-[#0a1a3a]/35 focus:border-[#006AF9] focus:ring-1 focus:ring-[#006AF9]/20'
                }`}
              />

              {searchOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] border border-[#0a1a3a]/5 overflow-hidden z-50">
                  {results}
                </div>
              )}
            </div>
          </div>

          {/* Right side: nav + mobile search + hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
            {/* Desktop navigation */}
            <nav className="hidden xl:flex items-center gap-5 mr-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    transparent
                      ? 'text-white/90 hover:text-white drop-shadow-[0_1px_6px_rgba(10,26,58,0.5)]'
                      : 'text-[#0a1a3a] hover:text-[#006AF9]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile search trigger */}
            <div ref={mobileSearchRef} className="md:hidden">
              <button
                type="button"
                onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  transparent ? 'text-white hover:bg-white/15' : 'text-[#0a1a3a]/70 hover:bg-[#006AF9]/5 hover:text-[#006AF9]'
                }`}
                aria-label="Suchen"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {searchOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)} />
                  <div className="fixed left-3 right-3 top-[64px] bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] border border-[#0a1a3a]/5 overflow-hidden z-50">
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a1a3a]/30" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Reiseziel suchen..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a1a3a]/[0.03] border border-[#0a1a3a]/8 text-sm text-[#0a1a3a] placeholder:text-[#0a1a3a]/35 outline-none focus:border-[#006AF9] focus:ring-1 focus:ring-[#006AF9]/20 transition-all"
                        />
                      </div>
                    </div>
                    {results}
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className={`xl:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-colors ${
                transparent ? 'text-white hover:bg-white/15' : 'text-[#0a1a3a]/70 hover:bg-[#0a1a3a]/5'
              }`}
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
        <div className="xl:hidden border-t border-[#0a1a3a]/6 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#0a1a3a] hover:text-[#006AF9] hover:bg-[#006AF9]/5 px-3 py-2.5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#0a1a3a]/6 mt-2 pt-2">
              <a
                href="tel:+4917682405507"
                onClick={() => trackLead('header-mobile')}
                className="flex items-center gap-2 text-sm font-medium text-[#006AF9] px-3 py-2.5 rounded-lg hover:bg-[#006AF9]/5 transition-colors"
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
