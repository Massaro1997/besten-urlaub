'use client'

import { useState } from 'react'
import { trackLead } from '@/lib/tiktok-pixel'

export function NewsletterForm() {
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
        body: JSON.stringify({ email, source: 'newsletter-footer' }),
      })
      if (!res.ok) throw new Error('failed')
      // Persist email so subsequent pixel events include it (EMQ boost)
      try { localStorage.setItem('bu_email', email.trim().toLowerCase()) } catch {}
      trackLead('newsletter-footer')
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        placeholder="Deine E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff6b35] transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-5 py-2.5 rounded-lg bg-[#ff6b35] hover:bg-[#e85d2c] disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
      >
        {status === 'sending' ? '...' : status === 'ok' ? 'Danke!' : 'Abonnieren'}
      </button>
    </form>
  )
}
