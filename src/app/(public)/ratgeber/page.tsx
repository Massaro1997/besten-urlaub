import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { ratgeberArticles } from '@/lib/ratgeber-data'

export const metadata: Metadata = {
  title: 'Reise-Ratgeber | Bester Urlaub',
  description:
    'Alle Reise-Ratgeber auf Bester Urlaub: Inspiration & Insider-Tipps für deinen nächsten Urlaub. Entdecke die besten Reiseziele und Geheimtipps.',
}

export default function RatgeberIndexPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-[#2e75fa]" />
          <span className="text-xs font-semibold text-[#2e75fa] uppercase tracking-wider">
            Ratgeber
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a1a3a] tracking-tight mb-3">
          Reise-Ratgeber
        </h1>
        <p className="text-sm sm:text-base text-[#0a1a3a]/60 max-w-xl mx-auto">
          Inspiration &amp; Insider-Tipps f&uuml;r deinen n&auml;chsten Urlaub. Entdecke {ratgeberArticles.length} Reiseziele.
        </p>
      </div>

      {/* Grid of all articles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {ratgeberArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/ratgeber/${article.slug}`}
            className="group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a1a3a]/5">
              <Image
                src={article.heroImage}
                alt={article.destination}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a3a]/85 via-[#0a1a3a]/20 to-transparent" />

              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1a3a]">
                {article.country}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow group-hover:text-[#ff6b35] transition-colors">
                  {article.title}
                </h2>
                <p className="text-xs text-white/60 mt-1 hidden sm:block">
                  {article.destination}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
