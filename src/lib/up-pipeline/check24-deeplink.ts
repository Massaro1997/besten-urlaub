/**
 * Build Check24 affiliate deeplink per UP deal.
 *
 * Check24 NON ha search API pubblica (verified). Strategia: costruisci URL
 * diretto al Pauschalreisen-Vergleich con params catalogo Check24 + nostro
 * partner ID + tid tracking.
 *
 * Esempio pattern reale (da offers.ts esistente):
 * https://a.check24.net/misc/click.php?aid=18&pid=1168044&tid={TID}
 *   &subid={EVENT_ID}&target_url=https%3A%2F%2Fwww.check24.net%2Fpauschalreisen-vergleich%2F%3F
 *   c24pp_hotel_id={GIATA}&c24pp_adult=2&c24pp_departure_date={FROM}
 *   &c24pp_return_date={TO}&c24pp_travel_duration={NIGHTS}
 */

const PARTNER_ID = '1168044'
const CHECK24_BASE = 'https://a.check24.net/misc/click.php'

export interface BuildDeeplinkParams {
  giataId?: string | null
  destination?: string | null
  nights?: number | null
  priceFrom?: number | null
  tid: string                     // tracking identifier (es. 'up-{slug}')
  airport?: string                // 'BER,FRA,MUC,...' (default deutschland-wide)
  adults?: number                 // default 2
  fromDate?: Date                 // partenza date (default +30gg)
  toDate?: Date                   // return date
}

export function buildCheck24Deeplink(params: BuildDeeplinkParams): string {
  const adults = params.adults || 2
  const nights = params.nights || 7
  const fromDate = params.fromDate || dateInDays(30)
  const toDate = params.toDate || addDays(fromDate, nights)
  const airport = params.airport || 'BER,BRE,CGN,DRS,DTM,DUS,FMM,FMO,FRA,HAJ,HAM,HHN,LEJ,MUC,NUE,PAD,STR'

  // Build target URL params
  const target = new URL('https://www.check24.net/pauschalreisen-vergleich/')
  target.searchParams.set('c24pp_adult', String(adults))
  target.searchParams.set('c24pp_departure_date', isoDate(fromDate))
  target.searchParams.set('c24pp_return_date', isoDate(toDate))
  target.searchParams.set('c24pp_travel_duration', String(nights))
  target.searchParams.set('c24pp_airport', airport)
  if (params.giataId) {
    target.searchParams.set('c24pp_hotel_id', params.giataId)
  }
  target.searchParams.set('pid', PARTNER_ID)
  target.searchParams.set('tid', params.tid)

  // Wrap in click.php tracking
  const click = new URL(CHECK24_BASE)
  click.searchParams.set('aid', '18')
  click.searchParams.set('pid', PARTNER_ID)
  click.searchParams.set('tid', params.tid)
  click.searchParams.set('subid', '{eventId}')      // resolved at runtime
  click.searchParams.set('sub_id', '{eventId}')
  click.searchParams.set('deepId', '{eventId}')
  click.searchParams.set('target_url', target.toString())

  return click.toString()
}

/**
 * Score quanto è probabile che il deal abbia match Check24.
 * GIATA ID = match certo. Solo destination = match probabile. Niente = skip.
 */
export function matchScore(deal: {
  giataId?: string | null
  hotelName?: string | null
  destinationCountry?: string | null
  priceFromUp?: number | null
  nights?: number | null
  partnerName?: string | null
}): { score: number; strategy: string; skip?: string } {
  // Skip flights-only deals (Check24 non ha Flüge nel nostro affiliate)
  if (deal.partnerName === 'ryanair' || deal.partnerName === 'eurowings') {
    return { score: 0, strategy: 'flights_only', skip: 'flights_only' }
  }
  // Skip se prezzo troppo basso (probabilmente flight-only o ticket)
  if (deal.priceFromUp != null && deal.priceFromUp < 100) {
    return { score: 0, strategy: 'price_too_low', skip: 'price_too_low' }
  }

  // Accept ALL Pauschal/Hotels — affiliate link placeholder, user genera manuale
  if (deal.giataId) {
    return { score: 100, strategy: 'giata_placeholder' }
  }
  if (deal.hotelName) {
    return { score: 60, strategy: 'hotel_placeholder' }
  }
  return { score: 30, strategy: 'destination_placeholder' }
}

function dateInDays(days: number): Date {
  return addDays(new Date(), days)
}
function addDays(d: Date, days: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + days)
  return r
}
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
