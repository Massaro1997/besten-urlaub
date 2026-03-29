'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useTheme } from '@/hooks/use-theme'
import { GERMAN_AIRPORTS } from '@/lib/constants'
import { Save, Key, Plane, Sun, Moon, Database } from 'lucide-react'

export default function ImpostazioniPage() {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useState('')
  const [defaultAirport, setDefaultAirport] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState({ destinations: 0, offers: 0, videos: 0, creatives: 0 })

  useEffect(() => {
    fetch('/api/impostazioni')
      .then((r) => r.json())
      .then((data) => {
        if (data.apiKey) setApiKey(data.apiKey)
        if (data.defaultAirport) setDefaultAirport(data.defaultAirport)
        if (data.stats) setStats(data.stats)
      })
      .catch(() => {})
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/impostazioni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, defaultAirport }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  const airportOptions = GERMAN_AIRPORTS.map((a) => ({
    value: a.code,
    label: `${a.city} (${a.code})`,
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Impostazioni</h1>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Key Anthropic
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            label="Chiave API"
          />
          <p className="text-xs text-secondary mt-2">
            Necessaria per la ricerca AI delle destinazioni. Ottenila da console.anthropic.com.
          </p>
        </CardContent>
      </Card>

      {/* Default Airport */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              Aeroporto Predefinito
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={defaultAirport}
            onChange={(e) => setDefaultAirport(e.target.value)}
            options={airportOptions}
            placeholder="Seleziona aeroporto..."
            label="Aeroporto di partenza predefinito"
          />
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
              Tema
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border text-secondary hover:border-primary/30'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto mb-1" />
              Chiaro
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border text-secondary hover:border-primary/30'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto mb-1" />
              Scuro
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Statistiche Database
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Destinazioni', value: stats.destinations },
              { label: 'Offerte', value: stats.offers },
              { label: 'Video', value: stats.videos },
              { label: 'Creativi', value: stats.creatives },
            ].map((s) => (
              <div key={s.label} className="bg-surface rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : saved ? 'Salvato!' : 'Salva Impostazioni'}
        </Button>
      </div>
    </div>
  )
}
