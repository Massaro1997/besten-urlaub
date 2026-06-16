'use client'

import { useRef } from 'react'
import { generateEventId, buildAffiliateLinkWithSubid } from '@/lib/affiliate-link'

interface Props {
  /** Base Check24 url WITHOUT subid params (we add subid + tid dynamically). */
  baseHref: string
  /** Source identifier (e.g. "mobile-hero-pauschal") — used as fallback subid if no DB row matches and for human-readable debug. */
  source: string
  /** Display category for tracking ("Pauschalreise" | "Mietwagen" | "Hotel" | ...). */
  product?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

/**
 * CTA outbound to Check24 with dynamic per-click eventId logging.
 *
 * 1. Generate fresh eventId per click (sourceSlug-ts-random)
 * 2. POST /api/affiliate-click with ttclid + UA + referrer
 * 3. Append subid to Check24 link
 * 4. Open in new tab
 *
 * Falls back to direct navigation if anything throws.
 */
export function TrackedCheck24CTA({
  baseHref,
  source,
  product,
  className,
  style,
  children,
}: Props) {
  const inflight = useRef(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (inflight.current) return
    inflight.current = true
    e.preventDefault()

    let ttclid = ''
    let externalId = ''
    try {
      const params = new URLSearchParams(window.location.search)
      ttclid = params.get('ttclid') || sessionStorage.getItem('ttclid') || ''
      if (ttclid) sessionStorage.setItem('ttclid', ttclid)
      const match = document.cookie.match(/bu_eid=([^;]+)/)
      if (match) {
        externalId = match[1]
      } else {
        externalId = `bu_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        document.cookie = `bu_eid=${externalId};path=/;max-age=31536000;SameSite=Lax`
      }
    } catch {
      // noop
    }

    const eventId = `${source}-${generateEventId()}`
    const linkWithSubid = buildAffiliateLinkWithSubid(baseHref, eventId)

    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        offerId: null,
        ttclid,
        externalId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        landingUrl: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {})

    if (product) {
      try {
        window.ttq?.track('ClickButton', {
          content_name: source,
          content_category: product,
          event_id: eventId,
          ...(ttclid ? { ttclid } : {}),
          ...(externalId ? { external_id: externalId } : {}),
        })
      } catch {
        // noop
      }
    }

    window.open(linkWithSubid, '_blank', 'noopener,noreferrer')
    inflight.current = false
  }

  return (
    <a
      href={baseHref}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  )
}
