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
    <section className="bg-white overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14">
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
                className="h-9 sm:h-11 w-auto shrink-0 opacity-80"
              />
            ))
          )}
        </div>
      </div>
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
