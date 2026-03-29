import Image from 'next/image'
import { Search } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Background image */}
      <Image
        src="/santorini.png"
        alt="Urlaubsparadies"
        fill
        className="object-cover"
        priority
        quality={90}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/70 via-[#0a1a3a]/50 to-[#0a1a3a]/80" />

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
          Die besten Urlaubsangebote
        </h1>

        <p className="text-base sm:text-lg text-white/80 mt-4 max-w-2xl mx-auto drop-shadow">
          Direkt f&uuml;r dich gefunden &mdash; spare bei deinem n&auml;chsten Urlaub
        </p>

        {/* Decorative search bar */}
        <div className="max-w-md mx-auto mt-8">
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-5 py-3.5 shadow-xl shadow-black/20">
            <Search className="w-5 h-5 text-[#0a1a3a]/40 shrink-0" />
            <span className="ml-3 text-[#0a1a3a]/40 text-sm sm:text-base select-none">
              Wohin soll es gehen?
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
