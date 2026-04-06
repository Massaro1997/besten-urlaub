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
    // Load Check24 widget CSS
    if (!document.querySelector('link[href*="check24.net/widgets/package.css"]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.type = 'text/css'
      css.href = 'https://files.check24.net/widgets/package.css'
      document.head.appendChild(css)
    }

    // Load Check24 widget JS (uses the specific widget ID from the partner embed code)
    if (!document.querySelector('script[src*="c24pp-package-widget"]')) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://files.check24.net/widgets/1168044/c24pp-package-widget/package.js'
      document.body.appendChild(script)
    }
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-center">
      {/* Background image */}
      <Image
        src="/santorini.png"
        alt="Urlaubsparadies"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/30 to-[#0a1a3a]/70" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        {/* Category tab pills */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                tab.active
                  ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/25'
                  : 'bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg max-w-3xl mb-8 sm:mb-10">
          Die besten Urlaubsangebote
          <br className="hidden sm:block" />
          {' '}zum besten Preis.
        </h1>

        {/* Check24 Package Widget — real functional search */}
        <div className="max-w-5xl c24-hero-widget">
          <div
            id="c24pp-package-widget"
            data-target="_blank"
            data-whitelabel="no"
            data-form="https://www.check24.net/pauschalreisen-vergleich/"
          />
        </div>
      </div>

      {/* Style overrides to make the 300px Check24 widget full-width and match our hero */}
      <style jsx global>{`
        /* Make widget full width instead of fixed 300px */
        .c24-hero-widget div.c24pp1.c24pp2.c24pp3.c24package {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          background-image: none !important;
          background-color: transparent !important;
          border: none !important;
          border-radius: 12px !important;
          overflow: visible !important;
        }

        /* Restyle the inner wrapper to look like Check24 hero search bar */
        .c24-hero-widget div.c24package-wrapper {
          background: white !important;
          border-radius: 12px !important;
          border: 2px solid #0a1a3a !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
          padding: 16px 20px !important;
          margin: 0 !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          align-items: flex-end !important;
        }

        /* Hide the Check24 logo and title inside the widget */
        .c24-hero-widget .c24package-logo-wrapper {
          display: none !important;
        }
        .c24-hero-widget span.c24package-title {
          display: none !important;
        }

        /* Style all labels */
        .c24-hero-widget span.c24package-dep,
        .c24-hero-widget span.c24package-duration,
        .c24-hero-widget span.c24package-ret,
        .c24-hero-widget span.c24package-airport,
        .c24-hero-widget div.c24package-location > span:first-child {
          font-size: 10px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.08em !important;
          color: rgba(10, 26, 58, 0.5) !important;
          font-weight: 600 !important;
          margin: 0 0 4px 0 !important;
          display: block !important;
        }

        /* Style all inputs and selects */
        .c24-hero-widget input.c24package-location,
        .c24-hero-widget input.c24package-dep,
        .c24-hero-widget input.c24package-ret,
        .c24-hero-widget select.c24package-duration,
        .c24-hero-widget select.c24package-airport {
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          height: 42px !important;
          padding: 0 12px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #0a1a3a !important;
          background-color: #fff !important;
          width: 100% !important;
        }
        .c24-hero-widget input.c24package-location:focus,
        .c24-hero-widget input.c24package-dep:focus,
        .c24-hero-widget input.c24package-ret:focus,
        .c24-hero-widget select.c24package-duration:focus,
        .c24-hero-widget select.c24package-airport:focus {
          border-color: #2e75fa !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(46, 117, 250, 0.15) !important;
        }

        /* Layout: make fields flow horizontally on desktop */
        .c24-hero-widget div.c24package-location,
        .c24-hero-widget div.c24package-left,
        .c24-hero-widget div.c24package-right,
        .c24-hero-widget div.c24package-full {
          width: auto !important;
          flex: 1 !important;
          min-width: 140px !important;
          padding: 0 !important;
        }
        .c24-hero-widget div.c24package-location {
          flex: 2 !important;
          min-width: 200px !important;
        }

        /* Submit button — blue like Check24 */
        .c24-hero-widget button.c24package-submit {
          background-color: #2e75fa !important;
          border-radius: 10px !important;
          padding: 0 28px !important;
          height: 42px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin: 0 !important;
          border: none !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          transition: background-color 0.15s !important;
          flex-shrink: 0 !important;
        }
        .c24-hero-widget button.c24package-submit:hover {
          background-color: #1a5fe0 !important;
        }

        /* Autocomplete dropdown — make it look cleaner */
        .c24-hero-widget .ui-autocomplete {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          z-index: 9999 !important;
        }
        .c24-hero-widget .ui-autocomplete li.ui-menu-item {
          padding: 10px 14px !important;
          font-size: 13px !important;
          color: #0a1a3a !important;
        }
        .c24-hero-widget .ui-autocomplete li.ui-menu-item.ui-state-focus,
        .c24-hero-widget .ui-autocomplete li:hover {
          background: #f0f4ff !important;
          border-color: #2e75fa !important;
        }

        /* Datepicker — subtle cleanup */
        .c24-hero-widget .ui-datepicker {
          z-index: 9999 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15) !important;
        }

        /* Mobile: stack fields vertically */
        @media (max-width: 639px) {
          .c24-hero-widget div.c24package-wrapper {
            flex-direction: column !important;
            gap: 8px !important;
            padding: 12px !important;
          }
          .c24-hero-widget div.c24package-location,
          .c24-hero-widget div.c24package-left,
          .c24-hero-widget div.c24package-right,
          .c24-hero-widget div.c24package-full {
            min-width: 100% !important;
            flex: none !important;
          }
          .c24-hero-widget button.c24package-submit {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
