import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
  }).format(d)
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDateShort(start)} – ${formatDate(end)}`
}

export function getAirportLabel(code: string): string {
  const airports: Record<string, string> = {
    FRA: 'Frankfurt',
    MUC: 'München',
    DUS: 'Düsseldorf',
    BER: 'Berlin',
    HAM: 'Hamburg',
    STR: 'Stuttgart',
    CGN: 'Köln/Bonn',
    HAJ: 'Hannover',
    NUE: 'Nürnberg',
    LEJ: 'Leipzig',
  }
  return airports[code] || code
}

export function getStarsDisplay(stars: number): string {
  return '★'.repeat(stars) + '☆'.repeat(5 - stars)
}

/**
 * German relative time formatter — "vor 3 Stunden", "vor 2 Tagen".
 * Per FOMO/freshness signal on offer cards (pattern preso da urlaubspiraten.de).
 * Accepts Date | string | number (timestamp ms) | null.
 * Returns "gerade eben" for <1 minute, "vor X Min." up to 60, "vor X Std." up to 24h,
 * "vor X T." up to 7 days, fallback formatDate for older.
 */
export function formatRelativeTime(input: Date | string | number | null | undefined): string {
  if (!input) return ''
  const date = typeof input === 'number' ? new Date(input) : typeof input === 'string' ? new Date(input) : input
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return formatDate(date)
  const sec = Math.floor(diffMs / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const days = Math.floor(hr / 24)
  if (sec < 60) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  if (hr < 24) return `vor ${hr} Std.`
  if (days < 7) return `vor ${days} T.`
  return formatDate(date)
}

/**
 * Deterministic pseudo-publishedAt timestamp from offer.id.
 * Without a real DB publishedAt field, generates a stable "vor X Stunden"
 * value so cards feel fresh + identical between SSR/CSR (no hydration mismatch).
 * Spread between 30 minutes and 5 days ago, biased toward recent.
 */
export function getDeterministicPublishedAt(offerId: string): Date {
  let h = 0
  for (let i = 0; i < offerId.length; i++) h = (h * 31 + offerId.charCodeAt(i)) | 0
  const seed = Math.abs(h)
  // 70% under 24h, 30% 1-5 days. Range: 30min - 120h.
  const hoursAgo = seed % 100 < 70
    ? 0.5 + (seed % 24) // 0.5 - 23.5h
    : 24 + (seed % 96)   // 24 - 119h
  return new Date(Date.now() - hoursAgo * 3600 * 1000)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
