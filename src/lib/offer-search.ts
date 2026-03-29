import Anthropic from '@anthropic-ai/sdk'

const CHECK24_PARTNER_ID = '1168044'

export interface SuggestedOffer {
  destination: string
  country: string
  title: string
  description: string
  priceFrom: number
  duration: string
  hotel: string
  hotelStars: number
  mealPlan: string
  airport: string
  source: string
  affiliateLink: string
}

function buildCheck24Link(params: {
  destination: string
  regionId?: string
  cityId?: string
  departureDate?: string
  returnDate?: string
  duration?: string
}): string {
  const base = `https://a.check24.net/misc/click.php?aid=18&pid=${CHECK24_PARTNER_ID}&tid=${encodeURIComponent(params.destination)}-auto`
  const search = new URLSearchParams()
  search.set('c24pp_adult', '2')
  search.set('c24pp_childrenCount', '0')
  if (params.duration) search.set('c24pp_travel_duration', params.duration)
  // Use all major German airports
  search.set('c24pp_airport', 'FRA,MUC,DUS,BER,HAM,STR,CGN,HAJ,NUE,LEJ')

  const targetUrl = `https://www.check24.net/pauschalreisen-vergleich/?${search.toString()}&pid=${CHECK24_PARTNER_ID}&tid=${encodeURIComponent(params.destination)}-auto`
  return `${base}&target_url=${encodeURIComponent(targetUrl)}`
}

export async function searchBestOffers(apiKey: string): Promise<SuggestedOffer[]> {
  const client = new Anthropic({ apiKey })

  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const threeMonths = new Date(today)
  threeMonths.setMonth(threeMonths.getMonth() + 3)

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    system: `Du bist ein Reise-Deal-Experte. Deine Aufgabe ist es, die aktuell besten Pauschalreise-Angebote für deutsche Urlauber zu finden und vorzuschlagen.

Konzentriere dich auf:
- Beliebte Destinationen (Mallorca, Antalya, Hurghada, Sharm el Sheikh, Kreta, Sardinien, Kanaren, etc.)
- Realistische Preise für Pauschalreisen (Flug + Hotel) ab deutschen Flughäfen
- Angebote die aktuell im Zeitraum ${nextMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} bis ${threeMonths.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} verfügbar wären
- 4-5 Sterne Hotels mit guten Bewertungen
- All Inclusive oder Halbpension bevorzugt

Antworte NUR mit einem JSON-Array. Kein anderer Text. Jedes Objekt hat:
{
  "destination": "Stadtname",
  "country": "Land",
  "title": "Ansprechender deutscher Titel (max 80 Zeichen)",
  "description": "Kurze Beschreibung (max 200 Zeichen)",
  "priceFrom": Preis als Zahl (realistisch, pro Person),
  "duration": "7" oder "8" oder "14" (Tage),
  "hotel": "Hotelname",
  "hotelStars": 4 oder 5,
  "mealPlan": "All Inclusive" oder "Halbpension" oder "Frühstück",
  "airport": "Alle deutschen Flughäfen",
  "source": "Marktrecherche"
}

Gib genau 8 Angebote zurück. Variiere die Destinationen. Preise müssen realistisch sein (z.B. Mallorca 7 Tage AI ab 499€, Antalya 7 Tage AI ab 399€, etc.)`,
    messages: [
      {
        role: 'user',
        content: `Finde die 8 besten aktuellen Pauschalreise-Angebote für deutsche Urlauber. Zeitraum: ${nextMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} bis ${threeMonths.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}. Nur JSON-Array zurückgeben.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  try {
    const raw = JSON.parse(jsonMatch[0]) as Array<{
      destination: string
      country: string
      title: string
      description: string
      priceFrom: number
      duration: string
      hotel: string
      hotelStars: number
      mealPlan: string
      airport: string
      source: string
    }>

    return raw.map((item) => ({
      ...item,
      affiliateLink: buildCheck24Link({
        destination: item.destination,
        duration: `${item.duration}d`,
      }),
    }))
  } catch {
    return []
  }
}
