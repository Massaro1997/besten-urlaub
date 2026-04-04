import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mietwagen Test (Travelpayouts) | Besten Urlaub',
  description: 'Testseite für das Travelpayouts Mietwagen-Widget.',
}

export default function MietwagenTestPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white border-b border-[#0a1a3a]/10 px-4 sm:px-6 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60 hover:text-[#2e75fa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Startseite</span>
          </Link>
          <div className="h-5 w-px bg-[#0a1a3a]/10" />
          <div>
            <p className="text-sm font-semibold text-[#0a1a3a]">Mietwagen Test</p>
            <p className="text-xs text-[#0a1a3a]/50">Travelpayouts Widget</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3a] tracking-tight mb-2">
          Mietwagen vergleichen
        </h1>
        <p className="text-[#0a1a3a]/60 mb-8">
          Finde den besten Preis für deinen Mietwagen weltweit.
        </p>

        {/* Travelpayouts Mietwagen Widget */}
        <div id="travelpayouts-cars-widget" className="min-h-[600px]" />
        <Script
          id="travelpayouts-cars"
          src="//tpemd.com/content?trs=515191&shmarker=716420&locale=en&country=153&city=68511&powered_by=true&campaign_id=87&promo_id=2466"
          strategy="afterInteractive"
          charSet="utf-8"
        />
      </div>
    </div>
  )
}
