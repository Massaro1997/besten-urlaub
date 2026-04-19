export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Mail, Phone, Tag, TrendingUp } from 'lucide-react'

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(d)
}

export default async function LeadsPage() {
  const now = new Date()
  const d1 = new Date(now.getTime() - 24 * 3600 * 1000)
  const d7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000)

  const [total, last1, last7, last30, withPhone, leads, bySource] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: d1 } } }),
    prisma.lead.count({ where: { createdAt: { gte: d7 } } }),
    prisma.lead.count({ where: { createdAt: { gte: d30 } } }),
    prisma.lead.count({ where: { NOT: { phone: null } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.lead.groupBy({
      by: ['source'],
      _count: { _all: true },
      where: { createdAt: { gte: d30 } },
      orderBy: { _count: { source: 'desc' } },
    }),
  ])

  const stats = [
    { label: 'Lead totali', value: total, sub: `${last30} ultimi 30gg`, icon: Mail, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Ultime 24h', value: last1, sub: `${last7} ultimi 7gg`, icon: TrendingUp, color: 'text-[#007aff]', bg: 'bg-[#007aff]/10' },
    { label: 'Con telefono', value: withPhone, sub: total > 0 ? `${((withPhone / total) * 100).toFixed(0)}% del totale` : '—', icon: Phone, color: 'text-[#af52de]', bg: 'bg-[#af52de]/10' },
    { label: 'Sorgenti attive', value: bySource.length, sub: 'ultimi 30gg', icon: Tag, color: 'text-success', bg: 'bg-[#34c759]/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-secondary text-sm mt-1">Email e contatti raccolti dal sito</p>
      </div>

      {/* Stats */}
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

      {/* Breakdown per sorgente */}
      {bySource.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Per sorgente (30gg)</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border-light">
              {bySource.map((s) => (
                <div key={s.source} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium">{s.source}</span>
                  <span className="text-sm text-secondary tabular-nums">{s._count._all}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recenti */}
      <div>
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Ultimi 100 lead</h2>
        {leads.length === 0 ? (
          <Card className="text-center py-12">
            <Mail className="w-10 h-10 text-secondary/40 mx-auto mb-3" />
            <p className="text-secondary text-sm">Nessun lead ancora raccolto.</p>
            <p className="text-secondary/60 text-xs mt-1">I lead appariranno qui quando utenti compilano form newsletter/contatti.</p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface/50 border-b border-border-light">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Telefono</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Sorgente</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">TikTok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-secondary tabular-nums whitespace-nowrap">{formatDate(l.createdAt)}</td>
                      <td className="px-4 py-3 font-medium">{l.email}</td>
                      <td className="px-4 py-3 text-secondary">{l.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-surface text-xs">{l.source}</span>
                      </td>
                      <td className="px-4 py-3 text-secondary text-xs">{l.ttclid ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
