export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Euro, TrendingUp, CheckCircle, XCircle, Link2Off } from 'lucide-react'

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(d)
}

function fmtEur(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

export default async function SalesPage() {
  const [total, paid, cancelled, matched, sales, byProduct] = await Promise.all([
    prisma.check24Sale.count(),
    prisma.check24Sale.count({ where: { status: 'paid' } }),
    prisma.check24Sale.count({ where: { status: 'cancelled' } }),
    prisma.check24Sale.count({ where: { matched: true } }),
    prisma.check24Sale.findMany({
      orderBy: { createdAtC24: 'desc' },
      take: 100,
    }),
    prisma.check24Sale.groupBy({
      by: ['product'],
      _count: { _all: true },
      _sum: { commission: true, revenue: true },
      where: { status: 'paid' },
      orderBy: { _sum: { commission: 'desc' } },
    }),
  ])

  const totalCommission = sales
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + (s.commission || 0), 0)
  const totalRevenue = sales
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + (s.revenue || 0), 0)

  const stats = [
    { label: 'Provision totale', value: fmtEur(totalCommission), icon: Euro, color: 'text-success', bg: 'bg-[#34c759]/10' },
    { label: 'Umsatz gesamt', value: fmtEur(totalRevenue), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Paid', value: paid, sub: `${cancelled} cancelled`, icon: CheckCircle, color: 'text-success', bg: 'bg-[#34c759]/10' },
    { label: 'Matched a click', value: matched, sub: `${total - matched} ohne tracking_id`, icon: Link2Off, color: 'text-[#ff9f0a]', bg: 'bg-[#ff9f0a]/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales Check24</h1>
        <p className="text-secondary text-sm mt-1">Reale Provisionen aus der Check24 Partner-API (Poll alle 10 Min.)</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
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

      {byProduct.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Per prodotto (paid)</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border-light">
              {byProduct.map(p => (
                <div key={p.product} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.product}</p>
                    <p className="text-xs text-secondary">{p._count._all} vendite</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{fmtEur(p._sum.commission)}</p>
                    <p className="text-xs text-secondary">{fmtEur(p._sum.revenue)} Umsatz</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Ultime 100 vendite</h2>
        {sales.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-secondary text-sm">Cron non ha ancora sincronizzato. Attendi max 10 min o trigger manuale via /api/cron/check24-sync.</p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface/50 border-b border-border-light">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Prodotto</th>
                    <th className="text-left px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Provision</th>
                    <th className="text-right px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Umsatz</th>
                    <th className="text-center px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">Match</th>
                    <th className="text-center px-4 py-3 font-medium text-secondary text-xs uppercase tracking-wider">TikTok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-secondary tabular-nums whitespace-nowrap">{fmtDate(s.createdAtC24)}</td>
                      <td className="px-4 py-3">{s.product}</td>
                      <td className="px-4 py-3">
                        {s.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle className="w-3 h-3" /> paid</span>
                        ) : s.status === 'cancelled' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600"><XCircle className="w-3 h-3" /> cancelled</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-surface text-xs">{s.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">{fmtEur(s.commission)}</td>
                      <td className="px-4 py-3 text-right text-secondary tabular-nums">{fmtEur(s.revenue)}</td>
                      <td className="px-4 py-3 text-center text-xs">{s.matched ? '✓' : '—'}</td>
                      <td className="px-4 py-3 text-center text-xs">{s.firedToTiktok ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <p className="text-xs text-secondary/60">
        Nota: {total - matched} vendite senza tracking_id = nessun match con AffiliateClick. Solo click futuri con subid nostro (format `subid=&lt;eventId&gt;`) verranno attribuiti a TikTok.
      </p>
    </div>
  )
}
