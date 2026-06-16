import Image from 'next/image'

/**
 * Hero "vetrina tropicale plush" — clean symmetric composition.
 *  - Aerial tropical lagoon BG
 *  - 4 monstera leaves in corners (frame)
 *  - 2 plush palms left + right (mirrored)
 *  - 2 plush animals at bottom (pelican + flamingo)
 *  - Logo dead center
 *  - Subtle sway on leaves and palms (tropical breeze)
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#cfeef5] h-[480px] sm:h-[620px] lg:h-[720px]">
      {/* BG: aerial tropical lagoon */}
      <Image
        src="/hero-vetrina-bg-v2.png"
        alt=""
        fill
        className="object-cover"
        priority
        quality={90}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-white/5" />

      {/* ===== FRAME — 4 MONSTERA CORNERS (symmetric) ===== */}
      <Image
        src="/stickers/foglia-monstera.png"
        alt=""
        width={400}
        height={400}
        priority
        className="hero-sway hero-sway-1 pointer-events-none select-none absolute top-[-5%] left-[-3%] w-[110px] sm:w-[160px] lg:w-[200px] h-auto z-[5] drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
        style={{ transform: 'rotate(-20deg)' }}
      />
      <Image
        src="/stickers/foglia-monstera.png"
        alt=""
        width={400}
        height={400}
        priority
        className="hero-sway hero-sway-2 pointer-events-none select-none absolute top-[-5%] right-[-3%] w-[110px] sm:w-[160px] lg:w-[200px] h-auto z-[5] drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
        style={{ transform: 'scaleX(-1) rotate(-20deg)' }}
      />
      <Image
        src="/stickers/foglia-monstera.png"
        alt=""
        width={400}
        height={400}
        className="hero-sway hero-sway-2 pointer-events-none select-none absolute bottom-[-5%] left-[-3%] w-[110px] sm:w-[160px] lg:w-[200px] h-auto z-[7] drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
        style={{ transform: 'rotate(200deg)' }}
      />
      <Image
        src="/stickers/foglia-monstera.png"
        alt=""
        width={400}
        height={400}
        className="hero-sway hero-sway-1 pointer-events-none select-none absolute bottom-[-5%] right-[-3%] w-[110px] sm:w-[160px] lg:w-[200px] h-auto z-[7] drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
        style={{ transform: 'scaleX(-1) rotate(200deg)' }}
      />

      {/* ===== PALMS — symmetric framing, contained size ===== */}
      <Image
        src="/stickers/palma-v4.png"
        alt=""
        width={900}
        height={900}
        priority
        className="hero-sway hero-sway-slow pointer-events-none select-none absolute left-[-8%] sm:left-[-5%] lg:left-[-3%] bottom-[-4%] h-[78%] sm:h-[85%] lg:h-[90%] w-auto z-[4] drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        style={{ maxWidth: 'none', transform: 'scaleX(-1)' }}
      />
      <Image
        src="/stickers/palma-v4.png"
        alt=""
        width={900}
        height={900}
        priority
        className="hero-sway hero-sway-slow-reverse pointer-events-none select-none absolute right-[-8%] sm:right-[-5%] lg:right-[-3%] bottom-[-4%] h-[78%] sm:h-[85%] lg:h-[90%] w-auto z-[4] drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        style={{ maxWidth: 'none' }}
      />

      {/* ===== ANIMALS — 2 only, symmetric at bottom ===== */}
      <Image
        src="/stickers/pellicano-v4.png"
        alt=""
        width={500}
        height={500}
        className="pointer-events-none select-none absolute bottom-[6%] left-[24%] sm:left-[26%] lg:left-[28%] w-[100px] sm:w-[150px] lg:w-[190px] h-auto z-[6] drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
      />
      <Image
        src="/stickers/fenicottero-v4.png"
        alt=""
        width={500}
        height={500}
        className="pointer-events-none select-none absolute bottom-[6%] right-[24%] sm:right-[26%] lg:right-[28%] w-[100px] sm:w-[150px] lg:w-[190px] h-auto z-[6] drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
      />

      {/* ===== LOGO — CENTER ===== */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-center">
        <Image
          src="/noBgWhite.png"
          alt="Bester Urlaub"
          width={720}
          height={200}
          priority
          className="relative z-[10] w-[220px] sm:w-[360px] lg:w-[460px] h-auto drop-shadow-[0_10px_40px_rgba(10,26,58,0.7)]"
        />
      </div>

      {/* ===== SWAY ANIMATIONS — tropical breeze ===== */}
      <style>{`
        /* Sway via 'rotate' CSS property (independent of 'transform') — keeps base style.transform intact */
        @keyframes leafSwayA {
          0%, 100% { rotate: 0deg; }
          50% { rotate: 2deg; }
        }
        @keyframes leafSwayB {
          0%, 100% { rotate: 0deg; }
          50% { rotate: -2deg; }
        }
        @keyframes palmSwayLeft {
          0%, 100% { rotate: 0deg; }
          50% { rotate: 1.5deg; }
        }
        @keyframes palmSwayRight {
          0%, 100% { rotate: 0deg; }
          50% { rotate: -1.5deg; }
        }
        .hero-sway-1 { animation: leafSwayA 6s ease-in-out infinite; transform-origin: bottom center; }
        .hero-sway-2 { animation: leafSwayB 7s ease-in-out infinite; transform-origin: bottom center; }
        .hero-sway-slow { animation: palmSwayLeft 9s ease-in-out infinite; transform-origin: bottom center; }
        .hero-sway-slow-reverse { animation: palmSwayRight 9s ease-in-out infinite; transform-origin: bottom center; }
        @media (prefers-reduced-motion: reduce) {
          .hero-sway-1, .hero-sway-2,
          .hero-sway-slow, .hero-sway-slow-reverse { animation: none; }
        }
      `}</style>
    </section>
  )
}
