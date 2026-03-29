'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { VIDEO_STATUSES } from '@/lib/constants'

interface Destination {
  id: string
  name: string
  country: string
}

export default function NuovoVideoPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    title: '',
    description: '',
    destinationId: '',
    status: 'pianificato',
    plannedDate: '',
    hashtags: '',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/destinazioni')
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.error('Fetch destinations error:', err))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client validation
    if (!form.title.trim()) {
      setErrors({ title: 'Il titolo e richiesto' })
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        status: form.status,
      }

      if (form.description.trim()) body.description = form.description.trim()
      if (form.destinationId) body.destinationId = form.destinationId
      if (form.plannedDate) body.plannedDate = form.plannedDate
      if (form.hashtags.trim()) body.hashtags = form.hashtags.trim()
      if (form.notes.trim()) body.notes = form.notes.trim()

      const res = await fetch('/api/contenuti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            fieldErrors[key] = (msgs as string[])[0]
          }
          setErrors(fieldErrors)
        } else {
          setErrors({ _form: data.error || 'Errore nella creazione' })
        }
        return
      }

      router.push('/contenuti')
    } catch (err) {
      console.error('Submit error:', err)
      setErrors({ _form: 'Errore di rete. Riprova.' })
    } finally {
      setSubmitting(false)
    }
  }

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: `${d.name}, ${d.country}`,
  }))

  const statusOptions = VIDEO_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/contenuti"
          className="p-2 rounded-xl hover:bg-surface text-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuovo Video</h1>
          <p className="text-secondary text-sm mt-0.5">
            Pianifica un nuovo contenuto TikTok
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors._form && (
            <div className="bg-danger/10 text-danger text-sm rounded-xl px-4 py-3">
              {errors._form}
            </div>
          )}

          <Input
            id="title"
            name="title"
            label="Titolo"
            placeholder="es. Mallorca Top 5 Hotel All-Inclusive"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Textarea
            id="description"
            name="description"
            label="Descrizione"
            placeholder="Descrizione del contenuto video..."
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="destinationId"
              name="destinationId"
              label="Destinazione"
              placeholder="Seleziona destinazione"
              options={destinationOptions}
              value={form.destinationId}
              onChange={handleChange}
              error={errors.destinationId}
            />

            <Select
              id="status"
              name="status"
              label="Stato"
              options={statusOptions}
              value={form.status}
              onChange={handleChange}
              error={errors.status}
            />
          </div>

          <Input
            id="plannedDate"
            name="plannedDate"
            label="Data pianificata"
            type="date"
            value={form.plannedDate}
            onChange={handleChange}
            error={errors.plannedDate}
          />

          <Input
            id="hashtags"
            name="hashtags"
            label="Hashtags"
            placeholder="#mallorca, #urlaub, #check24"
            value={form.hashtags}
            onChange={handleChange}
            error={errors.hashtags}
          />

          <Textarea
            id="notes"
            name="notes"
            label="Note"
            placeholder="Appunti, idee, script..."
            value={form.notes}
            onChange={handleChange}
            error={errors.notes}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/contenuti">
              <Button type="button" variant="ghost">
                Annulla
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Crea Video'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
