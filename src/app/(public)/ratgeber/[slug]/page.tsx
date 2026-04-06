import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Lightbulb, MapPin, ArrowLeft } from 'lucide-react'
import { ratgeberArticles } from '@/lib/ratgeber-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = ratgeberArticles.find((a) => a.slug === slug)

  if (!article) {
    return { title: 'Ratgeber nicht gefunden | Bester Urlaub' }
  }

  return {
    title: `${article.title} | Reise-Ratgeber | Bester Urlaub`,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
      locale: 'de_DE',
      images: [{ url: article.heroImage, width: 1200, height: 630, alt: article.title }],
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Static params                                                     */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return ratgeberArticles.map((a) => ({ slug: a.slug }))
}

/* ------------------------------------------------------------------ */
/*  Helper — pick N random related articles                           */
/* ------------------------------------------------------------------ */

function getRelatedArticles(currentSlug: string, count: number) {
  const others = ratgeberArticles.filter((a) => a.slug !== currentSlug)
  const shuffled = [...others].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function RatgeberArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = ratgeberArticles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const related = getRelatedArticles(article.slug, 3)

  // Insert the Check24 banner after the 2nd section (index 1)
  const bannerAfterIndex = 1

  return (
    <>
      {/* ---- Breadcrumb ---- */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      >
        <ol className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60">
          <li>
            <Link href="/" className="hover:text-[#2e75fa] transition-colors">
              Startseite
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 inline" />
          </li>
          <li>
            <Link
              href="/"
              className="hover:text-[#2e75fa] transition-colors"
            >
              Ratgeber
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 inline" />
          </li>
          <li className="text-[#0a1a3a] font-medium truncate max-w-[200px]">
            {article.destination}
          </li>
        </ol>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 overflow-hidden">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a3a]/60 via-[#0a1a3a]/40 to-[#0a1a3a]/80" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-4">
            <MapPin className="w-3 h-3" />
            {article.destination}, {article.country}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-lg">
            {article.title}
          </h1>

          <p className="text-white/70 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {article.intro}
          </p>
        </div>
      </section>

      {/* ---- Article Body with Sidebar ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex gap-8 lg:gap-12">
          {/* Main content */}
          <article className="flex-1 max-w-3xl">
            {article.sections.map((section, idx) => (
              <div key={idx}>
                <section className="mb-10">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight mb-4">
                    {section.title}
                  </h2>
                  <p className="text-[#0a1a3a] text-base leading-relaxed">
                    {section.content}
                  </p>
                </section>

                {/* Horizontal banner between sections — mobile + tablet */}
                {idx === 1 && (
                  <div className="lg:hidden my-8">
                    <p className="text-[9px] text-[#0a1a3a]/25 uppercase tracking-wider mb-1.5">Anzeige</p>
                    <a
                      href="https://a.check24.net/misc/click.php?pid=1168044&aid=256&deep=pauschalreisen-vergleich&cat=9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src="https://a.check24.net/misc/view.php?pid=1168044&aid=256&cat=9"
                        width={728}
                        height={90}
                        alt="Check24 Pauschalreisen"
                        className="w-full rounded-lg"
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}

        {/* ---- Tips Box ---- */}
        <div className="bg-[#2e75fa]/5 border border-[#2e75fa]/10 rounded-2xl p-6 sm:p-8 my-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#2e75fa]" />
            <h3 className="text-lg font-bold text-[#0a1a3a]">
              Insider-Tipps
            </h3>
          </div>
          <ul className="space-y-3">
            {article.tips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-[#0a1a3a] text-sm sm:text-base leading-relaxed">
                <span className="text-[#2e75fa] font-bold mt-0.5 shrink-0">
                  {idx + 1}.
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Offer CTA */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden my-12">
          <div className="h-1 bg-gradient-to-r from-[#ff6b35] via-[#ff6b35] to-[#2e75fa]" />
          <div className="p-6 sm:p-8">
            <p className="text-xs text-[#0a1a3a]/40 uppercase tracking-wider font-medium mb-1">
              Unser Deal f&uuml;r dich
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight">
              {article.offerTitle}
              <span className="text-[#2e75fa] ml-2">{article.offerPrice}</span>
            </h3>
            <p className="text-sm text-[#0a1a3a]/50 mt-2 mb-5">
              Flug + Hotel. Gepr&uuml;ft. Handverlesen. Greif zu, bevor es andere tun.
            </p>
            <Link
              href={article.offerLink}
              className="inline-flex items-center gap-2 bg-[#ff6b35] text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#e55a2b] active:scale-95 transition-all shadow-md shadow-[#ff6b35]/20"
            >
              Zum Angebot
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Horizontal banner at bottom of article */}
        <div className="my-8">
          <p className="text-[9px] text-[#0a1a3a]/25 uppercase tracking-wider mb-1.5">Anzeige</p>
          <a
            href="https://a.check24.net/misc/click.php?pid=1168044&aid=257&deep=pauschalreisen-vergleich&cat=9"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="https://a.check24.net/misc/view.php?pid=1168044&aid=257&cat=9"
              width={468}
              height={60}
              alt="Check24"
              className="w-full max-w-md rounded-lg"
            />
          </a>
        </div>
      </article>

          {/* Sidebar with vertical banner */}
          <aside className="hidden lg:block w-[180px] shrink-0 pt-4">
            <div className="sticky top-20">
              <p className="text-[9px] text-[#0a1a3a]/25 uppercase tracking-wider mb-1.5">Anzeige</p>
              <a
                href="https://a.check24.net/misc/click.php?pid=1168044&aid=260&deep=pauschalreisen-vergleich&cat=9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://a.check24.net/misc/view.php?pid=1168044&aid=260&cat=9"
                  width={160}
                  height={600}
                  alt="Check24 Pauschalreisen"
                  className="rounded-lg"
                />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ---- Related Articles ---- */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight mb-6">
            Weitere Ratgeber
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/ratgeber/${rel.slug}`}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={rel.heroImage}
                    alt={rel.destination}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a3a]/60 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1a3a]">
                    {rel.country}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#0a1a3a] line-clamp-2 group-hover:text-[#2e75fa] transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-[#0a1a3a]/50 mt-1 line-clamp-2">
                    {rel.metaDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Back link ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2e75fa] hover:text-[#1a5fe0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zur&uuml;ck zur Startseite
        </Link>
      </div>
    </>
  )
}
