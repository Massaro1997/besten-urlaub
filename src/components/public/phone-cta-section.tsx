import { Phone } from 'lucide-react'

const PHONE_NUMBER = '+4917682405507'
const PHONE_DISPLAY = '+49 176 8240 5507'

export function PhoneCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1a3a] via-[#0f2454] to-[#0a1a3a]">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #2e75fa 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ff6b35 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#ff6b35] font-bold mb-3">
          Persönliche Beratung
        </p>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Brauchst du Hilfe bei deiner Buchung?
        </h2>

        <p className="text-white/60 text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10">
          Ruf uns direkt an. Kostenlos. Keine Warteschlange.<br className="hidden sm:block" />
          Wir finden gemeinsam dein perfektes Angebot.
        </p>

        {/* Big phone number */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="group inline-flex items-center gap-3 sm:gap-5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl sm:rounded-3xl px-5 sm:px-10 py-5 sm:py-7 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#e85d2c] shadow-[0_8px_30px_rgba(255,107,53,0.4)] shrink-0">
            <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" />
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/40 font-semibold mb-0.5 sm:mb-1">
              Jetzt anrufen
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight tabular-nums">
              {PHONE_DISPLAY}
            </div>
          </div>
        </a>

        <p className="text-white/40 text-xs sm:text-sm mt-6 sm:mt-8">
          Mo–Fr 9:00 – 19:00 Uhr · Sa 10:00 – 16:00 Uhr
        </p>
      </div>
    </section>
  )
}
