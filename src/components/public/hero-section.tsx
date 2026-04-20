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
  pauschalreisen: { title: 'Dein Traumurlaub wartet.', subtitle: 'Bis zu 60% günstiger.' },
  mietwagen: { title: 'Den perfekten Mietwagen.', subtitle: 'Zum besten Preis.' },
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('pauschalreisen')
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
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

  // Lock body scroll when fullscreen mobile
  useEffect(() => {
    if (!fullscreen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [fullscreen])

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

  // Suppress mobile keyboard on datepicker inputs + extend yearRange
  useEffect(() => {
    function lockInput(el: HTMLInputElement) {
      if (el.dataset.buLocked === '1') return
      el.readOnly = true
      el.setAttribute('inputmode', 'none')
      el.setAttribute('autocomplete', 'off')
      el.dataset.buLocked = '1'

      // Widget ships with a narrow yearRange — widen it so user sees current + next 2 years
      const $ = (window as unknown as { jQuery?: (el: HTMLElement) => { datepicker: (op: string, k: string, v: unknown) => void; hasClass: (c: string) => boolean } }).jQuery
      if ($ && $(el).hasClass('hasDatepicker')) {
        try {
          const now = new Date().getFullYear()
          $(el).datepicker('option', 'yearRange', `${now}:${now + 2}`)
          $(el).datepicker('option', 'changeYear', true)
          $(el).datepicker('option', 'changeMonth', true)
        } catch {}
      }
    }

    function scan() {
      document.querySelectorAll<HTMLInputElement>('input.hasDatepicker').forEach(lockInput)
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true })
    // Rescan every second for 15s to catch widget late-init
    const interval = setInterval(scan, 1000)
    setTimeout(() => clearInterval(interval), 15000)
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  // Force ALL datepickers to open ABOVE the triggering input (fixed positioning)
  useEffect(() => {
    let lastInput: HTMLInputElement | null = null
    let rafId: number | null = null

    function getVisibleDatepickers(): HTMLElement[] {
      // jQuery UI global popup (used by package widget)
      const globalDp = document.getElementById('ui-datepicker-div') as HTMLElement | null
      // Check24 rentalcar inline datepickers with custom IDs
      const c24Dps = Array.from(document.querySelectorAll<HTMLElement>('[id^="c24pp-datepicker-"]'))

      const all: HTMLElement[] = []
      if (globalDp && globalDp.style.display !== 'none') all.push(globalDp)
      c24Dps.forEach((dp) => {
        if (window.getComputedStyle(dp).display !== 'none' && dp.offsetHeight > 50) {
          all.push(dp)
        }
      })
      return all
    }

    function repositionAbove(dp: HTMLElement, input: HTMLInputElement) {
      const inputRect = input.getBoundingClientRect()
      const dpHeight = dp.offsetHeight
      const dpWidth = dp.offsetWidth
      if (dpHeight === 0) return

      const vh = window.innerHeight
      const vw = window.innerWidth
      const isMobile = vw < 640
      const pad = 8

      // Fixed positioning so coordinates are viewport-based
      dp.style.position = 'fixed'
      dp.style.zIndex = '9999'

      // Mobile: always center on viewport, cap height so month header stays visible
      if (isMobile) {
        const maxH = vh - 32
        dp.style.maxHeight = `${maxH}px`
        dp.style.overflowY = 'auto'
        const top = Math.max(pad, (vh - Math.min(dpHeight, maxH)) / 2)
        const left = Math.max(pad, (vw - dpWidth) / 2)
        if (dp.style.top !== `${top}px`) dp.style.top = `${top}px`
        if (dp.style.left !== `${left}px`) dp.style.left = `${left}px`
        return
      }

      // Desktop: prefer above input, fall back below if no room, clamp to viewport
      const spaceAbove = inputRect.top - pad
      const spaceBelow = vh - inputRect.bottom - pad
      let top: number
      if (spaceAbove >= dpHeight) {
        top = inputRect.top - dpHeight - pad
      } else if (spaceBelow >= dpHeight) {
        top = inputRect.bottom + pad
      } else {
        // Neither fits — pin to viewport top, let datepicker scroll its own content
        top = pad
        dp.style.maxHeight = `${vh - pad * 2}px`
        dp.style.overflowY = 'auto'
      }
      const left = Math.min(Math.max(pad, inputRect.left), vw - dpWidth - pad)

      if (dp.style.top !== `${top}px`) dp.style.top = `${top}px`
      if (dp.style.left !== `${left}px`) dp.style.left = `${left}px`
    }

    function findAssociatedInput(dp: HTMLElement): HTMLInputElement | null {
      // For c24pp datepickers, the input is a sibling with matching id pattern
      if (dp.id.startsWith('c24pp-datepicker-')) {
        // Walk up and find the closest hasDatepicker input
        let el: HTMLElement | null = dp.parentElement
        while (el) {
          const input = el.querySelector<HTMLInputElement>('input.hasDatepicker')
          if (input) return input
          el = el.parentElement
          if (el?.classList.contains('c24pp1')) break
        }
      }
      // Fallback to last known input
      return lastInput
    }

    function tick() {
      const dps = getVisibleDatepickers()
      for (const dp of dps) {
        const input = findAssociatedInput(dp)
        if (input) repositionAbove(dp, input)
      }
      rafId = requestAnimationFrame(tick)
    }

    function onInputInteract(e: Event) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' && target.classList.contains('hasDatepicker')) {
        lastInput = target as HTMLInputElement
      }
    }

    document.addEventListener('focusin', onInputInteract, true)
    document.addEventListener('click', onInputInteract, true)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('focusin', onInputInteract, true)
      document.removeEventListener('click', onInputInteract, true)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

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

        {/* Heading block — centered. Mobile: big logo on top + heading below. */}
        <div className="text-center max-w-4xl lg:max-w-5xl w-full order-1">
          {/* Mobile only: big centered logo */}
          <div className="sm:hidden flex justify-center mb-5">
            <Image
              src="/noBgWhite.png"
              alt="Bester Urlaub"
              width={260}
              height={70}
              priority
              className="h-14 w-auto drop-shadow-lg"
            />
          </div>
          <div className="hidden sm:block text-xs font-bold tracking-[0.25em] uppercase text-[#ff6b35] mb-3">
            Urlaubs-Pakete · Handverlesen
          </div>
          <h1 className="text-[22px] sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-lg whitespace-normal px-1">
            <span className="block sm:inline sm:whitespace-nowrap">{content.title}</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline opacity-90 sm:whitespace-nowrap">{content.subtitle}</span>
          </h1>
        </div>

        {/* Trust row — clean iconized badges, no pill "dots" */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 max-w-full px-2 order-3 sm:order-2 relative">
          {[
            { key: '24h', labelFull: 'Bis zu 24h stornierbar', labelShort: '24h stornierbar', icon: (
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z"/></svg>
            ) },
            { key: 'bestpreis', labelFull: 'Bestpreis Garantie', labelShort: 'Bestpreis', icon: (
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/></svg>
            ) },
            { key: 'rabatt', labelFull: 'Bis zu 60% Rabatt', labelShort: '60% Rabatt', icon: (
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h6l12 12-6 6L3 9V3zM7.5 7.5h.01"/></svg>
            ) },
          ].map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setShowInfo(showInfo === chip.key ? null : chip.key)}
              className="group inline-flex items-center gap-1.5 sm:gap-2 text-white/85 hover:text-white transition-colors whitespace-nowrap"
            >
              <span className="text-[#ff6b35]">{chip.icon}</span>
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-tight sm:hidden">{chip.labelShort}</span>
              <span className="hidden sm:inline text-[13px] font-semibold tracking-tight">{chip.labelFull}</span>
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
          {/* Mobile: two direct CTAs to Check24 with marketing hooks */}
          <div className="sm:hidden flex flex-col gap-3">
            {/* Pauschalreisen — primary with destination photo background */}
            <a
              href="https://p1168044s0m.urlaub.check24.net/?tid1=mobile-hero-pauschal&deviceoutput=mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.45)] overflow-hidden active:scale-[0.98] transition-transform min-h-[180px] flex flex-col justify-end"
            >
              {/* Bg photo */}
              <Image
                src="/destinations/mauritius.webp"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 0"
                priority
              />
              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

              {/* Corner discount badge */}
              <div className="absolute top-0 right-0 bg-[#ff6b35] text-white px-3 py-1.5 rounded-bl-xl text-[11px] font-extrabold tracking-wide shadow-lg shadow-[#ff6b35]/40 z-10">
                BIS ZU 60% SPAREN
              </div>

              {/* Text content */}
              <div className="relative p-4 pt-14">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ff6b35] drop-shadow mb-1">Pauschalreisen</p>
                <p className="text-[20px] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg">Dein Traumurlaub.<br/>Alles inklusive.</p>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/85 font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] shrink-0" />
                    ab 199 €
                  </span>
                  <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#ff6b35] text-white text-[12px] font-bold shadow-md shadow-[#ff6b35]/40 whitespace-nowrap shrink-0">
                    Sparen
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Mietwagen — secondary with car photo background */}
            <a
              href="https://p1168044s0.mietwagen.check24.net/?tid1=mobile-hero-mietwagen&tid2=223"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.45)] overflow-hidden active:scale-[0.98] transition-transform min-h-[180px] flex flex-col justify-end"
            >
              <Image
                src="/destinations/mietwagen.webp"
                alt=""
                fill
                className="object-cover object-[center_25%]"
                sizes="(max-width: 640px) 100vw, 0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

              <div className="absolute top-0 right-0 bg-[#2e75fa] text-white px-3 py-1.5 rounded-bl-xl text-[11px] font-extrabold tracking-wide shadow-lg shadow-[#2e75fa]/40 z-10">
                TÄGLICH AB 9 €
              </div>

              <div className="relative p-4 pt-14">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2e75fa] drop-shadow mb-1">Mietwagen</p>
                <p className="text-[20px] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg">Einsteigen.<br/>Losfahren.</p>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/85 font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] shrink-0" />
                    Frei stornierbar
                  </span>
                  <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#2e75fa] text-white text-[12px] font-bold shadow-md shadow-[#2e75fa]/40 whitespace-nowrap shrink-0">
                    Vergleichen
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Social proof strip with real photos */}
            <div className="flex items-center justify-center gap-2.5 mt-1 text-[12px] text-white/80">
              <span className="flex -space-x-2">
                <Image src="/avatars/avatar-1.jpg" alt="" width={24} height={24} className="w-6 h-6 rounded-full border-2 border-[#0a1a3a] object-cover" />
                <Image src="/avatars/avatar-2.jpg" alt="" width={24} height={24} className="w-6 h-6 rounded-full border-2 border-[#0a1a3a] object-cover" />
                <Image src="/avatars/avatar-3.jpg" alt="" width={24} height={24} className="w-6 h-6 rounded-full border-2 border-[#0a1a3a] object-cover" />
              </span>
              <span>
                <span className="font-bold text-white">12.000+</span> glückliche Urlauber
              </span>
            </div>
          </div>

          {/* Desktop card (hidden on mobile now) */}
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

            {/* Widget bodies (share same card) — submit directly to Check24 in a new tab, no intermediate page */}
            <div className={`c24-hero-widget ${fullscreen ? 'flex-1 overflow-y-auto' : ''} ${activeTab === 'pauschalreisen' ? '' : 'hidden'}`}>
              <div id="c24pp-package-widget63276" data-target="_blank" data-whitelabel="yes"
                data-form="https://www.check24.net/pauschalreisen-vergleich/" data-tid="HERO01" />
            </div>
            <div className={`c24-mietwagen-widget ${fullscreen ? 'flex-1 overflow-y-auto' : ''} ${activeTab === 'mietwagen' ? '' : 'hidden'}`}>
              <div id="c24pp-rentalcar-widget78419" data-target="_blank" data-whitelabel="yes"
                data-form="https://www.check24.net/mietwagen-preisvergleich/" style={{ width: '100%', minHeight: 100 }} />
            </div>
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

        /* ===== GRID: 4 cols, 4 rows (original layout) ===== */
        .c24-hero-widget .c24package-wrapper {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr auto !important;
          grid-template-rows: auto auto auto auto !important;
          background: white !important;
          border-radius: 0 !important;
          box-shadow: none !important;
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
        /* Hide stray Check24 rentalcar datepickers that the widget appends to <body>
           and never removes — they otherwise leak above the navbar (skeleton-looking
           cards on initial paint) and below the footer (extra 30px white strip). */
        body > div[id^="c24pp-datepicker-"]:not([style*="display: block"]) {
          display: none !important;
        }
        /* Same for the global jQuery UI datepicker container when not actively shown */
        body > #ui-datepicker-div:not([style*="display: block"]) {
          display: none !important;
        }

        /* ===== GLOBAL DATEPICKER (used by both widgets) ===== */
        .ui-datepicker,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker {
          z-index: 9999 !important; border-radius: 20px !important;
          box-shadow: 0 24px 60px -12px rgba(10,26,58,0.25), 0 0 0 1px rgba(10,26,58,0.04) !important;
          background: #ffffff !important; border: none !important;
          padding: 20px !important;
          color: #0a1a3a !important;
          width: 320px !important;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif !important;
        }
        @media (max-width: 640px) {
          .ui-datepicker,
          .c24pp1.c24pp2.c24pp3 .ui-datepicker {
            width: calc(100vw - 24px) !important;
            max-width: 360px !important;
            padding: 18px !important;
          }
        }

        /* Header (month/year bar) */
        .ui-datepicker .ui-datepicker-header,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header {
          background: transparent !important; border: none !important; border-radius: 0 !important;
          padding: 2px 40px 10px !important; margin: 0 0 6px 0 !important;
          color: #0a1a3a !important;
          position: relative !important;
          min-height: 36px !important;
          display: block !important;
          border-bottom: 1px solid rgba(10,26,58,0.06) !important;
        }
        .ui-datepicker .ui-datepicker-header a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header a {
          color: #0a1a3a !important; cursor: pointer !important;
        }

        /* Prev/Next arrows — fully round, clear hit target */
        .ui-datepicker .ui-datepicker-prev,
        .ui-datepicker .ui-datepicker-next,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next {
          position: absolute !important;
          width: 34px !important; height: 34px !important; top: 1px !important;
          transform: none !important; border: none !important;
          background: rgba(10,26,58,0.05) !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          transition: background 150ms, transform 100ms !important;
        }
        .ui-datepicker .ui-datepicker-prev:hover,
        .ui-datepicker .ui-datepicker-next:hover,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:hover,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:hover {
          background: #ff6b35 !important;
        }
        .ui-datepicker .ui-datepicker-prev:hover::after,
        .ui-datepicker .ui-datepicker-next:hover::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:hover::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:hover::after {
          color: #ffffff !important;
        }
        .ui-datepicker .ui-datepicker-prev:active,
        .ui-datepicker .ui-datepicker-next:active,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:active,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:active {
          transform: scale(0.94) !important;
        }
        .ui-datepicker .ui-datepicker-prev,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev { left: 0 !important; right: auto !important; }
        .ui-datepicker .ui-datepicker-next,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next { right: 0 !important; left: auto !important; }
        .ui-datepicker .ui-datepicker-prev span,
        .ui-datepicker .ui-datepicker-next span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next span { display: none !important; }
        .ui-datepicker .ui-datepicker-prev::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev::after {
          content: '' !important;
          width: 10px !important; height: 10px !important;
          border-left: 2px solid #0a1a3a !important; border-bottom: 2px solid #0a1a3a !important;
          transform: rotate(45deg) translate(2px, -2px) !important;
          transition: border-color 120ms !important;
        }
        .ui-datepicker .ui-datepicker-next::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next::after {
          content: '' !important;
          width: 10px !important; height: 10px !important;
          border-right: 2px solid #0a1a3a !important; border-top: 2px solid #0a1a3a !important;
          transform: rotate(45deg) translate(-2px, 2px) !important;
          transition: border-color 120ms !important;
        }
        .ui-datepicker .ui-datepicker-prev:hover::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:hover::after {
          border-left-color: #ffffff !important; border-bottom-color: #ffffff !important;
        }
        .ui-datepicker .ui-datepicker-next:hover::after,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:hover::after {
          border-right-color: #ffffff !important; border-top-color: #ffffff !important;
        }

        /* Title (month year) — tighter tracking, compact */
        .ui-datepicker .ui-datepicker-title,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-title {
          color: #0a1a3a !important; font-weight: 700 !important; font-size: 14px !important;
          text-align: center !important; margin: 0 !important; padding: 7px 0 !important;
          line-height: 20px !important;
          letter-spacing: -0.02em !important;
        }
        .ui-datepicker .ui-datepicker-title select,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-title select {
          font-size: 14px !important; font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          color: #0a1a3a !important;
          border: none !important; background: transparent !important;
          padding: 0 2px !important; margin: 0 !important;
          cursor: pointer !important;
          appearance: none !important;
        }

        /* Table */
        .ui-datepicker table,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker table {
          background: white !important;
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 0 !important;
          table-layout: fixed !important;
        }

        /* Day-of-week headers */
        .ui-datepicker thead,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker thead {
          background: white !important;
        }
        .ui-datepicker th,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker th {
          background: white !important;
          color: rgba(10,26,58,0.45) !important; font-size: 11px !important; font-weight: 700 !important;
          text-align: center !important;
          padding: 8px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.08em !important;
          border: none !important;
        }

        /* Day cells */
        .ui-datepicker tbody,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker tbody {
          background: white !important;
        }
        .ui-datepicker td,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td {
          background: white !important;
          padding: 3px !important;
          text-align: center !important;
          border: none !important;
        }
        .ui-datepicker td a,
        .ui-datepicker td span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td span {
          background: transparent !important;
          color: #0a1a3a !important; font-size: 14px !important;
          padding: 0 !important;
          line-height: 40px !important;
          height: 40px !important;
          text-align: center !important; border-radius: 10px !important;
          display: block !important; text-decoration: none !important;
          width: 100% !important;
          box-sizing: border-box !important;
          font-weight: 500 !important;
          border: none !important;
          transition: background 120ms, color 120ms, transform 100ms !important;
          font-variant-numeric: tabular-nums !important;
        }
        @media (max-width: 640px) {
          .ui-datepicker td a,
          .ui-datepicker td span,
          .c24pp1.c24pp2.c24pp3 .ui-datepicker td a,
          .c24pp1.c24pp2.c24pp3 .ui-datepicker td span {
            font-size: 15px !important;
            line-height: 44px !important;
            height: 44px !important;
          }
        }
        .ui-datepicker td a:hover,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a:hover {
          background: rgba(255,107,53,0.1) !important; color: #ff6b35 !important;
        }
        .ui-datepicker td a:active,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a:active {
          transform: scale(0.94) !important;
        }
        /* Today */
        .ui-datepicker .ui-state-highlight,
        .ui-datepicker .ui-state-highlight a,
        .c24pp1.c24pp2.c24pp3 .ui-state-highlight,
        .c24pp1.c24pp2.c24pp3 .ui-state-highlight a {
          background: rgba(255,107,53,0.08) !important;
          color: #ff6b35 !important; font-weight: 700 !important;
        }
        /* Selected */
        .ui-datepicker .ui-state-active,
        .ui-datepicker .ui-state-active a,
        .ui-datepicker td.ui-datepicker-current-day a,
        .c24pp1.c24pp2.c24pp3 .ui-state-active,
        .c24pp1.c24pp2.c24pp3 .ui-state-active a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td.ui-datepicker-current-day a {
          background: #ff6b35 !important;
          color: #ffffff !important; font-weight: 700 !important;
          box-shadow: 0 4px 12px -2px rgba(255,107,53,0.45) !important;
        }
        /* Disabled */
        .ui-datepicker .ui-state-disabled span,
        .ui-datepicker .ui-state-disabled,
        .c24pp1.c24pp2.c24pp3 .ui-state-disabled span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker .ui-state-disabled span {
          color: rgba(10,26,58,0.2) !important; background: transparent !important;
          cursor: default !important;
          text-decoration: line-through !important;
        }
        /* ===== PAUSCHALREISEN MOBILE — override grid + display:contents ===== */
        @media (max-width: 768px) {
          .c24-hero-widget .c24package-wrapper {
            display: block !important;
            grid-template-columns: unset !important;
            grid-template-rows: unset !important;
            border-radius: 16px !important; overflow: hidden !important;
            padding: 14px !important;
            gap: 0 !important;
          }
          /* Restore container display (desktop uses contents to dissolve) */
          .c24-hero-widget .c24package-location,
          .c24-hero-widget .c24package-left,
          .c24-hero-widget .c24package-right {
            display: block !important;
            width: 100% !important;
          }
          /* Kill decorative pseudo-elements on mobile */
          .c24-hero-widget .c24package-wrapper::before,
          .c24-hero-widget .c24package-wrapper::after { display: none !important; }
          .c24-hero-widget div.c24package-location::before { display: none !important; }

          /* Labels — single line above each input */
          .c24-hero-widget .c24package-location > span,
          .c24-hero-widget span.c24package-dep,
          .c24-hero-widget span.c24package-ret,
          .c24-hero-widget span.c24package-duration,
          .c24-hero-widget span.c24package-airport {
            display: block !important;
            grid-column: unset !important; grid-row: unset !important;
            font-size: 10px !important; font-weight: 700 !important;
            color: rgba(10,26,58,0.55) !important;
            text-transform: uppercase !important; letter-spacing: 0.08em !important;
            padding: 0 0 4px 2px !important; margin: 0 !important;
            border: none !important;
          }

          /* Row wrappers — vertical stack with spacing */
          .c24-hero-widget .c24package-location > input.c24package-location,
          .c24-hero-widget div.c24package-airport,
          .c24-hero-widget div.c24package-dep,
          .c24-hero-widget div.c24package-ret,
          .c24-hero-widget div.c24package-duration {
            display: block !important;
            grid-column: unset !important; grid-row: unset !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 0 12px 0 !important;
            border: none !important;
          }

          /* Input/select base style on mobile (including location input) */
          .c24-hero-widget input,
          .c24-hero-widget select,
          .c24-hero-widget input.c24package-location,
          .c24-hero-widget input[type="text"].c24package-location {
            height: 46px !important;
            font-size: 15px !important;
            padding: 0 14px !important;
            border: 1px solid rgba(10,26,58,0.15) !important;
            border-radius: 10px !important;
            background: #fff !important;
            width: 100% !important;
            box-sizing: border-box !important;
            outline: none !important;
          }
          .c24-hero-widget input:focus,
          .c24-hero-widget select:focus,
          .c24-hero-widget input.c24package-location:focus {
            border-color: #2e75fa !important;
            box-shadow: 0 0 0 3px rgba(46,117,250,0.12) !important;
          }

          /* Submit full-width orange button */
          .c24-hero-widget .c24package-full {
            grid-column: unset !important; grid-row: unset !important;
            width: 100% !important;
            padding: 4px 0 0 0 !important;
            margin: 0 !important;
            border: none !important;
          }
          .c24-hero-widget button.c24package-submit {
            width: 100% !important; height: 52px !important;
            padding: 0 !important;
            border-radius: 12px !important;
            font-size: 16px !important; font-weight: 800 !important;
            background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%) !important;
            color: #fff !important;
            box-shadow: 0 4px 15px rgba(255,107,53,0.35) !important;
          }
        }

        /* ===== MIETWAGEN (RENTALCAR BILLBOARD) WIDGET STYLING ===== */
        /* Main container — inner only; outer card handles radius/shadow */
        .c24-mietwagen-widget div.c24pp1.c24pp2.c24pp3.c24rentalcarbillboard {
          width: 100% !important; height: auto !important; min-height: 0 !important;
          background: white !important; border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
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
