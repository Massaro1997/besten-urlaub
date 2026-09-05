import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Admin dashboard: monitor pipeline UP→Check24→Publish.
 * Counts + last 50 deals con stato.
 */
export default async function UpPipelinePage() {
  const [total, matched, published, skipped, recent] = await Promise.all([
    prisma.upDeal.count(),
    prisma.upDeal.count({ where: { matched: true } }),
    prisma.upDeal.count({ where: { published: true } }),
    prisma.upDeal.count({ where: { skipReason: { not: null } } }),
    prisma.upDeal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  const last24h = await prisma.upDeal.count({
    where: { createdAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1a3a]">Urlaubspiraten Pipeline</h1>
          <p className="text-sm text-[#0a1a3a]/60 mt-1">
            Auto-import RSS → match Check24 → Claude rewrite → publish
          </p>
        </div>
        <Link href="/admin" className="text-sm text-[#006AF9] hover:underline">← Admin</Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <Stat label="Total scraped" value={total} />
        <Stat label="Letzten 24h" value={last24h} accent="blue" />
        <Stat label="Matched Check24" value={matched} accent="green" />
        <Stat label="Published" value={published} accent="orange" />
        <Stat label="Skipped" value={skipped} accent="muted" />
      </div>

      {/* Manual triggers */}
      <div className="bg-white border border-[#0a1a3a]/10 rounded-xl p-4 mb-8">
        <h2 className="text-sm font-bold text-[#0a1a3a] mb-3">Manuelle Pipeline-Trigger</h2>
        <div className="flex flex-wrap gap-2">
          <TriggerButton path="/api/cron/up-ingest" label="1. Ingest RSS" />
          <TriggerButton path="/api/cron/up-match" label="2. Match Check24" />
          <TriggerButton path="/api/cron/up-publish" label="3. Publish (Claude)" />
        </div>
        <p className="text-xs text-[#0a1a3a]/50 mt-2">
          Hinweis: brauchen CRON_SECRET im Authorization-Header
        </p>
      </div>

      {/* Recent deals table */}
      <div className="bg-white border border-[#0a1a3a]/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#0a1a3a]/8 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0a1a3a]">Letzte 50 Deals</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a1a3a]/[0.02]">
              <tr className="text-left text-[11px] uppercase tracking-wider text-[#0a1a3a]/55">
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Cat</th>
                <th className="px-4 py-2 font-semibold">Title</th>
                <th className="px-4 py-2 font-semibold">Hotel</th>
                <th className="px-4 py-2 font-semibold">Partner</th>
                <th className="px-4 py-2 font-semibold">Preis</th>
                <th className="px-4 py-2 font-semibold">Strategie</th>
                <th className="px-4 py-2 font-semibold">Veröffentlicht</th>
                <th className="px-4 py-2 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((d) => (
                <tr key={d.id} className="border-t border-[#0a1a3a]/8 hover:bg-[#0a1a3a]/[0.015]">
                  <td className="px-4 py-2">
                    <StatusBadge deal={d} />
                  </td>
                  <td className="px-4 py-2 text-[11px] uppercase font-semibold text-[#F2660A]">{d.category}</td>
                  <td className="px-4 py-2 max-w-[280px] truncate text-[#0a1a3a]" title={d.rawTitle}>
                    {d.rewrittenTitle || d.rawTitle}
                  </td>
                  <td className="px-4 py-2 text-[#0a1a3a]/70 max-w-[140px] truncate" title={d.hotelName || ''}>
                    {d.hotelName || '-'}
                  </td>
                  <td className="px-4 py-2 text-[11px] text-[#0a1a3a]/55">{d.partnerName || '-'}</td>
                  <td className="px-4 py-2 text-[#0a1a3a] font-semibold">
                    {d.priceFromUp ? `${d.priceFromUp}€` : '-'}
                  </td>
                  <td className="px-4 py-2 text-[11px] text-[#0a1a3a]/55">{d.matchStrategy || '-'}</td>
                  <td className="px-4 py-2 text-[11px] text-[#0a1a3a]/55">
                    {d.publishedAt ? new Date(d.publishedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <a href={d.upUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#006AF9] hover:underline">UP →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent = 'default' }: { label: string; value: number; accent?: string }) {
  const colorMap: Record<string, string> = {
    default: 'text-[#0a1a3a]',
    blue: 'text-[#006AF9]',
    green: 'text-emerald-600',
    orange: 'text-[#F2660A]',
    muted: 'text-[#0a1a3a]/45',
  }
  return (
    <div className="bg-white border border-[#0a1a3a]/10 rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-[#0a1a3a]/55 font-semibold">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${colorMap[accent]}`}>{value.toLocaleString('de-DE')}</p>
    </div>
  )
}

function StatusBadge({ deal }: { deal: { published: boolean; matched: boolean; skipReason: string | null } }) {
  if (deal.published) return <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">Live</span>
  if (deal.skipReason) return <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#0a1a3a]/8 text-[#0a1a3a]/55 font-bold uppercase tracking-wider" title={deal.skipReason}>Skip</span>
  if (deal.matched) return <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#F2660A]/15 text-[#F2660A] font-bold uppercase tracking-wider">Matched</span>
  return <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#006AF9]/10 text-[#006AF9] font-bold uppercase tracking-wider">Queued</span>
}

function TriggerButton({ path, label }: { path: string; label: string }) {
  return (
    <code className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1a3a]/5 text-[11px] font-mono text-[#0a1a3a]">
      GET {path}
      <span className="text-[#0a1a3a]/50">— {label}</span>
    </code>
  )
}
