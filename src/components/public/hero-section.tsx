'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Car, Palmtree } from 'lucide-react'

type TabKey = 'pauschalreisen' | 'mietwagen' | 'lastminute' | 'all-inclusive'

const TABS: { key: TabKey; href: string; label: string; icon: typeof Palmtree; hasWidget: boolean }[] = [
  { key: 'pauschalreisen', href: '/pauschalreisen', label: 'Pauschalreisen', icon: Palmtree, hasWidget: true },
  { key: 'mietwagen', href: '/mietwagen', label: 'Mietwagen', icon: Car, hasWidget: true },
]

const HERO_CONTENT: Record<string, { title: string; subtitle: string }> = {
  pauschalreisen: { title: 'Die besten Urlaubsangebote', subtitle: 'zum besten Preis.' },
  mietwagen: { title: 'Mietwagen vergleichen', subtitle: 'und günstig buchen.' },
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('pauschalreisen')
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const pauschalLoaded = useRef(false)
  const mietwagenLoaded = useRef(false)

  // Load pauschalreisen widget
  const loadPauschalWidget = useCallback(() => {
    if (pauschalLoaded.current) return
    const existing = document.querySelector('script[src*="c24pp-package-widget63276"]')
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://files.check24.net/widgets/1168044/c24pp-package-widget63276/package.js'
    document.body.appendChild(script)
    pauschalLoaded.current = true
  }, [])

  // Load mietwagen widget
  const loadMietwagenWidget = useCallback(() => {
    if (mietwagenLoaded.current) return
    // Load billboard CSS
    const existingCss = document.querySelector('link[href*="packagebillboard.css"]')
    if (!existingCss) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.type = 'text/css'
      css.href = 'https://files.check24.net/widgets/rentalcarbillboard.css'
      document.head.appendChild(css)
    }
    // Load rentalcar billboard JS
    const existingJs = document.querySelector('script[src*="c24pp-rentalcar-widget78419"]')
    if (existingJs) existingJs.remove()
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://files.check24.net/widgets/1168044/c24pp-rentalcar-widget78419/rentalcarbillboard.js'
    document.body.appendChild(script)
    mietwagenLoaded.current = true
  }, [])

  useEffect(() => {
    loadPauschalWidget()
    // Retry if widget didn't render
    const timer = setTimeout(() => {
      const container = document.getElementById('c24pp-package-widget63276')
      if (container && container.children.length === 0) {
        pauschalLoaded.current = false
        loadPauschalWidget()
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [loadPauschalWidget])

  // Load mietwagen widget when tab is first activated
  useEffect(() => {
    if (activeTab === 'mietwagen') {
      loadMietwagenWidget()
    }
  }, [activeTab, loadMietwagenWidget])

  function handleTabClick(tab: typeof TABS[number]) {
    setActiveTab(tab.key)
  }

  const content = HERO_CONTENT[activeTab] || HERO_CONTENT.pauschalreisen

  return (
    <section className="relative overflow-hidden min-h-0 sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-center">
      <Image src="/santorini.png" alt="Urlaubsparadies" fill className="object-cover" priority quality={90} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/30 to-[#0a1a3a]/70" />

      {/* Trust badges — desktop only, triangle/cluster layout with glossy effect */}
      <div className="hidden lg:block absolute top-24 xl:top-28 right-4 xl:right-10 z-10">
        <div className="relative w-[260px] h-[280px] xl:w-[300px] xl:h-[310px]">
          {/* 24h — white, top-left of cluster with info popup */}
          <div className="absolute top-0 -left-10 w-[160px] h-[160px] xl:w-[180px] xl:h-[180px]">
            <div className="relative w-full h-full rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center text-center pt-0 pb-4">
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/80 to-transparent" />
              </div>
              <span className="relative text-[10px] xl:text-xs font-bold text-[#0a1a3a]/50 uppercase tracking-widest">Bis zu</span>
              <span className="relative text-4xl xl:text-5xl font-black text-[#0a1a3a] leading-none">24h</span>
              <span className="relative text-[9px] xl:text-[10px] font-bold text-[#0a1a3a]/50 uppercase tracking-wider mt-0.5">vor Abflug</span>
              <span className="relative text-[11px] xl:text-sm font-extrabold text-[#ff6b35] uppercase tracking-wide">stornieren</span>
              <button
                onClick={() => setShowInfo(showInfo === '24h' ? null : '24h')}
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a1a3a] flex items-center justify-center cursor-pointer hover:bg-[#2e75fa] transition-colors shadow-md"
              >
                <span className="text-white text-xs font-bold leading-none">i</span>
              </button>
            </div>
            {showInfo === '24h' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowInfo(null)} />
                <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[340px] z-50">
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a1a3a] rotate-45 rounded-[2px]" />
                  <div className="bg-[#0a1a3a] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-left">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[15px] font-bold text-white leading-snug">Bis zu 24h vor Abflug stornieren</h4>
                      <button onClick={() => setShowInfo(null)} className="text-white/40 hover:text-white ml-3 mt-0.5 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <p className="text-[13px] text-white/70 leading-relaxed mb-3">Viele Pauschalreisen lassen sich bis kurz vor Anreise kostenlos umbuchen oder stornieren.</p>
                    <p className="text-[13px] text-white/70 leading-relaxed">Auf Bester Urlaub findest du ganz einfach solche Angebote und kannst die passende Stornierungsfrist wählen. Die genaue Frist wird bei jedem Angebot direkt angezeigt.</p>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* 60% — orange, top-right of cluster */}
          <div className="absolute top-2 right-0 xl:right-2 w-[105px] h-[105px] xl:w-[115px] xl:h-[115px] rounded-full shadow-[0_8px_30px_rgba(255,107,53,0.4)] flex flex-col items-center justify-center text-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #ff8c5a 0%, #ff6b35 40%, #e85d2c 100%)' }}>
            <div className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            <span className="relative text-[9px] font-semibold text-white/90 uppercase">Bis zu</span>
            <span className="relative text-3xl xl:text-[34px] font-black text-white leading-none">60%</span>
            <span className="relative text-[10px] xl:text-[11px] font-bold text-white uppercase tracking-wide">Rabatt</span>
          </div>
          {/* Bestpreis — navy, bottom-center of cluster */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[105px] h-[105px] xl:w-[115px] xl:h-[115px] rounded-full shadow-[0_8px_30px_rgba(10,26,58,0.4)] flex flex-col items-center justify-center text-center border-2 border-white/15 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a2e52 0%, #0a1a3a 40%, #06112a 100%)' }}>
            <div className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <svg className="relative w-5 h-5 text-[#ff6b35] mb-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <span className="relative text-[9px] font-bold text-white/60 uppercase tracking-widest">Bestpreis</span>
            <span className="relative text-sm xl:text-[15px] font-extrabold text-white uppercase tracking-wide">Garantie</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 pb-6 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="lg:max-w-[70%]">
            {/* Tab pills */}
            <div className="flex items-center gap-2 mb-5 sm:mb-10 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.key
                      ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/25'
                      : 'bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 border border-white/20'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg max-w-3xl mb-5 sm:mb-10">
              {content.title}<br className="hidden sm:block" /> {content.subtitle}
            </h1>

            {/* Pauschalreisen widget */}
            <div className={`max-w-5xl c24-hero-widget ${activeTab === 'pauschalreisen' ? '' : 'hidden'}`}>
              <div id="c24pp-package-widget63276" data-target="_self" data-whitelabel="yes"
                data-form="https://www.besterurlaub.com/pauschalreisen" data-tid="HERO01" />
            </div>

            {/* Mietwagen widget */}
            <div className={`max-w-5xl c24-mietwagen-widget ${activeTab === 'mietwagen' ? '' : 'hidden'}`}>
              <div id="c24pp-rentalcar-widget78419" data-target="_self" data-whitelabel="yes"
                data-form="https://www.check24.net/mietwagen-preisvergleich/" style={{ width: '100%', minHeight: 100 }} />
            </div>
        </div>
      </div>

      <style jsx global>{`
        /* ===== PAUSCHALREISEN WIDGET RESET ===== */
        .c24-hero-widget div.c24pp1.c24pp2.c24pp3.c24package {
          width: 100% !important; height: auto !important; min-height: 0 !important;
          background: none !important; border: none !important;
        }
        .c24-hero-widget .c24package-logo-wrapper,
        .c24-hero-widget span.c24package-title { display: none !important; }
        .c24-hero-widget img[src*="view.php"] { position: absolute !important; opacity: 0 !important; pointer-events: none !important; }

        /* ===== GRID: 4 cols, 4 rows ===== */
        .c24-hero-widget .c24package-wrapper {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr auto !important;
          grid-template-rows: auto auto auto auto !important;
          background: white !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 60px -12px rgba(0,0,0,0.35) !important;
          padding: 0 !important; margin: 0 !important;
          overflow: hidden !important;
          color: #0a1a3a !important; text-align: left !important;
        }

        /* Dissolve containers */
        .c24-hero-widget .c24package-location,
        .c24-hero-widget .c24package-left,
        .c24-hero-widget .c24package-right {
          display: contents !important;
        }

        /* ===== ALL LABELS ===== */
        .c24-hero-widget .c24package-location > span,
        .c24-hero-widget span.c24package-dep,
        .c24-hero-widget span.c24package-ret,
        .c24-hero-widget span.c24package-duration,
        .c24-hero-widget span.c24package-airport {
          font-size: 12px !important; font-weight: 700 !important; color: #003366 !important;
          padding: 12px 16px 4px 16px !important; margin: 0 !important;
          display: block !important;
        }

        /* ===== ALL INPUTS/SELECTS ===== */
        .c24-hero-widget input,
        .c24-hero-widget select {
          border: 1.5px solid #d4d8e0 !important; border-radius: 6px !important;
          height: 36px !important; padding: 0 8px !important; font-size: 13px !important;
          color: #333 !important; background: #fff !important;
          width: 100% !important; box-sizing: border-box !important; outline: none !important;
        }
        .c24-hero-widget input:focus, .c24-hero-widget select:focus {
          border-color: #2e75fa !important; box-shadow: 0 0 0 2px rgba(46,117,250,0.1) !important;
        }
        .c24-hero-widget input::placeholder { color: #9ca3af !important; }

        /* ===== INPUT WRAPPERS ===== */
        .c24-hero-widget div.c24package-dep,
        .c24-hero-widget div.c24package-ret,
        .c24-hero-widget div.c24package-duration,
        .c24-hero-widget div.c24package-airport {
          padding: 0 16px 12px 16px !important; margin: 0 !important; width: auto !important;
        }

        /* ===== ROW 1-2: REISEZIEL (cols 1-2) ===== */
        .c24-hero-widget div.c24package-location::before {
          content: 'Reiseziel' !important;
          grid-column: 1 / 3 !important; grid-row: 1 !important;
          font-size: 12px !important; font-weight: 700 !important; color: #003366 !important;
          padding: 12px 16px 4px 16px !important;
          display: block !important;
        }
        .c24-hero-widget .c24package-location > span {
          display: none !important;
        }
        .c24-hero-widget .c24package-location > input.c24package-location {
          grid-column: 1 / 3 !important; grid-row: 2 !important;
          margin: 0 16px 12px 16px !important; width: auto !important;
          display: block !important;
        }
        .c24-hero-widget .c24package-location > ul.ui-autocomplete {
          grid-column: 1 / 3 !important; grid-row: 2 !important;
        }

        /* ===== ROW 1-2: ABFLUGHAFEN (col 3) ===== */
        .c24-hero-widget span.c24package-airport {
          grid-column: 3 !important; grid-row: 1 !important;
        }
        .c24-hero-widget div.c24package-airport {
          grid-column: 3 !important; grid-row: 2 !important;
        }

        /* ===== DIVIDER (hidden) ===== */
        .c24-hero-widget .c24package-wrapper::before {
          content: '' !important; grid-column: 1 / -1 !important; grid-row: 3 !important;
          align-self: start !important;
          pointer-events: none !important; z-index: 0 !important;
        }

        /* ===== ROW 3-4: HINREISE (col 1) ===== */
        .c24-hero-widget span.c24package-dep {
          grid-column: 1 !important; grid-row: 3 !important;
        }
        .c24-hero-widget div.c24package-dep {
          grid-column: 1 !important; grid-row: 4 !important;
        }

        /* ===== ROW 3-4: RÜCKREISE (col 2) ===== */
        .c24-hero-widget span.c24package-ret {
          grid-column: 2 !important; grid-row: 3 !important;
        }
        .c24-hero-widget div.c24package-ret {
          grid-column: 2 !important; grid-row: 4 !important;
        }

        /* ===== ROW 3-4: REISEDAUER (col 3) ===== */
        .c24-hero-widget span.c24package-duration {
          grid-column: 3 !important; grid-row: 3 !important;
        }
        .c24-hero-widget div.c24package-duration {
          grid-column: 3 !important; grid-row: 4 !important;
        }

        /* ===== TOP-RIGHT BADGE (col 4, rows 1-2) ===== */
        .c24-hero-widget .c24package-wrapper::after {
          content: 'Jetzt buchen\\a & bis zu 60% sparen!' !important;
          grid-column: 4 !important; grid-row: 1 / 3 !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          text-align: center !important;
          font-size: 11px !important; font-weight: 600 !important; color: #2e75fa !important;
          padding: 8px 16px !important;
          white-space: pre-line !important;
          line-height: 1.4 !important;
          letter-spacing: 0.2px !important;
        }

        /* ===== BUTTON (col 4, rows 3-4) ===== */
        .c24-hero-widget .c24package-full {
          grid-column: 4 !important; grid-row: 3 / 5 !important;
          display: flex !important; align-items: center !important;
          padding: 10px 12px !important; width: auto !important;
        }
        .c24-hero-widget button.c24package-submit {
          background: linear-gradient(135deg, #ff6b35 0%, #e85d2c 100%) !important;
          border: none !important; border-radius: 12px !important;
          padding: 16px 32px !important; font-size: 15px !important; font-weight: 700 !important;
          color: white !important; cursor: pointer !important; white-space: nowrap !important;
          width: 100% !important; height: 100% !important; margin: 0 !important;
          box-shadow: 0 4px 15px rgba(255,107,53,0.35) !important;
          transition: transform 0.15s, box-shadow 0.15s !important;
          letter-spacing: 0.3px !important;
        }
        .c24-hero-widget button.c24package-submit:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 6px 20px rgba(255,107,53,0.45) !important;
        }
        .c24-hero-widget button.c24package-submit:active {
          transform: scale(0.98) !important;
        }

        /* ===== AUTOCOMPLETE ===== */
        .c24-hero-widget .ui-autocomplete {
          background: white !important; border: 1px solid #e5e7eb !important;
          border-radius: 12px !important; box-shadow: 0 12px 30px -6px rgba(0,0,0,0.15) !important;
          max-height: 280px !important; overflow-y: auto !important; z-index: 9999 !important;
        }
        .c24-hero-widget .ui-autocomplete li.ui-menu-item {
          padding: 10px 14px !important; font-size: 13px !important;
          color: #0a1a3a !important; border: none !important;
        }
        .c24-hero-widget .ui-autocomplete li:hover,
        .c24-hero-widget .ui-autocomplete li.ui-state-focus {
          background: #f0f4ff !important; border: none !important;
        }

        /* ===== DATEPICKER ===== */
        .c24pp1.c24pp2.c24pp3 .ui-datepicker {
          z-index: 9999 !important; border-radius: 12px !important;
          box-shadow: 0 12px 30px -6px rgba(0,0,0,0.15) !important;
          background: white !important; border: 1px solid #e5e7eb !important; padding: 12px !important;
          color: #0a1a3a !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker table {
          background: white !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td {
          background: white !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td span {
          background: white !important;
          color: #0a1a3a !important; font-size: 13px !important; padding: 6px !important;
          text-align: center !important; border-radius: 6px !important;
          display: block !important; text-decoration: none !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a:hover {
          background: #e8f0ff !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker .ui-state-highlight a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker .ui-state-active a,
        .c24pp1.c24pp2.c24pp3 .ui-state-highlight a,
        .c24pp1.c24pp2.c24pp3 .ui-state-active a {
          background: #2e75fa !important; color: white !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-state-disabled span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker .ui-state-disabled span {
          color: #ccc !important; background: white !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker th {
          background: white !important;
          color: #0a1a3a !important; font-size: 11px !important; font-weight: 600 !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header {
          background: #2e75fa !important; border: none !important; border-radius: 8px !important;
          padding: 8px !important; margin-bottom: 8px !important; color: white !important;
          position: relative !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header a { color: white !important; cursor: pointer !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next {
          position: absolute !important;
          width: 28px !important; height: 28px !important; top: 50% !important;
          transform: translateY(-50%) !important; border: none !important;
          background: rgba(255,255,255,0.2) !important; border-radius: 6px !important;
          cursor: pointer !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:hover,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:hover { background: rgba(255,255,255,0.35) !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev { left: 6px !important; right: auto !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next { right: 6px !important; left: auto !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next span { display: none !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev::after {
          content: '‹' !important; font-size: 20px !important; color: white !important; font-weight: bold !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next::after {
          content: '›' !important; font-size: 20px !important; color: white !important; font-weight: bold !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-title {
          color: white !important; font-weight: 700 !important; font-size: 14px !important;
          text-align: center !important; margin: 0 2.3em !important;
        }
        /* ===== PAUSCHALREISEN MOBILE ===== */
        @media (max-width: 768px) {
          .c24-hero-widget .c24package-wrapper {
            display: flex !important; flex-direction: column !important;
            border-radius: 16px !important; overflow: hidden !important;
            gap: 0 !important; padding: 0 !important;
          }
          .c24-hero-widget .c24package-location,
          .c24-hero-widget .c24package-left,
          .c24-hero-widget .c24package-right {
            display: block !important; width: 100% !important;
            padding: 14px 16px !important; border-bottom: 1px solid #f0f0f0 !important;
          }
          .c24-hero-widget .c24package-location > span {
            display: none !important;
          }
          .c24-hero-widget div.c24package-location::before {
            grid-column: unset !important; grid-row: unset !important;
            padding: 0 0 6px 0 !important; display: block !important;
          }
          .c24-hero-widget span.c24package-dep,
          .c24-hero-widget span.c24package-ret,
          .c24-hero-widget span.c24package-duration,
          .c24-hero-widget span.c24package-airport {
            padding: 0 0 6px 0 !important; margin: 0 !important;
            border-left: none !important; font-size: 11px !important;
          }
          .c24-hero-widget input[type="text"].c24package-location {
            margin: 0 !important; width: 100% !important;
            display: block !important; grid-column: unset !important; grid-row: unset !important;
          }
          .c24-hero-widget div.c24package-dep,
          .c24-hero-widget div.c24package-ret,
          .c24-hero-widget div.c24package-duration,
          .c24-hero-widget div.c24package-airport {
            padding: 0 !important; margin: 0 !important;
            border: none !important; width: 100% !important;
          }
          .c24-hero-widget input,
          .c24-hero-widget select {
            height: 40px !important; font-size: 14px !important;
            border-radius: 8px !important;
          }
          .c24-hero-widget .c24package-wrapper::before,
          .c24-hero-widget .c24package-wrapper::after { display: none !important; }
          .c24-hero-widget .c24package-full {
            width: 100% !important; padding: 16px !important;
            border-bottom: none !important;
          }
          .c24-hero-widget button.c24package-submit {
            border-radius: 12px !important; padding: 16px 24px !important;
            height: auto !important; font-size: 16px !important;
            width: 100% !important;
          }
        }

        /* ===== MIETWAGEN (RENTALCAR BILLBOARD) WIDGET STYLING ===== */
        /* Main container — white card like pauschalreisen */
        .c24-mietwagen-widget div.c24pp1.c24pp2.c24pp3.c24rentalcarbillboard {
          width: 100% !important; height: auto !important; min-height: 0 !important;
          background: white !important; border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 60px -12px rgba(0,0,0,0.35) !important;
          padding: 20px 24px !important;
          color: #0a1a3a !important; text-align: left !important;
          overflow: visible !important;
        }

        /* Hide title & logo */
        .c24-mietwagen-widget .c24rentalcar-title { display: none !important; }
        .c24-mietwagen-widget .c24rentalcar-logo-hidden { display: none !important; }
        .c24-mietwagen-widget img[src*="view.php"] { position: absolute !important; opacity: 0 !important; pointer-events: none !important; }

        /* ===== ROW 1: 3 equal columns (Anmietung / Rückgabeort / Alter) ===== */
        .c24-mietwagen-widget .form-field-row.first-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 16px !important;
          margin: 0 0 16px 0 !important;
          padding: 0 0 16px 0 !important;
          border-bottom: 1px solid #f0f0f0 !important;
          align-items: end !important;
          width: 100% !important;
        }
        .c24-mietwagen-widget .form-field-row.first-row > div {
          margin: 0 !important; padding: 0 !important;
          min-width: 0 !important; width: 100% !important;
          max-width: 100% !important;
        }

        /* ===== ROW 2: Abholung (date+time) | Rückgabe (date+time) | Button ===== */
        .c24-mietwagen-widget .form-field-row:not(.first-row) {
          display: grid !important;
          grid-template-columns: 2fr 2fr 1fr !important;
          gap: 16px !important;
          margin: 0 !important; padding: 0 !important;
          align-items: end !important;
          width: 100% !important;
        }
        .c24-mietwagen-widget .form-field-row:not(.first-row) > div {
          min-width: 0 !important; width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important; padding: 0 !important;
        }
        .c24-mietwagen-widget div.c24rentalcar-dep,
        .c24-mietwagen-widget div.c24rentalcar-ret {
          display: grid !important;
          grid-template-columns: 1.5fr 1fr !important;
          gap: 8px !important;
        }

        /* Inner wrapper (date/time) in Abholung/Rückgabe */
        .c24-mietwagen-widget div.c24rentalcar-dep .wrapper,
        .c24-mietwagen-widget div.c24rentalcar-ret .wrapper {
          display: block !important;
          margin: 0 !important; padding: 0 !important;
          min-width: 0 !important; width: 100% !important;
        }

        /* Button row wrapper */
        .c24-mietwagen-widget .c24rentalcar-buttonrow {
          display: block !important;
          width: 100% !important;
          margin: 0 !important; padding: 0 !important;
        }

        /* All labels */
        .c24-mietwagen-widget span.c24rentalcar-dep-location,
        .c24-mietwagen-widget span.c24rentalcar-ret-location,
        .c24-mietwagen-widget span.c24rentalcar-customer-age,
        .c24-mietwagen-widget span.c24rentalcar-dep,
        .c24-mietwagen-widget span.c24rentalcar-ret {
          font-size: 12px !important; font-weight: 700 !important; color: #003366 !important;
          margin: 0 0 6px 0 !important; padding: 0 !important;
          display: block !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        /* All inputs & selects */
        .c24-mietwagen-widget input,
        .c24-mietwagen-widget select {
          border: 1.5px solid #d4d8e0 !important; border-radius: 8px !important;
          height: 40px !important; padding: 0 10px !important; font-size: 13px !important;
          color: #333 !important; background: #fff !important;
          width: 100% !important;
          box-sizing: border-box !important; outline: none !important;
          min-width: 0 !important;
        }
        .c24-mietwagen-widget input:focus, .c24-mietwagen-widget select:focus {
          border-color: #2e75fa !important; box-shadow: 0 0 0 2px rgba(46,117,250,0.1) !important;
        }
        .c24-mietwagen-widget input::placeholder { color: #9ca3af !important; }

        /* Submit button — matching pauschalreisen style */
        .c24-mietwagen-widget button.c24rentalcar-submit {
          background: linear-gradient(135deg, #ff6b35 0%, #e85d2c 100%) !important;
          border: none !important; border-radius: 12px !important;
          padding: 12px 20px !important; font-size: 14px !important; font-weight: 700 !important;
          color: white !important; cursor: pointer !important;
          white-space: nowrap !important; height: 40px !important;
          width: 100% !important;
          box-shadow: 0 4px 15px rgba(255,107,53,0.35) !important;
          transition: transform 0.15s, box-shadow 0.15s !important;
          letter-spacing: 0.3px !important;
          margin: 0 !important;
          line-height: 1 !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
        }
        .c24-mietwagen-widget button.c24rentalcar-submit:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 6px 20px rgba(255,107,53,0.45) !important;
        }
        .c24-mietwagen-widget button.c24rentalcar-submit:active {
          transform: scale(0.98) !important;
        }

        /* Autocomplete dropdown */
        .c24-mietwagen-widget .ui-autocomplete {
          background: white !important; border: 1px solid #e5e7eb !important;
          border-radius: 12px !important; box-shadow: 0 12px 30px -6px rgba(0,0,0,0.15) !important;
          max-height: 280px !important; overflow-y: auto !important; z-index: 9999 !important;
        }
        .c24-mietwagen-widget .ui-autocomplete li.ui-menu-item {
          padding: 10px 14px !important; font-size: 13px !important;
          color: #0a1a3a !important; border: none !important;
        }
        .c24-mietwagen-widget .ui-autocomplete li:hover,
        .c24-mietwagen-widget .ui-autocomplete li.ui-state-focus {
          background: #f0f4ff !important; border: none !important;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .c24-mietwagen-widget div.c24pp1.c24pp2.c24pp3.c24rentalcarbillboard {
            padding: 16px !important; border-radius: 16px !important;
          }
          .c24-mietwagen-widget .form-field-row.first-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding-bottom: 12px !important;
            margin-bottom: 12px !important;
          }
          .c24-mietwagen-widget .form-field-row:not(.first-row) {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .c24-mietwagen-widget .form-field-row:not(.first-row) > div.c24rentalcar-dep,
          .c24-mietwagen-widget .form-field-row:not(.first-row) > div.c24rentalcar-ret {
            grid-template-columns: 1.5fr 1fr !important;
          }
          .c24-mietwagen-widget button.c24rentalcar-submit {
            width: 100% !important; height: 48px !important;
            font-size: 16px !important; margin-top: 4px !important;
          }
        }
      `}</style>
    </section>
  )
}
