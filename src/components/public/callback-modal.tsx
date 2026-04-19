'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { trackLead } from '@/lib/tiktok-pixel'

function EmailOnlyForm({ source }: { source: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = email.trim().toLowerCase()
    if (!val.includes('@')) return
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val, source }),
      })
      if (!res.ok) throw new Error('failed')
      try { localStorage.setItem('bu_email', val) } catch {}
      trackLead(source, { email: val })
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-xl bg-[#34c759]/10 border border-[#34c759]/30 p-4 text-center">
        <p className="text-sm font-bold text-[#0a1a3a]">Perfekt. Check dein Postfach.</p>
        <p className="text-xs text-[#0a1a3a]/60 mt-1">Die erste Deal-Mail kommt in wenigen Minuten.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        type="email"
        required
        autoFocus
        placeholder="deine@email.de"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#0a1a3a]/10 text-[15px] focus:outline-none focus:border-[#ff6b35] transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-4 py-3.5 rounded-xl bg-[#ff6b35] hover:bg-[#e85d2c] disabled:opacity-50 text-white text-[15px] font-extrabold transition-colors shadow-lg shadow-[#ff6b35]/30"
      >
        {status === 'sending' ? '...' : 'Deals sichern →'}
      </button>
      {status === 'err' && (
        <p className="text-xs text-red-600 text-center">Fehler. Bitte nochmal versuchen.</p>
      )}
    </form>
  )
}

interface Props {
  offerId?: string
  offerTitle?: string
  source?: string
  delayMs?: number
}

const STORAGE_KEY = 'bu_callback_shown'

export function CallbackModal({ source = 'callback-modal', delayMs = 4000 }: Props) {
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-block bg-[#ff6b35] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full mb-2">
              Nur für kurze Zeit
            </span>
            <h3 className="text-[26px] font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-lg">
              Spare bis zu <span className="text-[#ff6b35]">1.000 €</span> auf deinem nächsten Urlaub
            </h3>
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <p className="text-[15px] text-[#0a1a3a]/75 leading-snug mb-4">
            Unsere besten Deals landen direkt in deinem Postfach. Keine Anrufe. Kein Spam. Nur echte Schnäppchen, bevor sie ausverkauft sind.
          </p>

          <EmailOnlyForm source={source} />

          <p className="text-[11px] text-[#0a1a3a]/45 text-center mt-3">
            Jederzeit abbestellbar. Über 12.000 Reisende vertrauen uns.
          </p>
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
