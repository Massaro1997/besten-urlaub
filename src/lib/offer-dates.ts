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
    // Decode the wrapped target_url to access both flat params AND the
    // SPA hash fragment, which contains the AUTHORITATIVE return date.
    // Check24 links carry two return dates:
    //   - c24pp_return_date (search trigger, often off by 1+ days)
    //   - returnDate=YYYY-MM-DD inside the hash fragment (real check-out)
    // Always prefer the fragment value when present.
    let dep = url.searchParams.get('c24pp_departure_date')
    let retS = url.searchParams.get('c24pp_return_date')
    let fragmentRet: string | null = null
    let fragmentDep: string | null = null

    const target = url.searchParams.get('target_url')
    if (target) {
      const decoded = decodeURIComponent(target)
      if (!dep) {
        const m = decoded.match(/c24pp_departure_date=(\d{4}-\d{2}-\d{2})/)
        if (m) dep = m[1]
      }
      if (!retS) {
        const m = decoded.match(/c24pp_return_date=(\d{4}-\d{2}-\d{2})/)
        if (m) retS = m[1]
      }
      // Fragment overrides (real check-out date used by Check24 SPA)
      const fRet = decoded.match(/[?&#]returnDate=(\d{4}-\d{2}-\d{2})/)
      if (fRet) fragmentRet = fRet[1]
      const fDep = decoded.match(/[?&#]departureDate=(\d{4}-\d{2}-\d{2})/)
      if (fDep) fragmentDep = fDep[1]
    }

    const finalDep = fragmentDep || dep
    const finalRet = fragmentRet || retS

    return {
      departure: finalDep ? new Date(finalDep) : null,
      ret: finalRet ? new Date(finalRet) : null,
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
