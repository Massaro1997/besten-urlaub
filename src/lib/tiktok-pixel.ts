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

// Step 1: User sees the offer card (scroll into view)
export function trackViewContent(offer: OfferData) {
  getTtq()?.track('ViewContent', buildContents(offer))
}

// Step 2: User clicks "Zum Angebot"
export function trackClickButton(offer: OfferData) {
  getTtq()?.track('ClickButton', buildContents(offer))
}

// Step 3: User adds to cart (= clicks to see the offer detail)
export function trackAddToCart(offer: OfferData) {
  getTtq()?.track('AddToCart', buildContents(offer))
}

// Step 4: User initiates checkout (= lands on /angebot/[id] page with Check24 iframe)
export function trackInitiateCheckout(offer: OfferData) {
  getTtq()?.track('InitiateCheckout', buildContents(offer))
}

// Step 5: User completes payment (= opens Check24 in new tab or interacts with iframe)
export function trackCompletePayment(offer: OfferData) {
  getTtq()?.track('CompletePayment', buildContents(offer))
}

export function trackSearch(query: string) {
  getTtq()?.track('Search', { search_string: query })
}
