'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Plus, ExternalLink, Trash2, Image } from 'lucide-react'
import Link from 'next/link'

interface Creative {
  id: string
  designType: string
  canvaDesignId: string | null
  editUrl: string | null
  exportUrl: string | null
  thumbnailUrl: string | null
  queryUsed: string | null
  createdAt: string
  destination: { name: string; country: string } | null
}

const designTypeLabels: Record<string, string> = {
  tiktok_story: 'TikTok Story',
  instagram_post: 'Instagram Post',
  poster: 'Poster',
}

export default function CreativiPage() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/creativi')
      .then((r) => r.json())
      .then(setCreatives)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo creativo?')) return
    await fetch(`/api/creativi/${id}`, { method: 'DELETE' })
    setCreatives((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creativi</h1>
          <p className="text-sm text-secondary mt-1">
            Template visivi per i tuoi video TikTok
          </p>
        </div>
        <Link href="/creativi/nuovo">
          <Button>
            <Plus className="w-4 h-4" />
            Nuovo Creativo
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : creatives.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Palette className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
            <p className="text-lg font-medium">Nessun creativo generato</p>
            <p className="text-sm text-secondary mt-1 mb-4">
              Genera il tuo primo template per TikTok con Canva AI
            </p>
            <Link href="/creativi/nuovo">
              <Button>
                <Plus className="w-4 h-4" />
                Genera Creativo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creatives.map((creative) => (
            <Card key={creative.id} hover>
              {/* Thumbnail */}
              <div className="aspect-[9/16] max-h-48 bg-surface rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {creative.thumbnailUrl ? (
                  <img
                    src={creative.thumbnailUrl}
                    alt="Anteprima"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Image className="w-10 h-10 text-secondary/20" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">
                    {designTypeLabels[creative.designType] || creative.designType}
                  </Badge>
                  {creative.destination && (
                    <Badge>{creative.destination.name}</Badge>
                  )}
                </div>

                <p className="text-xs text-secondary">
                  {new Date(creative.createdAt).toLocaleDateString('it-IT')}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {creative.editUrl && (
                    <a
                      href={creative.editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Apri in Canva
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(creative.id)}
                    className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-secondary hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
