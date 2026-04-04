export const dynamic = 'force-dynamic'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Flame, MapPin, AlertCircle, Terminal } from 'lucide-react'

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

interface SubLocationDef {
  slug: string
  label: string
  hashtags: string[]
}

function loadSubLocations(destinationSlug: string): SubLocationDef[] | null {
  try {
    const raw = readFileSync(
      join(process.cwd(), 'data', 'tiktok-sublocations.json'),
      'utf8',
    )
    const data = JSON.parse(raw) as Record<string, SubLocationDef[]>
    return data[destinationSlug] || null
  } catch {
    return null
  }
}

export default async function DestinationDrillDownPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [destination, subLocations, topVideoMap] = await Promise.all([
    prisma.destinationTrend.findUnique({ where: { slug } }),
    prisma.subLocationTrend.findMany({
      where: { destinationSlug: slug },
      orderBy: { totalViews: 'desc' },
    }),
    prisma.competitorVideo.findMany({
      where: { destinationSlug: slug },
      orderBy: { playCount: 'desc' },
      take: 10,
    }),
  ])

  if (!destination) {
    notFound()
  }

  const subDefs = loadSubLocations(slug)
  const hasSubConfig = subDefs != null && subDefs.length > 0
  const hasSubData = subLocations.length > 0
  const lastSubScrape =
    subLocations.length > 0
      ? subLocations.reduce(
          (latest, s) =>
            s.lastScrapedAt > latest ? s.lastScrapedAt : latest,
          subLocations[0].lastScrapedAt,
        )
      : null

  // Pre-index top video by its id for fast lookup in sublocation rows
  const videosById = new Map(topVideoMap.map((v) => [v.id, v]))

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/tiktok-intel"
          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground mb-3"
        >
          <ArrowLeft className="w-3 h-3" />
          Tutte le destinazioni
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{destination.label}</h1>
              <p className="text-sm text-secondary">
                Drill-down · {fmt(destination.totalViews)} views aggregate ·{' '}
                {destination.videoCount} video analizzati
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-level destination stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Views totali" value={fmt(destination.totalViews)} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Video" value={String(destination.videoCount)} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Likes" value={fmt(destination.totalLikes)} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Engagement medio" value={pct(destination.avgEngagement)} icon={<Flame className="w-4 h-4" />} />
      </div>

      {/* Sub-location ranking */}
      <section>
        <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold">Quale zona di {destination.label} è in trend?</h2>
            <p className="text-xs text-secondary">
              Drill-down per sotto-zona.{' '}
              {lastSubScrape
                ? `Ultimo scrape: ${formatRelativeDate(lastSubScrape)}.`
                : 'Nessun dato ancora — vedi sotto come eseguire.'}
            </p>
          </div>
        </div>

        {!hasSubConfig ? (
          <div className="rounded-xl border border-border-light bg-white p-6 text-center">
            <AlertCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">
              Nessuna sotto-zona configurata per {destination.label}
            </p>
            <p className="text-xs text-secondary">
              Aggiungi {destination.label} in{' '}
              <code className="text-[10px] px-1 py-0.5 rounded bg-surface">
                data/tiktok-sublocations.json
              </code>{' '}
              per abilitare il drill-down.
            </p>
          </div>
        ) : !hasSubData ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <Terminal className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  Esegui il drill-down scrape
                </h3>
                <p className="text-xs text-secondary mb-3">
                  Il sistema ha {subDefs.length} sotto-zone configurate per{' '}
                  {destination.label}. Lancia questo comando nel terminale per
                  scraparle tutte (~60 secondi, ~$0.03):
                </p>
                <div className="bg-foreground/90 text-white text-xs font-mono rounded-lg px-4 py-3 mb-3 overflow-x-auto">
                  npx tsx --env-file=.env.local scripts/tiktok-intel-drill.ts {slug}
                </div>
                <p className="text-xs text-secondary">
                  Sotto-zone che verranno scrapate:{' '}
                  {subDefs.map((s, i) => (
                    <span key={s.slug}>
                      {i > 0 && ', '}
                      <strong>{s.label}</strong>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-12">#</th>
                  <th className="text-left px-4 py-3 font-medium">Zona</th>
                  <th className="text-right px-4 py-3 font-medium">Views</th>
                  <th className="text-right px-4 py-3 font-medium">Video</th>
                  <th className="text-right px-4 py-3 font-medium">Saves</th>
                  <th className="text-right px-4 py-3 font-medium">Engage</th>
                  <th className="text-left px-4 py-3 font-medium">Top video</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {subLocations.map((s, i) => {
                  const topVid = s.topVideoId ? videosById.get(s.topVideoId) : null
                  return (
                    <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-secondary font-mono text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{s.label}</div>
                        <div className="text-[10px] text-secondary font-mono mt-0.5">
                          {s.hashtags
                            .split(',')
                            .map((h) => `#${h}`)
                            .join(' ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        {fmt(s.totalViews)}
                      </td>
                      <td className="px-4 py-3 text-right text-secondary">{s.videoCount}</td>
                      <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">{fmt(s.totalSaves)}</td>
                      <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">{pct(s.avgEngagement)}</td>
                      <td className="px-4 py-3 max-w-xs">
                        {topVid ? (
                          <a
                            href={topVid.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-foreground hover:text-primary line-clamp-1"
                          >
                            {topVid.description || '(no caption)'}
                          </a>
                        ) : (
                          <span className="text-xs text-secondary/40">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Update scrape hint even when data exists */}
        {hasSubData && (
          <p className="text-[10px] text-secondary mt-2 font-mono">
            Aggiorna: npx tsx --env-file=.env.local scripts/tiktok-intel-drill.ts {slug}
          </p>
        )}
      </section>

      {/* Top videos for the whole destination as proof */}
      {topVideoMap.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3">Top 10 video su {destination.label}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topVideoMap.map((v, i) => (
              <a
                key={v.id}
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
                      <span className="text-xs font-medium">@{v.username}</span>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        {fmt(v.playCount)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2">
                      {v.description || '(no caption)'}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-secondary mt-1.5">
                      <span>{formatRelativeDate(v.createTime)}</span>
                      {v.textLanguage && (
                        <>
                          <span>·</span>
                          <span className="uppercase">{v.textLanguage}</span>
                        </>
                      )}
                      {v.musicTitle && (
                        <>
                          <span>·</span>
                          <span className="truncate">🎵 {v.musicTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-border-light p-4">
      <div className="flex items-center gap-2 text-secondary text-xs mb-1.5">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
