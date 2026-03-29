'use client'

import { useState, useCallback } from 'react'
import { VIDEO_STATUSES } from '@/lib/constants'
import { VideoCard, type VideoCardData } from './video-card'

interface KanbanBoardProps {
  videos: VideoCardData[]
  onStatusChange: (videoId: string, newStatus: string) => Promise<void>
}

const COLUMN_COLORS: Record<string, { dot: string; dropBg: string; headerBg: string }> = {
  pianificato: {
    dot: 'bg-[#0071e3]',
    dropBg: 'bg-[#0071e3]/5 border-[#0071e3]/30',
    headerBg: 'status-pianificato',
  },
  ripresa: {
    dot: 'bg-[#ff9f0a]',
    dropBg: 'bg-[#ff9f0a]/5 border-[#ff9f0a]/30',
    headerBg: 'status-ripresa',
  },
  montaggio: {
    dot: 'bg-[#7c3aed]',
    dropBg: 'bg-[#7c3aed]/5 border-[#7c3aed]/30',
    headerBg: 'status-montaggio',
  },
  pubblicato: {
    dot: 'bg-[#34c759]',
    dropBg: 'bg-[#34c759]/5 border-[#34c759]/30',
    headerBg: 'status-pubblicato',
  },
}

export function KanbanBoard({ videos, onStatusChange }: KanbanBoardProps) {
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const groupedVideos = VIDEO_STATUSES.reduce(
    (acc, status) => {
      acc[status.value] = videos.filter((v) => v.status === status.value)
      return acc
    },
    {} as Record<string, VideoCardData[]>,
  )

  const handleDragStart = useCallback((e: React.DragEvent, videoId: string) => {
    setDraggedVideoId(videoId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', videoId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(status)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if leaving the column entirely (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, newStatus: string) => {
      e.preventDefault()
      const videoId = e.dataTransfer.getData('text/plain')
      setDraggedVideoId(null)
      setDragOverColumn(null)

      if (!videoId) return

      // Find the video to check if status actually changed
      const video = videos.find((v) => v.id === videoId)
      if (!video || video.status === newStatus) return

      await onStatusChange(videoId, newStatus)
    },
    [videos, onStatusChange],
  )

  const handleDragEnd = useCallback(() => {
    setDraggedVideoId(null)
    setDragOverColumn(null)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {VIDEO_STATUSES.map((status) => {
        const columnVideos = groupedVideos[status.value] || []
        const colors = COLUMN_COLORS[status.value]
        const isOver = dragOverColumn === status.value

        return (
          <div
            key={status.value}
            onDragOver={(e) => handleDragOver(e, status.value)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status.value)}
            className={`
              flex flex-col rounded-2xl border transition-all duration-200 min-h-[300px]
              ${isOver
                ? `${colors.dropBg} border-dashed border-2`
                : 'bg-surface border-border-light'
              }
            `}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                <span className="text-sm font-semibold text-foreground">
                  {status.label}
                </span>
              </div>
              <span className="text-xs font-medium text-secondary bg-surface-elevated px-2 py-0.5 rounded-full">
                {columnVideos.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto">
              {columnVideos.length === 0 && (
                <div className={`
                  flex items-center justify-center h-24 rounded-xl border border-dashed
                  transition-colors duration-200
                  ${isOver ? 'border-primary/40' : 'border-border-light'}
                `}>
                  <p className="text-xs text-secondary">
                    {isOver ? 'Rilascia qui' : 'Nessun video'}
                  </p>
                </div>
              )}

              {columnVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isDragging={draggedVideoId === video.id}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Invisible drag end listener */}
      {draggedVideoId && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          onDragEnd={handleDragEnd}
        />
      )}
    </div>
  )
}
