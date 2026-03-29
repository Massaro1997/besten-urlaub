'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Loader2,
  Check,
  Plus,
  Star,
  Plane,
  Hotel,
  UtensilsCrossed,
  Calendar,
  ExternalLink,
} from 'lucide-react'

interface SuggestedOffer {
  destination: string
  country: string
  title: string
  description: string
  priceFrom: number
  duration: string
  hotel: string
  hotelStars: number
  mealPlan: string
  airport: string
  source: string
  affiliateLink: string
}

export default function SuggerimentiPage() {
  const [offers, setOffers] = useState<SuggestedOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState<Set<number>>(new Set())
  const [publishing, setPublishing] = useState<number | null>(null)

  async function handleSearch() {
    setLoading(true)
    setError('')
    setOffers([])
    setPublished(new Set())

    try {
      const res = await fetch('/api/ricerca-offerte', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Errore nella ricerca')
        return
      }

      setOffers(data.offers || [])
    } catch {
      setError('Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish(index: number) {
    const offer = offers[index]
    setPublishing(index)

    try {
      // Find or create destination
      const destRes = await fetch('/api/destinazioni')
      const destinations = await destRes.json()
      let destinationId = destinations.find(
        (d: { name: string }) => d.name.toLowerCase() === offer.destination.toLowerCase(),
      )?.id

      if (!destinationId) {
        const slug = offer.destination.toLowerCase()
          .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' } as Record<string, string>)[c] || c)
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        const createRes = await fetch('/api/destinazioni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: offer.destination,
            country: offer.country,
            category: 'mare',
          }),
        })
        const created = await createRes.json()
        destinationId = created.id

        // Set slug
        await fetch(`/api/destinazioni/${destinationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: offer.destination,
            country: offer.country,
            category: 'mare',
            slug,
          }),
        })
      }

      // Create the offer
      const offerRes = await fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          title: offer.title,
          priceFrom: offer.priceFrom,
          affiliateLink: offer.affiliateLink,
          description: `${offer.duration} Tage | ${offer.hotel} ${offer.hotelStars}* | ${offer.mealPlan} | ${offer.airport}`,
        }),
      })

      if (offerRes.ok) {
        setPublished((prev) => new Set(prev).add(index))
      }
    } catch {
      // silently fail
    } finally {
      setPublishing(null)
    }
  }

  async function handlePublishAll() {
    for (let i = 0; i < offers.length; i++) {
      if (!published.has(i)) {
        await handlePublish(i)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Offerte suggerite</h1>
          <p className="text-sm text-secondary mt-1">
            Claude AI cerca le migliori offerte viaggio per turisti tedeschi
          </p>
        </div>
        <div className="flex gap-2">
          {offers.length > 0 && published.size < offers.length && (
            <Button variant="secondary" onClick={handlePublishAll}>
              <Plus className="w-4 h-4" />
              Pubblica tutte
            </Button>
          )}
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ricerca in corso...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Cerca offerte
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 text-danger rounded-xl text-sm">{error}</div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-sm text-secondary">
            Claude sta cercando le migliori offerte...
          </p>
          <p className="text-xs text-secondary/60 mt-1">
            Questo potrebbe richiedere 15-30 secondi
          </p>
        </div>
      )}

      {!loading && offers.length === 0 && !error && (
        <Card>
          <CardContent className="py-16 text-center">
            <Sparkles className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
            <p className="text-lg font-medium">Cerca le migliori offerte</p>
            <p className="text-sm text-secondary mt-1 mb-6">
              Clicca &ldquo;Cerca offerte&rdquo; per trovare i deal migliori con AI
            </p>
            <Button onClick={handleSearch}>
              <Sparkles className="w-4 h-4" />
              Cerca offerte
            </Button>
          </CardContent>
        </Card>
      )}

      {offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer, i) => (
            <Card key={i} className={published.has(i) ? 'opacity-60' : ''}>
              <CardContent>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <Badge variant="primary">{offer.destination}, {offer.country}</Badge>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    ab {offer.priceFrom} &euro;
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold mb-2">{offer.title}</h3>
                <p className="text-sm text-secondary mb-3">{offer.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {offer.duration} Tage
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5" />
                    {offer.hotel} {'*'.repeat(offer.hotelStars)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    {offer.mealPlan}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" />
                    {offer.airport}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {published.has(i) ? (
                    <Button variant="secondary" size="sm" disabled className="flex-1">
                      <Check className="w-4 h-4 text-success" />
                      Pubblicata
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(i)}
                      disabled={publishing === i}
                      className="flex-1"
                    >
                      {publishing === i ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Pubblicando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Pubblica
                        </>
                      )}
                    </Button>
                  )}
                  <a
                    href={offer.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
