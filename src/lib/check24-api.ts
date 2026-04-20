/**
 * Check24 Partner API polling client.
 *
 * No S2S postback is offered by Check24 (confirmed by affiliate-support lead
 * Philipp Mazur 2026-04-20). Only two integration points exist:
 *
 *   1. Manual CSV export: https://www.check24-partnerprogramm.de/berichte/sales/
 *   2. Structured JSON: https://www.check24-partnerprogramm.de/sales/api/
 *
 * We poll the JSON endpoint on a cron and:
 *   - Match `subid` (attached to affiliate link when click fired) back to
 *     our AffiliateClick.eventId
 *   - Mark row converted=true, fill convValue, convAt
 *   - Fire CompletePayment on TikTok Events API server-side
 *
 * Credentials are loaded from env:
 *   CHECK24_API_USER      — partner login / api user
 *   CHECK24_API_PASSWORD  — api password or token (depends on auth scheme)
 *   CHECK24_API_URL       — full endpoint URL (set once docs are in hand)
 *   CHECK24_POLL_SINCE    — optional ISO date to start polling from
 */

export interface Check24Sale {
  subid: string            // maps to our AffiliateClick.eventId
  revenue?: number         // in EUR
  commission?: number      // what we actually earn
  currency?: string        // EUR default
  status?: 'pending' | 'confirmed' | 'cancelled'
  timestamp?: string       // ISO
  raw?: Record<string, unknown>
}

export async function fetchCheck24Sales(sinceISO?: string): Promise<Check24Sale[]> {
  const url = process.env.CHECK24_API_URL
  const user = process.env.CHECK24_API_USER
  const pass = process.env.CHECK24_API_PASSWORD
  if (!url || !user || !pass) {
    throw new Error('Check24 API env vars not set (CHECK24_API_URL / CHECK24_API_USER / CHECK24_API_PASSWORD)')
  }

  const qs = new URLSearchParams()
  if (sinceISO) qs.set('from', sinceISO)
  const fullUrl = qs.toString() ? `${url}?${qs}` : url

  // Most likely Basic Auth based on typical Check24 affiliate setup.
  // Swap to Bearer / API-Key header once docs confirm.
  const auth = Buffer.from(`${user}:${pass}`).toString('base64')

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Check24 API ${res.status}: ${body.slice(0, 300)}`)
  }

  const data = (await res.json()) as unknown

  // Shape of response is unknown until user shares docs — assume array of rows
  // under a `sales` / `data` key; normalize defensively.
  const rows = extractRows(data)
  return rows.map(normalize)
}

function extractRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    for (const key of ['sales', 'data', 'items', 'results', 'records']) {
      const v = obj[key]
      if (Array.isArray(v)) return v as Record<string, unknown>[]
    }
  }
  return []
}

function normalize(row: Record<string, unknown>): Check24Sale {
  const get = (keys: string[]): unknown => {
    for (const k of keys) if (row[k] !== undefined) return row[k]
    return undefined
  }
  return {
    subid: String(get(['subid', 'sub_id', 'tid', 'partner_sub']) ?? ''),
    revenue: toNum(get(['revenue', 'amount', 'sale_amount', 'umsatz'])),
    commission: toNum(get(['commission', 'provision', 'payout'])),
    currency: (get(['currency', 'waehrung']) as string) || 'EUR',
    status: (get(['status', 'state']) as Check24Sale['status']) || undefined,
    timestamp: (get(['timestamp', 'created_at', 'date', 'datum']) as string) || undefined,
    raw: row,
  }
}

function toNum(v: unknown): number | undefined {
  if (v == null) return undefined
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'))
  return isFinite(n) ? n : undefined
}
