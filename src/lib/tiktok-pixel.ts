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
  const payload: Record<string, unknown> = {
    contents: [
      {
        content_id: offer.id,
        content_type: 'product',
        content_name: offer.title,
      },
    ],
    currency: 'EUR',
  }
  if (offer.priceFrom) payload.value = offer.priceFrom
  return payload
}

function generateEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Get or create anonymous external ID (cookie-based)
function getExternalId(): string {
  if (typeof document === 'undefined') return ''
  const key = 'bu_eid'
  const existing = document.cookie.match(new RegExp(`${key}=([^;]+)`))
  if (existing) return existing[1]
  const id = `bu_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  document.cookie = `${key}=${id};path=/;max-age=31536000;SameSite=Lax`
  return id
}

// Get TikTok click ID from URL (ttclid parameter)
function getTtclid(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  const ttclid = params.get('ttclid') || ''
  if (ttclid) {
    // Store it for later use
    try { sessionStorage.setItem('ttclid', ttclid) } catch {}
  }
  return ttclid || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('ttclid') || '' : '')
}

function trackEvent(event: string, offer: OfferData) {
  const eventId = generateEventId()
  const externalId = getExternalId()
  const ttclid = getTtclid()

  // Client-side pixel
  getTtq()?.track(event, { ...buildContents(offer), event_id: eventId })

  // Server-side via our API with extra matching data
  if (typeof window !== 'undefined') {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        eventId,
        contentId: offer.id,
        contentName: offer.title,
        value: offer.priceFrom || undefined,
        currency: 'EUR',
        url: window.location.href,
        externalId,
        ttclid,
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

export function trackClickOutbound(offer: OfferData) {
  trackEvent('ClickOutbound', offer)
}

export function trackLead(source: string) {
  const eventId = generateEventId()
  const externalId = getExternalId()
  const ttclid = getTtclid()
  getTtq()?.track('Lead', { event_id: eventId, description: source })
  if (typeof window !== 'undefined') {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'Lead',
        eventId,
        contentName: source,
        url: window.location.href,
        externalId,
        ttclid,
      }),
    }).catch(() => {})
  }
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
