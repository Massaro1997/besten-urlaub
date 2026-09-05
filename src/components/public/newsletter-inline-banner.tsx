import { NewsletterForm } from './newsletter-form'

/**
 * Inline newsletter capture — mid-page touchpoint.
 * Pattern preso da urlaubspiraten (5 newsletter touchpoints per pagina,
 * ognuno ~2% conv → 8-10% blended). Light variant, sits between sections.
 */
export function NewsletterInlineBanner({ source = 'newsletter-inline' }: { source?: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bu-pattern-wellen bu-pattern--light relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0a1a3a] via-[#0a1a3a] to-[#1a2f5a] p-6 sm:p-10">
        {/* Un solo bagliore caldo: il resto lo fa il pattern d'onda del brand */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }} />

        <div className="relative grid md:grid-cols-2 gap-6 sm:gap-10 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Verpasse keinen Reise-Deal mehr.
            </h3>
            <p className="text-sm sm:text-base text-white/70 mt-3 leading-relaxed">
              Die besten handverlesenen Schnäppchen direkt in dein Postfach. Einmal pro Woche.
              Jederzeit abbestellbar.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#ff6b35]">✓</span> Bis zu 60% Rabatt
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#ff6b35]">✓</span> Exklusive Angebote
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#ff6b35]">✓</span> Kein Spam
              </span>
            </div>
          </div>

          <div className="md:pl-4">
            <NewsletterForm source={source} variant="dark" />
            <p className="mt-3 text-[10px] sm:text-[11px] text-white/40 leading-relaxed">
              Mit der Anmeldung stimmst du unserer{' '}
              <a href="/datenschutz" className="underline hover:text-white/70">Datenschutzerklärung</a> zu.
              Abmeldung jederzeit per Klick im Newsletter.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
