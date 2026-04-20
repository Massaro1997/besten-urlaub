'use client'

import { useState, useMemo } from 'react'
import { Calendar, MapPin, Users, Plane, Search } from 'lucide-react'

const CHECK24_PARTNER_ID = '1168044'

const AIRPORTS = [
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
  { code: 'ZRH', name: 'Zürich' },
]

const DURATIONS = [
  { v: 3, l: '3 Nächte' },
  { v: 5, l: '5 Nächte' },
  { v: 7, l: '7 Nächte' },
  { v: 10, l: '10 Nächte' },
  { v: 14, l: '14 Nächte' },
  { v: 21, l: '21 Nächte' },
]

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

function buildCheck24Link({
  destination,
  depDate,
  nights,
  adults,
  airports,
}: {
  destination: string
  depDate: string
  nights: number
  adults: number
  airports: string[]
}) {
  const tid = (destination || 'search').toLowerCase().replace(/\s+/g, '-').slice(0, 30) + '-hero'
  const base = `https://a.check24.net/misc/click.php?aid=18&pid=${CHECK24_PARTNER_ID}&tid=${encodeURIComponent(tid)}`
  const retDate = toISO(addDays(new Date(depDate), nights))
  const qs = new URLSearchParams()
  qs.set('c24pp_adult', String(adults))
  qs.set('c24pp_childrenCount', '0')
  qs.set('c24pp_travel_duration', String(nights))
  qs.set('c24pp_departure_date', depDate)
  qs.set('c24pp_return_date', retDate)
  const airportList = airports.length > 0 ? airports : AIRPORTS.map((a) => a.code)
  qs.set('c24pp_airport', airportList.join(','))
  if (destination) qs.set('c24pp_destination', destination)
  qs.set('pid', CHECK24_PARTNER_ID)
  qs.set('tid', tid)
  const target = `https://www.check24.net/pauschalreisen-vergleich/?${qs.toString()}`
  return `${base}&target_url=${encodeURIComponent(target)}`
}

interface Props {
  variant?: 'desktop' | 'mobile-fullscreen'
}

export function HeroSearchForm({ variant = 'desktop' }: Props) {
  const today = new Date()
  const [destination, setDestination] = useState('')
  const [depDate, setDepDate] = useState(toISO(addDays(today, 30)))
  const [nights, setNights] = useState(7)
  const [adults, setAdults] = useState(2)
  const [airports, setAirports] = useState<string[]>([])
  const [airportsOpen, setAirportsOpen] = useState(false)

  const minDate = toISO(today)
  const link = useMemo(
    () => buildCheck24Link({ destination, depDate, nights, adults, airports }),
    [destination, depDate, nights, adults, airports],
  )

  function toggleAirport(code: string) {
    setAirports((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const airportsLabel =
    airports.length === 0
      ? 'Alle deutschen Flughäfen'
      : airports.length === 1
        ? AIRPORTS.find((a) => a.code === airports[0])?.name || airports[0]
        : `${airports.length} Flughäfen ausgewählt`

  const isMobileFs = variant === 'mobile-fullscreen'
  const padding = isMobileFs ? 'p-5' : 'p-4 sm:p-5'
  const gridGap = isMobileFs ? 'gap-3' : 'gap-2.5'

  return (
    <div className={`${padding} bg-white`}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${gridGap}`}>
        {/* Destination */}
        <Field label="Reiseziel" icon={MapPin}>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ort, Land oder Hotel"
            className="w-full bg-transparent text-[15px] text-[#0a1a3a] placeholder:text-[#0a1a3a]/35 focus:outline-none"
          />
        </Field>

        {/* Departure date */}
        <Field label="Früheste Anreise" icon={Calendar}>
          <input
            type="date"
            value={depDate}
            min={minDate}
            onChange={(e) => setDepDate(e.target.value)}
            className="w-full bg-transparent text-[15px] text-[#0a1a3a] focus:outline-none"
          />
        </Field>

        {/* Duration */}
        <Field label="Reisedauer" icon={Plane}>
          <select
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            className="w-full bg-transparent text-[15px] text-[#0a1a3a] focus:outline-none appearance-none cursor-pointer"
          >
            {DURATIONS.map((d) => (
              <option key={d.v} value={d.v}>
                {d.l}
              </option>
            ))}
          </select>
        </Field>

        {/* Adults */}
        <Field label="Reisende" icon={Users}>
          <div className="flex items-center justify-between w-full">
            <span className="text-[15px] text-[#0a1a3a]">
              {adults} {adults === 1 ? 'Erwachsener' : 'Erwachsene'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-full bg-[#0a1a3a]/5 hover:bg-[#0a1a3a]/10 text-[#0a1a3a] flex items-center justify-center text-lg font-semibold leading-none"
                aria-label="Weniger"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setAdults(Math.min(6, adults + 1))}
                className="w-7 h-7 rounded-full bg-[#0a1a3a]/5 hover:bg-[#0a1a3a]/10 text-[#0a1a3a] flex items-center justify-center text-lg font-semibold leading-none"
                aria-label="Mehr"
              >
                +
              </button>
            </div>
          </div>
        </Field>
      </div>

      {/* Airports multi-select */}
      <div className="mt-3 relative">
        <button
          type="button"
          onClick={() => setAirportsOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#0a1a3a]/10 hover:border-[#0a1a3a]/25 bg-white text-left transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Plane className="w-4 h-4 text-[#0a1a3a]/45 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#0a1a3a]/50 font-semibold">Abflughafen</p>
              <p className="text-[15px] text-[#0a1a3a] truncate">{airportsLabel}</p>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-[#0a1a3a]/45 transition-transform ${airportsOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {airportsOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-[#0a1a3a]/10 shadow-xl p-3 z-20 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#0a1a3a]/5">
              <span className="text-xs font-semibold text-[#0a1a3a]">
                {airports.length > 0 ? `${airports.length} ausgewählt` : 'Alle Flughäfen'}
              </span>
              {airports.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAirports([])}
                  className="text-xs text-[#ff6b35] hover:underline"
                >
                  Zurücksetzen
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {AIRPORTS.map((a) => {
                const selected = airports.includes(a.code)
                return (
                  <button
                    key={a.code}
                    type="button"
                    onClick={() => toggleAirport(a.code)}
                    className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selected
                        ? 'bg-[#ff6b35]/10 text-[#ff6b35] font-semibold'
                        : 'hover:bg-[#0a1a3a]/5 text-[#0a1a3a]'
                    }`}
                  >
                    {a.name}
                    <span className="text-[10px] ml-1.5 opacity-60">{a.code}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#ff6b35] hover:bg-[#e85d2c] text-white text-[15px] font-bold transition-colors shadow-lg shadow-[#ff6b35]/30 active:scale-[0.98]"
      >
        <Search className="w-4 h-4" />
        Reise finden
      </a>

      <p className="mt-3 text-[11px] text-[#0a1a3a]/45 text-center">
        Buchung über CHECK24 · Bestpreis Garantie · 24h stornierbar
      </p>
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: typeof MapPin
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#0a1a3a]/10 focus-within:border-[#ff6b35] hover:border-[#0a1a3a]/25 bg-white transition-colors">
        <Icon className="w-4 h-4 text-[#0a1a3a]/45 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-[#0a1a3a]/50 font-semibold mb-0.5">{label}</p>
          <div className="text-[15px]">{children}</div>
        </div>
      </div>
    </label>
  )
}
