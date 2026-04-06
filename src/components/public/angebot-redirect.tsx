'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// The Window.ttq type is already declared globally by src/lib/tiktok-pixel.ts

interface Props {
  offerId: string
  offerTitle: string
  priceFrom: number | null
  affiliateLinkWithSubid: string
  eventId: string
}

/**
 * Client-side interstitial: fires AddToCart on the TikTok Pixel
 * (both client-side and server-side via /api/track) then redirects
 * the user to Check24 with the subid attached.
 *
 * This component runs on mobile, desktop, and in-app browsers (TikTok, IG, FB).
 * It is the ONLY place where AddToCart fires for the outbound click — the
 * server-side redirect has been replaced by this so 95% of TikTok traffic
 * (which is mobile) is no longer invisible to the pixel.
 */
export function AngebotRedirect({
  offerId,
  offerTitle,
  priceFrom,
  affiliateLinkWithSubid,
  eventId,
}: Props) {
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

    // 1) Client-side pixel — best effort, may be blocked by adblock/ITP
    try {
      window.ttq?.track('AddToCart', {
        contents,
        value,
        currency: 'EUR',
        event_id: eventId,
      })
    } catch {
      // noop
    }

    // 2) Capture ttclid + cookie-based external id for server-side matching
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

    // 3) Server-side Events API — bulletproof, fires regardless of browser state
    const trackPromise = fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'AddToCart',
        eventId,
        contentId: offerId,
        contentName: offerTitle,
        value,
        currency: 'EUR',
        url: window.location.href,
        externalId,
        ttclid,
      }),
      keepalive: true,
    }).catch(() => undefined)

    // 4) Persist the click to our DB so we can match the postback later
    const clickPromise = fetch('/api/affiliate-click', {
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
    }).catch(() => undefined)

    // 5) Redirect after both fire-and-forget calls settle (capped at 600ms).
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 600))
    Promise.race([Promise.all([trackPromise, clickPromise]), timeout]).finally(() => {
      window.location.replace(affiliateLinkWithSubid)
    })
  }, [offerId, offerTitle, priceFrom, affiliateLinkWithSubid, eventId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center max-w-sm">
        <Image
          src="/symbol.svg"
          alt="Bester Urlaub"
          width={48}
          height={48}
          className="mx-auto mb-4"
        />
        <h1 className="text-lg font-semibold text-[#0a1a3a] mb-1">
          Weiterleitung zu Check24…
        </h1>
        <p className="text-sm text-[#0a1a3a]/60 mb-6 line-clamp-2">
          {offerTitle}
        </p>
        <div className="w-10 h-10 border-4 border-[#0a1a3a]/10 border-t-[#2e75fa] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )
}
