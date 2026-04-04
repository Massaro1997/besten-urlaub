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
 *
 * Check24's affiliate system accepts arbitrary query params and reflects
 * them back in conversion reports under `subid` (sometimes `deepId`,
 * `partnerId2`, or `sub_id` depending on the program). We send all three
 * aliases to maximize compatibility — Check24 will simply ignore the ones
 * it doesn't use.
 *
 * If Check24 rejects extra params for a specific link, falls back to the
 * original link silently (no error).
 */
export function buildAffiliateLinkWithSubid(
  baseLink: string,
  eventId: string,
): string {
  try {
    const url = new URL(baseLink)
    // Multiple aliases — Check24 partner programs use different names.
    url.searchParams.set('subid', eventId)
    url.searchParams.set('sub_id', eventId)
    url.searchParams.set('deepId', eventId)
    // Generic UTM for our own analytics if Check24 preserves them.
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'bestenurlaub')
    }
    if (!url.searchParams.has('utm_medium')) {
      url.searchParams.set('utm_medium', 'affiliate')
    }
    return url.toString()
  } catch {
    return baseLink
  }
}
