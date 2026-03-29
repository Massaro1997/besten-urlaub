'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { OfferCard } from '@/components/offerte/offer-card'
import { Plus, Search, Tag, Loader2 } from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
}

interface Offer {
  id: string
  title: string
  priceFrom: number | null
  affiliateLink: string
  description: string | null
  usedInVideo: boolean
  destination: { id: string; name: string; country: string; category: string }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Più recenti' },
  { value: 'price_asc', label: 'Prezzo crescente' },
  { value: 'price_desc', label: 'Prezzo decrescente' },
  { value: 'name', label: 'Alfabetico' },
]

export default function OffertePage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [sort, setSort] = useState('newest')

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (destinationId) params.set('destinationId', destinationId)
    if (sort) params.set('sort', sort)

    try {
      const res = await fetch(`/api/offerte?${params.toString()}`)
      if (res.ok) setOffers(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [search, destinationId, sort])

  useEffect(() => {
    fetch('/api/destinazioni').then((r) => r.json()).then(setDestinations).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchOffers, 300)
    return () => clearTimeout(timer)
  }, [fetchOffers])

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: `${d.name}, ${d.country}`,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Offerte</h1>
            <p className="text-sm text-secondary">
              {loading ? 'Caricamento...' : `${offers.length} link affiliati`}
            </p>
          </div>
        </div>
        <Link href="/offerte/nuova">
          <Button>
            <Plus className="w-4 h-4" />
            Nuova Offerta
          </Button>
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            placeholder="Cerca offerte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={[{ value: '', label: 'Tutte le destinazioni' }, ...destinationOptions]}
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          className="w-52"
        />
        <Select
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nessuna offerta</h3>
          <p className="text-sm text-secondary mb-4 max-w-sm">
            Aggiungi i tuoi link affiliati Check24 per le destinazioni.
          </p>
          <Link href="/offerte/nuova">
            <Button>
              <Plus className="w-4 h-4" />
              Crea prima offerta
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  )
}
