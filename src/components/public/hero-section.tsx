'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plane, Hotel, Car, Palmtree } from 'lucide-react'

const TABS = [
  { href: '/pauschalreisen', label: 'Pauschalreisen', icon: Palmtree, active: true },
  { href: '/lastminute', label: 'Last Minute', icon: Plane, active: false },
  { href: '/all-inclusive', label: 'All Inclusive', icon: Hotel, active: false },
  { href: '/mietwagen', label: 'Mietwagen', icon: Car, active: false },
]

export function HeroSection() {
  useEffect(() => {
    if (!document.querySelector('script[src*="c24pp-package-widget63276"]')) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://files.check24.net/widgets/1168044/c24pp-package-widget63276/package.js'
      document.body.appendChild(script)
    }
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-center">
      <Image src="/santorini.png" alt="Urlaubsparadies" fill className="object-cover" priority quality={90} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/30 to-[#0a1a3a]/70" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="flex items-center gap-2 mb-8 sm:mb-10">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab.active
                  ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/25'
                  : 'bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 border border-white/20'
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg max-w-3xl mb-8 sm:mb-10">
          Die besten Urlaubsangebote<br className="hidden sm:block" /> zum besten Preis.
        </h1>

        <div className="max-w-5xl c24-hero-widget">
          <div id="c24pp-package-widget63276" data-target="_blank" data-whitelabel="no"
            data-form="https://www.check24.net/pauschalreisen-vergleich/" />
        </div>
      </div>

      <style jsx global>{`
        /* === Reset outer container === */
        .c24-hero-widget div.c24pp1.c24pp2.c24pp3.c24package {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          background: none !important;
          border: none !important;
        }

        /* === Hide branding === */
        .c24-hero-widget .c24package-logo-wrapper { display: none !important; }
        .c24-hero-widget span.c24package-title { display: none !important; }
        .c24-hero-widget img[src*="view.php"] { position: absolute !important; opacity: 0 !important; pointer-events: none !important; }

        /* ============================================================
           WRAPPER: CSS Grid — 4 columns x 4 rows (label+input per visual row)

           Visual Row 1: [ Reiseziel (cols 1-2)  | Abflughafen (col 3)  | (empty/btn top) ]
           Visual Row 2: [ Hinreise (1) | Rückreise (2) | Reisedauer (3) | Button (4) ]

           Grid rows: 1=label-r1, 2=input-r1, 3=label-r2, 4=input-r2
           ============================================================ */
        .c24-hero-widget div.c24package-wrapper {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr auto !important;
          grid-template-rows: auto auto auto auto !important;
          gap: 0 !important;
          background: rgba(255,255,255,0.95) !important;
          border-radius: 16px !important;
          border: none !important;
          box-shadow: 0 20px 60px -12px rgba(0,0,0,0.35) !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          color: #0a1a3a !important;
          text-align: left !important;
        }

        /* All containers become transparent */
        .c24-hero-widget div.c24package-location,
        .c24-hero-widget div.c24package-left,
        .c24-hero-widget div.c24package-right {
          display: contents !important;
        }

        /* ========== VISUAL ROW 1: Reiseziel (cols 1-2) + Abflughafen (col 3) ========== */

        /* Reiseziel label — grid row 1, cols 1-2 */
        .c24-hero-widget div.c24package-location > span {
          grid-column: 1 / 3 !important;
          grid-row: 1 !important;
          padding: 14px 16px 4px 20px !important;
          display: block !important;
        }

        /* Reiseziel input — grid row 2, cols 1-2 */
        .c24-hero-widget input.c24package-location {
          grid-column: 1 / 3 !important;
          grid-row: 2 !important;
          margin: 0 16px 14px 20px !important;
          width: auto !important;
        }

        /* Reiseziel autocomplete dropdown */
        .c24-hero-widget div.c24package-location > ul.ui-autocomplete {
          grid-column: 1 / 3 !important;
          grid-row: 2 !important;
        }

        /* Abflughafen label — grid row 1, col 3 */
        .c24-hero-widget span.c24package-airport {
          grid-column: 3 !important;
          grid-row: 1 !important;
          padding: 14px 16px 4px 16px !important;
          margin: 0 !important;
          border-left: 1px solid #eef0f3 !important;
        }

        /* Abflughafen select — grid row 2, col 3 */
        .c24-hero-widget div.c24package-airport {
          grid-column: 3 !important;
          grid-row: 2 !important;
          padding: 0 16px 14px 16px !important;
          margin: 0 !important;
          width: auto !important;
          border-left: 1px solid #eef0f3 !important;
        }

        /* Divider between visual row 1 and 2 */
        .c24-hero-widget div.c24package-wrapper::before {
          content: '' !important;
          grid-column: 1 / -1 !important;
          grid-row: 2 !important;
          border-bottom: 1px solid #eef0f3 !important;
          pointer-events: none !important;
          align-self: end !important;
          z-index: 0 !important;
        }

        /* ========== VISUAL ROW 2: Hinreise + Rückreise + Reisedauer + Button ========== */

        /* Hinreise label — grid row 3, col 1 */
        .c24-hero-widget span.c24package-dep {
          grid-column: 1 !important;
          grid-row: 3 !important;
          padding: 14px 12px 4px 20px !important;
          margin: 0 !important;
        }

        /* Hinreise input — grid row 4, col 1 */
        .c24-hero-widget div.c24package-dep {
          grid-column: 1 !important;
          grid-row: 4 !important;
          padding: 0 12px 14px 20px !important;
          margin: 0 !important;
          width: auto !important;
          border-right: 1px solid #eef0f3 !important;
        }

        /* Rückreise label — grid row 3, col 2 */
        .c24-hero-widget span.c24package-ret {
          grid-column: 2 !important;
          grid-row: 3 !important;
          padding: 14px 12px 4px 16px !important;
          margin: 0 !important;
        }

        /* Rückreise input — grid row 4, col 2 */
        .c24-hero-widget div.c24package-ret {
          grid-column: 2 !important;
          grid-row: 4 !important;
          padding: 0 12px 14px 16px !important;
          margin: 0 !important;
          width: auto !important;
          border-right: 1px solid #eef0f3 !important;
        }

        /* Reisedauer label — grid row 3, col 3 */
        .c24-hero-widget span.c24package-duration {
          grid-column: 3 !important;
          grid-row: 3 !important;
          padding: 14px 12px 4px 16px !important;
          margin: 0 !important;
        }

        /* Reisedauer select — grid row 4, col 3 */
        .c24-hero-widget div.c24package-duration {
          grid-column: 3 !important;
          grid-row: 4 !important;
          padding: 0 12px 14px 16px !important;
          margin: 0 !important;
          width: auto !important;
          border-right: 1px solid #eef0f3 !important;
        }

        /* Button — col 4, spans visual row 2 (label + input rows) */
        .c24-hero-widget div.c24package-full {
          grid-column: 4 !important;
          grid-row: 3 / 5 !important;
          display: flex !important;
          align-items: stretch !important;
          padding: 0 !important;
          width: auto !important;
        }

        /* ========== INPUT STYLES ========== */
        .c24-hero-widget input.c24package-location,
        .c24-hero-widget input.c24package-dep,
        .c24-hero-widget select.c24package-duration,
        .c24-hero-widget input.c24package-ret,
        .c24-hero-widget select.c24package-airport {
          border: 1.5px solid #d4d8e0 !important;
          border-radius: 8px !important;
          height: 40px !important;
          width: 100% !important;
          padding: 0 10px !important;
          font-size: 14px !important;
          color: #0a1a3a !important;
          background: white !important;
          box-sizing: border-box !important;
          outline: none !important;
          display: inline-block !important;
          transition: border-color 0.15s, box-shadow 0.15s !important;
        }
        .c24-hero-widget input:focus,
        .c24-hero-widget select:focus {
          border-color: #2e75fa !important;
          box-shadow: 0 0 0 3px rgba(46,117,250,0.1) !important;
        }
        .c24-hero-widget input::placeholder {
          color: #9ca3af !important;
        }

        /* ========== BUTTON ========== */
        .c24-hero-widget button.c24package-submit {
          background: #2e75fa !important;
          border: none !important;
          border-radius: 0 0 15px 0 !important;
          padding: 16px 36px !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          color: white !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          width: 100% !important;
          height: 100% !important;
          transition: background 0.15s !important;
          margin: 0 !important;
        }
        .c24-hero-widget button.c24package-submit:hover {
          background: #1a5fe0 !important;
        }

        /* ========== AUTOCOMPLETE ========== */
        .c24-hero-widget .ui-autocomplete {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          box-shadow: 0 12px 30px -6px rgba(0,0,0,0.15) !important;
          max-height: 280px !important;
          overflow-y: auto !important;
          z-index: 9999 !important;
        }
        .c24-hero-widget .ui-autocomplete li.ui-menu-item {
          padding: 10px 14px !important;
          font-size: 13px !important;
          color: #0a1a3a !important;
          border: none !important;
        }
        .c24-hero-widget .ui-autocomplete li:hover,
        .c24-hero-widget .ui-autocomplete li.ui-state-focus {
          background: #f0f4ff !important;
          border: none !important;
        }

        /* ========== DATEPICKER ========== */
        .c24pp1.c24pp2.c24pp3 .ui-datepicker {
          z-index: 9999 !important;
          border-radius: 12px !important;
          box-shadow: 0 12px 30px -6px rgba(0,0,0,0.15) !important;
          background: white !important;
          border: 1px solid #e5e7eb !important;
          padding: 12px !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header {
          background: #2e75fa !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px !important;
          margin-bottom: 8px !important;
          color: white !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-header a {
          color: white !important;
          cursor: pointer !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next {
          width: 28px !important;
          height: 28px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          border: none !important;
          background: rgba(255,255,255,0.2) !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev:hover,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next:hover {
          background: rgba(255,255,255,0.35) !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev { left: 6px !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next { right: 6px !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev span,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next span { display: none !important; }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-prev::after {
          content: '‹' !important; font-size: 20px !important; color: white !important; font-weight: bold !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-next::after {
          content: '›' !important; font-size: 20px !important; color: white !important; font-weight: bold !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker-title {
          color: white !important; font-weight: 700 !important; font-size: 14px !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker th {
          color: #0a1a3a !important; font-size: 11px !important; font-weight: 600 !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a,
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td span {
          color: #0a1a3a !important; font-size: 13px !important; padding: 6px !important;
          text-align: center !important; border-radius: 6px !important;
        }
        .c24pp1.c24pp2.c24pp3 .ui-datepicker td a:hover { background: #e8f0ff !important; }
        .c24pp1.c24pp2.c24pp3 .ui-state-highlight a,
        .c24pp1.c24pp2.c24pp3 .ui-state-active a { background: #2e75fa !important; color: white !important; }
        .c24pp1.c24pp2.c24pp3 .ui-state-disabled span { color: #ccc !important; }

        /* ========== MOBILE: stack vertically ========== */
        @media (max-width: 768px) {
          .c24-hero-widget div.c24package-wrapper {
            display: flex !important;
            flex-direction: column !important;
            border-radius: 14px !important;
            overflow: hidden !important;
          }
          .c24-hero-widget div.c24package-location,
          .c24-hero-widget div.c24package-left,
          .c24-hero-widget div.c24package-right {
            display: block !important;
            width: 100% !important;
            padding: 12px 16px !important;
            border-bottom: 1px solid #eef0f3 !important;
          }
          .c24-hero-widget div.c24package-location > span,
          .c24-hero-widget span.c24package-dep,
          .c24-hero-widget span.c24package-ret,
          .c24-hero-widget span.c24package-duration,
          .c24-hero-widget span.c24package-airport {
            padding: 0 !important;
            margin: 0 0 4px 0 !important;
          }
          .c24-hero-widget input.c24package-location,
          .c24-hero-widget div.c24package-dep,
          .c24-hero-widget div.c24package-ret,
          .c24-hero-widget div.c24package-duration,
          .c24-hero-widget div.c24package-airport {
            padding: 0 !important;
            margin: 0 0 8px 0 !important;
            border: none !important;
          }
          .c24-hero-widget div.c24package-full {
            width: 100% !important;
            padding: 12px 16px !important;
          }
          .c24-hero-widget button.c24package-submit {
            border-radius: 10px !important;
            padding: 14px 24px !important;
          }
          .c24-hero-widget div.c24package-wrapper::before {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
