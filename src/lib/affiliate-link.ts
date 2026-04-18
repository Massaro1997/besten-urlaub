import crypto from 'crypto'

/**
 * Generates a unique event ID used to correlate:
 *   - TikTok Pixel client-side event
 *   - TikTok Events API server-side event
 *   - Check24 affiliate click row in DB
 *   - Check24 postback conversion (when it arrives days later)
 *
 * Format: <ts>-<random> (URL-safe, ~20 chars). Short enough to fit in
 * most affiliate subid parameters which are often capped at 32-50 chars.
 */
export function generateEventId(): string {
  const ts = Date.now().toString(36)
  const rand = crypto.randomBytes(6).toString('hex')
  return `${ts}-${rand}`
}

/**
 * Appends a subid + utm parameters to a Check24 affiliate link.
 */
export function buildAffiliateLinkWithSubid(
  baseLink: string,
  eventId: string,
): string {
  try {
    const url = new URL(baseLink)
    url.searchParams.set('subid', eventId)
    url.searchParams.set('sub_id', eventId)
    url.searchParams.set('deepId', eventId)
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'bestenurlaub')
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'affiliate')
    return url.toString()
  } catch {
    return baseLink
  }
}

/**
 * Rebuild a Check24 affiliate link by overriding the inner target_url query
 * parameters (c24pp_departure_date, c24pp_return_date, c24pp_travel_duration,
 * c24pp_adult, and also the fragment hotelId params). Useful when the user
 * changes dates/travelers in the booking card — we rewrite the url before
 * they click out.
 */
export function overrideCheck24Params(
  baseLink: string,
  overrides: {
    departureDate?: string  // ISO yyyy-mm-dd
    returnDate?: string     // ISO yyyy-mm-dd
    nights?: number
    adults?: number
  },
): string {
  try {
    const outer = new URL(baseLink)
    const targetUrl = outer.searchParams.get('target_url') || ''
    if (!targetUrl) return baseLink
    const inner = new URL(decodeURIComponent(targetUrl))

    if (overrides.departureDate) inner.searchParams.set('c24pp_departure_date', overrides.departureDate)
    if (overrides.returnDate) inner.searchParams.set('c24pp_return_date', overrides.returnDate)
    if (overrides.nights != null) inner.searchParams.set('c24pp_travel_duration', String(overrides.nights))
    if (overrides.adults != null) inner.searchParams.set('c24pp_adult', String(overrides.adults))

    // Also update the inner fragment (after #) since Check24 SPA reads from it
    if (inner.hash) {
      const parts = inner.hash.split('?')
      const hashPath = parts[0]
      const hashQuery = new URLSearchParams(parts[1] || '')
      if (overrides.departureDate) hashQuery.set('departureDate', overrides.departureDate)
      if (overrides.returnDate) hashQuery.set('returnDate', overrides.returnDate)
      if (overrides.nights != null) hashQuery.set('days', String(overrides.nights))
      inner.hash = `${hashPath}?${hashQuery.toString()}`
    }

    outer.searchParams.set('target_url', inner.toString())
    return outer.toString()
  } catch {
    return baseLink
  }
}
