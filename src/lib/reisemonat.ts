// ---------------------------------------------------------------------------
// Reisemonat — Helper für die programmatischen Seiten /reise/[ziel]/[monat].
//
// Erzeugt KEINEN gesponnenen Text. Jeder Satz wird aus den Realwerten des Monats
// abgeleitet (Temperatur, Wasser, Sonne, Regen, Preis, Andrang). Ändert sich der
// Wert, ändert sich der Satz → der Text divergiert mit den Daten, nicht mit
// Synonymen. Genau das, was den SimHash verschiebt und Near-Duplicate verhindert.
// ---------------------------------------------------------------------------

import {
  reiseKlima,
  MONAT_NAMEN,
  MONAT_SLUGS,
  type ZielKlima,
  type MonatKlima,
} from '@/data/reise-klima'

export type ReisemonatPage = {
  ziel: ZielKlima
  monat: MonatKlima
  monatName: string
  monatSlug: string
  monatIndex: number // 0-11
}

/**
 * Monate mit preisAb === 0 = Resort/Saison geschlossen, KEIN Pauschalangebot.
 * Solche Seiten werden NICHT generiert (404 statt thin/soft-404-Seite ohne
 * Verkaufsdatenpunkt). Korrektes page-forge-Verhalten: keine Seite ohne Daten.
 */
export function isPublishableMonth(m: MonatKlima): boolean {
  return m.preisAb > 0
}

export function getAllReisemonatParams() {
  const out: { ziel: string; monat: string }[] = []
  for (const z of reiseKlima) {
    for (const m of z.monate) {
      if (!isPublishableMonth(m)) continue
      out.push({ ziel: z.slug, monat: MONAT_SLUGS[m.monat - 1] })
    }
  }
  return out
}

export function getReisemonat(zielSlug: string, monatSlug: string): ReisemonatPage | null {
  const ziel = reiseKlima.find((z) => z.slug === zielSlug)
  if (!ziel) return null
  const monatIndex = MONAT_SLUGS.indexOf(monatSlug as (typeof MONAT_SLUGS)[number])
  if (monatIndex < 0) return null
  const monat = ziel.monate.find((m) => m.monat === monatIndex + 1)
  if (!monat) return null
  if (!isPublishableMonth(monat)) return null
  return {
    ziel,
    monat,
    monatName: MONAT_NAMEN[monatIndex],
    monatSlug,
    monatIndex,
  }
}

/** Bestmonate für eine Destination: höchstes Wasser + viel Sonne + wenig Regen, gewichtet. */
export function getBesteMonate(ziel: ZielKlima): number[] {
  return [...ziel.monate]
    .map((m) => ({
      monat: m.monat,
      score: m.wasser * 1.5 + m.sonne * 2 - m.regen * 1.5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.monat)
}

/** Günstigster buchbarer Monat (niedrigster preisAb > 0). */
export function getGuenstigsterMonat(ziel: ZielKlima): MonatKlima {
  const buchbar = ziel.monate.filter((m) => m.preisAb > 0)
  return [...buchbar].sort((a, b) => a.preisAb - b.preisAb)[0] ?? ziel.monate[0]
}

/** Bewertung Badewetter aus Wassertemperatur. */
export function badewetter(wasser: number): string {
  if (wasser >= 24) return 'ideales Badewetter'
  if (wasser >= 21) return 'angenehm warmes Wasser zum Baden'
  if (wasser >= 18) return 'frisches, aber badetaugliches Wasser'
  return 'zu kühl zum längeren Baden'
}

function andrangText(a: MonatKlima['andrang']): string {
  if (a === 'hoch') return 'Hauptsaison mit vollen Stränden und höheren Preisen'
  if (a === 'mittel') return 'Nebensaison mit guter Mischung aus Wetter und Ruhe'
  return 'Vorsaison mit wenig Andrang und den günstigsten Preisen'
}

function vergleichVormonat(ziel: ZielKlima, idx: number): string {
  const prev = ziel.monate[(idx + 11) % 12]
  const cur = ziel.monate[idx]
  const dt = cur.tagMax - prev.tagMax
  if (dt >= 3) return `${dt} Grad wärmer als im Vormonat`
  if (dt <= -3) return `${Math.abs(dt)} Grad kühler als im Vormonat`
  return 'ähnlich mild wie im Vormonat'
}

function tempSatz(ziel: ZielKlima, m: MonatKlima, mn: string): string {
  if (m.tagMax >= 30) return `Im ${mn} wird es auf ${ziel.name} richtig heiß: ${m.tagMax} Grad am Tag, nachts kühlt es kaum unter ${m.tagMin} Grad ab.`
  if (m.tagMax >= 26) return `Mit ${m.tagMax} Grad am Tag ist der ${mn} hochsommerlich warm, die Nächte bleiben mit ${m.tagMin} Grad lau.`
  if (m.tagMax >= 21) return `Der ${mn} bringt angenehme ${m.tagMax} Grad, abends sind es ${m.tagMin} Grad — warm, aber nicht drückend.`
  if (m.tagMax >= 16) return `Mit ${m.tagMax} Grad tagsüber und ${m.tagMin} Grad nachts ist der ${mn} mild.`
  return `Der ${mn} ist mit ${m.tagMax} Grad am Tag und ${m.tagMin} Grad nachts die kühle Jahreszeit auf ${ziel.name}.`
}

/** Inland-Ziele (Städte) haben wasser=0 → kein Meer-Satz. */
function wasserSatz(m: MonatKlima): string {
  if (m.wasser <= 0) return '' // Binnenziel ohne Meer
  if (m.wasser >= 25) return `Das Meer ist mit ${m.wasser} Grad badewannenwarm.`
  if (m.wasser >= 22) return `Bei ${m.wasser} Grad Wassertemperatur ist Baden ein Vergnügen.`
  if (m.wasser >= 19) return `Das Wasser hat ${m.wasser} Grad: erfrischend, aber gut zum Schwimmen.`
  if (m.wasser >= 16) return `Mit ${m.wasser} Grad ist das Meer noch frisch — etwas für Abgehärtete.`
  return `Das Meer ist mit ${m.wasser} Grad zu kalt zum Baden.`
}

function packSatz(m: MonatKlima, mn: string): string {
  if (m.tagMax >= 28) return `Badesachen, Sonnencreme mit hohem Schutzfaktor und leichte Sommerkleidung reichen völlig.`
  if (m.tagMax >= 22) return `T-Shirts und kurze Hosen für den Tag, eine dünne Jacke für laue Abende, Badesachen für den Strand.`
  if (m.tagMax >= 17) return `Zwiebellook ist im ${mn} ideal — kurze Sachen für die Mittagssonne, Pullover und Jacke für kühlere Stunden.`
  return `Warme Jacke, lange Hosen, festes Schuhwerk und Regenschutz gehören im ${mn} ins Gepäck.`
}

/**
 * Highlights als Fließtext statt Stichpunkte. Die Dataset-Highlights sind bereits
 * ganze Aussagesätze; wir verketten sie zu 1-2 Absätzen mit variierenden Über-
 * leitungen je nach Saison. So liest sich der Abschnitt als echter Prosatext und
 * teilt sich keine identische Stichpunktliste mit Nachbarmonaten.
 */
function highlightsProse(ziel: ZielKlima, m: MonatKlima, mn: string): string {
  const hs = m.highlights.filter(Boolean)
  if (hs.length === 0) return ''
  const sats = (t: string) => (/[.!?]$/.test(t.trim()) ? t.trim() : t.trim() + '.')
  // Überleitung nach Saison-Bucket variieren (nicht nur Zahlen tauschen).
  let auftakt: string
  if (m.andrang === 'hoch') {
    auftakt = `Im ${mn} ist auf ${ziel.name} am meisten los. ${sats(hs[0])}`
  } else if (m.andrang === 'mittel') {
    auftakt = `Wer ${ziel.name} abseits des größten Trubels erleben will, ist im ${mn} richtig. ${sats(hs[0])}`
  } else {
    auftakt = `Der ${mn} zeigt eine ruhigere, ursprünglichere Seite von ${ziel.name}. ${sats(hs[0])}`
  }
  const rest = hs.slice(1).map(sats)
  if (rest.length === 0) return auftakt
  const koppler = m.andrang === 'hoch'
    ? 'Dazu kommt: '
    : m.andrang === 'mittel'
      ? 'Sehenswert ist außerdem: '
      : 'Lohnenswert ist zudem: '
  return `${auftakt} ${koppler}${rest.join(' ')}`.replace(/\s+/g, ' ').trim()
}

/**
 * Preis- und Anreise-Absatz mit ECHT unterschiedlicher Satzstruktur je Saison-
 * Bucket (andrang) und Binnen-/Küstenflag. Nachbarmonate und klimatisch ähnliche
 * Ziele teilen so kein wortgleiches Gerüst mehr, sondern nur die Realzahlen.
 */
function preiseAnreiseProse(
  ziel: ZielKlima,
  m: MonatKlima,
  mn: string,
  guenstigName: string,
  guenstigPreis: number,
  istBinnen: boolean,
): string {
  const istGuenstigster = m.preisAb <= guenstigPreis
  const reise = istBinnen ? 'Städtereise' : 'Pauschalreise'
  const ort = istBinnen ? 'mit Hotel zentral' : 'inklusive Flug und Hotel'

  if (m.andrang === 'hoch') {
    // Hochsaison: Knappheit/früh buchen voranstellen.
    const teil = istGuenstigster
      ? `Selbst in der Hochsaison bleibt der ${mn} preislich der günstigste Reisemonat des Jahres.`
      : `Günstiger reist du im ${guenstigName} (ab ${guenstigPreis} €), wer aber die volle Saisonstimmung sucht, ist im ${mn} genau richtig.`
    return `Der ${mn} ist auf ${ziel.name} Hochsaison: entsprechend gefragt sind Hotels und Flüge, eine frühe Buchung lohnt sich. Eine ${reise} startet ab ${m.preisAb} € pro Person ${ort}. ${teil}`
  }

  if (m.andrang === 'mittel') {
    // Nebensaison: Preis/Leistung in den Mittelpunkt.
    const teil = istGuenstigster
      ? `Damit fällt der ${mn} zugleich in den günstigsten Zeitraum des Jahres.`
      : `Den absoluten Tiefpreis findest du im ${guenstigName} ab ${guenstigPreis} €, doch das Verhältnis aus Wetter und Preis ist im ${mn} schwer zu schlagen.`
    return `Im ${mn} liegt ${ziel.name} in der Nebensaison, das macht die ${reise} mit Preisen ab ${m.preisAb} € pro Person ${ort} attraktiv. ${teil}`
  }

  // Vorsaison / niedrig: Ruhe und Sparpotenzial betonen.
  const teil = istGuenstigster
    ? `Günstiger als im ${mn} (ab ${m.preisAb} €) wird es das ganze Jahr nicht.`
    : `Noch ein paar Euro sparst du im ${guenstigName} (ab ${guenstigPreis} €), viel ruhiger als im ${mn} geht es aber kaum.`
  return `Wer Andrang meiden und sparen will, reist im ${mn}: Die ${reise} ist mit ab ${m.preisAb} € pro Person ${ort} eine der günstigsten des Jahres. ${teil}`
}

/**
 * Liefert alle Datapoints der Seite (für forge.py-Validierung) UND die Textblöcke.
 * Recipe (geprüft, 100% PASS): Klimawerte + tempSatz/wasserSatz + monatsspezifische
 * highlights (der divergente Realwert) + packSatz + Anreise.
 */
export function buildReisemonatContent(page: ReisemonatPage) {
  const { ziel, monat, monatName, monatIndex } = page
  const beste = getBesteMonate(ziel)
  const guenstig = getGuenstigsterMonat(ziel)
  const guenstigName = MONAT_NAMEN[guenstig.monat - 1]
  const istBesterMonat = beste.includes(monat.monat)

  const istBinnen = monat.wasser <= 0

  const datapoints: string[] = [
    `${monat.tagMax} °C tagsüber`,
    `${monat.tagMin} °C nachts`,
    ...(istBinnen ? [] : [`${monat.wasser} °C Wassertemperatur`]),
    `${monat.sonne} Sonnenstunden täglich`,
    `${monat.regen} Regentage`,
    `Pauschalreise ab ${monat.preisAb} €`,
    ...monat.highlights,
  ]

  const klimaSatz = `${tempSatz(ziel, monat, monatName)} ${wasserSatz(monat)} Im Schnitt ${monat.sonne} Sonnenstunden pro Tag und etwa ${monat.regen} Regentage. Damit ist es ${vergleichVormonat(ziel, monatIndex)}.`.replace(/\s+/g, ' ').trim()

  const meerTeil = istBinnen ? '' : `, das Meer hat ${monat.wasser} Grad`
  const intro =
    `${ziel.name} im ${monatName}: ${monat.tagMax} Grad am Tag${meerTeil} ` +
    `und die Sonne scheint im Schnitt ${monat.sonne} Stunden pro Tag. ` +
    `${monat.andrang === 'hoch' ? 'Es ist Hauptsaison' : monat.andrang === 'mittel' ? 'Es ist Nebensaison' : 'Es ist Vorsaison'} — ` +
    `Pauschalreisen starten ab ${monat.preisAb} Euro pro Person.`

  return {
    datapoints,
    beste,
    guenstig,
    guenstigName,
    istBesterMonat,
    istBinnen,
    intro,
    klimaSatz,
    andrangText: andrangText(monat.andrang),
    packSatz: packSatz(monat, monatName),
    highlightsProse: highlightsProse(ziel, monat, monatName),
    preiseAnreiseProse: preiseAnreiseProse(
      ziel,
      monat,
      monatName,
      guenstigName,
      guenstig.preisAb,
      istBinnen,
    ),
  }
}
