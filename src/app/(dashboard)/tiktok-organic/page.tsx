export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Video,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function fmt(n: bigint | number | null | undefined): string {
  if (n == null) return '—'
  const v = typeof n === 'bigint' ? Number(n) : n
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return String(v)
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${(n * 100).toFixed(1)}%`
}

export default async function TikTokOrganicPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; advertisers?: string; detail?: string }>
}) {
  const params = await searchParams

  const [creatorTokens, advertiserTokens, videos, insights] = await Promise.all([
    prisma.tikTokToken.findMany({ where: { flow: 'creator' } }),
    prisma.tikTokToken.findMany({ where: { flow: 'advertiser' } }),
    prisma.tikTokCreatorVideo.findMany({
      orderBy: { viewCount: 'desc' },
      take: 50,
    }),
    prisma.tikTokCreatorInsight.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    }),
  ])

  const latestInsight = insights[0]
  const prevInsight = insights.find(
    (i) =>
      latestInsight && i.date.getTime() < latestInsight.date.getTime(),
  )

  const followerDelta =
    latestInsight && prevInsight
      ? latestInsight.followerCount - prevInsight.followerCount
      : 0

  const totalViews = videos.reduce((s, v) => s + Number(v.viewCount), 0)
  const totalLikes = videos.reduce((s, v) => s + Number(v.likeCount), 0)
  const totalComments = videos.reduce((s, v) => s + Number(v.commentCount), 0)
  const totalShares = videos.reduce((s, v) => s + Number(v.shareCount), 0)
  const avgEngagement =
    videos.length > 0
      ? videos.reduce((s, v) => s + (v.engagementRate ?? 0), 0) / videos.length
      : 0

  const stats = [
    {
      label: 'Follower',
      value: fmt(latestInsight?.followerCount),
      sub:
        followerDelta === 0
          ? 'nessun delta'
          : `${followerDelta > 0 ? '+' : ''}${followerDelta} vs ieri`,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      label: 'Video totali',
      value: videos.length,
      sub: `${fmt(latestInsight?.videoCount)} da API`,
      icon: Video,
      color: 'text-[#007aff]',
      bg: 'bg-[#007aff]/10',
    },
    {
      label: 'Views totali',
      value: fmt(totalViews),
      sub: `${fmt(totalLikes)} likes`,
      icon: Eye,
      color: 'text-[#af52de]',
      bg: 'bg-[#af52de]/10',
    },
    {
      label: 'Engagement medio',
      value: fmtPct(avgEngagement),
      sub: `${fmt(totalComments)} commenti, ${fmt(totalShares)} share`,
      icon: Activity,
      color: avgEngagement > 0.05 ? 'text-success' : 'text-secondary',
      bg: avgEngagement > 0.05 ? 'bg-[#34c759]/10' : 'bg-surface',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">TikTok Organic</h1>
        <p className="text-secondary text-sm mt-1">
          Performance account @bestenurlaub via Creator API
        </p>
      </div>

      {/* Banner esiti OAuth */}
      {params.connected && (
        <Card className="flex items-start gap-3 bg-[#34c759]/5 border-[#34c759]/30">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Account Creator collegato</p>
            <p className="text-secondary mt-1">
              open_id: <code className="text-xs">{params.connected}</code>. Clicca
              &quot;Sincronizza ora&quot; per importare video + insights.
            </p>
          </div>
        </Card>
      )}
      {params.advertisers && (
        <Card className="flex items-start gap-3 bg-[#34c759]/5 border-[#34c759]/30">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Advertiser collegato</p>
            <p className="text-secondary mt-1">
              advertiser_ids: <code className="text-xs">{params.advertisers}</code>
            </p>
          </div>
        </Card>
      )}
      {params.error && (
        <Card className="flex items-start gap-3 bg-[#ff3b30]/5 border-[#ff3b30]/30">
          <AlertTriangle className="w-5 h-5 text-[#ff3b30] shrink-0 mt-0.5" />
          <div className="text-sm min-w-0">
            <p className="font-semibold">Errore OAuth</p>
            <p className="text-secondary mt-1">
              Codice: <code className="text-xs">{params.error}</code>
            </p>
            {params.detail && (
              <pre className="text-[11px] text-secondary mt-2 p-2 bg-surface rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                {decodeURIComponent(params.detail)}
              </pre>
            )}
          </div>
        </Card>
      )}

      {/* Connessioni */}
      <div>
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          Connessioni
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">TikTok Creator</p>
                <p className="text-sm text-secondary mt-1">
                  Account organico (@bestenurlaub). Scope: video.list, video.insights,
                  user.info, comment.list, publish/upload.
                </p>
              </div>
              {creatorTokens.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#34c759]/10 text-success text-xs font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> {creatorTokens.length} attivo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface text-secondary text-xs font-medium shrink-0">
                  non collegato
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href="/api/tiktok/creator/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
              >
                {creatorTokens.length > 0 ? 'Ricollega' : 'Collega account'}
              </Link>
              {creatorTokens.length > 0 && (
                <Link
                  href="/api/tiktok/creator/refresh"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light text-sm font-medium hover:bg-surface"
                >
                  Sincronizza ora
                </Link>
              )}
            </div>
            {creatorTokens.map((t) => (
              <p key={t.id} className="text-[11px] text-secondary/70 mt-2 tabular-nums">
                open_id {t.accountKey} · scade{' '}
                {t.expiresAt.toLocaleDateString('de-DE')}
              </p>
            ))}
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">TikTok Advertiser</p>
                <p className="text-sm text-secondary mt-1">
                  Ads Manager (Reporting API). Pull automatico spend/impression/CPC —
                  sostituisce input manuale.
                </p>
              </div>
              {advertiserTokens.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#34c759]/10 text-success text-xs font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> {advertiserTokens.length} attivo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface text-secondary text-xs font-medium shrink-0">
                  non collegato
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href="/api/tiktok/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
              >
                {advertiserTokens.length > 0 ? 'Ricollega' : 'Collega Ads'}
              </Link>
            </div>
            {advertiserTokens.map((t) => (
              <p key={t.id} className="text-[11px] text-secondary/70 mt-2 tabular-nums">
                advertiser_id {t.accountKey}
              </p>
            ))}
          </Card>
        </div>
      </div>

      {/* Stats */}
      {creatorTokens.length > 0 && (
        <>
          <div>
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Performance account
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <Card key={s.label} className="flex items-start gap-4">
                  <div className={`${s.bg} rounded-xl p-2.5 shrink-0`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                    <p className="text-xs text-secondary mt-0.5">{s.label}</p>
                    {s.sub && (
                      <p className="text-[11px] text-secondary/70 mt-0.5 truncate">
                        {s.sub}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Top videos */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top video per views</h2>
              <p className="text-xs text-secondary">
                {videos.length} video sincronizzati
              </p>
            </div>
            {videos.length === 0 ? (
              <p className="text-sm text-secondary py-8 text-center">
                Nessun video ancora sincronizzato. Clicca &quot;Sincronizza ora&quot; sopra.
              </p>
            ) : (
              <div className="space-y-2">
                {videos.slice(0, 20).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 py-2 border-b border-border-light last:border-0"
                  >
                    {v.coverUrl ? (
                      <Image
                        src={v.coverUrl}
                        alt=""
                        width={48}
                        height={72}
                        className="w-12 h-18 rounded-md object-cover shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-18 rounded-md bg-surface shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {v.description || v.title || v.id}
                      </p>
                      <p className="text-[11px] text-secondary tabular-nums">
                        {v.createTime.toLocaleDateString('de-DE')} ·{' '}
                        {v.duration ?? 0}s · ER {fmtPct(v.engagementRate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs tabular-nums shrink-0">
                      <span className="flex items-center gap-1 text-secondary">
                        <Eye className="w-3.5 h-3.5" /> {fmt(v.viewCount)}
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Heart className="w-3.5 h-3.5" /> {fmt(v.likeCount)}
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <MessageCircle className="w-3.5 h-3.5" /> {fmt(v.commentCount)}
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Share2 className="w-3.5 h-3.5" /> {fmt(v.shareCount)}
                      </span>
                      {v.shareUrl && (
                        <a
                          href={v.shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          apri
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {creatorTokens.length === 0 && (
        <Card className="flex items-start gap-3 bg-[#ff9f0a]/5 border-[#ff9f0a]/30">
          <AlertTriangle className="w-5 h-5 text-[#ff9f0a] shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Nessun account Creator collegato</p>
            <p className="text-secondary mt-1">
              Clicca &quot;Collega account&quot; sopra per autorizzare l&apos;app TikTok
              Developer a leggere video e insights di @bestenurlaub.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
