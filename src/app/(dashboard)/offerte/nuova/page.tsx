'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Loader2, Tag } from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
}

export default function NuovaOffertaPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [destinationId, setDestinationId] = useState('')
  const [title, setTitle] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetch('/api/destinazioni')
      .then((res) => res.json())
      .then(setDestinations)
      .catch(console.error)
  }, [])

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: `${d.name}, ${d.country}`,
  }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          title,
          priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
          affiliateLink,
          description: description || undefined,
          notes: notes || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          for (const [key, messages] of Object.entries(data.details)) {
            fieldErrors[key] = (messages as string[])[0]
          }
          setErrors(fieldErrors)
        } else {
          setErrors({ _form: data.error || "Errore nella creazione dell'offerta" })
        }
        return
      }

      router.push('/offerte')
    } catch {
      setErrors({ _form: 'Errore di rete. Riprova.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/offerte">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Nuova Offerta</h1>
            <p className="text-sm text-secondary">Link affiliato per una destinazione</p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors._form && (
            <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm">{errors._form}</div>
          )}

          <Select
            id="destinationId"
            label="Destinazione *"
            options={destinationOptions}
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            placeholder="Seleziona destinazione"
            error={errors.destinationId}
          />

          <Input
            id="title"
            label="Titolo *"
            placeholder="es. Mallorca — vacanze mare a partire da 399€"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <Input
            id="priceFrom"
            label="Prezzo indicativo (a partire da, EUR)"
            type="number"
            step="1"
            min="0"
            placeholder="399"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
          />

          <Input
            id="affiliateLink"
            label="Link affiliato Check24 *"
            type="url"
            placeholder="https://www.check24.de/..."
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            error={errors.affiliateLink}
          />

          <Textarea
            id="description"
            label="Descrizione breve"
            placeholder="es. Volo + Hotel, da tutti gli aeroporti tedeschi, 7 notti"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <Textarea
            id="notes"
            label="Note (solo per te)"
            placeholder="Note interne sull'offerta..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/offerte">
              <Button variant="secondary" type="button">Annulla</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salva Offerta'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
