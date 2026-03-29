'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Tag,
  Video,
  Star,
  Sun,
  Users,
  Brain,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  Calendar,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DESTINATION_CATEGORIES } from '@/lib/constants'
import { formatPrice, formatDate } from '@/lib/utils'

interface Offer {
  id: string
  title: string
  price: number
  originalPrice: number | null
  departureDate: string
  returnDate: string
  departureAirport: string
  hotelName: string | null
  hotelStars: number | null
  affiliateLink: string
  usedInVideo: boolean
}

interface VideoItem {
  id: string
  title: string
  status: string
  plannedDate: string | null
  publishedDate: string | null
  tiktokUrl: string | null
}

interface Destination {
  id: string
  name: string
  country: string
  category: string
  description: string | null
  imageUrl: string | null
  popularity: number | null
  bestSeason: string | null
  targetAudience: string | null
  aiResearchNotes: string | null
  aiResearchDate: string | null
  offers: Offer[]
  videos: VideoItem[]
}

const statusLabels: Record<string, string> = {
  pianificato: 'Pianificato',
  ripresa: 'In ripresa',
  montaggio: 'Montaggio',
  pubblicato: 'Pubblicato',
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStreamText, setAiStreamText] = useState('')

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const fetchDestination = useCallback(async () => {
    try {
      const res = await fetch(`/api/destinazioni/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setDestination(data)
    } catch {
      console.error('Errore nel caricamento della destinazione')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDestination()
  }, [fetchDestination])

  function openEditDialog() {
    if (!destination) return
    setEditName(destination.name)
    setEditCountry(destination.country)
    setEditCategory(destination.category)
    setEditDescription(destination.description || '')
    setEditOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/destinazioni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          country: editCountry,
          category: editCategory,
          description: editDescription,
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditOpen(false)
      fetchDestination()
    } catch {
      console.error('Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Sei sicuro di voler eliminare questa destinazione? Tutte le offerte collegate verranno eliminate.')) {
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/destinazioni/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/destinazioni')
    } catch {
      console.error('Errore nell\'eliminazione')
      setDeleting(false)
    }
  }

  const categoryInfo = DESTINATION_CATEGORIES.find(
    (c) => c.value === destination?.category,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="text-center py-20">
        <p className="text-secondary text-sm">Destinazione non trovata</p>
        <Link href="/destinazioni" className="inline-block mt-3">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Torna alle destinazioni
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button + Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/destinazioni"
          className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Destinazioni
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={openEditDialog}>
            <Pencil className="w-3.5 h-3.5" />
            Modifica
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Elimina
          </Button>
        </div>
      </div>

      {/* Destination header */}
      <div>
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {destination.name}
          </h1>
          {categoryInfo && (
            <Badge variant="primary" className="mt-1">
              <span>{categoryInfo.emoji}</span>
              <span>{categoryInfo.label}</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-secondary">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{destination.country}</span>
        </div>
        {destination.description && (
          <p className="text-sm text-secondary leading-relaxed mt-3 max-w-2xl">
            {destination.description}
          </p>
        )}
      </div>

      {/* Stats row */}
      {(destination.popularity || destination.bestSeason || destination.targetAudience) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {destination.popularity && (
            <Card className="flex items-center gap-3">
              <div className="bg-[#ff9f0a]/10 rounded-xl p-2.5">
                <Star className="w-4 h-4 text-[#ff9f0a]" />
              </div>
              <div>
                <p className="text-sm font-semibold">{destination.popularity}/10</p>
                <p className="text-[11px] text-secondary">Popolarita</p>
              </div>
            </Card>
          )}
          {destination.bestSeason && (
            <Card className="flex items-center gap-3">
              <div className="bg-[#ff9f0a]/10 rounded-xl p-2.5">
                <Sun className="w-4 h-4 text-[#ff9f0a]" />
              </div>
              <div>
                <p className="text-sm font-semibold">{destination.bestSeason}</p>
                <p className="text-[11px] text-secondary">Stagione migliore</p>
              </div>
            </Card>
          )}
          {destination.targetAudience && (
            <Card className="flex items-center gap-3">
              <div className="bg-primary-light rounded-xl p-2.5">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{destination.targetAudience}</p>
                <p className="text-[11px] text-secondary">Target</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* AI Research section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Ricerca AI
            </CardTitle>
            <Button
              variant="secondary"
              size="sm"
              disabled={aiLoading}
              onClick={async () => {
                setAiLoading(true)
                setAiStreamText('')
                try {
                  const res = await fetch('/api/destinazioni/ricerca-ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: destination.name,
                      country: destination.country,
                      destinationId: destination.id,
                    }),
                  })
                  if (!res.ok) throw new Error('Errore nella ricerca')
                  const reader = res.body?.getReader()
                  const decoder = new TextDecoder()
                  if (reader) {
                    while (true) {
                      const { done, value } = await reader.read()
                      if (done) break
                      setAiStreamText((prev) => prev + decoder.decode(value))
                    }
                  }
                  fetchDestination()
                } catch (err) {
                  setAiStreamText('Errore: ' + (err instanceof Error ? err.message : 'sconosciuto'))
                } finally {
                  setAiLoading(false)
                }
              }}
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analizzando...
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  {destination.aiResearchNotes ? 'Aggiorna ricerca' : 'Avvia ricerca AI'}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiLoading && aiStreamText ? (
            <div className="bg-surface rounded-xl p-4 border border-border-light">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                {aiStreamText}
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
              </p>
            </div>
          ) : destination.aiResearchNotes ? (
            <div>
              <div className="bg-surface rounded-xl p-4 border border-border-light">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {destination.aiResearchNotes}
                </p>
              </div>
              {destination.aiResearchDate && (
                <p className="text-[11px] text-secondary/60 mt-3">
                  Ultimo aggiornamento: {formatDate(destination.aiResearchDate)}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-secondary">
                Nessuna ricerca AI disponibile. Clicca &quot;Avvia ricerca AI&quot; per analizzare questa destinazione con Claude Opus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#ff9f0a]" />
            Offerte ({destination.offers.length})
          </CardTitle>
          <Link href={`/offerte/nuova?destinationId=${destination.id}`}>
            <Button size="sm" variant="secondary">
              Aggiungi offerta
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {destination.offers.length === 0 ? (
            <p className="text-sm text-secondary text-center py-6">
              Nessuna offerta collegata
            </p>
          ) : (
            <div className="space-y-3">
              {destination.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface border border-border-light"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{offer.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-secondary">
                        {formatDate(offer.departureDate)} - {formatDate(offer.returnDate)}
                      </span>
                      {offer.hotelName && (
                        <span className="text-xs text-secondary">
                          {offer.hotelName}
                          {offer.hotelStars && ` ${'★'.repeat(offer.hotelStars)}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(offer.price)}
                      </p>
                      {offer.originalPrice && (
                        <p className="text-[11px] text-secondary line-through">
                          {formatPrice(offer.originalPrice)}
                        </p>
                      )}
                    </div>
                    {offer.usedInVideo && (
                      <Badge variant="success">In video</Badge>
                    )}
                    <a
                      href={offer.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-surface-elevated text-secondary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Videos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#af52de]" />
            Video ({destination.videos.length})
          </CardTitle>
          <Link href={`/contenuti/nuovo?destinationId=${destination.id}`}>
            <Button size="sm" variant="secondary">
              Pianifica video
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {destination.videos.length === 0 ? (
            <p className="text-sm text-secondary text-center py-6">
              Nessun video collegato
            </p>
          ) : (
            <div className="space-y-3">
              {destination.videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface border border-border-light"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {video.plannedDate && (
                        <span className="text-xs text-secondary flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(video.plannedDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`status-${video.status} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                      {statusLabels[video.status] || video.status}
                    </span>
                    {video.tiktokUrl && (
                      <a
                        href={video.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-surface-elevated text-secondary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Modifica destinazione">
        <div className="space-y-4">
          <Input
            id="edit-name"
            label="Nome"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="es. Santorini"
          />
          <Input
            id="edit-country"
            label="Paese"
            value={editCountry}
            onChange={(e) => setEditCountry(e.target.value)}
            placeholder="es. Grecia"
          />
          <Select
            id="edit-category"
            label="Categoria"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            options={DESTINATION_CATEGORIES.map((c) => ({
              value: c.value,
              label: `${c.emoji} ${c.label}`,
            }))}
          />
          <Textarea
            id="edit-description"
            label="Descrizione"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descrizione della destinazione..."
            rows={4}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave} disabled={saving || !editName || !editCountry}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva modifiche'
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
