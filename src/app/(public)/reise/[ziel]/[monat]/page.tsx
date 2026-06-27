import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight, Sun, Droplets, Thermometer, CloudRain, CalendarDays, Plane } from 'lucide-react'
import { JsonLd } from '@/components/public/json-ld'
import {
  SITE_URL,
  breadcrumbJsonLd,
  faqJsonLd,
  articleJsonLd,
} from '@/lib/seo-jsonld'
import {
  getAllReisemonatParams,
  getReisemonat,
  buildReisemonatContent,
} from '@/lib/reisemonat'
import { MONAT_NAMEN, MONAT_SLUGS } from '@/data/reise-klima'
import { ratgeberArticles } from '@/lib/ratgeber-data'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllReisemonatParams()
}

interface PageProps {
  params: Promise<{ ziel: string; monat: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ziel, monat } = await params
  const page = getReisemonat(ziel, monat)
  if (!page) return { title: 'Seite nicht gefunden | Bester Urlaub' }

  const { ziel: z, monat: m, monatName } = page
  const url = `${SITE_URL}/reise/${ziel}/${monat}`
  const title = `${z.name} im ${monatName}: Wetter, Wassertemperatur & Preise`
  const description = `${z.name} im ${monatName}: ${m.tagMax}°C am Tag, ${m.wasser}°C Wasser, ${m.sonne} Sonnenstunden. Pauschalreise ab ${m.preisAb} €. Beste Reisezeit, Klima & Tipps.`

  return {
    title: `${title} | Bester Urlaub`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'de_DE',
      url,
      siteName: 'Bester Urlaub',
      images: [{ url: `/destinations/${ziel}.webp`, width: 1200, height: 630, alt: z.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/destinations/${ziel}.webp`],
    },
  }
}

export default async function ReisemonatPage({ params }: PageProps) {
  const { ziel, monat } = await params
  const page = getReisemonat(ziel, monat)
  if (!page) notFound()

  const { ziel: z, monat: m, monatName, monatIndex } = page
  const c = buildReisemonatContent(page)
  const url = `${SITE_URL}/reise/${ziel}/${monat}`
  const heroImage = `/destinations/${ziel}.webp`

  // sibling months for internal linking — nur buchbare Monate (preisAb > 0),
  // damit keine Links auf 404-Seiten zeigen (Gate 6 sauber).
  const siblings = z.monate
    .filter((sm) => sm.preisAb > 0)
    .map((sm) => ({
      name: MONAT_NAMEN[sm.monat - 1],
      slug: MONAT_SLUGS[sm.monat - 1],
      aktiv: sm.monat === m.monat,
      preisAb: sm.preisAb,
    }))


  const stats = [
    { icon: Thermometer, label: 'Tagestemperatur', value: `${m.tagMax}°C` },
    { icon: Thermometer, label: 'Nachts', value: `${m.tagMin}°C` },
    ...(c.istBinnen ? [] : [{ icon: Droplets, label: 'Wassertemperatur', value: `${m.wasser}°C` }]),
    { icon: Sun, label: 'Sonnenstunden', value: `${m.sonne} h` },
    { icon: CloudRain, label: 'Regentage', value: `${m.regen}` },
    { icon: CalendarDays, label: 'Pauschalreise ab', value: `${m.preisAb} €` },
  ]

  /* ---- FAQ (datengetrieben, divergiert pro Monat) ---- */
  const faqItems = [
    {
      q: `Wie ist das Wetter auf ${z.name} im ${monatName}?`,
      a: `Im ${monatName} liegt die Tagestemperatur auf ${z.name} bei rund ${m.tagMax}°C, nachts bei ${m.tagMin}°C. Das Meer hat ${m.wasser}°C, es gibt etwa ${m.sonne} Sonnenstunden pro Tag und ${m.regen} Regentage.`,
    },
    ...(c.istBinnen ? [] : [{
      q: `Kann man auf ${z.name} im ${monatName} baden?`,
      a: `Bei ${m.wasser}°C Wassertemperatur ${m.wasser >= 22 ? `ist Baden im ${monatName} ohne Weiteres möglich` : m.wasser >= 19 ? `ist Baden erfrischend, aber für die meisten gut machbar` : `ist das Meer für längeres Baden zu kühl`}.`,
    }]),
    {
      q: `Was kostet ein Urlaub auf ${z.name} im ${monatName}?`,
      a: `Eine Pauschalreise nach ${z.name} startet im ${monatName} ab ${m.preisAb} € pro Person inklusive Flug und Hotel. Es ist ${c.andrangText}.`,
    },
    {
      q: `Was kann man auf ${z.name} im ${monatName} unternehmen?`,
      a: m.highlights.join(' '),
    },
  ]

  const faqSchema = faqJsonLd(faqItems.map((f) => ({ q: f.q, a: f.a })))
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Startseite', url: '/' },
    { name: 'Reisezeit', url: '/reise' },
    { name: z.name, url: `/reiseziel/${ziel}` },
    { name: monatName, url: `/reise/${ziel}/${monat}` },
  ])
  const articleSchema = articleJsonLd({
    headline: `${z.name} im ${monatName}: Wetter, Wassertemperatur & Preise`,
    description: c.intro,
    url,
    image: heroImage,
    datePublished: '2026-06-16',
    dateModified: '2026-06-16',
  })

  return (
    <>
      <JsonLd data={[articleSchema, faqSchema, breadcrumbSchema]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li><Link href="/" className="hover:text-[#2e75fa] transition-colors">Startseite</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li><Link href="/reise" className="hover:text-[#2e75fa] transition-colors">Reisezeit</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li><Link href={`/reiseziel/${ziel}`} className="hover:text-[#2e75fa] transition-colors">{z.name}</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5 inline" /></li>
          <li className="text-[#0a1a3a] font-medium">{monatName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
        <Image src={heroImage} alt={`${z.name} im ${monatName}`} fill className="object-cover" priority quality={85} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/65 via-[#0a1a3a]/45 to-[#0a1a3a]/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-4">
            {z.land} · {m.andrang === 'hoch' ? 'Hauptsaison' : m.andrang === 'mittel' ? 'Nebensaison' : 'Vorsaison'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {z.name} im {monatName}
          </h1>
          <p className="text-white/85 text-lg mt-3 max-w-2xl mx-auto">{c.intro}</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Klima-Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#0a1a3a]/10 p-4 text-center shadow-sm">
              <s.icon className="w-5 h-5 mx-auto text-[#2e75fa] mb-1.5" />
              <div className="text-2xl font-bold text-[#0a1a3a]">{s.value}</div>
              <div className="text-xs text-[#0a1a3a]/55 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wetter & Klima */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-3">Wetter auf {z.name} im {monatName}</h2>
          <p className="text-[#0a1a3a]/80 leading-relaxed">{c.klimaSatz}</p>
        </section>

        {/* Highlights als Fließtext = der divergente Realwert, strukturell variiert */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-3">Was ist im {monatName} auf {z.name} los?</h2>
          {c.highlightsProse ? (
            <p className="text-[#0a1a3a]/80 leading-relaxed">{c.highlightsProse}</p>
          ) : (
            <ul className="space-y-2.5">
              {m.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-[#0a1a3a]/80 leading-relaxed">
                  <span className="text-[#2e75fa] mt-1 shrink-0">●</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Preise & Anreise */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-3">Preise & Anreise</h2>
          <p className="text-[#0a1a3a]/80 leading-relaxed">{c.preiseAnreiseProse}</p>
          <p className="text-[#0a1a3a]/80 leading-relaxed mt-3 flex items-start gap-2">
            <Plane className="w-5 h-5 text-[#2e75fa] mt-0.5 shrink-0" />
            <span>Der Flug von Deutschland dauert rund {z.flugStunden} Stunden zum Flughafen {z.flughafen}, die Zeitverschiebung beträgt {z.zeitverschiebung} {z.zeitverschiebung === 1 ? 'Stunde' : 'Stunden'}. Abflug ab {z.abflug.join(', ')}.</span>
          </p>
          <p className="text-[#0a1a3a]/80 leading-relaxed mt-3"><strong>Was anziehen?</strong> {c.packSatz}</p>
        </section>

        {/* CTA */}
        <div className="rounded-3xl bg-[#0a1a3a] text-white p-6 sm:p-8 mb-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">{z.name}-Angebote im {monatName}</h3>
          <p className="text-white/75 mb-5">Ab {m.preisAb} € pro Person — handgepickte Deals, verglichen mit Check24.</p>
          <Link
            href={`/reiseziel/${ziel}`}
            className="inline-flex items-center gap-2 bg-[#2e75fa] hover:bg-[#1f5fd8] transition-colors text-white font-semibold rounded-full px-7 py-3"
          >
            {z.name}-Angebote ansehen
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* FAQ (sichtbar, deckt sich mit FAQ-Schema) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-4">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqItems.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-[#0a1a3a]/10 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-[#0a1a3a] list-none flex items-center justify-between">
                  {f.q}
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-[#0a1a3a]/75 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sibling months — internal linking (Gate 6) */}
        <section>
          <h2 className="text-xl font-bold text-[#0a1a3a] mb-4">{z.name} in anderen Monaten</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/reise/${ziel}/${s.slug}`}
                aria-current={s.aktiv ? 'page' : undefined}
                className={`rounded-xl border px-3 py-2.5 text-center transition-colors ${
                  s.aktiv
                    ? 'border-[#2e75fa] bg-[#2e75fa]/10 text-[#2e75fa] font-semibold'
                    : 'border-[#0a1a3a]/10 bg-white text-[#0a1a3a]/80 hover:border-[#2e75fa] hover:text-[#2e75fa]'
                }`}
              >
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs opacity-70">ab {s.preisAb} €</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-axis links: Ratgeber + Reise-Fragen für dieselbe Destination */}
        <nav className="mt-8 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#0a1a3a]/55">
          <Link href={`/reiseziel/${ziel}`} className="text-[#2e75fa] hover:underline">{z.name}-Angebote</Link>
          <Link href={`/fragen/beste-reisezeit-${ziel}`} className="text-[#2e75fa] hover:underline">Beste Reisezeit {z.name}</Link>
          {ratgeberArticles.some((r) => r.slug === ziel) && (
            <Link href={`/ratgeber/${ziel}`} className="text-[#2e75fa] hover:underline">{z.name} Reiseführer</Link>
          )}
        </nav>
      </article>
    </>
  )
}
