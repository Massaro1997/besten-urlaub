import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Last Minute Angebote | Besten Urlaub',
  description: 'Finde die besten Last Minute Reiseangebote. Pauschalreisen zum besten Preis direkt vergleichen und buchen.',
}

export default function LastMinutePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0a1a3a] to-[#2e75fa] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Startseite
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Last Minute Angebote
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Vergleiche Pauschalreisen und finde die besten Last Minute Deals. Direkt buchen und sparen.
          </p>
        </div>
      </section>

      {/* Check24 Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div id="c24pp-package-iframe" data-offer="lastminute" data-scrollto="iframe" data-forward-url="no" style={{ width: '100%' }} />
        <Script
          src="https://files.check24.net/widgets/auto/1168044/c24pp-package-iframe/package-iframe.js"
          strategy="afterInteractive"
        />
      </section>

      {/* Affiliate disclosure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-2xl p-6 border border-[#0a1a3a]/5">
          <h3 className="text-sm font-semibold text-[#0a1a3a] mb-2">CHECK24.net Partnerprogramm</h3>
          <p className="text-xs text-[#0a1a3a]/50 leading-relaxed">
            Wir nehmen am CHECK24.net Partnerprogramm teil. Auf unseren Seiten werden iFrame-Buchungsmasken
            und andere Werbemittel eingebunden, an denen wir über Transaktionen, zum Beispiel durch Leads
            und Sales, eine Werbekostenerstattung erhalten können. Weitere Informationen zur Datennutzung
            durch CHECK24.net erhalten Sie in der Datenschutzerklärung von{' '}
            <a href="https://www.check24.net" target="_blank" rel="noopener noreferrer" className="text-[#2e75fa] hover:underline">
              CHECK24.net
            </a>.
          </p>
        </div>
      </section>
    </div>
  )
}
