'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Video, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from '@/components/contenuti/kanban-board'
import type { VideoCardData } from '@/components/contenuti/video-card'

export default function ContenutiPage() {
  const [videos, setVideos] = useState<VideoCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/contenuti')
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setVideos(data)
      setError(null)
    } catch (err) {
      console.error('Fetch videos error:', err)
      setError('Impossibile caricare i video')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleStatusChange = useCallback(
    async (videoId: string, newStatus: string) => {
      // Find the current video to preserve its data for the PUT request
      const video = videos.find((v) => v.id === videoId)
      if (!video) return

      // Optimistic update
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, status: newStatus } : v)),
      )

      try {
        const res = await fetch(`/api/contenuti/${videoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: video.title,
            status: newStatus,
          }),
        })

        if (!res.ok) throw new Error('Errore aggiornamento')

        // Refetch to get fresh data
        await fetchVideos()
      } catch (err) {
        console.error('Status change error:', err)
        // Revert optimistic update
        await fetchVideos()
      }
    },
    [videos, fetchVideos],
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#af52de]/10 rounded-xl p-2.5">
            <Video className="w-5 h-5 text-[#af52de]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Contenuti TikTok</h1>
            <p className="text-secondary text-sm mt-0.5">
              Pianifica e gestisci i tuoi video
            </p>
          </div>
        </div>
        <Link href="/contenuti/nuovo">
          <Button size="md">
            <Plus className="w-4 h-4" />
            Nuovo Video
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-secondary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-secondary text-sm">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => { setLoading(true); fetchVideos() }}>
            Riprova
          </Button>
        </div>
      ) : (
        <KanbanBoard videos={videos} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}
