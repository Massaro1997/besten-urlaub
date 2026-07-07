import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight, Plane, CalendarDays } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import {
  SITE_URL,
  SITE_NAME,
  BUILD_DATE,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/lib/seo-jsonld'
import { getAllPauschalreiseParams, getPauschalreise } from '@/lib/pauschalreise'
import { getFrage } from '@/lib/fragen'
import { MONAT_NAMEN, MONAT_SLUGS } from '@/data/reise-klima'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPauschalreiseParams()
}

interface PageProps {
  params: Promise<{ ziel: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ziel } = await params
  const page = getPauschalreise(ziel)
  if (!page) return { title: 'Seite nicht gefunden | Bester Urlaub' }

  const url = `${SITE_URL}/pauschalreise/${ziel}`
  const title = `Pauschalreise ${page.ziel.name} ab ${page.minPreis} €: Preise pro Monat`
  const description = `Pauschalreise nach ${page.ziel.name} ab ${page.minPreis} € pro Person (Flug + Hotel). Preistabelle für alle Monate, günstigster Reisemonat ${MONAT_NAMEN[page.guenstigste[0].monat - 1]}, bis ${page.maxPreis - page.minPreis} € Ersparnis durch die Monatswahl.`

  return {
    title: `${title} | Bester Urlaub`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Bester Urlaub',
      images: [{ url: `/destinations/${ziel}.webp`, width: 1200, height: 630, alt: page.ziel.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`/destinations/${ziel}.webp`] },
  }
}

export default async function PauschalreisePage({ params }: PageProps) {
  const { ziel } = await params
  const page = getPauschalreise(ziel)
  if (!page) notFound()

  const { ziel: z, buchbar, minPreis, maxPreis, guenstigste, sweetSpot, absaetze, faq } = page
  const url = `${SITE_URL}/pauschalreise/${ziel}`
  const istBinnen = buchbar.every((m) => m.wasser === 0)
  // Fragen-Links nur, wenn die Seite existiert (NEAR_DUP_BLOCK kann Slugs sperren)
  const hatAnreise = getFrage(`anreise-${ziel}`) !== null
  const fragenLinks = [
    { slug: `guenstigste-reisezeit-${ziel}`, label: `Wann ist ${z.name} am günstigsten?` },
    { slug: `beste-reisezeit-${ziel}`, label: `Beste Reisezeit für ${z.name}` },
  ].filter((l) => getFrage(l.slug) !== null)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: `Pauschalreise ${z.name}`,
    description: `Pauschalreisen nach ${z.name} mit Flug und Hotel, Preise nach Reisemonat.`,
    image: `${SITE_URL}/destinations/${ziel}.webp`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    sku: `pauschalreise-${ziel}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: minPreis,
      highPrice: maxPreis,
      offerCount: buchbar.length,
      url,
    },
  }
  const faqSchema = faqJsonLd(faq)
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Pauschalreise', url: '/pauschalreise' },
    { name: z.name, url: `/pauschalreise/${ziel}` },
  ])

  return (
    <>
      <JsonLd data={[productSchema, faqSchema, breadcrumbSchema]} />

      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#2e75fa]">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li><Link href="/pauschalreise" className="hover:text-[#2e75fa]">Pauschalreise</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li className="text-[#0a1a3a] font-medium">{z.name}</li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a1a3a] tracking-tight">
          Pauschalreise {z.name}: Preise und beste Buchungsmonate
        </h1>

        {/* Answer-first Box */}
        <div className="mt-5 rounded-2xl bg-[#2e75fa]/8 border border-[#2e75fa]/20 p-5">
          <p className="text-[#0a1a3a] leading-relaxed font-medium">
            Pauschalreisen nach {z.name} (Flug + Hotel) gibt es ab {minPreis} € pro Person.
            Am günstigsten reist du im {MONAT_NAMEN[guenstigste[0].monat - 1]}, das beste
            Verhältnis aus Wetter und Preis bietet der {MONAT_NAMEN[sweetSpot.monat - 1]} ab {sweetSpot.preisAb} €.
          </p>
        </div>

        {/* Hero */}
        <div className="mt-6 relative aspect-[2/1] rounded-3xl overflow-hidden">
          <Image src={`/destinations/${ziel}.webp`} alt={`Pauschalreise ${z.name}`} fill className="object-cover" sizes="(max-width: 896px) 100vw, 896px" priority />
        </div>

        {/* Preistabelle */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-4">
            <CalendarDays className="w-6 h-6 inline mr-2 text-[#2e75fa]" />
            {z.name} Pauschalreise: Preis pro Monat
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0a1a3a]/10 text-left">
                  <th className="py-2 px-3 font-semibold text-[#0a1a3a]">Monat</th>
                  <th className="py-2 px-3 font-semibold text-[#0a1a3a]">Preis ab</th>
                  <th className="py-2 px-3 font-semibold text-[#0a1a3a]">Tag</th>
                  {!istBinnen && <th className="py-2 px-3 font-semibold text-[#0a1a3a]">Wasser</th>}
                  <th className="py-2 px-3 font-semibold text-[#0a1a3a]">Details</th>
                </tr>
              </thead>
              <tbody>
                {buchbar.map((m) => (
                  <tr key={m.monat} className={`border-b border-[#0a1a3a]/8 ${m.monat === guenstigste[0].monat ? 'bg-[#2e75fa]/5' : ''}`}>
                    <td className="py-2 px-3 font-medium text-[#0a1a3a]">
                      {MONAT_NAMEN[m.monat - 1]}
                      {m.monat === guenstigste[0].monat && <span className="ml-2 text-xs font-semibold text-[#2e75fa]">günstigster</span>}
                    </td>
                    <td className="py-2 px-3 text-[#0a1a3a]/75">{m.preisAb} €</td>
                    <td className="py-2 px-3 text-[#0a1a3a]/75">{m.tagMax}°C</td>
                    {!istBinnen && <td className="py-2 px-3 text-[#0a1a3a]/75">{m.wasser > 0 ? `${m.wasser}°C` : 'n. v.'}</td>}
                    <td className="py-2 px-3">
                      <Link href={`/reise/${ziel}/${MONAT_SLUGS[m.monat - 1]}`} className="text-[#2e75fa] hover:underline">
                        {z.name} im {MONAT_NAMEN[m.monat - 1]}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Prose */}
        <section className="mt-10 space-y-4">
          {absaetze.map((p, i) => (
            <p key={i} className="text-[#0a1a3a]/80 leading-relaxed">{p}</p>
          ))}
          {hatAnreise && (
            <p className="text-[#0a1a3a]/80 leading-relaxed flex items-start gap-2">
              <Plane className="w-5 h-5 text-[#2e75fa] mt-0.5 shrink-0" />
              <span>
                Mehr zur Anreise: <Link href={`/fragen/anreise-${ziel}`} className="text-[#2e75fa] hover:underline">Wie lange dauert der Flug nach {z.name}?</Link>
              </span>
            </p>
          )}
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-[#0a1a3a] text-white p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{z.name}-Angebote vergleichen</h2>
          <p className="text-white/75 mb-5">Aktuelle Pauschalreisen ab {minPreis} €, verglichen mit Check24.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/reiseziel/${ziel}`} className="inline-flex items-center gap-2 bg-[#2e75fa] hover:bg-[#1f5fd8] transition-colors text-white font-semibold rounded-full px-6 py-2.5">
              Handgepickte {z.name}-Deals <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/pauschalreisen" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 transition-colors text-white font-semibold rounded-full px-6 py-2.5">
              Selbst vergleichen
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#0a1a3a] mb-4">Häufige Fragen zur {z.name}-Pauschalreise</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
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

        {/* Interne Links */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[#0a1a3a] mb-3">Mehr zu {z.name}</h2>
          <ul className="space-y-2">
            {fragenLinks.map((l) => (
              <li key={l.slug}>
                <Link href={`/fragen/${l.slug}`} className="text-[#2e75fa] hover:underline flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" /> {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/reiseziel/${ziel}`} className="text-[#2e75fa] hover:underline flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" /> Alle {z.name}-Angebote
              </Link>
            </li>
          </ul>
        </section>

        <p className="mt-8 text-xs text-[#0a1a3a]/45">Preise: ab-Preise pro Person laut Datenstand, Stand {BUILD_DATE}. Tagesaktuelle Preise im Vergleich.</p>
      </article>
    </>
  )
}
