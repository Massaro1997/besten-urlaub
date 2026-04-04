export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TrendingUp, Users, Video, Heart, Eye } from 'lucide-react'

// Small number formatter with German-friendly separators
function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function pct(n: number | null | undefined): string {
  if (n == null) return '—'
  return (n * 100).toFixed(2) + '%'
}

function formatRelativeDate(d: Date): string {
  const now = Date.now()
  const diff = now - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'oggi'
  if (days === 1) return 'ieri'
  if (days < 7) return `${days} giorni fa`
  if (days < 30) return `${Math.floor(days / 7)} sett fa`
  if (days < 365) return `${Math.floor(days / 30)} mesi fa`
  return `${Math.floor(days / 365)} anni fa`
}

export default async function TikTokIntelPage() {
  // Pull everything we need in parallel
  const [accounts, topVideos, recentVideos, totalVideos] = await Promise.all([
    prisma.competitorAccount.findMany({
      orderBy: { followerCount: 'desc' },
      include: { _count: { select: { videos: true } } },
    }),
    prisma.competitorVideo.findMany({
      orderBy: { playCount: 'desc' },
      take: 20,
    }),
    prisma.competitorVideo.findMany({
      orderBy: { createTime: 'desc' },
      take: 10,
    }),
    prisma.competitorVideo.count(),
  ])

  const totalViews = topVideos.reduce((sum, v) => sum + v.playCount, 0)
  const avgEngagement =
    topVideos.length > 0
      ? topVideos.reduce((sum, v) => sum + (v.engagementRate || 0), 0) /
        topVideos.length
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">TikTok Competitor Intel</h1>
            <p className="text-sm text-secondary">
              {accounts.length} competitor · {totalVideos} video · ultimo scrape:{' '}
              {accounts[0]?.lastScrapedAt
                ? formatRelativeDate(accounts[0].lastScrapedAt)
                : 'mai'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-sm text-secondary">
          <span className="font-mono text-xs">
            pnpm tsx scripts/tiktok-intel-scrape.ts
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Competitor tracciati"
          value={String(accounts.length)}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Video totali"
          value={String(totalVideos)}
          icon={<Video className="w-4 h-4" />}
        />
        <StatCard
          label="Views top 20"
          value={fmt(totalViews)}
          icon={<Eye className="w-4 h-4" />}
        />
        <StatCard
          label="Engagement medio top 20"
          value={pct(avgEngagement)}
          icon={<Heart className="w-4 h-4" />}
        />
      </div>

      {/* Competitor accounts overview */}
      <section>
        <h2 className="text-base font-semibold mb-3">Account tracciati</h2>
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Username</th>
                <th className="text-left px-4 py-3 font-medium">Categoria</th>
                <th className="text-right px-4 py-3 font-medium">Follower</th>
                <th className="text-right px-4 py-3 font-medium">Video tot</th>
                <th className="text-right px-4 py-3 font-medium">Likes tot</th>
                <th className="text-right px-4 py-3 font-medium">Video scrapati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-secondary">
                    Nessun competitor ancora scrapato. Lancia lo script dal terminale.
                  </td>
                </tr>
              ) : (
                accounts.map((a) => (
                  <tr key={a.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={`https://www.tiktok.com/@${a.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary"
                      >
                        @{a.username}
                      </a>
                      {a.verified && (
                        <span className="ml-1.5 text-xs text-primary">✓</span>
                      )}
                      {a.nickname && (
                        <div className="text-xs text-secondary mt-0.5">
                          {a.nickname}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a.category && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {a.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {fmt(a.followerCount)}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary">
                      {fmt(a.videoCount)}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary">
                      {fmt(a.heartCount)}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary">
                      {a._count.videos}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top viral videos */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold">Top 20 video virali</h2>
            <p className="text-xs text-secondary">
              Ordinati per views, tra tutti i competitor tracciati
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topVideos.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-secondary">
              Nessun video ancora. Lancia lo script.
            </div>
          ) : (
            topVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} rank={i + 1} />
            ))
          )}
        </div>
      </section>

      {/* Recent videos */}
      {recentVideos.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3">Ultimi pubblicati</h2>
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-left px-4 py-3 font-medium">Account</th>
                  <th className="text-left px-4 py-3 font-medium">Descrizione</th>
                  <th className="text-right px-4 py-3 font-medium">Views</th>
                  <th className="text-right px-4 py-3 font-medium">Engage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {recentVideos.map((v) => (
                  <tr key={v.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">
                      {formatRelativeDate(v.createTime)}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://www.tiktok.com/@${v.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium hover:text-primary"
                      >
                        @{v.username}
                      </a>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-foreground hover:text-primary line-clamp-2"
                      >
                        {v.description || '(no caption)'}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                      {fmt(v.playCount)}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary whitespace-nowrap">
                      {pct(v.engagementRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function VideoCard({
  video,
  rank,
}: {
  video: {
    id: string
    username: string
    videoUrl: string
    description: string | null
    playCount: number
    diggCount: number
    commentCount: number
    shareCount: number
    collectCount: number
    engagementRate: number | null
    createTime: Date
    duration: number | null
    musicTitle: string | null
  }
  rank: number
}) {
  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-border-light p-4 hover:shadow-sm hover:border-primary/30 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">@{video.username}</span>
            <span className="text-xs text-secondary">·</span>
            <span className="text-xs text-secondary">
              {formatRelativeDate(video.createTime)}
            </span>
            {video.duration && (
              <>
                <span className="text-xs text-secondary">·</span>
                <span className="text-xs text-secondary">{video.duration}s</span>
              </>
            )}
          </div>
          <p className="text-sm text-foreground line-clamp-2 mb-2">
            {video.description || '(no caption)'}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-primary">
              {fmt(video.playCount)} views
            </span>
            <span className="text-secondary">❤️ {fmt(video.diggCount)}</span>
            <span className="text-secondary">💬 {fmt(video.commentCount)}</span>
            <span className="text-secondary">🔖 {fmt(video.collectCount)}</span>
            {video.engagementRate != null && (
              <span className="text-secondary ml-auto">
                engage {pct(video.engagementRate)}
              </span>
            )}
          </div>
          {video.musicTitle && (
            <p className="text-xs text-secondary mt-1.5">
              🎵 {video.musicTitle}
            </p>
          )}
        </div>
      </div>
    </a>
  )
}
