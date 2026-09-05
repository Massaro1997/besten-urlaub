import Image from 'next/image'
import { Phone } from 'lucide-react'
import { TrackedPhoneLink } from './tracked-phone-link'

const PHONE_NUMBER = '+4917682405507'
const PHONE_DISPLAY = '+49 176 8240 5507'

export function PhoneCtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a1a3a]">
      {/* Full-bleed destination photo */}
      <Image
        src="/destinations/malediven.webp"
        alt="Überwasser-Villen einer Insel im Indischen Ozean bei Sonnenuntergang"
        fill
        quality={85}
        sizes="100vw"
        className="object-cover object-[72%_center]"
      />

      {/* Readability gradient: from the left on desktop, from the bottom on mobile */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#0a1a3a] from-10% via-[#0a1a3a]/85 via-55% to-transparent" />
      <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-[#0a1a3a]/20 via-[#0a1a3a]/85 via-40% to-[#0a1a3a]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-44 pb-12 sm:py-20 lg:py-24">
        <div className="max-w-xl">
          <h2 className="text-[26px] sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Lieber beraten lassen?
          </h2>

          <p className="text-white/75 text-[15px] sm:text-lg leading-relaxed mb-7">
            Wir vergleichen die Angebote und stellen deine Reise zusammen — unverbindlich.
          </p>

          <TrackedPhoneLink
            href={`tel:${PHONE_NUMBER}`}
            source="phone-cta-section"
            className="group inline-flex items-center gap-3 sm:gap-4 rounded-2xl bg-gradient-to-br from-[#F2660A] to-[#FE561B] px-5 sm:px-7 py-4 sm:py-5 shadow-[0_12px_40px_-8px_rgba(255,107,53,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 shrink-0">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/75 font-bold mb-0.5">
                Direkt anrufen
              </span>
              <span className="block text-xl sm:text-3xl font-black text-white leading-none tracking-tight tabular-nums">
                {PHONE_DISPLAY}
              </span>
            </span>
          </TrackedPhoneLink>

          <p className="text-white/50 text-xs sm:text-sm mt-5">
            Erreichbar Mo–Fr 9:00 – 19:00 Uhr · Sa 10:00 – 16:00 Uhr
          </p>
        </div>
      </div>
    </section>
  )
}
