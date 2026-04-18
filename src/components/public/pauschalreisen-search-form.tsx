'use client'

import { useMemo, useState } from 'react'
import { Plane, Calendar as CalendarIcon, Users, MapPin, Search } from 'lucide-react'

const NAVY = '#0a1a3a'
const ORANGE = '#ff6b35'
const BLUE = '#2e75fa'
const CHECK24_PARTNER_ID = '1168044'

const AIRPORTS: { code: string; name: string }[] = [
  { code: 'FRA', name: 'Frankfurt' },
  { code: 'MUC', name: 'München' },
  { code: 'DUS', name: 'Düsseldorf' },
  { code: 'HAM', name: 'Hamburg' },
  { code: 'BER', name: 'Berlin BER' },
  { code: 'STR', name: 'Stuttgart' },
  { code: 'CGN', name: 'Köln/Bonn' },
  { code: 'HAJ', name: 'Hannover' },
  { code: 'NUE', name: 'Nürnberg' },
  { code: 'LEJ', name: 'Leipzig' },
  { code: 'BRE', name: 'Bremen' },
  { code: 'DTM', name: 'Dortmund' },
  { code: 'VIE', name: 'Wien' },
  { code: 'SZG', name: 'Salzburg' },
  { code: 'ZRH', name: 'Zürich' },
  { code: 'BSL', name: 'Basel' },
]

const DURATIONS: { value: number; label: string }[] = [
  { value: 3, label: '3 Nächte' },
  { value: 5, label: '5 Nächte' },
  { value: 7, label: '7 Nächte' },
  { value: 10, label: '10 Nächte' },
  { value: 14, label: '14 Nächte' },
  { value: 21, label: '21 Nächte' },
]

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function fromISO(s: string): Date | null {
  if (!s) return null
  return new Date(s + 'T00:00:00Z')
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime())
  r.setUTCDate(r.getUTCDate() + n)
  return r
}

function buildSearchLink(params: {
  destination: string
  depDate: Date | null
  retDate: Date | null
  nights: number
  adults: number
  airports: string[]
}): string {
  const tid = (params.destination || 'all').toLowerCase().replace(/\s+/g, '-').slice(0, 30)
  const base = `https://a.check24.net/misc/click.php?aid=18&pid=${CHECK24_PARTNER_ID}&tid=${encodeURIComponent(tid)}-search`
  const search = new URLSearchParams()
  search.set('c24pp_adult', String(params.adults))
  search.set('c24pp_childrenCount', '0')
  search.set('c24pp_travel_duration', String(params.nights))
  if (params.depDate) search.set('c24pp_departure_date', toISO(params.depDate))
  if (params.retDate) search.set('c24pp_return_date', toISO(params.retDate))
  const airportList = params.airports.length > 0 ? params.airports : ['FRA', 'MUC', 'DUS', 'BER', 'HAM', 'STR', 'CGN', 'HAJ', 'NUE', 'LEJ']
  search.set('c24pp_airport', airportList.join(','))
  if (params.destination) search.set('c24pp_destination', params.destination)
  const targetUrl = `https://www.check24.net/pauschalreisen-vergleich/?${search.toString()}&pid=${CHECK24_PARTNER_ID}&tid=${encodeURIComponent(tid)}-search`
  return `${base}&target_url=${encodeURIComponent(targetUrl)}`
}

export function PauschalreisenSearchForm() {
  const today = new Date()
  const defaultDep = addDays(today, 30)
  const defaultRet = addDays(defaultDep, 7)

  const [destination, setDestination] = useState('')
  const [depDate, setDepDate] = useState<Date | null>(defaultDep)
  const [retDate, setRetDate] = useState<Date | null>(defaultRet)
  const [nights, setNights] = useState<number>(7)
  const [adults, setAdults] = useState<number>(2)
  const [airports, setAirports] = useState<string[]>([])

  const link = useMemo(() => buildSearchLink({
    destination,
    depDate,
    retDate,
    nights,
    adults,
    airports,
  }), [destination, depDate, retDate, nights, adults, airports])

  const minDate = toISO(today)

  function toggleAirport(code: string) {
    setAirports((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code])
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(10,26,58,0.6)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(10,26,58,0.15)',
    borderRadius: 10,
    fontSize: 15,
    color: NAVY,
    fontFamily: 'inherit',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 40px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,26,58,0.08)',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: NAVY, margin: 0, letterSpacing: '-0.02em' }}>Pauschalreise suchen</h2>
          <p style={{ fontSize: 13, color: 'rgba(10,26,58,0.6)', margin: '4px 0 0' }}>Flug + Hotel zum besten Preis bei CHECK24 vergleichen.</p>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {/* Reiseziel */}
          <div>
            <label style={labelStyle}>
              <MapPin size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              Reiseziel (optional)
            </label>
            <input
              type="text"
              placeholder="z.B. Mallorca, Kreta, Antalya ..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>
                <CalendarIcon size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                Früheste Anreise
              </label>
              <input
                type="date"
                value={depDate ? toISO(depDate) : ''}
                min={minDate}
                onChange={(e) => setDepDate(fromISO(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <CalendarIcon size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                Späteste Abreise
              </label>
              <input
                type="date"
                value={retDate ? toISO(retDate) : ''}
                min={depDate ? toISO(addDays(depDate, 1)) : minDate}
                onChange={(e) => setRetDate(fromISO(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Duration + adults */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Reisedauer</label>
              <select
                value={nights}
                onChange={(e) => setNights(parseInt(e.target.value, 10))}
                style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'%230a1a3a\' d=\'M6 8 0 0h12z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                <Users size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                Erwachsene
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(10,26,58,0.15)', borderRadius: 10, height: 46, overflow: 'hidden', background: '#fff' }}>
                <button
                  type="button"
                  onClick={() => setAdults((v) => Math.max(1, v - 1))}
                  style={{ width: 46, height: '100%', border: 'none', background: 'transparent', fontSize: 20, fontWeight: 700, color: NAVY, cursor: 'pointer' }}
                  aria-label="Weniger Erwachsene"
                >−</button>
                <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: NAVY }}>{adults}</div>
                <button
                  type="button"
                  onClick={() => setAdults((v) => Math.min(6, v + 1))}
                  style={{ width: 46, height: '100%', border: 'none', background: 'transparent', fontSize: 20, fontWeight: 700, color: NAVY, cursor: 'pointer' }}
                  aria-label="Mehr Erwachsene"
                >+</button>
              </div>
            </div>
          </div>

          {/* Airports */}
          <div>
            <label style={labelStyle}>
              <Plane size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              Abflughafen {airports.length > 0 && <span style={{ color: BLUE, textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>· {airports.length} gewählt</span>}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))', gap: 8 }}>
              {AIRPORTS.map((a) => {
                const selected = airports.includes(a.code)
                return (
                  <button
                    key={a.code}
                    type="button"
                    onClick={() => toggleAirport(a.code)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1,
                      padding: '10px 12px', borderRadius: 10,
                      border: selected ? `1.5px solid ${BLUE}` : '1px solid rgba(10,26,58,0.1)',
                      background: selected ? 'rgba(46,117,250,0.06)' : '#fff',
                      cursor: 'pointer', fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontWeight: 800, color: selected ? BLUE : NAVY, fontSize: 13, letterSpacing: '-0.01em' }}>{a.code}</span>
                    <span style={{ color: 'rgba(10,26,58,0.55)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{a.name}</span>
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(10,26,58,0.5)', margin: '8px 0 0' }}>
              {airports.length === 0 ? 'Keine Auswahl = alle großen deutschen Flughäfen.' : 'Tippe, um Flughafen abzuwählen.'}
            </p>
          </div>

          {/* CTA */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: `linear-gradient(135deg, ${ORANGE} 0%, #e85d2c 100%)`,
              color: '#fff',
              padding: '16px 24px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
              marginTop: 4,
              letterSpacing: '0.3px',
            }}
          >
            <Search size={18} />
            Angebote auf CHECK24 suchen
          </a>
          <p style={{ fontSize: 11, color: 'rgba(10,26,58,0.45)', textAlign: 'center', margin: 0 }}>
            Du wirst zu CHECK24 weitergeleitet. Der Preis bleibt identisch.
          </p>
        </div>
      </div>
    </div>
  )
}
