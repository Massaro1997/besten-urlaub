'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { CallbackForm } from './callback-form'

interface Props {
  offerId?: string
  offerTitle?: string
  source?: string
  delayMs?: number
}

const STORAGE_KEY = 'bu_callback_shown'

export function CallbackModal({ offerId, offerTitle, source = 'callback-modal', delayMs = 8000 }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Only show once per session
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {}

    const timer = setTimeout(() => {
      setOpen(true)
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#0a1a3a]/60 hover:bg-white hover:text-[#0a1a3a] transition-colors shadow-sm"
          aria-label="Schliessen"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image — paradise destination */}
        <div className="relative w-full aspect-[5/3] bg-[#0a1a3a]/5">
          <Image
            src="/destinations/mauritius.webp"
            alt="Traumurlaub"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 384px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-semibold drop-shadow">
              Exklusiv für dich
            </p>
            <h3 className="text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Dein Traumurlaub wartet
            </h3>
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="mb-4">
            <p className="text-sm text-[#0a1a3a]/70 leading-snug">
              Lass uns deinen Kontakt da. Wir finden dein perfektes Angebot und melden uns persönlich.
            </p>
          </div>

          <CallbackForm
            offerId={offerId}
            offerTitle={offerTitle}
            source={source}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        :global(.animate-fade-in) {
          animation: fadeIn 0.2s ease-out;
        }
        :global(.animate-scale-in) {
          animation: scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  )
}
