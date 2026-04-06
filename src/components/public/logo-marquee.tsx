'use client'

import Image from 'next/image'

const LOGOS = [
  { src: '/LOGHI/operatorTuifalse.svg', alt: 'TUI' },
  { src: '/LOGHI/operatorAurumToursfalse.svg', alt: 'AurumTours' },
  { src: '/LOGHI/operatorSchauinslandReisenfalse.svg', alt: 'Schauinsland Reisen' },
  { src: '/LOGHI/operatorDertourfalse.svg', alt: 'DERTOUR' },
  { src: '/LOGHI/operatorCoralTravelfalse.svg', alt: 'Coral Travel' },
  { src: '/LOGHI/operatorVtoursfalse.svg', alt: 'vtours' },
  { src: '/LOGHI/operatorLturfalse.svg', alt: 'ltur' },
  { src: '/LOGHI/operatorItsfalse.svg', alt: 'ITS' },
]

export function LogoMarquee() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-2">
        <p className="text-sm font-medium text-[#0a1a3a]/40 text-center tracking-wide mb-8">
          Alle Top Reiseveranstalter im Vergleich
        </p>
      </div>
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="flex gap-16 animate-scroll-logos w-max">
          {[...Array(2)].flatMap((_, setIdx) =>
            LOGOS.map((logo) => (
              <Image
                key={`${setIdx}-${logo.alt}`}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="h-10 w-auto shrink-0"
              />
            ))
          )}
        </div>
      </div>
      <div className="pb-8" />
      <style jsx>{`
        @keyframes scroll-logos {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-logos {
          animation: scroll-logos 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
