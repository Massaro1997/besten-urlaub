'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import {
  ArrowLeft, Copy, Check, ExternalLink, Pencil, Trash2,
  Video, Loader2, Link2, MapPin, StickyNote,
} from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import { DESTINATION_CATEGORIES } from '@/lib/constants'

interface Destination {
  id: string
  name: string
  country: string
  category: string
}

interface OfferFull {
  id: string
  destinationId: string
  title: string
  priceFrom: number | null
  affiliateLink: string
  description: string | null
  notes: string | null
  usedInVideo: boolean
  createdAt: string
  updatedAt: string
  destination: Destination
  videoOffers: { video: { id: string; title: string; status: string; tiktokUrl: string | null } }[]
}

export default function OfferDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [offer, setOffer] = useState<OfferFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [editLoading, setEditLoading] = useState(false)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})

  const [editDestinationId, setEditDestinationId] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editPriceFrom, setEditPriceFrom] = useState('')
  const [editAffiliateLink, setEditAffiliateLink] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const fetchOffer = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/offerte/${id}`)
      if (!res.ok) { router.push('/offerte'); return }
      setOffer(await res.json())
    } catch { router.push('/offerte') }
    finally { setLoading(false) }
  }, [id, router])

  useEffect(() => { fetchOffer() }, [fetchOffer])

  function openEditDialog() {
    if (!offer) return
    setEditDestinationId(offer.destinationId)
    setEditTitle(offer.title)
    setEditPriceFrom(offer.priceFrom?.toString() || '')
    setEditAffiliateLink(offer.affiliateLink)
    setEditDescription(offer.description || '')
    setEditNotes(offer.notes || '')
    setEditErrors({})
    fetch('/api/destinazioni').then((r) => r.json()).then(setDestinations).catch(() => {})
    setShowEdit(true)
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    setEditErrors({})
    setEditLoading(true)
    try {
      const res = await fetch(`/api/offerte/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: editDestinationId,
          title: editTitle,
          priceFrom: editPriceFrom ? parseFloat(editPriceFrom) : undefined,
          affiliateLink: editAffiliateLink,
          description: editDescription || undefined,
          notes: editNotes || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          const fe: Record<string, string> = {}
          for (const [k, v] of Object.entries(data.details)) fe[k] = (v as string[])[0]
          setEditErrors(fe)
        } else setEditErrors({ _form: data.error || 'Errore' })
        return
      }
      setShowEdit(false)
      fetchOffer()
    } catch { setEditErrors({ _form: 'Errore di rete' }) }
    finally { setEditLoading(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/offerte/${id}`, { method: 'DELETE' })
      if (res.ok) router.push('/offerte')
    } catch { setDeleting(false) }
  }

  async function handleCopyLink() {
    if (!offer) return
    try { await navigator.clipboard.writeText(offer.affiliateLink) } catch {
      const ta = document.createElement('textarea')
      ta.value = offer.affiliateLink; document.body.appendChild(ta)
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
  if (!offer) return null

  const categoryInfo = DESTINATION_CATEGORIES.find((c) => c.value === offer.destination.category)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/offerte"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Offerte</Button></Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={openEditDialog}><Pencil className="w-3.5 h-3.5" /> Modifica</Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="w-3.5 h-3.5" /> Elimina</Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href={`/destinazioni/${offer.destination.id}`}>
          <Badge variant="primary" className="cursor-pointer hover:opacity-80"><MapPin className="w-3 h-3" /> {offer.destination.name}, {offer.destination.country}</Badge>
        </Link>
        {categoryInfo && <Badge>{categoryInfo.emoji} {categoryInfo.label}</Badge>}
        {offer.usedInVideo && <Badge variant="success"><Video className="w-3 h-3" /> In video</Badge>}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">{offer.title}</h1>

      {/* Description */}
      {offer.description && <p className="text-sm text-secondary leading-relaxed">{offer.description}</p>}

      {/* Price */}
      {offer.priceFrom && (
        <Card>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-secondary">a partire da</span>
              <span className="text-3xl font-bold text-primary">{formatPrice(offer.priceFrom)}</span>
              <span className="text-sm text-secondary">/ persona</span>
            </div>
            <p className="text-xs text-secondary mt-1">Il prezzo finale dipende da data, aeroporto e hotel scelti su Check24</p>
          </CardContent>
        </Card>
      )}

      {/* Link affiliato */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Link2 className="w-4 h-4 text-primary" /> Link affiliato Check24</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface rounded-xl px-4 py-2.5 text-sm text-secondary overflow-hidden"><span className="block truncate">{offer.affiliateLink}</span></div>
            <Button onClick={handleCopyLink} size="sm">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copiato!</> : <><Copy className="w-3.5 h-3.5" /> Copia</>}
            </Button>
            <a href={offer.affiliateLink} target="_blank" rel="noopener noreferrer"><Button variant="secondary" size="sm"><ExternalLink className="w-3.5 h-3.5" /></Button></a>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {offer.notes && (
        <Card><CardContent className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2"><StickyNote className="w-4 h-4 text-primary" /> Note</h3>
          <p className="text-sm text-secondary whitespace-pre-wrap">{offer.notes}</p>
        </CardContent></Card>
      )}

      {/* Videos */}
      {offer.videoOffers.length > 0 && (
        <Card><CardContent className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Video collegati</h3>
          <div className="space-y-2">
            {offer.videoOffers.map(({ video }) => (
              <Link key={video.id} href={`/contenuti/${video.id}`} className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-border-light transition-colors">
                <span className="text-sm font-medium">{video.title}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', `status-${video.status}`)}>{video.status}</span>
              </Link>
            ))}
          </div>
        </CardContent></Card>
      )}

      <p className="text-xs text-secondary text-center">Creata il {formatDate(offer.createdAt)} &middot; Aggiornata il {formatDate(offer.updatedAt)}</p>

      {/* Delete dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminare questa offerta?">
        <p className="text-sm text-secondary mb-4">Stai per eliminare &ldquo;{offer.title}&rdquo;.</p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Annulla</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</> : <><Trash2 className="w-4 h-4" /> Elimina</>}
          </Button>
        </div>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={showEdit} onClose={() => setShowEdit(false)} title="Modifica Offerta" className="max-w-xl">
        <form onSubmit={handleEdit} className="space-y-4">
          {editErrors._form && <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm">{editErrors._form}</div>}
          <Select id="ed" label="Destinazione *" options={destinations.map((d) => ({ value: d.id, label: `${d.name}, ${d.country}` }))} value={editDestinationId} onChange={(e) => setEditDestinationId(e.target.value)} placeholder="Seleziona" error={editErrors.destinationId} />
          <Input id="et" label="Titolo *" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} error={editErrors.title} />
          <Input id="ep" label="Prezzo indicativo (EUR)" type="number" value={editPriceFrom} onChange={(e) => setEditPriceFrom(e.target.value)} />
          <Input id="el" label="Link affiliato *" type="url" value={editAffiliateLink} onChange={(e) => setEditAffiliateLink(e.target.value)} error={editErrors.affiliateLink} />
          <Textarea id="edc" label="Descrizione" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} />
          <Textarea id="en" label="Note" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowEdit(false)}>Annulla</Button>
            <Button type="submit" disabled={editLoading}>
              {editLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : 'Salva'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
