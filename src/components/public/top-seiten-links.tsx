import Link from 'next/link'
import { topSeiten } from '@/data/top-seiten'

/**
 * Linkblock auf die meistgesuchten Seiten (GSC-Daten).
 * Server component, auf Home und Hubs eingebunden: gibt den Seiten,
 * die schon Impressionen haben, zusätzliches internes Linkgewicht.
 */
export function TopSeitenLinks({ title = 'Gerade viel gesucht' }: { title?: string }) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#0a1a3a]">{title}</h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {topSeiten.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-[#0a1a3a]/10 bg-white hover:border-[#2e75fa] transition-colors px-3 py-2.5"
          >
            <div className="text-sm font-semibold text-[#0a1a3a] leading-snug">{s.label}</div>
            <div className="text-xs text-[#0a1a3a]/55 mt-0.5">{s.hint}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
