'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

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
              <Link href="/datenschutz" className="text-[#2e75fa] hover:underline">
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2e75fa] text-white hover:bg-[#1a5fe0] active:scale-95 transition-all"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
