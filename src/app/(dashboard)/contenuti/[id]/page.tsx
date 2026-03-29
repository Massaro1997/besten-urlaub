'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  ExternalLink,
  Trash2,
  Hash,
  FileText,
  Loader2,
  Save,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { VIDEO_STATUSES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

interface VideoOffer {
  id: string
  offer: {
    id: string
    title: string
    price: number
    affiliateLink: string
    destination: {
      id: string
      name: string
      country: string
    } | null
  }
}

interface VideoDetail {
  id: string
  title: string
  description: string | null
  status: string
  plannedDate: string | null
  publishedDate: string | null
  hashtags: string | null
  tiktokUrl: string | null
  notes: string | null
  createdAt: string
  destination: { id: string; name: string; country: string } | null
  videoOffers: VideoOffer[]
}

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [video, setVideo] = useState<VideoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedStatus, setSelectedStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/contenuti/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Video non trovato')
          } else {
            throw new Error('Errore nel caricamento')
          }
          return
        }
        const data = await res.json()
        setVideo(data)
        setSelectedStatus(data.status)
      } catch (err) {
        console.error('Fetch video error:', err)
        setError('Impossibile caricare il video')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id])

  const handleStatusSave = async () => {
    if (!video || selectedStatus === video.status) return
    setSavingStatus(true)

    try {
      const res = await fetch(`/api/contenuti/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: video.title,
          status: selectedStatus,
        }),
      })

      if (!res.ok) throw new Error('Errore aggiornamento')

      const updated = await res.json()
      setVideo(updated)
    } catch (err) {
      console.error('Status update error:', err)
      setSelectedStatus(video.status)
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/contenuti/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Errore eliminazione')
      router.push('/contenuti')
    } catch (err) {
      console.error('Delete error:', err)
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const hashtagList = video?.hashtags
    ? video.hashtags.split(',').map((h) => h.trim()).filter(Boolean)
    : []

  const statusOptions = VIDEO_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-secondary">{error || 'Video non trovato'}</p>
        <Link href="/contenuti">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Torna ai contenuti
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/contenuti"
        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Contenuti TikTok
      </Link>

      {/* Title and status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`status-${video.status} px-3 py-1 rounded-full text-xs font-semibold`}>
              {VIDEO_STATUSES.find((s) => s.value === video.status)?.label || video.status}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{video.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
            Elimina
          </Button>
        </div>
      </div>

      {/* Main info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Destination */}
          {video.destination && (
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-light rounded-xl p-2.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Destinazione</p>
                    <Link
                      href={`/destinazioni/${video.destination.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {video.destination.name}, {video.destination.country}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {video.description && (
            <Card>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="bg-surface rounded-xl p-2.5 shrink-0">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary mb-1">Descrizione</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hashtags */}
          {hashtagList.length > 0 && (
            <Card>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="bg-surface rounded-xl p-2.5 shrink-0">
                    <Hash className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary mb-2">Hashtags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {hashtagList.map((tag) => (
                        <Badge key={tag} variant="primary">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {video.notes && (
            <Card>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="bg-surface rounded-xl p-2.5 shrink-0">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary mb-1">Note</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {video.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Linked offers */}
          {video.videoOffers.length > 0 && (
            <Card>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#ff9f0a]/10 rounded-xl p-2.5">
                    <Tag className="w-4 h-4 text-[#ff9f0a]" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Offerte collegate</p>
                    <p className="text-sm font-semibold">
                      {video.videoOffers.length}{' '}
                      {video.videoOffers.length === 1 ? 'offerta' : 'offerte'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 ml-[52px]">
                  {video.videoOffers.map((vo) => (
                    <div
                      key={vo.id}
                      className="flex items-center justify-between bg-surface rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {vo.offer.title}
                        </p>
                        {vo.offer.destination && (
                          <p className="text-xs text-secondary">
                            {vo.offer.destination.name}, {vo.offer.destination.country}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-primary shrink-0 ml-3">
                        {vo.offer.price.toFixed(0)} EUR
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Status change */}
          <Card>
            <CardContent>
              <p className="text-xs text-secondary mb-2 font-medium">Cambia stato</p>
              <div className="space-y-3">
                <Select
                  id="status-change"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                />
                <Button
                  size="sm"
                  className="w-full"
                  disabled={selectedStatus === video.status || savingStatus}
                  onClick={handleStatusSave}
                >
                  {savingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Aggiorna stato
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="space-y-3">
              {video.plannedDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-secondary">Data pianificata</p>
                    <p className="text-sm font-medium">{formatDate(video.plannedDate)}</p>
                  </div>
                </div>
              )}

              {video.publishedDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-success shrink-0" />
                  <div>
                    <p className="text-xs text-secondary">Data pubblicazione</p>
                    <p className="text-sm font-medium">{formatDate(video.publishedDate)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Creato il</p>
                  <p className="text-sm font-medium">{formatDate(video.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TikTok link */}
          {video.tiktokUrl && (
            <Card>
              <CardContent>
                <a
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apri su TikTok
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Elimina video"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Sei sicuro di voler eliminare <strong className="text-foreground">{video.title}</strong>?
            Questa azione non puo essere annullata.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Elimina
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
