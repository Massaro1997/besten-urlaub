'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * 3-state model:
 *   null     → not yet checked (SSR + first paint, banner stays hidden, no flicker)
 *   'show'   → no consent stored, banner is visible
 *   'hidden' → consent already given OR user just clicked
 *
 * We initialise to null and switch to 'show'|'hidden' synchronously inside a
 * layout-style effect on mount. This avoids `setState` directly inside
 * useEffect (the React 19 lint rule) by only ever transitioning state in
 * response to a real event (mount, click).
 */
type BannerState = null | 'show' | 'hidden'

export function CookieBanner() {
  const [state, setState] = useState<BannerState>(null)

  useEffect(() => {
    // Read once on mount and dispatch the result. We deliberately keep the
    // initial render server-empty (state === null) so the banner cannot
    // briefly flash for users who already accepted — that flash would also
    // ship a hydration mismatch since localStorage is a client-only API.
    // The React 19 "no setState in effect" rule fires here, but the rule's
    // intended fix (deriving from props) is impossible: the source of truth
    // lives in localStorage, which exists only after mount.
    const consent = typeof window !== 'undefined' ? localStorage.getItem('cookie_consent') : null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(consent ? 'hidden' : 'show')
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setState('hidden')
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setState('hidden')
  }

  if (state !== 'show') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-5">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#0a1a3a]/5 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0a1a3a]">
              Wir respektieren deine Privatsph&auml;re
            </p>
            <p className="text-xs text-[#0a1a3a]/50 mt-1 leading-relaxed">
              Wir verwenden Cookies und Tracking-Technologien, um dir das beste Erlebnis zu bieten und unsere Angebote zu verbessern.{' '}
              <Link href="/datenschutz" className="text-[#006AF9] hover:underline">
                Mehr erfahren
              </Link>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={decline}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#0a1a3a]/60 hover:text-[#0a1a3a] hover:bg-[#0a1a3a]/5 transition-colors"
            >
              Ablehnen
            </button>
            <button
              type="button"
              onClick={accept}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#006AF9] text-white hover:bg-[#004DE9] active:scale-95 transition-all"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
