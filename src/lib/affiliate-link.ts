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

const AWIN_AFFID = '2837966'
const AWIN_CHECK24_MID = '9364'

/**
 * Wrap a Check24 target URL (or any target) into an Awin affiliate deeplink.
 * Awin passes `clickref` back to us in the postback — we use it as our subid.
 *
 *   https://www.awin1.com/cread.php?awinmid=9364&awinaffid=2837966&clickref=<eventId>&ued=<encoded target>
 */
export function buildAwinLink(targetUrl: string, eventId: string): string {
  const params = new URLSearchParams()
  params.set('awinmid', AWIN_CHECK24_MID)
  params.set('awinaffid', AWIN_AFFID)
  params.set('clickref', eventId)
  params.set('ued', targetUrl)
  return `https://www.awin1.com/cread.php?${params.toString()}`
}

/**
 * Detects if a stored affiliate link is an Awin wrapper.
 */
export function isAwinLink(link: string): boolean {
  return /awin1\.com\/(c|aw)read|awinaffid=/i.test(link)
}

/**
 * Extracts the inner Check24 target URL from any affiliate wrapper
 * (Awin `ued`, or Check24 `a.check24.net/misc/click.php?target_url=`).
 * Returns null if the input is already a direct Check24 URL.
 */
export function extractCheck24Target(link: string): string | null {
  try {
    const url = new URL(link)
    if (url.hostname.includes('awin1.com')) {
      const ued = url.searchParams.get('ued')
      return ued ? decodeURIComponent(ued) : null
    }
    if (url.hostname.includes('a.check24.net')) {
      const target = url.searchParams.get('target_url')
      return target ? decodeURIComponent(target) : null
    }
    return null
  } catch {
    return null
  }
}

/**
 * Appends a subid to an affiliate link.
 * For Awin links → overwrites `clickref`.
 * For legacy direct Check24 links → sets `subid` / `sub_id` / `deepId` on the wrapper URL.
 */
export function buildAffiliateLinkWithSubid(
  baseLink: string,
  eventId: string,
): string {
  try {
    const url = new URL(baseLink)

    // Awin wrapper — overwrite clickref
    if (url.hostname.includes('awin1.com')) {
      url.searchParams.set('clickref', eventId)
      return url.toString()
    }

    // Legacy Check24 direct
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
// Check24 board code mapping (minimum-board filter)
// 0 = none, 1 = Übernachtung, 2 = Frühstück, 3 = Halbpension, 4 = Halbpension+,
// 5 = Vollpension, 6 = Vollpension+, 7 = All Inclusive, 8 = AI Plus
function boardToCode(board: string): string | null {
  const map: Record<string, string> = {
    'Frühstück': '2',
    'Fruehstueck': '2',
    'BB': '2',
    'Halbpension': '3',
    'HP': '3',
    'Vollpension': '5',
    'VP': '5',
    'All Inclusive': '7',
    'Alles inklusive': '7',
    'AI': '7',
  }
  return map[board] || null
}

export function overrideCheck24Params(
  baseLink: string,
  overrides: {
    departureDate?: string  // ISO yyyy-mm-dd
    returnDate?: string     // ISO yyyy-mm-dd
    nights?: number
    adults?: number
    board?: string          // 'All Inclusive' | 'Halbpension' | 'Frühstück' ...
    airports?: string[]     // IATA codes: ['HAM', 'FRA', ...]
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
    if (overrides.adults != null) {
      inner.searchParams.set('c24pp_adult', String(overrides.adults))
      inner.searchParams.set('c24pp_childrenCount', '0')
    }
    if (overrides.board) {
      const code = boardToCode(overrides.board)
      if (code) {
        inner.searchParams.set('c24pp_board_minimum', code)
        inner.searchParams.set('c24pp_board', code)
      }
    }
    if (overrides.airports && overrides.airports.length > 0) {
      inner.searchParams.set('c24pp_airport', overrides.airports.join(','))
    }

    // Also update the inner fragment (after #) since Check24 SPA reads from it
    if (inner.hash) {
      const parts = inner.hash.split('?')
      const hashPath = parts[0]
      const hashQuery = new URLSearchParams(parts[1] || '')
      if (overrides.departureDate) hashQuery.set('departureDate', overrides.departureDate)
      if (overrides.returnDate) hashQuery.set('returnDate', overrides.returnDate)
      if (overrides.nights != null) hashQuery.set('days', String(overrides.nights))
      if (overrides.adults != null) {
        const alloc = Array(overrides.adults).fill('A').join('-')
        hashQuery.set('roomAllocation', alloc)
        hashQuery.set('adults', String(overrides.adults))
      }
      if (overrides.board) {
        const code = boardToCode(overrides.board)
        if (code) {
          hashQuery.set('boardMinimum', code)
          hashQuery.set('board', code)
        }
      }
      if (overrides.airports && overrides.airports.length > 0) {
        hashQuery.set('airport', overrides.airports.join(','))
      }
      inner.hash = `${hashPath}?${hashQuery.toString()}`
    }

    outer.searchParams.set('target_url', inner.toString())
    return outer.toString()
  } catch {
    return baseLink
  }
}
