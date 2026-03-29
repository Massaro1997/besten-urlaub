'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, Video, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { DESTINATION_CATEGORIES } from '@/lib/constants'

interface OfferData {
  id: string
  title: string
  priceFrom: number | null
  affiliateLink: string
  description: string | null
  usedInVideo: boolean
  destination: {
    id: string
    name: string
    country: string
    category: string
  }
}

export function OfferCard({ offer }: { offer: OfferData }) {
  const [copied, setCopied] = useState(false)

  const categoryInfo = DESTINATION_CATEGORIES.find((c) => c.value === offer.destination.category)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(offer.affiliateLink)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = offer.affiliateLink
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card hover className="flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Link href={`/destinazioni/${offer.destination.id}`}>
          <Badge variant="primary" className="cursor-pointer hover:opacity-80 transition-opacity">
            {categoryInfo?.emoji} {offer.destination.name}
          </Badge>
        </Link>
        {offer.usedInVideo && (
          <Badge variant="success">
            <Video className="w-3 h-3" />
            Usato
          </Badge>
        )}
      </div>

      {/* Title */}
      <Link href={`/offerte/${offer.id}`} className="group">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {offer.title}
        </h3>
      </Link>

      {/* Description */}
      {offer.description && (
        <p className="text-sm text-secondary line-clamp-2 mb-3">{offer.description}</p>
      )}

      {/* Price */}
      {offer.priceFrom && (
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-xs text-secondary">a partire da</span>
          <span className="text-xl font-bold text-primary">{formatPrice(offer.priceFrom)}</span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border-light">
        <Button variant="secondary" size="sm" onClick={handleCopyLink} className="flex-1">
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              Copiato!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copia link
            </>
          )}
        </Button>
        <a href={offer.affiliateLink} target="_blank" rel="noopener noreferrer" title="Apri su Check24">
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      </div>
    </Card>
  )
}
