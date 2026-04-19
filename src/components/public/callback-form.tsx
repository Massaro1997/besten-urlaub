'use client'

import { useState } from 'react'
import { trackLead } from '@/lib/tiktok-pixel'

interface Props {
  offerId?: string
  offerTitle?: string
  source?: string
}

type Contact = 'email' | 'phone'

export function CallbackForm({ offerId, offerTitle, source = 'callback-form' }: Props) {
  const [contactType, setContactType] = useState<Contact>('email')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = contact.trim()
    if (!name.trim()) return
    if (contactType === 'email' && !val.includes('@')) return
    if (contactType === 'phone' && val.length < 6) return

    setStatus('sending')
    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        source,
        offerId: offerId || '',
        offerTitle: offerTitle || '',
      }
      // Lead endpoint requires email; synthesize placeholder when phone-only
      if (contactType === 'email') {
        payload.email = val
      } else {
        payload.phone = val
        payload.email = `phone-${val.replace(/[^\d]/g, '')}@phone.bestenurlaub.local`
      }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('failed')

      try {
        if (contactType === 'email') localStorage.setItem('bu_email', val.toLowerCase())
        else localStorage.setItem('bu_phone', val)
      } catch {}

      trackLead(
        source,
        contactType === 'email' ? { email: val } : { phone: val },
      )
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-xl bg-[#34c759]/10 border border-[#34c759]/30 p-4 text-center">
        <p className="text-sm font-semibold text-[#0a1a3a]">Danke, {name.split(' ')[0]}! Wir melden uns bald.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Toggle email / phone */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#0a1a3a]/5 rounded-lg">
        <button
          type="button"
          onClick={() => { setContactType('email'); setContact('') }}
          className={`py-1.5 rounded-md text-xs font-semibold transition-colors ${
            contactType === 'email'
              ? 'bg-white text-[#0a1a3a] shadow-sm'
              : 'text-[#0a1a3a]/55 hover:text-[#0a1a3a]'
          }`}
        >
          E-Mail
        </button>
        <button
          type="button"
          onClick={() => { setContactType('phone'); setContact('') }}
          className={`py-1.5 rounded-md text-xs font-semibold transition-colors ${
            contactType === 'phone'
              ? 'bg-white text-[#0a1a3a] shadow-sm'
              : 'text-[#0a1a3a]/55 hover:text-[#0a1a3a]'
          }`}
        >
          Telefon
        </button>
      </div>

      <input
        type="text"
        required
        placeholder="Dein Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-[#0a1a3a]/15 text-sm focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/10 transition-all"
      />

      <input
        type={contactType === 'email' ? 'email' : 'tel'}
        required
        placeholder={contactType === 'email' ? 'deine@email.de' : '+49 ...'}
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-[#0a1a3a]/15 text-sm focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/10 transition-all"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-4 py-3 rounded-lg bg-[#ff6b35] hover:bg-[#e85d2c] disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm shadow-[#ff6b35]/25"
      >
        {status === 'sending' ? '...' : 'Jetzt beraten lassen'}
      </button>

      {status === 'err' && (
        <p className="text-xs text-red-600 text-center">Fehler. Bitte nochmal versuchen.</p>
      )}
    </form>
  )
}
