/**
 * Insolvenzversicherung trust block — German legal trust trigger on Pauschalreise.
 * Pattern preso da urlaubspiraten.de — appears on every offer detail page.
 * §651r BGB richiede protezione insolvenza per pacchetti turistici.
 * Variante compact / full.
 */
export function InsolvenzTrustBlock({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-[#0a1a3a]/10 bg-[#0a1a3a]/[0.02] p-3">
        <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#006AF9]/10 text-[#006AF9]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
          </svg>
        </span>
        <div className="text-xs text-[#0a1a3a]/70 leading-relaxed">
          <p className="font-semibold text-[#0a1a3a]">Sicher buchen mit Insolvenzversicherung</p>
          <p>Alle Pauschalreisen in Deutschland sind nach §651r BGB durch einen Sicherungsschein abgesichert.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-[#0a1a3a]/10 bg-gradient-to-br from-[#006AF9]/[0.04] to-transparent p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#006AF9]/10 text-[#006AF9]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
          </svg>
        </span>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0a1a3a] tracking-tight">
            Sicher buchen mit Insolvenzversicherung
          </h3>
          <p className="text-sm text-[#0a1a3a]/70 leading-relaxed mt-1.5">
            Alle Pauschalreisen, die du über unseren Partner Check24 buchst, sind nach §651r BGB durch einen
            Sicherungsschein des jeweiligen Reiseveranstalters abgesichert. Bei Insolvenz erstattet die
            Versicherung deine Reisekosten — du fliegst sicher in den Urlaub.
          </p>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#0a1a3a]/65">
            <li className="flex items-center gap-1.5">
              <span className="text-[#F2660A]">✓</span> Sicherungsschein inklusive
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#F2660A]">✓</span> Geld-zurück bei Insolvenz
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#F2660A]">✓</span> Bestpreis-Garantie Check24
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
