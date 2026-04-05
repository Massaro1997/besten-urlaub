/**
 * Check24 affiliate link coherence fixer.
 *
 * The Check24 Linkgenerator has a known bug: when you change hotel/area in
 * its form, the inner deep link (after the `#`) updates but the outer query
 * string (before the `#`) keeps the dates/region from the previous search.
 * This silent corruption creates links where:
 *
 *   - Desktop Check24 (SPA) reads the inner deep link    → shows correct offer
 *   - Mobile  Check24         reads the outer query      → shows the WRONG offer
 *
 * This utility detects the mismatch and copies the inner (correct) values
 * over the stale outer ones, so both mobile and desktop see the same thing.
 *
 * Used by:
 *   - scripts/apply-new-links.ts  (auto-fix when adding new links)
 *   - scripts/fix-check24-link-coherence.ts (one-off batch fix on DB)
 */

function parseQS(s: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const part of s.split('&')) {
    if (!part) continue
    const eq = part.indexOf('=')
    const k = eq < 0 ? part : part.slice(0, eq)
    const v = eq < 0 ? '' : part.slice(eq + 1)
    try {
      out.set(decodeURIComponent(k), decodeURIComponent(v))
    } catch {
      out.set(k, v)
    }
  }
  return out
}

function buildQS(params: Map<string, string>): string {
  const parts: string[] = []
  for (const [k, v] of params) {
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  }
  return parts.join('&')
}

export interface FixResult {
  /** The possibly-rewritten affiliate link. Same as input when no fix was needed. */
  fixed: string
  /** True if the link was actually rewritten. */
  changed: boolean
  /** Human-readable explanation of what happened. */
  note: string
}

/**
 * Given a Check24 click.php affiliate link, checks whether the outer query
 * params (read by Check24 mobile) and the inner deep link (read by Check24
 * desktop SPA) are coherent. If not, rewrites the outer to match the inner.
 *
 * Always safe: returns the original link unchanged when:
 *   - the URL is not a Check24 click.php
 *   - there is no target_url param
 *   - there is no inner deep link (no `#`)
 *   - inner has no date info to copy over
 *   - outer and inner are already coherent
 */
export function fixCheck24LinkCoherence(original: string): FixResult {
  let clickUrl: URL
  try {
    clickUrl = new URL(original)
  } catch {
    return { fixed: original, changed: false, note: 'not a valid URL' }
  }

  const targetUrl = clickUrl.searchParams.get('target_url')
  if (!targetUrl) {
    return { fixed: original, changed: false, note: 'no target_url' }
  }

  const hashIdx = targetUrl.indexOf('#')
  if (hashIdx < 0) {
    return { fixed: original, changed: false, note: 'no inner deep link' }
  }

  const outerPart = targetUrl.slice(0, hashIdx)
  const innerPart = targetUrl.slice(hashIdx + 1)

  const [outerBase, outerQS = ''] = outerPart.split('?')
  const [, innerQS = ''] = innerPart.split('?')

  const outer = parseQS(outerQS)
  const inner = parseQS(innerQS)

  const outerDep = outer.get('c24pp_departure_date')
  const outerRet = outer.get('c24pp_return_date')
  const innerDep = inner.get('departureDate')
  const innerRet = inner.get('returnDate')

  if (!innerDep || !innerRet) {
    return { fixed: original, changed: false, note: 'inner has no dates' }
  }
  if (outerDep === innerDep && outerRet === innerRet) {
    return { fixed: original, changed: false, note: 'already coherent' }
  }

  // Override outer with inner truth
  outer.set('c24pp_departure_date', innerDep)
  outer.set('c24pp_return_date', innerRet)

  const innerArea = inner.get('areaId')
  const innerCountry = inner.get('countryId')
  const innerHotel = inner.get('hotelId')
  if (innerArea) outer.set('c24pp_region_id', innerArea)
  if (innerCountry) outer.set('c24pp_country_id', innerCountry)
  if (innerHotel) outer.set('c24pp_hotel_id', innerHotel)

  const fixedTargetUrl = `${outerBase}?${buildQS(outer)}#${innerPart}`
  clickUrl.searchParams.set('target_url', fixedTargetUrl)

  return {
    fixed: clickUrl.toString(),
    changed: true,
    note: `dates ${outerDep || '(none)'}→${innerDep} / ${outerRet || '(none)'}→${innerRet}`,
  }
}
