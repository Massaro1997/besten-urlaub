declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void
      identify: (params: Record<string, string>) => void
      page: () => void
    }
  }
}

function getTtq() {
  if (typeof window !== 'undefined' && window.ttq) return window.ttq
  return null
}

export function trackViewContent(offer: { id: string; title: string; priceFrom: number | null }) {
  getTtq()?.track('ViewContent', {
    contents: [
      {
        content_id: offer.id,
        content_type: 'product',
        content_name: offer.title,
      },
    ],
    value: offer.priceFrom || 0,
    currency: 'EUR',
  })
}

export function trackClickButton(offer: { id: string; title: string; priceFrom: number | null }) {
  getTtq()?.track('ClickButton', {
    contents: [
      {
        content_id: offer.id,
        content_type: 'product',
        content_name: offer.title,
      },
    ],
    value: offer.priceFrom || 0,
    currency: 'EUR',
  })
}

export function trackCompletePayment(offer: { id: string; title: string; priceFrom: number | null }) {
  getTtq()?.track('CompletePayment', {
    contents: [
      {
        content_id: offer.id,
        content_type: 'product',
        content_name: offer.title,
      },
    ],
    value: offer.priceFrom || 0,
    currency: 'EUR',
  })
}

export function trackSearch(query: string) {
  getTtq()?.track('Search', {
    search_string: query,
  })
}
