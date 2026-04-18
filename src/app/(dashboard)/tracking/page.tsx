export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Activity, MousePointerClick, TrendingUp, Target, Euro, AlertTriangle } from 'lucide-react'
import { AdSpendForm } from './adspend-form'
import { ClicksTimeline } from './clicks-timeline'

function dayBucket(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default async function TrackingPage() {
  const now = new Date()
  const d1 = new Date(now.getTime() - 24 * 3600 * 1000)
  const d7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000)

  const [
    total,
    last1,
    last7,
    last30,
    converted,
    withTtclid,
    withTtclid7,
    recent,
    byOffer,
    allOffers,
    spendRows,
    convRows,
  ] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { createdAt: { gte: d1 } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: d7 } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: d30 } } }),
    prisma.affiliateClick.count({ where: { converted: true } }),
    prisma.affiliateClick.count({ where: { NOT: { ttclid: null } } }),
    prisma.affiliateClick.count({ where: { NOT: { ttclid: null }, createdAt: { gte: d7 } } }),
    prisma.affiliateClick.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { id: true, createdAt: true, offerId: true, ttclid: true, converted: true, convValue: true, referrer: true },
    }),
    prisma.affiliateClick.groupBy({
      by: ['offerId'],
      _count: { _all: true },
      where: { createdAt: { gte: d30 } },
      orderBy: { _count: { offerId: 'desc' } },
      take: 15,
    }),
    prisma.offer.findMany({
      select: { id: true, title: true, priceFrom: true, destination: { select: { name: true } } },
    }),
    prisma.adSpend.findMany({
      where: { date: { gte: d30 } },
      orderBy: { date: 'desc' },
    }),
    prisma.affiliateClick.findMany({
      where: { converted: true, createdAt: { gte: d30 } },
      select: { convValue: true },
    }),
  ])

  const offerMap = new Map(allOffers.map((o) => [o.id, o]))
  const spendTotal30 = spendRows.reduce((s, r) => s + r.spend, 0)
  const spendTotal7 = spendRows.filter((r) => r.date >= d7).reduce((s, r) => s + r.spend, 0)
  const spendTotal1 = spendRows.filter((r) => r.date >= d1).reduce((s, r) => s + r.spend, 0)
  const impressions30 = spendRows.reduce((s, r) => s + r.impressions, 0)
  const adClicks30 = spendRows.reduce((s, r) => s + r.clicks, 0)
  const revenueTotal = convRows.reduce((s, r) => s + (r.convValue || 0), 0)

  const cpc30 = adClicks30 > 0 ? spendTotal30 / adClicks30 : 0
  const cpa30 = converted > 0 ? spendTotal30 / converted : 0
  const ttclidPct = last30 > 0 ? (withTtclid / last30) * 100 : 0
  const ttclidPct7 = last7 > 0 ? (withTtclid7 / last7) * 100 : 0
  const clickoutRate = adClicks30 > 0 ? (last30 / adClicks30) * 100 : 0
  const roas = spendTotal30 > 0 ? (revenueTotal / spendTotal30) * 100 : 0

  // Build daily buckets last 30 days
  const bucketMap = new Map<string, { clicks: number; spend: number; impressions: number }>()
  for (let i = 0; i < 30; i++) {
    const dd = new Date(now.getTime() - i * 24 * 3600 * 1000)
    const k = dayBucket(dd)
    bucketMap.set(k, { clicks: 0, spend: 0, impressions: 0 })
  }
  const clicksByDay = await prisma.affiliateClick.findMany({
    where: { createdAt: { gte: d30 } },
    select: { createdAt: true },
  })
  for (const c of clicksByDay) {
    const k = dayBucket(c.createdAt)
    const b = bucketMap.get(k)
    if (b) b.clicks += 1
  }
  for (const s of spendRows) {
    const k = dayBucket(s.date)
    const b = bucketMap.get(k)
    if (b) { b.spend += s.spend; b.impressions += s.impressions }
  }
  const timeline = Array.from(bucketMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const stats = [
    { label: 'Click ultime 24h', value: last1, sub: `${last7} ultimi 7gg`, icon: Activity, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Click 30gg', value: last30, sub: `${total} totale storico`, icon: MousePointerClick, color: 'text-[#007aff]', bg: 'bg-[#007aff]/10' },
    { label: 'TikTok attribution', value: `${ttclidPct.toFixed(1)}%`, sub: `${withTtclid}/${last30} con ttclid`, icon: Target, color: 'text-[#af52de]', bg: 'bg-[#af52de]/10' },
    { label: 'Conversioni 30gg', value: converted, sub: converted === 0 ? 'postback non attivo' : `€${revenueTotal.toFixed(2)}`, icon: TrendingUp, color: converted > 0 ? 'text-success' : 'text-secondary', bg: converted > 0 ? 'bg-[#34c759]/10' : 'bg-surface' },
  ]

  const adStats = [
    { label: 'Spend 24h', value: `€${spendTotal1.toFixed(2)}`, icon: Euro, color: 'text-[#ff9f0a]', bg: 'bg-[#ff9f0a]/10' },
    { label: 'Spend 30gg', value: `€${spendTotal30.toFixed(2)}`, icon: Euro, color: 'text-[#ff9f0a]', bg: 'bg-[#ff9f0a]/10' },
    { label: 'CPC medio', value: adClicks30 > 0 ? `€${cpc30.toFixed(3)}` : '—', icon: MousePointerClick, color: 'text-[#007aff]', bg: 'bg-[#007aff]/10' },
    { label: 'CPA', value: converted > 0 ? `€${cpa30.toFixed(2)}` : '—', icon: Target, color: 'text-[#af52de]', bg: 'bg-[#af52de]/10' },
    { label: 'ROAS', value: spendTotal30 > 0 && revenueTotal > 0 ? `${roas.toFixed(0)}%` : '—', icon: TrendingUp, color: 'text-success', bg: 'bg-[#34c759]/10' },
    { label: 'Clickout rate', value: adClicks30 > 0 ? `${clickoutRate.toFixed(1)}%` : '—', sub: 'ad click → affiliate', icon: Activity, color: 'text-primary', bg: 'bg-primary-light' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tracking</h1>
        <p className="text-secondary text-sm mt-1">Performance affiliate Check24 + spend TikTok Ads</p>
      </div>

      {/* Alert no-conversion */}
      {converted === 0 && (
        <Card className="flex items-start gap-3 bg-[#ff9f0a]/5 border-[#ff9f0a]/30">
          <AlertTriangle className="w-5 h-5 text-[#ff9f0a] shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Postback Check24 non configurato</p>
            <p className="text-secondary mt-1">Nessuna conversione tracciabile server-side. Configura S2S postback su partner.check24.de oppure upload manuale offline events.</p>
          </div>
        </Card>
      )}

      {/* Core stats */}
      <div>
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Traffico</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="flex items-start gap-4">
              <div className={`${s.bg} rounded-xl p-2.5 shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                <p className="text-xs text-secondary mt-0.5">{s.label}</p>
                {s.sub && <p className="text-[11px] text-secondary/70 mt-0.5 truncate">{s.sub}</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad stats */}
      <div>
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">TikTok Ads (input manuale)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {adStats.map((s) => (
            <Card key={s.label} className="flex items-start gap-3">
              <div className={`${s.bg} rounded-xl p-2 shrink-0`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-tight">{s.value}</p>
                <p className="text-[11px] text-secondary">{s.label}</p>
                {(s as { sub?: string }).sub && <p className="text-[10px] text-secondary/60 truncate">{(s as { sub?: string }).sub}</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Timeline 30gg</h2>
          <p className="text-xs text-secondary">Click affiliate + spend giornaliero</p>
        </div>
        <ClicksTimeline data={timeline} />
      </Card>

      {/* Top offers */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Top offerte per click (30gg)</h2>
        <div className="space-y-2">
          {byOffer.length === 0 && <p className="text-sm text-secondary">Nessun click negli ultimi 30gg.</p>}
          {byOffer.map((row) => {
            const offer = row.offerId ? offerMap.get(row.offerId) : null
            const title = offer?.title || row.offerId || 'Offerta sconosciuta'
            const dest = offer?.destination?.name
            const pct = last30 > 0 ? (row._count._all / last30) * 100 : 0
            return (
              <div key={row.offerId || 'null'} className="flex items-center gap-3 py-2 border-b border-border-light last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{title}</p>
                  {dest && <p className="text-xs text-secondary">{dest}</p>}
                </div>
                <div className="w-40 bg-surface rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(pct * 3, 100)}%` }} />
                </div>
                <p className="text-sm font-semibold tabular-nums w-12 text-right">{row._count._all}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent clicks */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Ultimi click</h2>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary uppercase tracking-wider border-b border-border-light">
                <th className="py-2 pr-4">Quando</th>
                <th className="py-2 pr-4">Offerta</th>
                <th className="py-2 pr-4">Fonte</th>
                <th className="py-2 pr-4">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => {
                const offer = c.offerId ? offerMap.get(c.offerId) : null
                const when = new Date(c.createdAt)
                const src = c.ttclid ? 'TikTok Ad' : c.referrer?.includes('tiktok') ? 'TikTok organic' : c.referrer ? new URL(c.referrer).hostname : 'direct'
                return (
                  <tr key={c.id} className="border-b border-border-light last:border-0">
                    <td className="py-2 pr-4 text-secondary tabular-nums whitespace-nowrap">{when.toLocaleString('de-DE', { hour12: false, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })}</td>
                    <td className="py-2 pr-4 truncate max-w-[300px]">{offer?.title || c.offerId || '—'}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${c.ttclid ? 'bg-[#af52de]/10 text-[#af52de]' : 'bg-surface text-secondary'}`}>{src}</span>
                    </td>
                    <td className="py-2 pr-4">{c.converted ? <span className="text-success font-semibold">€{c.convValue?.toFixed(0) || '?'}</span> : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual spend input */}
      <Card>
        <h2 className="text-lg font-semibold mb-2">Inserisci spend TikTok giornaliero</h2>
        <p className="text-xs text-secondary mb-4">Copia da TikTok Ads Manager. Un record per giorno (sovrascrive se esiste).</p>
        <AdSpendForm recent={spendRows.slice(0, 7)} />
      </Card>
    </div>
  )
}
