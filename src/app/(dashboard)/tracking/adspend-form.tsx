'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type SpendRow = {
  id: string
  date: Date | string
  spend: number
  impressions: number
  clicks: number
  campaign: string | null
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function AdSpendForm({ recent }: { recent: SpendRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ date: todayISO(), spend: '', impressions: '', clicks: '', campaign: '' })
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const payload = {
      date: form.date,
      spend: parseFloat(form.spend.replace(',', '.')),
      impressions: parseInt(form.impressions || '0', 10),
      clicks: parseInt(form.clicks || '0', 10),
      campaign: form.campaign || null,
    }
    if (!payload.date || isNaN(payload.spend)) { setError('Data e spend obbligatori'); return }

    const res = await fetch('/api/admin/adspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) { setError('Errore salvataggio'); return }
    setForm({ date: todayISO(), spend: '', impressions: '', clicks: '', campaign: '' })
    startTransition(() => router.refresh())
  }

  async function remove(id: string) {
    if (!confirm('Eliminare questa riga?')) return
    const res = await fetch(`/api/admin/adspend?id=${id}`, { method: 'DELETE' })
    if (res.ok) startTransition(() => router.refresh())
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="col-span-1">
          <label className="block text-xs text-secondary mb-1">Data</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-secondary mb-1">Spend €</label>
          <input type="text" inputMode="decimal" placeholder="13.15" value={form.spend} onChange={(e) => setForm({ ...form, spend: e.target.value })} required className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-secondary mb-1">Impressions</label>
          <input type="text" inputMode="numeric" placeholder="29714" value={form.impressions} onChange={(e) => setForm({ ...form, impressions: e.target.value })} className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-secondary mb-1">Click</label>
          <input type="text" inputMode="numeric" placeholder="136" value={form.clicks} onChange={(e) => setForm({ ...form, clicks: e.target.value })} className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-secondary mb-1">Campagna (opz.)</label>
          <input type="text" placeholder="Destination Traffic" value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })} className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="col-span-2 sm:col-span-6 flex items-center gap-3">
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all">
            {isPending ? 'Salvo…' : 'Salva / aggiorna'}
          </button>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </form>

      {recent.length > 0 && (
        <div className="overflow-x-auto -mx-5 px-5 pt-2 border-t border-border-light">
          <p className="text-xs text-secondary mb-2">Ultimi inserimenti</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary uppercase tracking-wider">
                <th className="py-1 pr-4">Data</th>
                <th className="py-1 pr-4">Spend</th>
                <th className="py-1 pr-4">Impr.</th>
                <th className="py-1 pr-4">Click</th>
                <th className="py-1 pr-4">Campagna</th>
                <th className="py-1"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-border-light">
                  <td className="py-1.5 pr-4 tabular-nums whitespace-nowrap">{new Date(r.date).toISOString().slice(0, 10)}</td>
                  <td className="py-1.5 pr-4 tabular-nums">€{r.spend.toFixed(2)}</td>
                  <td className="py-1.5 pr-4 tabular-nums">{r.impressions.toLocaleString('de-DE')}</td>
                  <td className="py-1.5 pr-4 tabular-nums">{r.clicks}</td>
                  <td className="py-1.5 pr-4 text-secondary truncate max-w-[200px]">{r.campaign || '—'}</td>
                  <td className="py-1.5 text-right">
                    <button onClick={() => remove(r.id)} className="p-1 text-secondary hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
