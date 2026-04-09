'use client'

import { useEffect, useRef } from 'react'

interface Props {
  offerId: string
  offerTitle: string
  priceFrom: number | null
  affiliateLinkWithSubid: string
  eventId: string
}

/**
 * Fires TikTok Pixel events (ViewContent + AddToCart + CompletePayment)
 * on page load. Used inside the iframe page layout — the parent server
 * component renders the iframe directly, this component just handles tracking.
 */
export function AngebotTrackingPixel({
  offerId,
  offerTitle,
  priceFrom,
  eventId,
}: Omit<Props, 'affiliateLinkWithSubid'>) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    const value = priceFrom || 0
    const contents = [
      {
        content_id: offerId,
        content_type: 'product',
        content_name: offerTitle,
      },
    ]

    // Capture ttclid + external id
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

    // Client-side: fire all events
    try {
      window.ttq?.track('ViewContent', {
        contents,
        value,
        currency: 'EUR',
        event_id: eventId,
      })
      window.ttq?.track('AddToCart', {
        contents,
        value,
        currency: 'EUR',
        event_id: `${eventId}-atc`,
      })
      window.ttq?.track('CompletePayment', {
        contents,
        value,
        currency: 'EUR',
        event_id: `${eventId}-cp`,
      })
    } catch {
      // noop
    }

    // Server-side: fire all events
    const trackData = {
      contentId: offerId,
      contentName: offerTitle,
      value,
      currency: 'EUR',
      url: window.location.href,
      externalId,
      ttclid,
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'ViewContent', eventId, ...trackData }),
      keepalive: true,
    }).catch(() => {})

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'AddToCart', eventId: `${eventId}-atc`, ...trackData }),
      keepalive: true,
    }).catch(() => {})

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'CompletePayment', eventId: `${eventId}-cp`, ...trackData }),
      keepalive: true,
    }).catch(() => {})

    // Persist click to DB
    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        offerId,
        ttclid,
        externalId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        landingUrl: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {})
  }, [offerId, offerTitle, priceFrom, eventId])

  return null
}
