import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mietwagen vergleichen | Besten Urlaub',
  description: 'Mietwagen weltweit vergleichen und günstig buchen. Die besten Angebote für deinen Urlaub.',
}

export default function MietwagenPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Compact header */}
      <div className="bg-gradient-to-r from-[#0a1a3a] to-[#2e75fa] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Startseite
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Mietwagen vergleichen
          </h1>
          <p className="text-white/70 mt-1 text-sm sm:text-base">
            Weltweit den besten Preis finden und direkt buchen
          </p>
        </div>
      </div>

      {/* Check24 Widget — directly integrated, no gaps */}
      <div id="c24pp-rentalcar-iframe" data-scrollto="iframe" style={{ width: '100%' }} />
      <Script
        src="https://files.check24.net/widgets/auto/1168044/c24pp-rentalcar-iframe/rentalcar-iframe.js"
        strategy="afterInteractive"
      />

      {/* Affiliate disclosure */}
      <div className="border-t border-[#0a1a3a]/5 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-[10px] text-[#0a1a3a]/40 leading-relaxed">
            <span className="font-semibold">CHECK24.net Partnerprogramm:</span>{' '}
            Wir nehmen am CHECK24.net Partnerprogramm teil. Auf unseren Seiten werden iFrame-Buchungsmasken
            und andere Werbemittel eingebunden, an denen wir über Transaktionen eine Werbekostenerstattung
            erhalten können. Weitere Informationen:{' '}
            <a href="https://www.check24.net" target="_blank" rel="noopener noreferrer" className="text-[#2e75fa] hover:underline">
              CHECK24.net
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
