/**
 * Extract departure/return dates from Check24 affiliate links.
 *
 * The affiliate URL contains c24pp_departure_date / c24pp_return_date params
 * (both in the outer querystring and in the URL-encoded `target_url`).
 * We check both and return whichever we find first.
 */

export interface OfferDates {
  departure: Date | null
  ret: Date | null
}

export function extractOfferDates(affiliateLink: string): OfferDates {
  try {
    const url = new URL(affiliateLink)
    // First try the outer query
    let dep = url.searchParams.get('c24pp_departure_date')
    let retS = url.searchParams.get('c24pp_return_date')

    // Fallback: many Check24 links wrap the real URL in target_url (URL-encoded)
    if (!dep || !retS) {
      const target = url.searchParams.get('target_url')
      if (target) {
        const decoded = decodeURIComponent(target)
        const match = decoded.match(/c24pp_departure_date=(\d{4}-\d{2}-\d{2})/)
        const match2 = decoded.match(/c24pp_return_date=(\d{4}-\d{2}-\d{2})/)
        if (match) dep = match[1]
        if (match2) retS = match2[1]
      }
    }

    return {
      departure: dep ? new Date(dep) : null,
      ret: retS ? new Date(retS) : null,
    }
  } catch {
    return { departure: null, ret: null }
  }
}

const MONTHS_DE = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

export function formatOfferDateRange(dates: OfferDates): string | null {
  if (!dates.departure || !dates.ret) return null
  const d = dates.departure
  const r = dates.ret
  const sameMonth = d.getMonth() === r.getMonth() && d.getFullYear() === r.getFullYear()
  if (sameMonth) {
    return `${d.getDate()}. - ${r.getDate()}. ${MONTHS_DE[r.getMonth()]} ${r.getFullYear()}`
  }
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} - ${r.getDate()}. ${MONTHS_DE[r.getMonth()]} ${r.getFullYear()}`
}

/**
 * Days until departure. Negative = past.
 */
export function daysUntilDeparture(dates: OfferDates, now = new Date()): number | null {
  if (!dates.departure) return null
  const ms = dates.departure.getTime() - now.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}
