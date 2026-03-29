import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Frühbucher Angebote | Besten Urlaub',
  description: 'Frühbucher-Rabatte sichern! Jetzt früh buchen und bei deinem nächsten Urlaub sparen.',
}

export default function FruehbucherPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white border-b border-[#0a1a3a]/10 px-4 sm:px-6 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60 hover:text-[#2e75fa] transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Startseite</span>
            </Link>
            <div className="h-5 w-px bg-[#0a1a3a]/10 shrink-0" />
            <div className="flex items-center gap-2">
              <Image src="/symbol.svg" alt="Besten Urlaub" width={20} height={20} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#0a1a3a]">Frühbucher Angebote</p>
                <p className="text-xs text-[#0a1a3a]/50">Früh buchen, mehr sparen</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#0a1a3a]/40">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Buchung über Check24</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-0 sm:px-5">
        <div id="c24pp-package-iframe" data-offer="earlybooker" data-scrollto="begin" data-forward-url="no" style={{ width: '100%' }} />
        <Script src="https://files.check24.net/widgets/auto/1168044/c24pp-package-iframe/package-iframe.js" strategy="afterInteractive" />
      </div>

      <div className="border-t border-[#0a1a3a]/5 bg-[#f8f9fc] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-[10px] text-[#0a1a3a]/40 leading-relaxed">
            <span className="font-semibold">CHECK24.net Partnerprogramm:</span>{' '}
            Wir nehmen am CHECK24.net Partnerprogramm teil. Weitere Informationen:{' '}
            <a href="https://www.check24.net" target="_blank" rel="noopener noreferrer" className="text-[#2e75fa] hover:underline">CHECK24.net</a>
          </p>
        </div>
      </div>
    </div>
  )
}
