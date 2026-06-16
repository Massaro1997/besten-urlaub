/**
 * Urlaubspiraten.de RSS feed parser.
 * Feed: https://www.urlaubspiraten.de/feed (RSS 2.0, ~60 item rolling, daily refresh)
 * Pattern verified live via chrome-devtools MCP scrape 2026-05-13.
 * NO external deps — regex parser since fields are stable.
 */

export interface UpRssItem {
  title: string
  link: string
  pubDate: Date
  description: string
  category: 'pauschalreisen' | 'hotels' | 'fluege' | 'sonstiges' | 'kreuzfahrten' | 'reise-journal' | 'unknown'
  guid?: string
}

const UP_RSS_URL = 'https://www.urlaubspiraten.de/feed'

export async function fetchUpRss(): Promise<UpRssItem[]> {
  const res = await fetch(UP_RSS_URL, {
    headers: {
      'User-Agent': 'BesterUrlaubBot/1.0 (+https://www.besterurlaub.com)',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`UP RSS fetch failed: ${res.status}`)
  const xml = await res.text()
  return parseUpRss(xml)
}

export function parseUpRss(xml: string): UpRssItem[] {
  const items: UpRssItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, 'title') || ''
    const link = extractTag(block, 'link') || ''
    const pubDateStr = extractTag(block, 'pubDate') || ''
    const description = extractTag(block, 'description') || ''
    if (!link || !title) continue
    items.push({
      title: decodeHtml(title),
      link,
      pubDate: new Date(pubDateStr),
      description: decodeHtml(description),
      category: extractCategory(link),
    })
  }
  return items
}

function extractTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`)
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function extractCategory(url: string): UpRssItem['category'] {
  const m = url.match(/urlaubspiraten\.de\/([a-z\-]+)\//)
  const cat = m?.[1]
  if (cat === 'pauschalreisen' || cat === 'hotels' || cat === 'fluege' ||
      cat === 'sonstiges' || cat === 'kreuzfahrten' || cat === 'reise-journal') {
    return cat
  }
  return 'unknown'
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/**
 * Filter items relevant for Check24 matching:
 * - SOLO pauschalreisen (volo+hotel pacchetto)
 * - Skip hotels-only (manca volo), fluege (solo volo), sonstiges (Disneyland/eventi)
 * User esplicito: deve essere PACCHETTO volo+hotel.
 */
export function filterMatchable(items: UpRssItem[]): UpRssItem[] {
  return items.filter(it => it.category === 'pauschalreisen')
}

/** Extract slug from URL: /pauschalreisen/{slug} → {slug} */
export function extractSlug(url: string): string {
  const m = url.match(/urlaubspiraten\.de\/[a-z\-]+\/([^/?#]+)/)
  return m ? m[1] : url
}
