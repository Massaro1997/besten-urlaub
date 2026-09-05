'use client'

import { useState } from 'react'

interface PendingOffer {
  id: string
  title: string
  description: string | null
  priceFrom: number | null
  hotelName: string | null
  hotelStars: number | null
  board: string | null
  nights: number | null
  upSourceUrl: string | null
  destination: { name: string; country: string }
}

export function PendingOfferRow({ offer }: { offer: PendingOffer }) {
  const [link, setLink] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function save() {
    if (!link.trim() || !link.includes('http')) {
      setErrMsg('Invalid URL')
      setStatus('err')
      return
    }
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save-affiliate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, affiliateLink: link }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErrMsg(j.error || 'Save failed')
        setStatus('err')
        return
      }
      setStatus('ok')
    } catch (err) {
      setErrMsg(String(err))
      setStatus('err')
    }
  }

  async function reject() {
    if (!confirm('Diese Offer löschen?')) return
    setStatus('saving')
    await fetch('/api/admin/reject-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId: offer.id }),
    })
    window.location.reload()
  }

  if (status === 'ok') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm font-semibold">
        ✓ Offer pubblicata. Refresh per vedere lista aggiornata.
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#0a1a3a]/10 rounded-xl p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: offer details */}
        <div className="lg:col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-[#F2660A] font-bold mb-1">
            {offer.destination.country}
          </p>
          <h3 className="text-base font-bold text-[#0a1a3a] leading-tight">{offer.title}</h3>
          {offer.hotelName && (
            <p className="text-sm text-[#0a1a3a]/75 mt-2">
              <span className="font-semibold">Hotel:</span> {offer.hotelName}
              {offer.hotelStars && <span className="ml-1">({offer.hotelStars}*)</span>}
            </p>
          )}
          {offer.nights && (
            <p className="text-xs text-[#0a1a3a]/60 mt-1">
              {offer.nights} Nächte
              {offer.board && ` · ${offer.board}`}
              {offer.priceFrom && ` · Ab ${offer.priceFrom}€ p.P.`}
            </p>
          )}
          {offer.description && (
            <p className="text-xs text-[#0a1a3a]/55 mt-2 italic leading-relaxed">"{offer.description}"</p>
          )}
        </div>

        {/* Middle: 3-step workflow */}
        <div className="lg:col-span-1 space-y-3">
          {/* Step 1 */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#0a1a3a]/55 font-semibold mb-1.5">
              1. UP Source (Hotel ansehen)
            </p>
            {offer.upSourceUrl ? (
              <a
                href={offer.upSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a1a3a]/5 hover:bg-[#0a1a3a]/10 text-[#0a1a3a] text-xs font-semibold break-all"
              >
                ↗ Urlaubspiraten Deal
              </a>
            ) : (
              <p className="text-xs text-[#0a1a3a]/50">No source URL</p>
            )}
          </div>

          {/* Step 2: Check24 search */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#0a1a3a]/55 font-semibold mb-1.5">
              2. Auf Check24.net Angebot finden
            </p>
            <a
              href={`https://www.check24.net/pauschalreisen-vergleich/?c24pp_hotel=${encodeURIComponent(offer.hotelName || offer.destination.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#006AF9]/10 hover:bg-[#006AF9]/15 text-[#006AF9] text-xs font-semibold"
            >
              ↗ Check24 Suche öffnen
            </a>
            <p className="text-[10px] text-[#0a1a3a]/50 mt-1.5 leading-snug">
              URL der Check24-Angebotsseite aus Browserleiste kopieren
            </p>
          </div>

          {/* Step 3: Link-Generator + Tracking-ID */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#0a1a3a]/55 font-semibold mb-1.5">
              3. Link-Generator + Tracking-ID
            </p>
            <a
              href="https://www.check24-partnerprogramm.de/werbemittel/linkgenerator/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#006AF9]/10 hover:bg-[#006AF9]/15 text-[#006AF9] text-xs font-semibold"
            >
              ↗ Linkgenerator
            </a>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-[#0a1a3a]/55">Tracking-ID:</span>
              <code
                className="flex-1 px-2 py-1 rounded bg-[#0a1a3a]/5 text-[11px] font-mono text-[#0a1a3a] cursor-pointer hover:bg-[#0a1a3a]/10"
                onClick={() => {
                  const id = `up${offer.id.slice(-8)}${(offer.destination.country || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}`
                  navigator.clipboard.writeText(id)
                }}
                title="Click to copy"
              >
                {`up${offer.id.slice(-8)}${(offer.destination.country || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}`}
              </code>
            </div>
            <p className="text-[10px] text-[#0a1a3a]/50 mt-1 leading-snug">
              Click → copy. Nur Buchstaben+Zahlen erlaubt.
            </p>
          </div>
        </div>

        {/* Right: paste link + save */}
        <div className="lg:col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-[#0a1a3a]/55 font-semibold mb-2">
            3. Affiliate Link einfügen
          </p>
          <textarea
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://a.check24.net/misc/click.php?aid=18&pid=1168044&..."
            className="w-full h-24 px-3 py-2 text-xs font-mono border border-[#0a1a3a]/15 rounded-lg focus:border-[#F2660A] focus:outline-none focus:ring-2 focus:ring-[#F2660A]/20"
          />
          {status === 'err' && (
            <p className="text-xs text-red-600 mt-1">{errMsg}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={save}
              disabled={status === 'saving'}
              className="flex-1 px-4 py-2 rounded-lg bg-[#F2660A] hover:bg-[#e55a2b] text-white text-sm font-bold disabled:opacity-50 transition-colors"
            >
              {status === 'saving' ? '...' : 'Speichern & Live'}
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={status === 'saving'}
              className="px-3 py-2 rounded-lg bg-[#0a1a3a]/5 hover:bg-red-50 text-[#0a1a3a]/60 hover:text-red-600 text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
