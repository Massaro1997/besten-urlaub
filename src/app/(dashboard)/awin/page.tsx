export const dynamic = 'force-dynamic'
export const revalidate = 300

import { Card } from '@/components/ui/card'
import { Euro, MousePointerClick, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react'
import { fetchAwinAdvertiserReport, fetchAwinTransactions } from '@/lib/awin-api'
import { prisma } from '@/lib/prisma'

function fmtEur(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

function fmtDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(date)
}

export default async function AwinPage() {
  const now = new Date()
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
  const yyyymmdd = (d: Date) => d.toISOString().slice(0, 10)
  const isoMinute = (d: Date) => d.toISOString().slice(0, 19)

  let report: Awaited<ReturnType<typeof fetchAwinAdvertiserReport>> = []
  let txs: Awaited<ReturnType<typeof fetchAwinTransactions>> = []
  let error: string | null = null

  try {
    [report, txs] = await Promise.all([
      fetchAwinAdvertiserReport(yyyymmdd(d30), yyyymmdd(now), 'DE'),
      fetchAwinTransactions(isoMinute(d30), isoMinute(now)),
    ])
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const check24 = report.find((r) => r.advertiserId === 9364)
  const clicks = check24?.clicks || 0
  const impressions = check24?.impressions || 0
  const totalComm = check24?.totalComm || 0
  const pendingComm = check24?.pendingComm || 0
  const confirmedComm = check24?.confirmedComm || 0
  const declinedComm = check24?.declinedComm || 0
  const totalValue = check24?.totalValue || 0

  // Match rate: how many tx have a clickref that matches an AffiliateClick row
  const clickRefs = txs.map((t) => t.clickRefs?.clickRef).filter(Boolean) as string[]
  const knownClicks = clickRefs.length > 0
    ? await prisma.affiliateClick.count({ where: { eventId: { in: clickRefs } } })
    : 0
  const matchRate = clickRefs.length > 0 ? (knownClicks / clickRefs.length) * 100 : 0

  const stats = [
    { label: 'Provision 30gg', value: fmtEur(totalComm), sub: `${check24?.totalNo || 0} vendite`, icon: Euro, color: 'text-success', bg: 'bg-[#34c759]/10' },
    { label: 'Click 30gg', value: clicks, sub: `${impressions} Impressionen`, icon: MousePointerClick, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Confirmed', value: fmtEur(confirmedComm), sub: `${check24?.confirmedNo || 0} vendite`, icon: CheckCircle, color: 'text-success', bg: 'bg-[#34c759]/10' },
    { label: 'Pending', value: fmtEur(pendingComm), sub: `${check24?.pendingNo || 0} in attesa`, icon: Clock, color: 'text-[#ff9f0a]', bg: 'bg-[#ff9f0a]/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Awin · Check24</h1>
        <p className="text-secondary text-sm mt-1">
          Performance affiliate via Awin (Publisher 2837966, Advertiser 9364). Cache 5 min.
        </p>
      </div>

      {error && (
        <Card className="flex items-start gap-3 bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-900">Errore API Awin</p>
            <p className="text-red-700 mt-1 font-mono text-xs">{error}</p>
          </div>
        </Card>
      )}

      {!error && (
        <>
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

          <div>
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Match Rate</h2>
            <Card>
              <p className="text-3xl font-semibold tracking-tight">{matchRate.toFixed(1)}%</p>
              <p className="text-sm text-secondary mt-1">
                {knownClicks} di {clickRefs.length} transactions hanno un clickref che corrisponde a un AffiliateClick nel DB.
              </p>
              <p className="text-xs text-secondary/70 mt-2">
                Più alto = più conversioni attribuite correttamente a TikTok ads. {clickRefs.length - knownClicks} transactions senza match = revenue Awin ma senza ttclid → TikTok non impara da quelle.
              </p>
            </Card>
          </div>

          {(check24?.declinedNo || 0) > 0 && (
            <Card className="flex items-start gap-3 bg-red-50 border-red-200">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-900">
                  {check24!.declinedNo} vendite rifiutate ({fmtEur(declinedComm)})
                </p>
                <p className="text-red-700 mt-1">
                  Cancellazioni / rimborsi. Commissione persa {fmtEur(check24!.declinedValue)}.
                </p>
              </div>
            </Card>
          )}

          <div>
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Ultime transactions ({txs.length})
            </h2>
            {txs.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-secondary text-sm">
                  Nessuna transaction ancora. Awin ha ~1h di delay prima di registrare un click come conversione.
                </p>
              </Card>
            ) : (
              <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface/50 border-b border-border-light">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-secondary font-medium">Data</th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-secondary font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-secondary font-medium">ClickRef</th>
                        <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-secondary font-medium">Umsatz</th>
                        <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-secondary font-medium">Provision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {txs.slice(0, 100).map((t) => (
                        <tr key={t.id} className="hover:bg-surface/30">
                          <td className="px-4 py-3 text-secondary tabular-nums whitespace-nowrap">
                            {t.transactionDate ? fmtDate(t.transactionDate) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs inline-flex items-center gap-1 ${
                              t.commissionStatus === 'approved' ? 'text-success'
                              : t.commissionStatus === 'declined' ? 'text-red-600'
                              : 'text-[#ff9f0a]'
                            }`}>
                              {t.commissionStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-secondary truncate max-w-[180px]">
                            {t.clickRefs?.clickRef || '—'}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-secondary">
                            {fmtEur(t.saleAmount?.amount)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium">
                            {fmtEur(t.commissionAmount?.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
