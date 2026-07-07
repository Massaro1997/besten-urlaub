import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import { SITE_URL, BUILD_DATE, breadcrumbJsonLd, faqJsonLd, articleJsonLd } from '@/lib/seo-jsonld'
import { getAllFragenParams, getFrage } from '@/lib/fragen'
import { getSeitenExtra } from '@/data/seiten-extra'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllFragenParams()
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const f = getFrage(slug)
  if (!f) return { title: 'Frage nicht gefunden | Bester Urlaub' }
  const url = `${SITE_URL}/fragen/${slug}`
  const serpTitle = f.seoTitle ?? f.frage
  return {
    title: `${serpTitle} | Bester Urlaub`,
    description: f.kurzantwort.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: serpTitle,
      description: f.kurzantwort.slice(0, 200),
      type: 'article',
      locale: 'de_DE',
      url,
      siteName: 'Bester Urlaub',
      images: [{ url: `/destinations/${f.ziel.slug}.webp`, width: 1200, height: 630, alt: f.ziel.name }],
    },
    twitter: { card: 'summary_large_image', title: serpTitle, description: f.kurzantwort.slice(0, 200), images: [`/destinations/${f.ziel.slug}.webp`] },
  }
}

export default async function FragePage({ params }: PageProps) {
  const { slug } = await params
  const f = getFrage(slug)
  if (!f) notFound()

  const url = `${SITE_URL}/fragen/${slug}`
  const extra = getSeitenExtra(slug)

  // related questions for the same destination (internal linking, Gate 6)
  const related = getAllFragenParams()
    .filter((p) => p.slug !== slug && p.slug.endsWith(`-${f.ziel.slug}`))
    .map((p) => {
      const rf = getFrage(p.slug)
      return rf ? { slug: p.slug, frage: rf.frage } : null
    })
    .filter((x): x is { slug: string; frage: string } => x !== null)

  const faqSchema = faqJsonLd([{ q: f.frage, a: f.kurzantwort }, ...f.faq])
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Reise-Fragen', url: '/fragen' },
    { name: f.ziel.name, url: `/reiseziel/${f.ziel.slug}` },
    { name: f.frage, url: `/fragen/${slug}` },
  ])
  const articleSchema = articleJsonLd({
    headline: f.frage,
    description: f.kurzantwort,
    url,
    image: `/destinations/${f.ziel.slug}.webp`,
    datePublished: '2026-06-16',
    dateModified: BUILD_DATE,
  })

  return (
    <>
      <JsonLd data={[articleSchema, faqSchema, breadcrumbSchema]} />

      <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#2e75fa]">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li><Link href="/fragen" className="hover:text-[#2e75fa]">Reise-Fragen</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li><Link href={`/reiseziel/${f.ziel.slug}`} className="hover:text-[#2e75fa]">{f.ziel.name}</Link></li>
        </ol>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a1a3a] tracking-tight">{f.frage}</h1>

        {/* Kurzantwort (answer-first, AI-Overview-tauglich) */}
        <div className="mt-5 rounded-2xl bg-[#2e75fa]/8 border border-[#2e75fa]/20 p-5">
          <p className="text-[#0a1a3a] leading-relaxed font-medium">{f.kurzantwort}</p>
        </div>

        {/* Langantwort */}
        <div className="mt-8 space-y-4">
          {f.absatz.map((p, i) => (
            <p key={i} className="text-[#0a1a3a]/80 leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Tabelle (falls vorhanden) */}
        {f.tabelle && f.tabelleHead && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0a1a3a]/10 text-left">
                  {f.tabelleHead.map((h, i) => (
                    <th key={i} className="py-2 px-3 font-semibold text-[#0a1a3a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {f.tabelle.map((row, i) => (
                  <tr key={i} className="border-b border-[#0a1a3a]/8">
                    <td className="py-2 px-3 font-medium text-[#0a1a3a]">{row.monat}</td>
                    {row.werte.map((w, j) => (
                      <td key={j} className="py-2 px-3 text-[#0a1a3a]/75">{w}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Handgeschriebener Zusatzcontent (Top-Seiten, siehe seiten-extra.ts) */}
        {extra && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-[#0a1a3a] mb-3">{extra.titel}</h2>
            <div className="space-y-4">
              {extra.absaetze.map((p, i) => (
                <p key={i} className="text-[#0a1a3a]/80 leading-relaxed">{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-[#0a1a3a] text-white p-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold mb-2">{f.ziel.name}-Angebote ansehen</h2>
          <p className="text-white/75 mb-4 text-sm">Handgepickte Pauschalreisen, verglichen mit Check24.</p>
          <Link href={`/reiseziel/${f.ziel.slug}`} className="inline-flex items-center gap-2 bg-[#2e75fa] hover:bg-[#1f5fd8] transition-colors text-white font-semibold rounded-full px-6 py-2.5">
            Zu den {f.ziel.name}-Angeboten <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* weitere FAQ */}
        {f.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-[#0a1a3a] mb-4">Weitere Fragen zu {f.ziel.name}</h2>
            <div className="space-y-3">
              {f.faq.map((item, i) => (
                <details key={i} className="group rounded-2xl border border-[#0a1a3a]/10 bg-white p-4">
                  <summary className="cursor-pointer font-semibold text-[#0a1a3a] list-none flex items-center justify-between">
                    {item.q}
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-[#0a1a3a]/75 mt-2 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* related questions — internal linking */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-[#0a1a3a] mb-3">Mehr zu {f.ziel.name}</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/fragen/${r.slug}`} className="text-[#2e75fa] hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5" /> {r.frage}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/pauschalreise/${f.ziel.slug}`} className="text-[#2e75fa] hover:underline flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" /> Pauschalreise {f.ziel.name}: Preise pro Monat
                </Link>
              </li>
              <li>
                <Link href={`/reiseziel/${f.ziel.slug}`} className="text-[#2e75fa] hover:underline flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" /> Alle {f.ziel.name}-Angebote
                </Link>
              </li>
            </ul>
          </section>
        )}
      </article>
    </>
  )
}
