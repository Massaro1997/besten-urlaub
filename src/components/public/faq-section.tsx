'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { HOMEPAGE_FAQ } from '@/lib/faq-data'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center text-center mb-8">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#ff6b35] mb-2">
          Häufige Fragen · Schnell beantwortet
        </span>
        <h2 className="text-xl sm:text-3xl lg:text-[2rem] font-extrabold text-[#0a1a3a] tracking-tight leading-tight">
          Alles, was du wissen musst 💡
        </h2>
        <p className="text-sm sm:text-base text-[#0a1a3a]/55 mt-2 max-w-xl">
          Plane deinen Urlaub ohne Stress — wir haben die Antworten.
        </p>
      </div>

      <div className="space-y-0 border-t border-[#0a1a3a]/10">
        {HOMEPAGE_FAQ.map((item, i) => (
          <div key={i} className="border-b border-[#0a1a3a]/10">
            <button
              type="button"
              aria-expanded={openIndex === i ? 'true' : 'false'}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
              <span className="text-[15px] font-semibold text-[#0a1a3a]">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#0a1a3a]/40 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="pb-5 pr-10">
                <p className="text-sm text-[#0a1a3a]/65 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
