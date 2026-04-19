export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 min cache

import { Card } from '@/components/ui/card'
import { Globe, Users, Languages, ExternalLink, AlertTriangle } from 'lucide-react'
import {
  fetchCountryTotals,
  fetchSourceBreakdown,
  fetchLanguageBreakdown,
} from '@/lib/ga4'

const TARGET_MARKET = 'Germany'

function pct(n: number, total: number): string {
  if (total === 0) return '0.0%'
  return `${((n / total) * 100).toFixed(1)}%`
}

export default async function AnalyticsPage() {
  let countries: Awaited<ReturnType<typeof fetchCountryTotals>> = []
  let sources: Awaited<ReturnType<typeof fetchSourceBreakdown>> = []
  let languages: Awaited<ReturnType<typeof fetchLanguageBreakdown>> = []
  let error: string | null = null

  try {
    ;[countries, sources, languages] = await Promise.all([
      fetchCountryTotals(30),
      fetchSourceBreakdown(30),
      fetchLanguageBreakdown(30),
    ])
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  const totalUsers = countries.reduce((s, r) => s + r.users, 0)
  const germanyRow = countries.find((r) => r.country === TARGET_MARKET)
  const germanyUsers = germanyRow?.users || 0
  const germanPct = totalUsers > 0 ? (germanyUsers / totalUsers) * 100 : 0
  const offTarget = totalUsers - germanyUsers

  const tiktokUsers = sources.find((s) => s.source.includes('tiktok'))?.users || 0
  const directUsers = sources.find((s) => s.source === '(direct)')?.users || 0

  const topSuspicious = countries
    .filter((c) => c.country !== TARGET_MARKET && c.users >= 10)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-secondary text-sm mt-1">Google Analytics 4 — Geo + Sources (ultimi 30 giorni)</p>
      </div>

      {error && (
        <Card className="flex items-start gap-3 bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-900">Errore GA4 API</p>
            <p className="text-red-700 mt-1 font-mono text-xs">{error}</p>
          </div>
        </Card>
      )}

      {!error && (
        <>
          {/* Core stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-start gap-4">
              <div className="bg-primary-light rounded-xl p-2.5 shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">{totalUsers.toLocaleString('de-DE')}</p>
                <p className="text-xs text-secondary mt-0.5">Active users 30gg</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <div className="bg-[#34c759]/10 rounded-xl p-2.5 shrink-0">
                <Globe className="w-5 h-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">{germanPct.toFixed(1)}%</p>
                <p className="text-xs text-secondary mt-0.5">Germania</p>
                <p className="text-[11px] text-secondary/70 mt-0.5">{germanyUsers} users</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <div className="bg-[#ff9f0a]/10 rounded-xl p-2.5 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#ff9f0a]" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">{offTarget}</p>
                <p className="text-xs text-secondary mt-0.5">Off-target users</p>
                <p className="text-[11px] text-secondary/70 mt-0.5">{pct(offTarget, totalUsers)} sprecati</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <div className="bg-[#af52de]/10 rounded-xl p-2.5 shrink-0">
                <ExternalLink className="w-5 h-5 text-[#af52de]" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">{pct(tiktokUsers, totalUsers)}</p>
                <p className="text-xs text-secondary mt-0.5">Da TikTok</p>
                <p className="text-[11px] text-secondary/70 mt-0.5">{tiktokUsers} users</p>
              </div>
            </Card>
          </div>

          {/* Alert off-target */}
          {germanPct < 90 && topSuspicious.length > 0 && (
            <Card className="flex items-start gap-3 bg-[#ff9f0a]/5 border-[#ff9f0a]/30">
              <AlertTriangle className="w-5 h-5 text-[#ff9f0a] shrink-0 mt-0.5" />
              <div className="text-sm flex-1">
                <p className="font-semibold">Traffico fuori target rilevato</p>
                <p className="text-secondary mt-1">
                  Germania {germanPct.toFixed(1)}% (target &gt;90%). Top paesi off-target da verificare in TikTok Ads Manager:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topSuspicious.map((c) => (
                    <span key={c.country} className="inline-block px-2.5 py-1 rounded-md bg-white text-xs font-medium border border-[#ff9f0a]/30">
                      {c.country}: {c.users}
                    </span>
                  ))}
                </div>
                <p className="text-secondary/80 mt-2 text-xs">
                  Apri TikTok Ads Manager → Ad Group → Location targeting → imposta Germany only.
                </p>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries */}
            <div>
              <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Paesi (30gg)</h2>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border-light max-h-96 overflow-y-auto">
                  {countries.slice(0, 30).map((c) => {
                    const p = totalUsers > 0 ? (c.users / totalUsers) * 100 : 0
                    const isTarget = c.country === TARGET_MARKET
                    return (
                      <div key={c.country} className="flex items-center gap-3 px-4 py-2.5">
                        <span className={`text-sm flex-1 ${isTarget ? 'font-bold text-success' : ''}`}>
                          {isTarget && '★ '}{c.country}
                        </span>
                        <div className="flex-1 max-w-[120px] bg-surface rounded-full h-1.5 overflow-hidden">
                          <div
                            className={isTarget ? 'bg-success h-full' : 'bg-primary h-full'}
                            style={{ width: `${Math.min(p, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm tabular-nums text-secondary w-12 text-right">{c.users}</span>
                        <span className="text-xs tabular-nums text-secondary/60 w-14 text-right">{p.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Sources */}
            <div>
              <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Sorgenti traffico (30gg)</h2>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-border-light max-h-96 overflow-y-auto">
                  {sources.slice(0, 20).map((s, i) => (
                    <div key={`${s.source}-${i}`} className="flex items-center justify-between px-4 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{s.source}</p>
                        <p className="text-[11px] text-secondary/60">{s.medium}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm tabular-nums">{s.users}</p>
                        <p className="text-[11px] text-secondary/60 tabular-nums">{s.sessions} sess</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Lingue browser (30gg)
            </h2>
            <Card className="p-0 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-border-light">
                {languages.slice(0, 12).map((l) => (
                  <div key={l.language} className="px-4 py-3">
                    <p className="text-sm capitalize">{l.language}</p>
                    <p className="text-lg font-semibold tabular-nums">{l.users}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <p className="text-xs text-secondary/60 text-center">
            Cached 5 min · Dati Google Analytics 4 · Target: {TARGET_MARKET}
          </p>
        </>
      )}

      {/* Direct benchmark */}
      {!error && (
        <div className="text-xs text-secondary text-center pt-4 border-t border-border-light">
          TikTok: {pct(tiktokUsers, totalUsers)} · Direct: {pct(directUsers, totalUsers)} · Others: {pct(totalUsers - tiktokUsers - directUsers, totalUsers)}
        </div>
      )}
    </div>
  )
}
