import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import { SITE_URL, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo-jsonld'
import { getAllFragenParams, getFrage } from '@/lib/fragen'
import { TopSeitenLinks } from '@/components/public/top-seiten-links'
import { reiseKlima } from '@/data/reise-klima'

const url = `${SITE_URL}/fragen`

export const metadata: Metadata = {
  title: 'Reise-Fragen: Beste Reisezeit, Wassertemperatur & Preise | Bester Urlaub',
  description:
    'Antworten auf die häufigsten Reisefragen: beste Reisezeit, günstigste Monate, Wassertemperatur, Klimatabellen und Familienurlaub für jedes Reiseziel.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Reise-Fragen & Antworten',
    description: 'Beste Reisezeit, Preise, Wassertemperatur und Klima für jedes Reiseziel — alle Antworten auf einen Blick.',
    type: 'website',
    locale: 'de_DE',
    url,
    siteName: 'Bester Urlaub',
  },
}

export default function FragenHub() {
  const params = getAllFragenParams()
  const byZiel = new Map<string, { slug: string; frage: string }[]>()
  for (const p of params) {
    const f = getFrage(p.slug)
    if (!f) continue
    const arr = byZiel.get(f.ziel.slug) ?? []
    arr.push({ slug: p.slug, frage: f.frage })
    byZiel.set(f.ziel.slug, arr)
  }

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Reise-Fragen', url: '/fragen' },
  ])
  const itemListSchema = itemListJsonLd({
    name: 'Reise-Fragen nach Reiseziel',
    url,
    items: params.map((p) => ({ url: `/fragen/${p.slug}`, name: getFrage(p.slug)?.frage ?? p.slug })),
  })

  return (
    <>
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />

      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#2e75fa]">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li className="text-[#0a1a3a] font-medium">Reise-Fragen</li>
        </ol>
      </nav>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a1a3a] tracking-tight">Reise-Fragen & Antworten</h1>
        <p className="text-[#0a1a3a]/70 text-lg mt-3 max-w-2xl">
          Beste Reisezeit, günstigste Monate, Wassertemperatur, Klima und Familienurlaub — die wichtigsten Fragen zu jedem Reiseziel, mit echten Daten beantwortet.
        </p>

        <div className="mt-8">
          <TopSeitenLinks title="Meistgestellte Fragen" />
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {reiseKlima
            .filter((z) => byZiel.has(z.slug))
            .map((z) => (
              <div key={z.slug} className="rounded-2xl border border-[#0a1a3a]/10 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-[#0a1a3a] mb-3">
                  <Link href={`/reiseziel/${z.slug}`} className="hover:text-[#2e75fa]">{z.name}</Link>
                </h2>
                <ul className="space-y-1.5">
                  {byZiel.get(z.slug)!.map((q) => (
                    <li key={q.slug}>
                      <Link href={`/fragen/${q.slug}`} className="text-sm text-[#2e75fa] hover:underline flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {q.frage}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}
