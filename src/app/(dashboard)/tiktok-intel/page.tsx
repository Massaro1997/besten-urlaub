export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TrendingUp, Flame, CheckCircle2, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react'

function fmt(n: number | bigint | null | undefined): string {
  if (n == null) return '—'
  const num = typeof n === 'bigint' ? Number(n) : n
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(num)
}

function pct(n: number | null | undefined): string {
  if (n == null) return '—'
  return (n * 100).toFixed(2) + '%'
}

function formatRelativeDate(d: Date): string {
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'oggi'
  if (days === 1) return 'ieri'
  if (days < 7) return `${days} giorni fa`
  if (days < 30) return `${Math.floor(days / 7)} sett fa`
  return `${Math.floor(days / 30)} mesi fa`
}

export default async function TikTokIntelPage() {
  const [destinations, totalVideos, topVideosPerDest] = await Promise.all([
    prisma.destinationTrend.findMany({
      orderBy: { totalViews: 'desc' },
    }),
    prisma.competitorVideo.count(),
    // For each destination, pull the single top video (by views) as proof
    prisma.competitorVideo.findMany({
      where: { destinationSlug: { not: null } },
      orderBy: [{ destinationSlug: 'asc' }, { playCount: 'desc' }],
    }),
  ])

  // Build a map: slug -> top video
  const topVideoBySlug = new Map<string, (typeof topVideosPerDest)[0]>()
  for (const v of topVideosPerDest) {
    if (v.destinationSlug && !topVideoBySlug.has(v.destinationSlug)) {
      topVideoBySlug.set(v.destinationSlug, v)
    }
  }

  // Which destinations do we already have offers for? Match by destination.slug
  const ourOffers = await prisma.offer.findMany({
    include: { destination: { select: { slug: true } } },
  })
  const ourSlugs = new Set(
    ourOffers.map((o) => o.destination.slug).filter(Boolean) as string[],
  )

  const lastScraped =
    destinations.length > 0
      ? destinations.reduce(
          (latest, d) =>
            d.lastScrapedAt > latest ? d.lastScrapedAt : latest,
          destinations[0].lastScrapedAt,
        )
      : null

  const totalViewsAll = destinations.reduce(
    (s, d) => s + Number(d.totalViews),
    0,
  )

  // Classify destinations:
  // - trending = in top 10 of ranking
  // - matched = we have an offer for it
  const top10 = new Set(destinations.slice(0, 10).map((d) => d.slug))
  const opportunities = destinations
    .slice(0, 10)
    .filter((d) => !ourSlugs.has(d.slug))
  const matched = destinations
    .slice(0, 10)
    .filter((d) => ourSlugs.has(d.slug))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">TikTok Destination Trends</h1>
            <p className="text-sm text-secondary">
              {destinations.length} destinazioni · {totalVideos} video · ultimo scrape:{' '}
              {lastScraped ? formatRelativeDate(lastScraped) : 'mai'}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-xs text-secondary font-mono">
          pnpm tsx scripts/tiktok-intel-scrape.ts
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Destinazioni tracciate"
          value={String(destinations.length)}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Video analizzati"
          value={String(totalVideos)}
          icon={<Flame className="w-4 h-4" />}
        />
        <StatCard
          label="Views aggregate"
          value={fmt(totalViewsAll)}
          icon={<Flame className="w-4 h-4" />}
        />
        <StatCard
          label="Opportunità top 10"
          value={`${opportunities.length} / 10`}
          icon={<AlertCircle className="w-4 h-4" />}
          highlight
        />
      </div>

      {/* Recommendations — prioritized action list based on data */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Cosa fare questa settimana</h3>
            <p className="text-xs text-secondary mt-0.5">
              Consigli automatici basati sui dati TikTok appena scrapati
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {opportunities.length > 0 && (
            <RecommendationItem
              priority="ALTA"
              title={`Crea ${opportunities.length} nuov${opportunities.length === 1 ? 'a offerta' : 'e offerte'} Check24`}
              detail={
                <>
                  Queste destinazioni sono nel top 10 di TikTok DE ma{' '}
                  <strong>non le hai ancora sul sito</strong>:{' '}
                  {opportunities.map((d, i) => (
                    <span key={d.slug}>
                      {i > 0 && ', '}
                      <strong>{d.label}</strong> ({fmt(d.totalViews)} views)
                    </span>
                  ))}
                  . Apri il Check24 Linkgenerator e aggiungile.
                </>
              }
            />
          )}

          {matched.length > 0 && (
            <RecommendationItem
              priority="MEDIA"
              title={`${matched.length} offer${matched.length === 1 ? 'ta tua' : 'te tue'} in trend — push${matched.length === 1 ? 'ala' : 'ale'} in homepage`}
              detail={
                <>
                  Hai già offerte per{' '}
                  {matched.map((d, i) => (
                    <span key={d.slug}>
                      {i > 0 && ', '}
                      <strong>{d.label}</strong>
                    </span>
                  ))}
                  . Sono nel top 10 del trend adesso — valuta di marcarle come{' '}
                  <code className="text-[10px] px-1 py-0.5 rounded bg-surface">
                    featured=true
                  </code>{' '}
                  per la sezione &quot;Top Deals&quot; della homepage.
                </>
              }
            />
          )}

          {destinations[0] && (
            <RecommendationItem
              priority="INFO"
              title={`Destinazione #1 assoluta: ${destinations[0].label}`}
              detail={
                <>
                  {fmt(destinations[0].totalViews)} views aggregate su{' '}
                  {destinations[0].videoCount} video. Clicca la riga nella tabella
                  per fare drill-down e scoprire quali{' '}
                  <strong>zone specifiche</strong> di {destinations[0].label}{' '}
                  sono più virali.
                </>
              }
            />
          )}

          {(() => {
            const lowVideo = destinations
              .slice(0, 15)
              .filter((d) => d.videoCount > 0 && d.videoCount < 10)
            if (lowVideo.length === 0) return null
            return (
              <RecommendationItem
                priority="INFO"
                title={`${lowVideo.length} destinazioni con pochi dati`}
                detail={
                  <>
                    {lowVideo.map((d) => d.label).join(', ')} hanno meno di 10
                    video scrapati. Dato meno affidabile — i numeri potrebbero
                    cambiare significativamente al prossimo scrape.
                  </>
                }
              />
            )
          })()}
        </div>
      </section>

      {/* Opportunities alert compact */}
      {opportunities.length > 0 && (
        <section className="rounded-xl border border-[#ff6b35]/20 bg-[#ff6b35]/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff6b35] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                🔥 {opportunities.length} destinazioni in trend senza offerta tua
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunities.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/tiktok-intel/${d.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#ff6b35]/30 text-xs font-medium hover:border-[#ff6b35]/60 hover:shadow-sm transition-all"
                  >
                    {d.label}
                    <span className="text-[#ff6b35] font-semibold">
                      {fmt(d.totalViews)}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#ff6b35]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main ranking table */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold">Ranking destinazioni</h2>
            <p className="text-xs text-secondary">
              Aggregato views dei video travel TikTok DE. Top = più trending adesso.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-medium w-12">#</th>
                <th className="text-left px-4 py-3 font-medium">Destinazione</th>
                <th className="text-right px-4 py-3 font-medium">Views</th>
                <th className="text-right px-4 py-3 font-medium">Video</th>
                <th className="text-right px-4 py-3 font-medium">Likes</th>
                <th className="text-right px-4 py-3 font-medium">Saves</th>
                <th className="text-right px-4 py-3 font-medium">Engage</th>
                <th className="text-right px-4 py-3 font-medium">Growth</th>
                <th className="text-center px-4 py-3 font-medium">Offerta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {destinations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-secondary">
                    Nessun dato ancora. Lancia lo script di scraping.
                  </td>
                </tr>
              ) : (
                destinations.map((d, i) => {
                  const hasOffer = ourSlugs.has(d.slug)
                  const isTop10 = i < 10
                  const topVid = topVideoBySlug.get(d.slug)
                  return (
                    <tr
                      key={d.id}
                      className={`hover:bg-surface/50 transition-colors ${
                        !hasOffer && isTop10 ? 'bg-[#ff6b35]/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-secondary font-mono text-xs">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/tiktok-intel/${d.slug}`}
                          className="group inline-flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
                        >
                          {d.label}
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="text-[10px] text-secondary font-mono mt-0.5">
                          {d.hashtags
                            .split(',')
                            .map((h) => `#${h}`)
                            .join(' ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        {fmt(d.totalViews)}
                      </td>
                      <td className="px-4 py-3 text-right text-secondary">
                        {d.videoCount}
                      </td>
                      <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">
                        {fmt(d.totalLikes)}
                      </td>
                      <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">
                        {fmt(d.totalSaves)}
                      </td>
                      <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">
                        {pct(d.avgEngagement)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs whitespace-nowrap">
                        {d.growthPct == null ? (
                          <span className="text-secondary/40">—</span>
                        ) : d.growthPct > 0 ? (
                          <span className="text-green-600 font-medium">
                            ↑ {d.growthPct.toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            ↓ {Math.abs(d.growthPct).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {hasOffer ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 inline" />
                        ) : isTop10 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#ff6b35] text-white text-[10px] font-semibold">
                            NUOVO
                          </span>
                        ) : (
                          <span className="text-secondary/30">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top video per destinazione (as proof) */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold">Video top per destinazione</h2>
          <p className="text-xs text-secondary">
            Il video più visto per ogni destinazione, come prova del trend. Click per aprirlo su TikTok.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {destinations.slice(0, 12).map((d, i) => {
            const v = topVideoBySlug.get(d.slug)
            if (!v) return null
            return (
              <a
                key={d.slug}
                href={v.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-border-light p-3 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">{d.label}</span>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        {fmt(v.playCount)}
                      </span>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2">
                      {v.description || '(no caption)'}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-secondary mt-1.5">
                      <span>@{v.username}</span>
                      <span>·</span>
                      <span>{formatRelativeDate(v.createTime)}</span>
                      {v.textLanguage && (
                        <>
                          <span>·</span>
                          <span className="uppercase">{v.textLanguage}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function RecommendationItem({
  priority,
  title,
  detail,
}: {
  priority: 'ALTA' | 'MEDIA' | 'INFO'
  title: string
  detail: React.ReactNode
}) {
  const colors = {
    ALTA: 'bg-[#ff6b35] text-white',
    MEDIA: 'bg-primary text-white',
    INFO: 'bg-secondary/20 text-secondary',
  }
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-border-light">
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${colors[priority]}`}
      >
        {priority}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-secondary mt-1 leading-relaxed">
          {detail}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        highlight ? 'border-[#ff6b35]/30 bg-[#ff6b35]/5' : 'border-border-light'
      }`}
    >
      <div className="flex items-center gap-2 text-secondary text-xs mb-1.5">
        {icon}
        {label}
      </div>
      <div
        className={`text-2xl font-semibold ${
          highlight ? 'text-[#ff6b35]' : ''
        }`}
      >
        {value}
      </div>
    </div>
  )
}
