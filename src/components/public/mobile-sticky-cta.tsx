'use client'

import { useEffect, useState } from 'react'
import { TrackedCheck24CTA } from './tracked-check24-cta'

/**
 * Mobile-only sticky bottom CTA — appears after user scrolls 600px from top
 * and hides when scrolling back near hero. Pattern preso da urlaubspiraten
 * (mobile sticky bottom bar). Drives Check24 Pauschalreisen affiliate click.
 *
 * Hidden on desktop (≥640px). Hidden on key pages where it would duplicate
 * the primary CTA (offer detail, pauschalreisen widget page).
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Skip on offer detail / pauschal widget page (own CTA already prominent)
    const path = window.location.pathname
    if (path.startsWith('/angebot/') || path.startsWith('/pauschalreisen')) {
      setHidden(true)
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setVisible(y > 600)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (hidden) return null

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        background: 'linear-gradient(to top, rgba(255,255,255,0.98) 60%, rgba(255,255,255,0))',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
      }}
    >
      <TrackedCheck24CTA
        baseHref="https://p1168044s0m.urlaub.check24.net/?deviceoutput=mobile"
        source="mobile-sticky-cta"
        product="Pauschalreise"
        className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 active:scale-[0.98] transition-transform shadow-[0_8px_30px_rgba(255,107,53,0.4)]"
        style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #e85d2c 100%)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 8 14 12 22c4-8 4-16 0-20z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12c4-4 12-4 16 0" />
            </svg>
          </span>
          <div className="text-left min-w-0">
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/90 leading-none">Pauschalreisen</p>
            <p className="text-[15px] font-extrabold text-white leading-tight mt-0.5 truncate">Jetzt vergleichen · bis 60% sparen</p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#ff6b35]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </TrackedCheck24CTA>
    </div>
  )
}
