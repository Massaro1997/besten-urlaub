'use client'

import { useState } from 'react'
import { trackLead } from '@/lib/tiktok-pixel'
import { Phone } from 'lucide-react'

interface Props {
  offerId?: string
  offerTitle?: string
  source?: string
}

export function CallbackForm({ offerId, offerTitle, source = 'callback-form' }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@') || phone.length < 6) return
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, name, source, offerId, offerTitle }),
      })
      if (!res.ok) throw new Error('failed')
      try {
        localStorage.setItem('bu_email', email.trim().toLowerCase())
        localStorage.setItem('bu_phone', phone)
      } catch {}
      trackLead(source, { email, phone })
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-xl bg-[#34c759]/10 border border-[#34c759]/30 p-4 text-center">
        <p className="text-sm font-semibold text-[#0a1a3a]">Danke! Wir rufen dich bald an.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Phone className="w-4 h-4 text-[#ff6b35]" />
        <span className="text-sm font-semibold text-[#0a1a3a]">Wir rufen dich zurück</span>
      </div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[#0a1a3a]/15 text-sm focus:outline-none focus:border-[#ff6b35] transition-colors"
      />
      <input
        type="email"
        required
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[#0a1a3a]/15 text-sm focus:outline-none focus:border-[#ff6b35] transition-colors"
      />
      <input
        type="tel"
        required
        placeholder="+49 ..."
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[#0a1a3a]/15 text-sm focus:outline-none focus:border-[#ff6b35] transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-4 py-2.5 rounded-lg bg-[#ff6b35] hover:bg-[#e85d2c] disabled:opacity-50 text-white text-sm font-semibold transition-colors"
      >
        {status === 'sending' ? '...' : 'Rückruf anfordern'}
      </button>
    </form>
  )
}
