'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DESIGN_TYPES } from '@/lib/constants'
import { formatPrice, formatDateRange } from '@/lib/utils'
import { ArrowLeft, Sparkles, Palette } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Destination {
  id: string
  name: string
  country: string
}

interface Offer {
  id: string
  title: string
  price: number
  departureDate: string
  returnDate: string
  departureAirport: string
  hotelName: string | null
}

export default function NuovoCreativoPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedDest, setSelectedDest] = useState('')
  const [selectedOffer, setSelectedOffer] = useState('')
  const [designType, setDesignType] = useState('tiktok_story')
  const [customQuery, setCustomQuery] = useState('')
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetch('/api/destinazioni')
      .then((r) => r.json())
      .then(setDestinations)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedDest) {
      fetch(`/api/offerte?destinationId=${selectedDest}`)
        .then((r) => r.json())
        .then(setOffers)
        .catch(() => {})
    } else {
      setOffers([])
    }
  }, [selectedDest])

  const selectedDestObj = destinations.find((d) => d.id === selectedDest)
  const selectedOfferObj = offers.find((o) => o.id === selectedOffer)

  async function handleGenerate() {
    setGenerating(true)
    try {
      const query = customQuery || buildQuery()
      const res = await fetch('/api/creativi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: selectedDest || undefined,
          designType,
          queryUsed: query,
        }),
      })
      if (res.ok) {
        router.push('/creativi')
      }
    } catch {
      // silently fail
    } finally {
      setGenerating(false)
    }
  }

  function buildQuery() {
    const parts: string[] = []
    if (selectedDestObj) {
      parts.push(`Destinazione: ${selectedDestObj.name}, ${selectedDestObj.country}`)
    }
    if (selectedOfferObj) {
      parts.push(`Prezzo: ${formatPrice(selectedOfferObj.price)}`)
      parts.push(`Date: ${formatDateRange(selectedOfferObj.departureDate, selectedOfferObj.returnDate)}`)
      parts.push(`Da: ${selectedOfferObj.departureAirport}`)
      if (selectedOfferObj.hotelName) parts.push(`Hotel: ${selectedOfferObj.hotelName}`)
    }
    const typeLabel = DESIGN_TYPES.find((t) => t.value === designType)?.label || designType
    parts.push(`Formato: ${typeLabel}`)
    parts.push('Stile: Moderno, accattivante, con prezzo grande e foto destinazione')
    parts.push('CTA: Link in Bio - Check24')
    parts.push('Lingua: Tedesco')
    return parts.join('\n')
  }

  const destOptions = destinations.map((d) => ({ value: d.id, label: `${d.name} (${d.country})` }))
  const offerOptions = offers.map((o) => ({ value: o.id, label: `${o.title} — ${formatPrice(o.price)}` }))
  const designOptions = DESIGN_TYPES.map((t) => ({ value: t.value, label: t.label }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/creativi" className="p-2 rounded-xl hover:bg-surface text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Genera Creativo</h1>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Destinazione */}
      {step >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Scegli Destinazione</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDest}
              onChange={(e) => {
                setSelectedDest(e.target.value)
                setSelectedOffer('')
                if (e.target.value && step === 1) setStep(2)
              }}
              options={destOptions}
              placeholder="Seleziona destinazione..."
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Offerta */}
      {step >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Seleziona Offerta (opzionale)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {offers.length > 0 ? (
              <Select
                value={selectedOffer}
                onChange={(e) => {
                  setSelectedOffer(e.target.value)
                  if (step === 2) setStep(3)
                }}
                options={offerOptions}
                placeholder="Nessuna offerta specifica..."
              />
            ) : (
              <p className="text-sm text-secondary">
                Nessuna offerta per questa destinazione.
              </p>
            )}
            {step === 2 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                Salta →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Tipo design */}
      {step >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Tipo di Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {DESIGN_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setDesignType(t.value)
                    if (step === 3) setStep(4)
                  }}
                  className={`py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center ${
                    designType === t.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border text-secondary hover:border-primary/30'
                  }`}
                >
                  <Palette className="w-6 h-6 mx-auto mb-1.5" />
                  {t.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preview + Generate */}
      {step >= 4 && (
        <Card>
          <CardHeader>
            <CardTitle>4. Anteprima e Generazione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-surface rounded-xl p-4 space-y-2">
              <p className="text-xs text-secondary font-medium uppercase tracking-wider">
                Riepilogo
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDestObj && (
                  <Badge variant="primary">
                    {selectedDestObj.name}, {selectedDestObj.country}
                  </Badge>
                )}
                {selectedOfferObj && (
                  <Badge variant="success">{formatPrice(selectedOfferObj.price)}</Badge>
                )}
                <Badge>
                  {DESIGN_TYPES.find((t) => t.value === designType)?.label}
                </Badge>
              </div>
            </div>

            <Textarea
              label="Query personalizzata (opzionale)"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={buildQuery()}
              rows={6}
            />

            <p className="text-xs text-secondary">
              La generazione avverrà tramite Canva AI. Il creativo verrà salvato nella galleria.
            </p>

            <Button onClick={handleGenerate} disabled={generating} size="lg" className="w-full">
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generando...' : 'Genera Creativo'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
