'use client'

import { useState } from 'react'
import { trackLead } from '@/lib/tiktok-pixel'

interface NewsletterFormProps {
  source?: string
  variant?: 'dark' | 'light'
}

export function NewsletterForm({ source = 'newsletter-footer', variant = 'dark' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) throw new Error('failed')
      // Persist email so subsequent pixel events include it (EMQ boost)
      try { localStorage.setItem('bu_email', email.trim().toLowerCase()) } catch {}
      trackLead(source)
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  const isLight = variant === 'light'
  const inputClass = isLight
    ? 'flex-1 px-4 py-3 rounded-xl bg-white border-2 border-[#0a1a3a]/10 text-base text-[#0a1a3a] placeholder:text-[#0a1a3a]/40 focus:outline-none focus:border-[#F2660A] transition-colors'
    : 'flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#F2660A] transition-colors'
  const buttonClass = isLight
    ? 'px-6 py-3 rounded-xl bg-[#F2660A] hover:bg-[#FE561B] disabled:opacity-50 text-white text-base font-bold transition-colors whitespace-nowrap shadow-[0_4px_15px_rgba(255,107,53,0.35)]'
    : 'px-5 py-2.5 rounded-lg bg-[#F2660A] hover:bg-[#FE561B] disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        placeholder="Deine E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className={buttonClass}
      >
        {status === 'sending' ? '...' : status === 'ok' ? 'Danke!' : 'Abonnieren'}
      </button>
    </form>
  )
}
