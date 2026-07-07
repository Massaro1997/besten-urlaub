// Pauschalreise — kommerzielle Preisseiten /pauschalreise/[ziel].
// Query-Ziel: "pauschalreise <ziel>", "<ziel> urlaub günstig", "<ziel> flug und hotel".
// Datenbasis: reise-klima.ts (monatliche ab-Preise, forge-erprobt divergent).
// Abgrenzung zu /fragen/guenstigste-reisezeit-*: dort informational (wann),
// hier transactional (was kostet es, Preistabelle, Buchung). Cross-Links statt Doppelung.

import { reiseKlima, MONAT_NAMEN, type ZielKlima, type MonatKlima } from '@/data/reise-klima'

export type PauschalreisePage = {
  slug: string
  ziel: ZielKlima
  buchbar: MonatKlima[]
  minPreis: number
  maxPreis: number
  guenstigste: MonatKlima[]
  teuerster: MonatKlima
  sweetSpot: MonatKlima
  absaetze: string[]
  faq: { q: string; a: string }[]
}

const monatName = (m: MonatKlima) => MONAT_NAMEN[m.monat - 1]

function buchbare(ziel: ZielKlima): MonatKlima[] {
  return ziel.monate.filter((m) => m.preisAb > 0)
}

export function getAllPauschalreiseParams(): { ziel: string }[] {
  return reiseKlima.filter((z) => buchbare(z).length >= 4).map((z) => ({ ziel: z.slug }))
}

export function getPauschalreise(slug: string): PauschalreisePage | null {
  const ziel = reiseKlima.find((z) => z.slug === slug)
  if (!ziel) return null
  const buchbar = buchbare(ziel)
  if (buchbar.length < 4) return null

  const byPrice = [...buchbar].sort((a, b) => a.preisAb - b.preisAb)
  const guenstigste = byPrice.slice(0, 3)
  const teuerster = byPrice[byPrice.length - 1]
  const minPreis = guenstigste[0].preisAb
  const maxPreis = teuerster.preisAb

  // Sweet Spot: wärmster Badeurlaub-tauglicher Monat zum kleinsten Preis
  const warme = buchbar.filter((m) => m.regen <= 6 && (m.wasser >= 22 || m.tagMax >= 24))
  const sweetSpot = warme.length
    ? [...warme].sort((a, b) => a.preisAb - b.preisAb)[0]
    : byPrice[0]

  const spart = maxPreis - minPreis
  const istBinnen = buchbar.every((m) => m.wasser === 0)

  const absaetze = [
    `Eine Pauschalreise nach ${ziel.name} kostet je nach Reisemonat ab ${minPreis} € bis ab ${maxPreis} € pro Person, Flug und Hotel inklusive. Am günstigsten ist der ${monatName(guenstigste[0])} ab ${guenstigste[0].preisAb} €, gefolgt vom ${monatName(guenstigste[1])} (ab ${guenstigste[1].preisAb} €) und ${monatName(guenstigste[2])} (ab ${guenstigste[2].preisAb} €). Am teuersten wird es im ${monatName(teuerster)} ab ${teuerster.preisAb} €. Wer flexibel ist, spart also bis zu ${spart} € pro Person allein durch die Monatswahl.`,
    `Das beste Verhältnis aus Wetter und Preis bietet der ${monatName(sweetSpot)}: ${sweetSpot.tagMax}°C am Tag${istBinnen || sweetSpot.wasser === 0 ? `, ${sweetSpot.sonne} Sonnenstunden` : `, ${sweetSpot.wasser}°C Wassertemperatur`} und Pauschalreisen ab ${sweetSpot.preisAb} €. Was ${ziel.name} in diesem Monat zu bieten hat: ${sweetSpot.highlights.map((h) => `${h}.`).join(' ')}`,
    `Die Anreise: Direktflüge nach ${ziel.name} starten ab ${ziel.abflug.join(', ')} und dauern rund ${ziel.flugStunden} Stunden zum Flughafen ${ziel.flughafen}. Pauschalangebote mit Zug zum Flug gleichen einen weiter entfernten Abflughafen oft komplett aus, weil die Flugpreise ab den großen Drehkreuzen niedriger liegen.`,
  ]

  const faq = [
    {
      q: `Was kostet eine Pauschalreise nach ${ziel.name}?`,
      a: `Ab ${minPreis} € pro Person im ${monatName(guenstigste[0])}, in der Hochsaison (${monatName(teuerster)}) ab ${teuerster.preisAb} €. Flug, Hotel und meist Transfer sind im Preis enthalten.`,
    },
    {
      q: `Was ist bei einer ${ziel.name}-Pauschalreise im Preis enthalten?`,
      a: `Flug ab Deutschland, Hotel und in der Regel der Transfer vor Ort. Je nach Angebot kommen Verpflegung (Halbpension oder All Inclusive) und Reiseleitung dazu. Der Reisepreis ist über den Sicherungsschein insolvenzgeschützt.`,
    },
  ]

  return { slug, ziel, buchbar, minPreis, maxPreis, guenstigste, teuerster, sweetSpot, absaetze, faq }
}
