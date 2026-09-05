import Image from 'next/image'
import { Clock, ShieldCheck, Tag, Phone } from 'lucide-react'
import { BrandMark } from './brand-mark'
import { Check24SearchTabs } from './check24-search-tabs'
import { HeroClouds } from './hero-clouds'
import { TrackedPhoneLink } from './tracked-phone-link'

const CHIPS = [
  { icon: Clock, label: 'Bis zu 24h stornierbar' },
  { icon: ShieldCheck, label: 'Bestpreis Garantie' },
  { icon: Tag, label: 'Bis zu 60% Rabatt' },
]

/**
 * Hero — laguna + comparatore CHECK24 (schede Pauschalreisen / Mietwagen)
 * e banco di nuvole in basso, così la hero sembra galleggiare sopra la pagina.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a1a3a]">
      {/* BG: laguna tropicale */}
      <Image
        src="/hero-vetrina-bg-clean.webp"
        alt="Traumhafte tropische Lagune"
        fill
        className="object-cover"
        priority
        quality={90}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/75 via-[#0a1a3a]/30 to-transparent" />

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-32 pb-[calc(16.7vw+28px)]">
        {/* Sotto sm la navbar è nascosta finché non si scorre: il marchio sta qui */}
        <div className="sm:hidden flex justify-center mb-6">
          <BrandMark variant="light" size="lg" />
        </div>

        <div className="text-center max-w-4xl 2xl:max-w-5xl mx-auto">
          <h1 className="text-[26px] sm:text-5xl lg:text-[56px] 2xl:text-[64px] font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(10,26,58,0.5)]">
            Dein Traumurlaub wartet.
            <span className="block text-white/90">Bis zu 60% günstiger.</span>
          </h1>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {CHIPS.map((chip) => (
              <li key={chip.label} className="inline-flex items-center gap-2 text-white/85 text-[13px] sm:text-[15px] font-medium">
                <chip.icon className="w-4 h-4 text-[#F2660A]" strokeWidth={2.2} />
                {chip.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Comparatore CHECK24 dentro la hero */}
        <div className="mt-8 sm:mt-10">
          <Check24SearchTabs />
        </div>

        <div className="mt-6 flex justify-center">
          <TrackedPhoneLink
            href="tel:+4917682405507"
            source="hero-phone"
            className="inline-flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm sm:text-[15px]"
          >
            <Phone className="w-4 h-4 text-[#F2660A]" fill="currentColor" />
            <span className="whitespace-nowrap">Lieber persönlich? <strong className="font-bold tabular-nums">+49 176 8240 5507</strong><span className="hidden sm:inline"> · Mo–Fr 9–19 Uhr</span></span>
          </TrackedPhoneLink>
        </div>
      </div>

      <HeroClouds />

    </section>
  )
}
