// ---------------------------------------------------------------------------
// Fragen — programmatische Q&A-Seiten /fragen/[slug].
//
// Achse: Fragetyp × Reiseziel. Jede Antwort zieht die REALEN, destinations-
// spezifischen Klima-/Preiswerte aus reise-klima.ts. Da jede Destination andere
// Zahlen, beste Monate, günstigste Monate und Highlights hat, divergiert jede
// Antwort substanziell — kein Spinning, der Datenwert trägt die Unterschiede.
//
// Gate-Logik: nur Destinationen mit genug buchbaren Monaten erzeugen eine Frage-
// seite (sonst zu dünn). preisAb=0-Monate zählen nicht.
// ---------------------------------------------------------------------------

import {
  reiseKlima,
  MONAT_NAMEN,
  type ZielKlima,
  type MonatKlima,
} from '@/data/reise-klima'
import { getBesteMonate, getGuenstigsterMonat } from '@/lib/reisemonat'

export type FrageTyp =
  | 'beste-reisezeit'
  | 'guenstigste-reisezeit'
  | 'klimatabelle'
  | 'mit-kindern'
  | 'anreise'

export type FragenPage = {
  slug: string
  typ: FrageTyp
  ziel: ZielKlima
  frage: string
  /** SERP-Title: Keyword vorn + konkrete Zahlen. Fallback in metadata = frage. */
  seoTitle?: string
  kurzantwort: string
  /** Absätze der Langantwort */
  absatz: string[]
  /** Tabellendaten (Monat → Werte), je nach Typ */
  tabelle?: { monat: string; werte: string[] }[]
  tabelleHead?: string[]
  datapoints: string[]
  faq: { q: string; a: string }[]
}

function buchbare(ziel: ZielKlima): MonatKlima[] {
  return ziel.monate.filter((m) => m.preisAb > 0)
}

function warm(m: MonatKlima) {
  return m.wasser >= 22 && m.regen <= 5
}

const FRAGE_TYPEN: FrageTyp[] = [
  'beste-reisezeit',
  'guenstigste-reisezeit',
  'klimatabelle',
  'mit-kindern',
  'anreise',
]

/**
 * Near-Duplicate-Sperre (forge.py-Befund): klimatisch identische Nachbarziele
 * teilen sich denselben Flughafen/dieselbe Küste — ihre rein numerischen
 * Antworten (Wassertemperatur/Klimatabelle) kollidieren und würden von Google
 * geclustert. Wir publizieren diese Frage-Typen nur für EINE der Zwillings-
 * Destinationen (key = `${typ}-${slug}` wird übersprungen → 404).
 * Side teilt Antalya (AYT); Teneriffa teilt Gran Canaria (Kanaren-Wasser).
 */
const NEAR_DUP_BLOCK = new Set<string>([
  // Side ist Antalyas Klima-Zwilling (gleicher Flughafen AYT, gleiche Küste).
  'beste-reisezeit-side',
  'klimatabelle-side',
  'mit-kindern-side',
  // Anreise-Antworten der Klima-Zwillinge kollidieren am stärksten: gleicher
  // Flughafen, gleiche Flugzeit, gleiche Zeitverschiebung. Daher die anreise-
  // Frage nur für die jeweilige Hauptdestination publizieren (Zwilling -> 404).
  'anreise-side',
])

export function getAllFragenParams(): { slug: string }[] {
  const out: { slug: string }[] = []
  for (const z of reiseKlima) {
    if (buchbare(z).length < 4) continue // zu wenig Daten → keine Seite
    for (const typ of FRAGE_TYPEN) {
      const slug = `${typ}-${z.slug}`
      if (NEAR_DUP_BLOCK.has(slug)) continue
      out.push({ slug })
    }
  }
  return out
}

function jahr(m: MonatKlima) {
  return MONAT_NAMEN[m.monat - 1]
}

export function getFrage(slug: string): FragenPage | null {
  if (NEAR_DUP_BLOCK.has(slug)) return null
  // slug = `${typ}-${zielSlug}` ; typ kann Bindestriche enthalten → längster Präfix-Match
  const typ = FRAGE_TYPEN.find((t) => slug.startsWith(t + '-'))
  if (!typ) return null
  const zielSlug = slug.slice(typ.length + 1)
  const ziel = reiseKlima.find((z) => z.slug === zielSlug)
  if (!ziel || buchbare(ziel).length < 4) return null

  const beste = getBesteMonate(ziel).map((mi) => ziel.monate[mi - 1])
  const guenstig = getGuenstigsterMonat(ziel)
  const warmMonate = ziel.monate.filter(warm)
  const peak = [...ziel.monate].sort((a, b) => b.wasser - a.wasser)[0]

  // destinationsspezifische Highlight-Fakten — brechen Near-Duplicate bei
  // klimatisch ähnlichen Nachbarzielen (forge-geprüft).
  const besteFakten = beste.flatMap((m) => m.highlights).slice(0, 3)

  const base = {
    slug,
    typ,
    ziel,
  }

  if (typ === 'beste-reisezeit') {
    const besteNamen = beste.map(jahr)
    return {
      ...base,
      frage: `Wann ist die beste Reisezeit für ${ziel.name}?`,
      seoTitle: `Beste Reisezeit ${ziel.name}: ${besteNamen.join(', ')} (bis ${peak.wasser}°C Wasser)`,
      kurzantwort: `Die beste Reisezeit für ${ziel.name} sind die Monate ${besteNamen.join(', ')}. Dann liegt die Wassertemperatur bei bis zu ${peak.wasser}°C bei ${beste[0].sonne}+ Sonnenstunden täglich.`,
      absatz: [
        `Für einen Badeurlaub auf ${ziel.name} eignen sich am besten ${besteNamen.join(', ')}: In diesen Monaten erreicht das Meer ${beste.map((m) => `${m.wasser}°C im ${jahr(m)}`).join(', ')}, kombiniert mit ${beste[0].sonne} bis ${peak.sonne} Sonnenstunden pro Tag.`,
        warmMonate.length
          ? `Badetauglich (Wasser ab 22°C, wenig Regen) ist ${ziel.name} in folgenden Monaten: ${warmMonate.map(jahr).join(', ')}.`
          : `${ziel.name} ist eher ein Ziel für Kultur und Aktivurlaub als für klassischen Badeurlaub — das Wasser bleibt das Jahr über frisch.`,
        `Was diese Monate auf ${ziel.name} besonders macht: ${besteFakten.map((h) => `${h}.`).join(' ')}`,
        `Wer Preise sparen will, reist im ${jahr(guenstig)}: Dann starten Pauschalreisen ab ${guenstig.preisAb} € pro Person. Der Flug ab Deutschland dauert rund ${ziel.flugStunden} Stunden zum Flughafen ${ziel.flughafen}.`,
      ],
      datapoints: [
        ...beste.map((m) => `${jahr(m)} ${m.wasser}°C Wasser`),
        `günstigster Monat ${jahr(guenstig)}`,
        `ab ${guenstig.preisAb} €`,
        `${peak.wasser}°C Spitzenwert`,
        `Flugzeit ${ziel.flugStunden} h`,
        `Flughafen ${ziel.flughafen}`,
      ],
      faq: [
        { q: `Welcher Monat ist am wärmsten auf ${ziel.name}?`, a: `Am wärmsten ist das Meer im ${jahr(peak)} mit ${peak.wasser}°C bei ${peak.tagMax}°C Lufttemperatur.` },
        { q: `Wann ist Nebensaison auf ${ziel.name}?`, a: `Die günstigste und ruhigste Zeit ist der ${jahr(guenstig)} mit Preisen ab ${guenstig.preisAb} €.` },
      ],
    }
  }

  if (typ === 'guenstigste-reisezeit') {
    const sortedByPrice = [...buchbare(ziel)].sort((a, b) => a.preisAb - b.preisAb)
    const teuer = sortedByPrice[sortedByPrice.length - 1]
    return {
      ...base,
      frage: `Wann ist ${ziel.name} am günstigsten?`,
      seoTitle: `${ziel.name} günstig buchen: im ${jahr(guenstig)} ab ${guenstig.preisAb} € (Preistabelle)`,
      kurzantwort: `${ziel.name} ist im ${jahr(guenstig)} am günstigsten: Pauschalreisen ab ${guenstig.preisAb} € pro Person. Am teuersten ist der ${jahr(teuer)} (ab ${teuer.preisAb} €).`,
      absatz: [
        `Der günstigste Reisemonat für ${ziel.name} ist der ${jahr(guenstig)} mit Pauschalpreisen ab ${guenstig.preisAb} € pro Person inklusive Flug und Hotel. Zu diesem Zeitpunkt liegt die Tagestemperatur bei ${guenstig.tagMax}°C, das Wasser bei ${guenstig.wasser}°C.`,
        `Was im ${jahr(guenstig)} auf ${ziel.name} los ist: ${guenstig.highlights.map((h) => `${h}.`).join(' ')}`,
        `Am teuersten wird es im ${jahr(teuer)} (ab ${teuer.preisAb} €) — der Preisunterschied zwischen günstigstem und teuerstem Monat beträgt rund ${teuer.preisAb - guenstig.preisAb} € pro Person.`,
        `Die drei günstigsten Monate: ${sortedByPrice.slice(0, 3).map((m) => `${jahr(m)} (ab ${m.preisAb} €)`).join(', ')}. Wer flexibel ist, spart hier am meisten.`,
      ],
      tabelleHead: ['Monat', 'Preis ab', 'Tag °C', 'Wasser °C'],
      tabelle: buchbare(ziel).map((m) => ({ monat: jahr(m), werte: [`${m.preisAb} €`, `${m.tagMax}°`, `${m.wasser}°`] })),
      datapoints: [
        `günstigster ${jahr(guenstig)} ab ${guenstig.preisAb} €`,
        `teuerster ${jahr(teuer)} ab ${teuer.preisAb} €`,
        `Differenz ${teuer.preisAb - guenstig.preisAb} €`,
        ...sortedByPrice.slice(0, 3).map((m) => `${jahr(m)} ${m.preisAb} €`),
      ],
      faq: [
        { q: `Wie viel kostet eine Woche ${ziel.name}?`, a: `Im günstigsten Monat (${jahr(guenstig)}) ab ${guenstig.preisAb} € pro Person, in der Hochsaison (${jahr(teuer)}) ab ${teuer.preisAb} €.` },
      ],
    }
  }

  if (typ === 'klimatabelle') {
    return {
      ...base,
      frage: `Wie ist das Klima auf ${ziel.name}? (Klimatabelle)`,
      seoTitle: `Klimatabelle ${ziel.name}: ${ziel.monate[0].tagMax}°C bis ${peak.tagMax}°C${peak.wasser > 0 ? `, Meer bis ${peak.wasser}°C` : ''} (alle Monate)`,
      kurzantwort: `${ziel.name} hat von ${ziel.monate[0].tagMax}°C im Winter bis ${peak.tagMax}°C im Hochsommer, das Meer erreicht bis zu ${peak.wasser}°C. Hier die komplette Klimatabelle.`,
      absatz: [
        `Die Klimatabelle für ${ziel.name} zeigt Tag- und Nachttemperatur, Wassertemperatur, Sonnenstunden und Regentage für jeden Monat.`,
        `Der wärmste Monat ist der ${jahr([...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0])} mit ${[...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0].tagMax}°C, der kühlste der ${jahr([...ziel.monate].sort((a, b) => a.tagMax - b.tagMax)[0])} mit ${[...ziel.monate].sort((a, b) => a.tagMax - b.tagMax)[0].tagMax}°C. Saisonales Highlight im wärmsten Monat: ${[...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0].highlights[0]}.`,
        `${ziel.name} liegt in ${ziel.land}, der Flug ab Deutschland dauert ${ziel.flugStunden} Stunden zum Flughafen ${ziel.flughafen}, die Zeitverschiebung beträgt ${ziel.zeitverschiebung} Stunden.`,
      ],
      tabelleHead: ['Monat', 'Tag °C', 'Nacht °C', 'Wasser °C', 'Sonne h', 'Regentage'],
      tabelle: ziel.monate.map((m) => ({ monat: jahr(m), werte: [`${m.tagMax}°`, `${m.tagMin}°`, `${m.wasser}°`, `${m.sonne}`, `${m.regen}`] })),
      datapoints: [
        `wärmster ${jahr([...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0])}`,
        `kühlster ${jahr([...ziel.monate].sort((a, b) => a.tagMax - b.tagMax)[0])}`,
        `Wasser bis ${peak.wasser}°C`,
        `Flugzeit ${ziel.flugStunden} h`,
        `Zeitverschiebung ${ziel.zeitverschiebung} h`,
        `Flughafen ${ziel.flughafen}`,
      ],
      faq: [
        { q: `Wie viele Sonnenstunden hat ${ziel.name}?`, a: `Im Hochsommer bis zu ${Math.max(...ziel.monate.map((m) => m.sonne))} Sonnenstunden pro Tag.` },
      ],
    }
  }

  if (typ === 'anreise') {
    const dauer = ziel.flugStunden <= 2.5 ? 'Kurzstrecke' : ziel.flugStunden <= 5 ? 'Mittelstrecke' : 'Langstrecke'
    const zv = ziel.zeitverschiebung === 0
      ? 'keine Zeitverschiebung zu Deutschland'
      : `${Math.abs(ziel.zeitverschiebung)} Stunden ${ziel.zeitverschiebung > 0 ? 'vor' : 'hinter'} Deutschland`
    const orte = [...new Set(ziel.monate.flatMap((m) => m.highlights))].slice(0, 2)
    return {
      ...base,
      frage: `Wie lange dauert der Flug nach ${ziel.name}?`,
      seoTitle: `Flugzeit nach ${ziel.name}: ca. ${String(ziel.flugStunden).replace('.', ',')} Stunden ab Deutschland`,
      kurzantwort: `Der Flug von Deutschland nach ${ziel.name} dauert rund ${ziel.flugStunden} Stunden (${dauer}) zum Flughafen ${ziel.flughafen}, ${zv}. Direktflüge ab ${ziel.abflug.join(', ')}.`,
      absatz: [
        `Der Flug von Deutschland nach ${ziel.name} dauert rund ${ziel.flugStunden} Stunden und ist damit eine ${dauer}. Geflogen wird zum Flughafen ${ziel.flughafen}, ${zv}. Direktflüge starten ab ${ziel.abflug.join(', ')}.`,
        ziel.flugStunden <= 4
          ? `Als ${dauer} eignet sich ${ziel.name} auch gut für einen kürzeren Urlaub oder mit kleinen Kindern.`
          : ziel.flugStunden <= 7
            ? `Die ${dauer} nach ${ziel.name} ist mit Kindern machbar, lohnt sich aber eher ab einer Woche.`
            : `Wegen der ${dauer} von ${ziel.flugStunden} Stunden lohnt sich ${ziel.name} vor allem für längere Reisen ab zwei Wochen.`,
        `Vom Flughafen ${ziel.flughafen} aus erreichst du die Highlights von ${ziel.name}: ${orte.join(' ')}.`,
        `Eine Pauschalreise nach ${ziel.name} startet ab ${guenstig.preisAb} € pro Person inklusive Flug und Hotel.`,
      ],
      datapoints: [
        `${ziel.flugStunden} h Flug`,
        ziel.flughafen,
        `${ziel.zeitverschiebung} h Zeitverschiebung`,
        ...ziel.abflug.slice(0, 3),
      ],
      faq: [
        { q: `Welche Flughäfen fliegen ${ziel.name} an?`, a: `Direktflüge ab ${ziel.abflug.join(', ')} landen auf dem Flughafen ${ziel.flughafen}.` },
        { q: `Wie groß ist die Zeitverschiebung in ${ziel.name}?`, a: zv.charAt(0).toUpperCase() + zv.slice(1) + '.' },
      ],
    }
  }

  // mit-kindern
  const familienMonate = ziel.monate.filter((m) => m.preisAb > 0 && m.wasser >= 22 && m.tagMax <= 33 && m.regen <= 5)
  const empfohlen = familienMonate.length ? familienMonate : beste
  return {
    ...base,
    frage: `Wann ist die beste Reisezeit für ${ziel.name} mit Kindern?`,
    seoTitle: `${ziel.name} mit Kindern: beste Reisezeit ${empfohlen.slice(0, 3).map(jahr).join(', ')}`,
    kurzantwort: `Für Familienurlaub auf ${ziel.name} eignen sich ${empfohlen.map(jahr).join(', ')} am besten: warmes Wasser (${empfohlen[0].wasser}°C+) ohne extreme Hitze.`,
    absatz: [
      `Mit Kindern ist auf ${ziel.name} die ideale Reisezeit ${empfohlen.map(jahr).join(', ')}: Das Wasser ist mit ${empfohlen.map((m) => m.wasser).join(', ')}°C kindgerecht warm, die Lufttemperatur bleibt mit maximal ${Math.max(...empfohlen.map((m) => m.tagMax))}°C aushaltbar.`,
      `Familienfreundliche Highlights in dieser Zeit: ${empfohlen.slice(0, 2).map((m) => `${m.highlights[0]}.`).join(' ')}`,
      `Die heißesten Monate (${[...ziel.monate].sort((a, b) => b.tagMax - a.tagMax).slice(0, 2).map(jahr).join(', ')}, bis ${[...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0].tagMax}°C) können für kleine Kinder anstrengend sein.`,
      `Familienfreundliche Pauschalreisen nach ${ziel.name} starten ab ${guenstig.preisAb} € pro Person. Der Flug dauert ${ziel.flugStunden} Stunden — ${ziel.flugStunden <= 4 ? 'eine kurze, familienfreundliche Strecke' : ziel.flugStunden <= 7 ? 'eine mittlere Distanz, mit Kindern gut machbar' : 'eine Langstrecke, eher für ältere Kinder geeignet'}.`,
    ],
    datapoints: [
      ...empfohlen.slice(0, 3).map((m) => `${jahr(m)} ${m.wasser}°C`),
      `Flugzeit ${ziel.flugStunden} h`,
      `ab ${guenstig.preisAb} €`,
      `heißester ${[...ziel.monate].sort((a, b) => b.tagMax - a.tagMax)[0].tagMax}°C`,
    ],
    faq: [
      { q: `Wie lange dauert der Flug nach ${ziel.name}?`, a: `Rund ${ziel.flugStunden} Stunden ab Deutschland zum Flughafen ${ziel.flughafen}.` },
    ],
  }
}
