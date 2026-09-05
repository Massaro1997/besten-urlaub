'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Check } from 'lucide-react'
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
      <div className="rounded-2xl bg-[#34c759]/10 border border-[#34c759]/30 p-6 text-center">
        <p className="text-lg font-bold text-[#0a1a3a]">Perfekt. Check dein Postfach.</p>
        <p className="text-sm text-[#0a1a3a]/60 mt-1.5">Die erste Deal-Mail kommt in wenigen Minuten.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        placeholder="deine@email.de"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-2xl border border-[#0a1a3a]/15 bg-white px-5 py-4 text-base text-[#0a1a3a] placeholder:text-[#0a1a3a]/35 outline-none focus:outline-none focus-visible:outline-none focus:border-[#F2660A] transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-2xl px-5 py-4 text-base sm:text-lg font-extrabold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #F2660A 0%, #FE561B 100%)', boxShadow: '0 12px 30px -10px rgba(255,107,53,0.7)' }}
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

export function CallbackModal({ source = 'callback-modal', delayMs = 45000 }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Una volta sola per sessione
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {}

    let done = false
    function show() {
      if (done) return
      done = true
      setOpen(true)
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
      cleanup()
    }

    // 1) il mouse esce dalla finestra (desktop), 2) meta' pagina scrollata, 3) dopo delayMs
    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0) show()
    }
    function onScroll() {
      const h = document.documentElement
      if (h.scrollHeight > h.clientHeight * 1.5 &&
          window.scrollY > (h.scrollHeight - h.clientHeight) * 0.5) show()
    }
    const timer = setTimeout(show, delayMs)

    function cleanup() {
      clearTimeout(timer)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('scroll', onScroll)
    }

    document.addEventListener('mouseout', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    return cleanup
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#0a1a3a]/55 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-w-[560px] sm:max-w-4xl h-[94svh] sm:h-auto sm:min-h-[520px] sm:max-h-[86vh] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_100px_-25px_rgba(10,26,58,0.55)] animate-scale-in sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0a1a3a]/60 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0a1a3a]"
          aria-label="Schliessen"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Foto */}
        <div className="relative h-[38%] shrink-0 sm:h-auto sm:w-[46%]">
          <Image
            src="/destinations/mauritius.webp"
            alt="Traumurlaub"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 46vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a3a]/90 via-[#0a1a3a]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <span className="inline-block rounded-full bg-[#F2660A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Nur für kurze Zeit
            </span>
            <h3 className="mt-3 text-[28px] sm:text-[34px] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Spare bis zu <span className="text-[#ffb020]">1.000 €</span> auf deinem nächsten Urlaub
            </h3>
          </div>
        </div>

        {/* Contenuto */}
        <div className="flex flex-1 flex-col justify-start sm:justify-center gap-5 overflow-y-auto p-6 pb-8 pt-7 sm:p-10 sm:pr-14">
          <p className="text-base sm:text-lg leading-relaxed text-[#0a1a3a]/75">
            Unsere besten Deals landen direkt in deinem Postfach — handverlesen,
            einmal pro Woche, bevor sie ausverkauft sind.
          </p>

          <ul className="space-y-2.5">
            {['Handverlesene Angebote, keine Massenmails', 'Einmal pro Woche, sonst nichts', 'Jederzeit abbestellbar'].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-[#0a1a3a]/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2660A]/12">
                  <Check className="h-3 w-3 text-[#F2660A]" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <EmailOnlyForm source={source} />

          <p className="text-center text-xs text-[#0a1a3a]/45">
            Kein Spam. Abmeldung mit einem Klick in jeder Mail.
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
