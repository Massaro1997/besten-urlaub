import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import { SITE_URL, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo-jsonld'
import { getAllPauschalreiseParams, getPauschalreise } from '@/lib/pauschalreise'
import { MONAT_NAMEN } from '@/data/reise-klima'

const url = `${SITE_URL}/pauschalreise`

export const metadata: Metadata = {
  title: 'Pauschalreise Preise: alle Reiseziele mit Preistabelle pro Monat | Bester Urlaub',
  description:
    'Was kostet eine Pauschalreise? Ab-Preise pro Monat für alle Reiseziele: Türkei, Griechenland, Spanien, Ägypten und mehr. Mit günstigstem Reisemonat und Wetterdaten.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Pauschalreise Preise nach Reiseziel',
    description: 'Ab-Preise pro Monat für alle Reiseziele, mit günstigstem Reisemonat.',
    type: 'website',
    locale: 'de_DE',
    url,
    siteName: 'Bester Urlaub',
  },
}

export default function PauschalreiseHub() {
  const pages = getAllPauschalreiseParams()
    .map((p) => getPauschalreise(p.ziel))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => a.minPreis - b.minPreis)

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Pauschalreise', url: '/pauschalreise' },
  ])
  const itemListSchema = itemListJsonLd({
    name: 'Pauschalreise Preise nach Reiseziel',
    url,
    items: pages.map((p) => ({ url: `/pauschalreise/${p.slug}`, name: `Pauschalreise ${p.ziel.name}` })),
  })

  return (
    <>
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />

      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#006AF9]">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li className="text-[#0a1a3a] font-medium">Pauschalreise</li>
        </ol>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a1a3a] tracking-tight">
          Pauschalreise Preise nach Reiseziel
        </h1>
        <p className="text-[#0a1a3a]/70 text-lg mt-3 max-w-2xl">
          Was kostet der Urlaub wirklich? Für jedes Reiseziel: ab-Preis, günstigster Reisemonat und die komplette Preistabelle pro Monat. Sortiert vom günstigsten zum teuersten Ziel.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/pauschalreise/${p.slug}`}
              className="rounded-2xl border border-[#0a1a3a]/10 bg-white hover:border-[#006AF9] transition-colors p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold text-[#0a1a3a]">{p.ziel.name}</h2>
                <span className="text-[#006AF9] font-bold whitespace-nowrap">ab {p.minPreis} €</span>
              </div>
              <p className="text-sm text-[#0a1a3a]/60 mt-1">
                {p.ziel.land} · günstigster Monat: {MONAT_NAMEN[p.guenstigste[0].monat - 1]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
