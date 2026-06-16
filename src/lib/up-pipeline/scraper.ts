/**
 * Scrape detail page UP per estrarre dati factuali:
 * partner URL, GIATA ID, prezzo, hotel name, image OG, JSON-LD Article.
 * NO cheerio dep — regex su HTML statico (UP usa Next.js SSR).
 */

export interface UpDealDetail {
  title: string                // h1 dalla page
  description: string          // meta description
  ogImage: string | null       // og:image (per riferimento)
  ogTitle: string | null
  partnerUrl: string | null    // CTA "ZUM DEAL" href
  partnerName: string | null   // 'weg.de' | 'lastminute' | 'aldiana' | etc
  giataId: string | null       // /productRef=giata:(\d+)/
  hotelName: string | null     // parsed from title or description
  hotelStars: number | null    // 3-5*
  priceFrom: number | null     // 359 from "Ab 359 € p. P."
  nights: number | null        // 4 from "4 Nächte"
  board: string | null         // 'Frühstück' | 'Halbpension' | 'All Inclusive'
  destinationCity: string | null
  destinationCountry: string | null
  publishedAt: Date | null     // from JSON-LD datePublished
  modifiedAt: Date | null      // from JSON-LD dateModified
  author: string | null
}

export async function scrapeUpDeal(url: string): Promise<UpDealDetail> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'BesterUrlaubBot/1.0 (+https://www.besterurlaub.com)',
      'Accept': 'text/html',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`UP scrape failed ${res.status} for ${url}`)
  const html = await res.text()
  return parseUpDealHtml(html)
}

export function parseUpDealHtml(html: string): UpDealDetail {
  // OG meta
  const ogImage = matchOg(html, 'og:image')
  const ogTitle = matchOg(html, 'og:title')
  const metaDesc = matchMeta(html, 'description') || ''

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  const title = h1Match ? stripTags(h1Match[1]) : ogTitle || ''

  // CTA partner URL — cerca "ZUM DEAL" link
  let partnerUrl: string | null = null
  const ctaRegex = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*(?:target="_blank")?[^>]*>\s*(?:<[^>]+>\s*)?(?:ZUM\s+DEAL|JETZT\s+BUCHEN|ZUM\s+ANGEBOT)/i
  const ctaMatch = html.match(ctaRegex)
  if (ctaMatch) partnerUrl = ctaMatch[1]

  // Partner name from URL
  const partnerName = partnerUrl ? detectPartner(partnerUrl) : null

  // GIATA ID from any URL in HTML
  const giataMatch = html.match(/giata[:\=](\d+)/i)
  const giataId = giataMatch ? giataMatch[1] : null

  // Price "Ab X € p. P." or "Ab X €"
  const priceMatch = html.match(/Ab\s+(?:<b>)?([\d.]+(?:,\d+)?)\s*(?:<\/b>)?\s*(?:&nbsp;|\s)?€/i)
  const priceFrom = priceMatch ? parseGermanNumber(priceMatch[1]) : null

  // Nights "X Nächte" or "X Übernachtungen"
  const nightsMatch = (title + ' ' + metaDesc).match(/(\d+)\s*(?:Nächte|Übernachtungen|Tage)/i)
  const nights = nightsMatch ? parseInt(nightsMatch[1]) : null

  // Board
  let board: string | null = null
  const combined = title + ' ' + metaDesc
  if (/All\s*Inclusive/i.test(combined)) board = 'All Inclusive'
  else if (/Halbpension|HP\b/i.test(combined)) board = 'Halbpension'
  else if (/Vollpension|VP\b/i.test(combined)) board = 'Vollpension'
  else if (/Frühstück|HP\+|F\b/i.test(combined)) board = 'Frühstück'

  // Stars "4*" or "5-Sterne"
  const starsMatch = combined.match(/(\d)\s*(?:\*|-?Sterne|Sterne)/i)
  const hotelStars = starsMatch ? parseInt(starsMatch[1]) : null

  // Hotel name — parsing dal titolo (heuristic: phrase senza emoji, dopo ":")
  const hotelName = extractHotelName(title)

  // Destinazione — country flag emoji in title → country
  const destinationCountry = detectCountry(title + ' ' + metaDesc)

  // JSON-LD Article
  let publishedAt: Date | null = null
  let modifiedAt: Date | null = null
  let author: string | null = null
  const jsonLdMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1])
      if (data.datePublished) publishedAt = new Date(data.datePublished)
      if (data.dateModified) modifiedAt = new Date(data.dateModified)
      if (data.author?.name) author = data.author.name
    } catch { /* ignore */ }
  }

  return {
    title,
    description: metaDesc,
    ogImage,
    ogTitle,
    partnerUrl,
    partnerName,
    giataId,
    hotelName,
    hotelStars,
    priceFrom,
    nights,
    board,
    destinationCity: null,  // filled later from category matching
    destinationCountry,
    publishedAt,
    modifiedAt,
    author,
  }
}

function matchOg(html: string, prop: string): string | null {
  const re = new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]+)"`, 'i')
  const m = html.match(re)
  return m ? m[1] : null
}

function matchMeta(html: string, name: string): string | null {
  const re = new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]+)"`, 'i')
  const m = html.match(re)
  return m ? m[1] : null
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim()
}

function parseGermanNumber(s: string): number {
  // "1.999" → 1999 | "359,50" → 359.50 | "1.003" → 1003
  if (s.includes(',')) {
    return parseFloat(s.replace(/\./g, '').replace(',', '.'))
  }
  return parseInt(s.replace(/\./g, ''))
}

function detectPartner(url: string): string {
  if (url.includes('weg.de')) return 'weg.de'
  if (url.includes('lastminute.de')) return 'lastminute'
  if (url.includes('aldiana.com')) return 'aldiana'
  if (url.includes('tui.com')) return 'tui'
  if (url.includes('b7ohif.net') || url.includes('secret-escapes')) return 'awin-se'
  if (url.includes('ryanair.com')) return 'ryanair'
  if (url.includes('eurowings.com')) return 'eurowings'
  if (url.includes('aida.de')) return 'aida'
  if (url.includes('travelcircus')) return 'travelcircus'
  if (url.includes('animod.de')) return 'animod'
  if (url.includes('journaway.com')) return 'journaway'
  return new URL(url).hostname
}

function extractHotelName(title: string): string | null {
  // Heuristics: "X im [HOTEL NAME] 4*" or "[HOTEL NAME]: 7 Tage"
  // Strip emoji + flags + special chars
  const cleaned = title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim()
  // Pattern "im {X}" or "{X} {N}*"
  const imMatch = cleaned.match(/im\s+([\w\s\-\.]+?)(?:\s+\d\s*\*|\s+inkl|\s+mit|$)/i)
  if (imMatch) return imMatch[1].trim()
  return null
}

function detectCountry(text: string): string | null {
  const flagMap: Record<string, string> = {
    '🇮🇹': 'Italien', '🇪🇸': 'Spanien', '🇬🇷': 'Griechenland', '🇹🇷': 'Türkei',
    '🇩🇪': 'Deutschland', '🇫🇷': 'Frankreich', '🇵🇹': 'Portugal', '🇳🇱': 'Niederlande',
    '🇦🇹': 'Österreich', '🇨🇭': 'Schweiz', '🇭🇷': 'Kroatien', '🇧🇬': 'Bulgarien',
    '🇵🇱': 'Polen', '🇹🇭': 'Thailand', '🇲🇺': 'Mauritius', '🇲🇽': 'Mexiko',
    '🇩🇰': 'Dänemark', '🇿🇦': 'Südafrika', '🇦🇼': 'Aruba', '🇨🇾': 'Zypern',
    '🇹🇿': 'Tansania', '🇩🇴': 'Dominikanische Republik',
  }
  for (const [emoji, country] of Object.entries(flagMap)) {
    if (text.includes(emoji)) return country
  }
  // Keyword fallback
  for (const country of Object.values(flagMap)) {
    if (new RegExp(`\\b${country}\\b`, 'i').test(text)) return country
  }
  return null
}
