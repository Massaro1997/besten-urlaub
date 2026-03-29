'use client'

import { MapPin, Calendar, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export interface VideoCardData {
  id: string
  title: string
  status: string
  plannedDate: string | null
  destination: { id: string; name: string; country: string } | null
  _count: { videoOffers: number }
}

interface VideoCardProps {
  video: VideoCardData
  isDragging?: boolean
  onDragStart: (e: React.DragEvent, videoId: string) => void
}

export function VideoCard({ video, isDragging, onDragStart }: VideoCardProps) {
  return (
    <a
      href={`/contenuti/${video.id}`}
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart(e, video.id)
      }}
      className={`
        block bg-surface-elevated rounded-xl border border-border-light p-3.5
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        hover:shadow-md hover:border-border
        ${isDragging ? 'opacity-40 scale-95' : ''}
      `}
      onClick={(e) => {
        // Prevent navigation when dragging
        if (isDragging) {
          e.preventDefault()
        }
      }}
    >
      <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
        {video.title}
      </p>

      <div className="mt-2.5 flex flex-col gap-1.5">
        {video.destination && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {video.destination.name}, {video.destination.country}
            </span>
          </div>
        )}

        {video.plannedDate && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{formatDate(video.plannedDate)}</span>
          </div>
        )}

        {video._count.videoOffers > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Tag className="w-3 h-3 shrink-0" />
            <span>
              {video._count.videoOffers} {video._count.videoOffers === 1 ? 'offerta' : 'offerte'}
            </span>
          </div>
        )}
      </div>
    </a>
  )
}
