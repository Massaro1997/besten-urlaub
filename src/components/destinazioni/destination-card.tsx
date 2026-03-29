'use client'

import Link from 'next/link'
import { MapPin, Tag, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DESTINATION_CATEGORIES } from '@/lib/constants'

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

interface DestinationCardProps {
  destination: DestinationWithCounts
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const categoryInfo = DESTINATION_CATEGORIES.find(
    (c) => c.value === destination.category,
  )

  return (
    <Link href={`/destinazioni/${destination.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{destination.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-secondary">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate">{destination.country}</span>
            </div>
          </div>
          {categoryInfo && (
            <Badge variant="primary" className="shrink-0">
              <span>{categoryInfo.emoji}</span>
              <span>{categoryInfo.label}</span>
            </Badge>
          )}
        </div>

        {/* Description */}
        {destination.description && (
          <p className="text-xs text-secondary leading-relaxed line-clamp-2 mb-4">
            {destination.description}
          </p>
        )}

        {/* Footer stats */}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border-light">
          <div className="flex items-center gap-1.5 text-secondary">
            <Tag className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {destination._count.offers} {destination._count.offers === 1 ? 'offerta' : 'offerte'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary">
            <Video className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {destination._count.videos} video
            </span>
          </div>
          {destination.popularity && (
            <div className="ml-auto">
              <span className="text-[10px] text-secondary/60">
                Pop. {destination.popularity}/10
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
