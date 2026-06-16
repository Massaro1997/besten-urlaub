import { Car, Palmtree } from 'lucide-react'
import { TrackedCheck24CTA } from './tracked-check24-cta'

/**
 * Two CTA cards shown directly below the hero "vetrina".
 * Was previously the mobile-only block inside <HeroSection>.
 * Now lives outside the hero so the storefront stays purely visual.
 */
export function HeroCtaBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-2 sm:pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Pauschalreisen — primary */}
        <TrackedCheck24CTA
          baseHref="https://p1168044s0m.urlaub.check24.net/?deviceoutput=mobile"
          source="hero-cta-bar-pauschal"
          product="Pauschalreise"
          className="group relative rounded-2xl overflow-hidden active:scale-[0.98] transition-transform bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)] border border-black/5"
        >
          <div className="h-1.5 bg-[#ff6b35]" />
          <div className="p-4 sm:p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
              <Palmtree className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff6b35]" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#ff6b35] mb-0.5">
                Pauschalreisen
              </p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-[#0a1a3a] leading-tight tracking-tight">
                Bis zu 60% sparen
              </p>
              <p className="text-[12px] sm:text-[13px] text-[#0a1a3a]/60 font-medium mt-0.5">
                Flug + Hotel ab 199 €
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </TrackedCheck24CTA>

        {/* Mietwagen — secondary */}
        <TrackedCheck24CTA
          baseHref="https://p1168044s0.mietwagen.check24.net/?tid2=223"
          source="hero-cta-bar-mietwagen"
          product="Mietwagen"
          className="group relative rounded-2xl overflow-hidden active:scale-[0.98] transition-transform bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18)] border border-black/5"
        >
          <div className="h-1.5 bg-[#2e75fa]" />
          <div className="p-4 sm:p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#2e75fa]/10 flex items-center justify-center">
              <Car className="w-6 h-6 sm:w-7 sm:h-7 text-[#2e75fa]" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#2e75fa] mb-0.5">
                Mietwagen
              </p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-[#0a1a3a] leading-tight tracking-tight">
                Täglich ab 9 €
              </p>
              <p className="text-[12px] sm:text-[13px] text-[#0a1a3a]/60 font-medium mt-0.5">
                Frei stornierbar
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2e75fa] text-white shadow-md shadow-[#2e75fa]/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </TrackedCheck24CTA>
      </div>
    </section>
  )
}
