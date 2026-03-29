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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
