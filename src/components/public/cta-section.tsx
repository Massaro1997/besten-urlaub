import Image from 'next/image'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Parallax background image */}
      <div className="absolute inset-0">
        <Image
          src="/alps.png"
          alt=""
          fill
          className="object-cover"
          style={{ transform: 'translateZ(0)' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a1a3a]/75 backdrop-blur-[2px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium mb-3">Immer einen Schritt voraus</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
          Die besten Deals?<br />Bekommst du zuerst.
        </h2>

        <p className="text-white/60 mt-4 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Folge uns &mdash; und buche, w&auml;hrend andere noch scrollen.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <a
            href="https://www.tiktok.com/@bestenurlaub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#0a1a3a] px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.24 8.24 0 0 0 4.82 1.56V6.89a4.84 4.84 0 0 1-1.06-.2Z" />
            </svg>
            TikTok folgen
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Instagram folgen
          </a>
        </div>
      </div>
    </section>
  )
}
