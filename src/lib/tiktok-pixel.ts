declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void
      identify: (params: Record<string, string>) => void
      page: () => void
    }
  }
}

type OfferData = { id: string; title: string; priceFrom: number | null }

function getTtq() {
  if (typeof window !== 'undefined' && window.ttq) return window.ttq
  return null
}

function buildContents(offer: OfferData) {
  return {
    contents: [
      {
        content_id: offer.id,
        content_type: 'product',
        content_name: offer.title,
      },
    ],
    value: offer.priceFrom || 0,
    currency: 'EUR',
  }
}

function generateEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Send event both client-side (pixel) and server-side (API)
function trackEvent(event: string, offer: OfferData) {
  const eventId = generateEventId()

  // Client-side pixel
  getTtq()?.track(event, { ...buildContents(offer), event_id: eventId })

  // Server-side via our API (fire and forget)
  if (typeof window !== 'undefined') {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        eventId,
        contentId: offer.id,
        contentName: offer.title,
        value: offer.priceFrom || 0,
        currency: 'EUR',
        url: window.location.href,
      }),
    }).catch(() => {})
  }
}

export function trackViewContent(offer: OfferData) {
  trackEvent('ViewContent', offer)
}

export function trackClickButton(offer: OfferData) {
  trackEvent('ClickButton', offer)
}

export function trackAddToCart(offer: OfferData) {
  trackEvent('AddToCart', offer)
}

export function trackInitiateCheckout(offer: OfferData) {
  trackEvent('InitiateCheckout', offer)
}

export function trackCompletePayment(offer: OfferData) {
  trackEvent('CompletePayment', offer)
}

export function trackSearch(query: string) {
  const eventId = generateEventId()
  getTtq()?.track('Search', { search_string: query, event_id: eventId })
  if (typeof window !== 'undefined') {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'Search', eventId, url: window.location.href }),
    }).catch(() => {})
  }
}
