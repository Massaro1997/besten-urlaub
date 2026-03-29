'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DESTINATION_CATEGORIES } from '@/lib/constants'

export default function NuovaDestinazionePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState('mare')
  const [description, setDescription] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Nome richiesto'
    if (!country.trim()) newErrors.country = 'Paese richiesto'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/destinazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim(),
          category,
          description: description.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            fieldErrors[key] = (msgs as string[])[0]
          }
          setErrors(fieldErrors)
        }
        return
      }

      router.push('/destinazioni')
    } catch {
      console.error('Errore nella creazione')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Back link */}
      <Link
        href="/destinazioni"
        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Destinazioni
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuova destinazione</h1>
        <p className="text-secondary text-sm mt-1">
          Aggiungi una nuova destinazione al catalogo
        </p>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Nome *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es. Santorini"
            error={errors.name}
          />

          <Input
            id="country"
            label="Paese *"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="es. Grecia"
            error={errors.country}
          />

          <Select
            id="category"
            label="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={DESTINATION_CATEGORIES.map((c) => ({
              value: c.value,
              label: `${c.emoji} ${c.label}`,
            }))}
          />

          <Textarea
            id="description"
            label="Descrizione"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione della destinazione..."
            rows={4}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/destinazioni">
              <Button type="button" variant="secondary">
                Annulla
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creazione...
                </>
              ) : (
                'Crea destinazione'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
