'use client'

import { useEffect } from 'react'
import { trackInitiateCheckout, trackClickButton, trackAddToCart } from '@/lib/tiktok-pixel'

interface Props {
  offerId: string
  offerTitle: string
  priceFrom: number | null
  affiliateLink: string
}

export function AngebotTracker({ offerId, offerTitle, priceFrom, affiliateLink }: Props) {
  // AddToCart + InitiateCheckout — fire when user lands on /angebot/ page.
  // AddToCart represents strong intent (dwell on detail page), InitiateCheckout represents active booking consideration.
  useEffect(() => {
    const offer = { id: offerId, title: offerTitle, priceFrom }
    trackAddToCart(offer)
    trackInitiateCheckout(offer)
  }, [offerId, offerTitle, priceFrom])

  return (
    <a
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // User is leaving to Check24 — this is a click-out, NOT a purchase.
        // Real CompletePayment fires from the server-side postback when Check24 confirms a booking.
        trackClickButton({ id: offerId, title: offerTitle, priceFrom })
      }}
      className="flex items-center gap-1.5 bg-[#ff6b35] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#e55a2b] transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
      <span className="hidden sm:inline">In neuem Tab öffnen</span>
    </a>
  )
}
