import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import { SITE_URL, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo-jsonld'
import { reiseKlima, MONAT_NAMEN, MONAT_SLUGS } from '@/data/reise-klima'
import { getBesteMonate, getGuenstigsterMonat } from '@/lib/reisemonat'

const url = `${SITE_URL}/reise`

export const metadata: Metadata = {
  title: 'Beste Reisezeit: Wetter, Wassertemperatur & Preise pro Monat | Bester Urlaub',
  description:
    'Wann ist die beste Reisezeit? Klimatabellen mit Tagestemperatur, Wassertemperatur, Sonnenstunden und Pauschalreise-Preisen für jeden Monat und jedes Reiseziel.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Beste Reisezeit pro Monat & Reiseziel',
    description: 'Klima, Wassertemperatur und Preise für jeden Monat — finde die beste Reisezeit für deinen Urlaub.',
    type: 'website',
    locale: 'de_DE',
    url,
    siteName: 'Bester Urlaub',
  },
}

export default function ReiseHub() {
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Reisezeit', url: '/reise' },
  ])
  const itemListSchema = itemListJsonLd({
    name: 'Reiseziele nach Reisezeit',
    url,
    items: reiseKlima.map((z) => ({ url: `/reiseziel/${z.slug}`, name: z.name })),
  })

  return (
    <>
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />

      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#2e75fa]">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li className="text-[#0a1a3a] font-medium">Reisezeit</li>
        </ol>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a1a3a] tracking-tight">
          Beste Reisezeit
        </h1>
        <p className="text-[#0a1a3a]/70 text-lg mt-3 max-w-2xl">
          Wann ist es wo am schönsten? Für jedes Reiseziel findest du hier Wetter, Wassertemperatur, Sonnenstunden und Pauschalreise-Preise — Monat für Monat.
        </p>

        <div className="mt-10 space-y-8">
          {reiseKlima.map((z) => {
            const beste = getBesteMonate(z)
            const guenstig = getGuenstigsterMonat(z)
            return (
              <div key={z.slug} className="rounded-3xl border border-[#0a1a3a]/10 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a1a3a]">
                    <Link href={`/reiseziel/${z.slug}`} className="hover:text-[#2e75fa]">{z.name}</Link>
                  </h2>
                  <span className="text-sm text-[#0a1a3a]/55">{z.land} · {z.flugStunden} h Flug</span>
                </div>
                <p className="text-sm text-[#0a1a3a]/70 mb-4">
                  Beste Reisezeit: {beste.map((mi) => MONAT_NAMEN[mi - 1]).join(', ')}. Günstigster Monat: {MONAT_NAMEN[guenstig.monat - 1]} (ab {guenstig.preisAb} €).
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {z.monate.map((m) => (
                    <Link
                      key={m.monat}
                      href={`/reise/${z.slug}/${MONAT_SLUGS[m.monat - 1]}`}
                      className="rounded-xl border border-[#0a1a3a]/10 bg-[#f7f9fc] hover:border-[#2e75fa] hover:text-[#2e75fa] transition-colors px-2 py-2 text-center"
                    >
                      <div className="text-xs font-semibold text-[#0a1a3a]">{MONAT_NAMEN[m.monat - 1].slice(0, 3)}</div>
                      <div className="text-[11px] text-[#0a1a3a]/55">{m.tagMax}° · ab {m.preisAb}€</div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
