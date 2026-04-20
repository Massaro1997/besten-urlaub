'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Car, Palmtree } from 'lucide-react'
import { HeroSearchForm } from './hero-search-form'

type TabKey = 'pauschalreisen' | 'mietwagen' | 'lastminute' | 'all-inclusive'

const TABS: { key: TabKey; href: string; label: string; icon: typeof Palmtree; hasWidget: boolean }[] = [
  { key: 'pauschalreisen', href: '/pauschalreisen', label: 'Pauschalreisen', icon: Palmtree, hasWidget: true },
  { key: 'mietwagen', href: '/mietwagen', label: 'Mietwagen', icon: Car, hasWidget: true },
]

const HERO_CONTENT: Record<string, { title: string; subtitle: string }> = {
  pauschalreisen: { title: 'Die bester Urlaubsangebote', subtitle: 'zum bester Preis.' },
  mietwagen: { title: 'Mietwagen vergleichen', subtitle: 'und günstig buchen.' },
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('pauschalreisen')
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // Lock body scroll when fullscreen mobile
  useEffect(() => {
    if (!fullscreen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [fullscreen])

  function handleTabClick(tab: typeof TABS[number]) {
    setActiveTab(tab.key)
  }

  const content = HERO_CONTENT[activeTab] || HERO_CONTENT.pauschalreisen

  return (
    <section className="relative overflow-hidden min-h-0 sm:min-h-[620px] lg:min-h-[700px] flex flex-col justify-center bg-[#0a1a3a]">
      {/* Hero photo desktop only; mobile uses solid navy for faster paint */}
      <div className="hidden sm:block absolute inset-0">
        <Image src="/santorini.png" alt="" fill className="object-cover" priority quality={75} sizes="(max-width: 640px) 0vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/30 to-[#0a1a3a]/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 pb-8 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 flex flex-col items-center gap-6 sm:gap-8">

        {/* Heading block — centered */}
        <div className="text-center max-w-4xl lg:max-w-5xl w-full order-1">
          <div className="hidden sm:block text-xs font-bold tracking-[0.25em] uppercase text-[#ff6b35] mb-3">
            Bester Urlaub
          </div>
          <h1 className="text-[22px] sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-lg whitespace-normal px-1">
            <span className="block sm:inline sm:whitespace-nowrap">{content.title}</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline opacity-90 sm:whitespace-nowrap">{content.subtitle}</span>
          </h1>
        </div>

        {/* Trust chips — on desktop stays above widget (order-2), on mobile moves below widget (order-3) */}
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2 relative overflow-x-auto sm:overflow-visible max-w-full px-1 scrollbar-hide order-3 sm:order-2">
          {[
            { key: '24h', labelFull: 'Bis zu 24h stornieren', labelShort: '24h Storno' },
            { key: 'bestpreis', labelFull: 'Bestpreis-Garantie', labelShort: 'Bestpreis' },
            { key: 'rabatt', labelFull: 'Bis zu 60% Rabatt', labelShort: '-60%' },
          ].map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setShowInfo(showInfo === chip.key ? null : chip.key)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
              <span className="sm:hidden">{chip.labelShort}</span>
              <span className="hidden sm:inline">{chip.labelFull}</span>
            </button>
          ))}
          {showInfo === '24h' && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowInfo(null)} />
              <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[320px] z-50">
                <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a1a3a] rotate-45 rounded-[2px]" />
                <div className="bg-[#0a1a3a] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-left">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-bold text-white leading-snug">Bis zu 24h vor Abflug stornieren</h4>
                    <button
                      type="button"
                      aria-label="Schließen"
                      onClick={(e) => { e.stopPropagation(); setShowInfo(null) }}
                      className="text-white/40 hover:text-white ml-3 mt-0.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">Viele Pauschalreisen lassen sich bis kurz vor Anreise kostenlos umbuchen oder stornieren. Die genaue Frist wird bei jedem Angebot direkt angezeigt.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Widget card — tabs integrated as header; on mobile appears above chips */}
        <div className="w-full max-w-5xl order-2 sm:order-3">
          {/* Mobile trigger — card sits above backdrop, tap opens fullscreen */}
          <div
            onClick={() => setFullscreen(true)}
            className={`c24-hero-card-mobile-trigger sm:hidden bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.35)] overflow-hidden cursor-pointer ${fullscreen ? 'invisible' : ''}`}
          >
            <div className="flex border-b border-[rgba(10,26,58,0.06)]">
              {TABS.map((tab) => (
                <div
                  key={tab.key}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold ${
                    activeTab === tab.key
                      ? 'text-[#0a1a3a] border-b-2 border-[#ff6b35]'
                      : 'text-[rgba(10,26,58,0.5)] border-b-2 border-transparent'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-6 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-semibold text-[#0a1a3a]">Reise finden</p>
                <p className="text-xs text-[#0a1a3a]/55 mt-0.5">Tippe zum Suchen</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop card + mobile fullscreen overlay container */}
          <div
            className={`c24-hero-card bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.35)] overflow-hidden
              ${fullscreen ? 'fixed inset-0 z-[110] rounded-none flex flex-col' : 'hidden sm:block'}
            `}
          >
            {/* Tabs row (inside card) */}
            <div className="flex border-b border-[rgba(10,26,58,0.06)] shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'text-[#0a1a3a] border-b-2 border-[#ff6b35]'
                      : 'text-[rgba(10,26,58,0.5)] border-b-2 border-transparent hover:text-[#0a1a3a]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
              {fullscreen && (
                <button
                  type="button"
                  aria-label="Schliessen"
                  onClick={() => setFullscreen(false)}
                  className="shrink-0 w-12 flex items-center justify-center text-[#0a1a3a]/55 hover:text-[#0a1a3a]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Our custom form — native HTML controls, predictable UX on all devices */}
            <div className={`${fullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
              {activeTab === 'pauschalreisen' && (
                <HeroSearchForm variant={fullscreen ? 'mobile-fullscreen' : 'desktop'} />
              )}
              {activeTab === 'mietwagen' && (
                <div className="p-8 text-center text-[#0a1a3a]/55 text-sm">
                  <p className="mb-3">Mietwagen-Suche in Kürze verfügbar.</p>
                  <a
                    href="https://a.check24.net/misc/click.php?aid=18&pid=1168044&tid=mietwagen-hero&target_url=https%3A%2F%2Fwww.check24.net%2Fmietwagen-preisvergleich%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 rounded-lg bg-[#ff6b35] hover:bg-[#e85d2c] text-white text-sm font-semibold"
                  >
                    Jetzt bei Check24 suchen
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
</section>
  )
}
