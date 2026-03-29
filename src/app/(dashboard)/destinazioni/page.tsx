'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DESTINATION_CATEGORIES } from '@/lib/constants'
import { DestinationCard } from '@/components/destinazioni/destination-card'
import { cn } from '@/lib/utils'

interface DestinationWithCounts {
  id: string
  name: string
  country: string
  category: string
  description: string | null
  imageUrl: string | null
  popularity: number | null
  bestSeason: string | null
  _count: {
    offers: number
    videos: number
  }
}

const categoryTabs = [
  { value: 'tutte', label: 'Tutte', emoji: '' },
  ...DESTINATION_CATEGORIES,
]

export default function DestinazioniPage() {
  const [destinations, setDestinations] = useState<DestinationWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('tutte')
  const [search, setSearch] = useState('')

  const fetchDestinations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'tutte') params.set('category', activeCategory)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/destinazioni?${params.toString()}`)
      if (!res.ok) throw new Error('Fetch error')
      const data = await res.json()
      setDestinations(data)
    } catch (err) {
      console.error('Errore nel caricamento:', err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search])

  useEffect(() => {
    const debounce = setTimeout(fetchDestinations, search ? 300 : 0)
    return () => clearTimeout(debounce)
  }, [fetchDestinations, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Destinazioni</h1>
          <p className="text-secondary text-sm mt-1">
            Gestisci le destinazioni del tuo catalogo
          </p>
        </div>
        <Link href="/destinazioni/nuova">
          <Button>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuova destinazione</span>
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
        <input
          type="text"
          placeholder="Cerca destinazione o paese..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-elevated text-foreground',
            'placeholder:text-secondary/50 outline-none transition-all text-sm',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
          )}
        />
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {categoryTabs.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0',
              activeCategory === cat.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-secondary hover:text-foreground hover:bg-border-light',
            )}
          >
            {cat.emoji && <span>{cat.emoji}</span>}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-secondary text-sm">Nessuna destinazione trovata</p>
          <Link href="/destinazioni/nuova" className="inline-block mt-3">
            <Button variant="secondary" size="sm">
              <Plus className="w-4 h-4" />
              Aggiungi la prima destinazione
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  )
}
