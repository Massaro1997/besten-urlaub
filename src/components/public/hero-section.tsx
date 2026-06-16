import Image from 'next/image'

/**
 * Hero — clean storefront. No stickers, no clutter.
 * Just a calm tropical lagoon background + centered logo.
 * The two comparator forms (Pauschalreise + Mietwagen) live in <HeroCtaBar/>
 * directly below.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#cfeef5] h-[320px] sm:h-[420px] lg:h-[500px]">
      {/* BG: clean aerial tropical lagoon */}
      <Image
        src="/hero-vetrina-bg-clean.webp"
        alt="Traumhafte tropische Lagune"
        fill
        className="object-cover"
        priority
        quality={88}
        sizes="100vw"
      />
      {/* soft readability gradient behind the logo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/10 via-transparent to-[#0a1a3a]/20" />

      {/* LOGO — centered */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-center">
        <Image
          src="/noBgWhite.png"
          alt="Bester Urlaub"
          width={720}
          height={200}
          priority
          className="relative z-[10] w-[220px] sm:w-[340px] lg:w-[420px] h-auto drop-shadow-[0_10px_40px_rgba(10,26,58,0.6)]"
        />
      </div>
    </section>
  )
}
