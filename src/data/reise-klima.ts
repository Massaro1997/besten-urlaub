// ---------------------------------------------------------------------------
// Reise-Klima — Klimadaten pro Reiseziel × Monat.
//
// QUELLE DER UNIQUE-WERTE für programmatische Seiten /reise/[ziel]/[monat].
// Jeder Monat einer Destination trägt EIGENE, divergente Realwerte:
//   - tagMax / tagMin  (°C Lufttemperatur Tag/Nacht)
//   - wasser           (°C Meerwassertemperatur)
//   - sonne            (Sonnenstunden pro Tag)
//   - regen            (Regentage im Monat)
//   - preisAb          (typischer Pauschalreise-Ab-Preis p.P. in € für diesen Monat)
//   - andrang          (Andrang/Auslastung: 'niedrig' | 'mittel' | 'hoch')
//
// Diese Zahlen verschieben den SimHash-Fingerprint jeder Seite real (jeder Monat
// andere Werte) → die Seiten sind KEINE Near-Duplicates → Google indexiert sie.
// Klimawerte sind langjährige Monatsmittel (Wetterdienst-Klimanormalen), bewusst
// gerundet. Preise sind Markt-Richtwerte für den deutschen Pauschalreise-Markt.
// ---------------------------------------------------------------------------

export type MonatKlima = {
  /** 1-12 */
  monat: number
  tagMax: number
  tagMin: number
  wasser: number
  sonne: number
  regen: number
  preisAb: number
  andrang: 'niedrig' | 'mittel' | 'hoch'
  /**
   * Monatsspezifische Highlights / Ereignisse / Saisonales. DAS ist der
   * divergente Realwert, der zwei klimatisch ähnliche Monate unterscheidbar
   * macht (Festivals, Erntezeit, Meereszustand, lokale Events). 2-4 Einträge.
   */
  highlights: string[]
}

export type ZielKlima = {
  /** muss zu einem Destination.slug passen (kanonisch, DE) */
  slug: string
  /** Anzeigename DE */
  name: string
  land: string
  /** Flugzeit ab Frankfurt in Stunden (Richtwert) */
  flugStunden: number
  /** typische Abflughäfen DE */
  abflug: string[]
  /** Zeitverschiebung zu MEZ in Stunden */
  zeitverschiebung: number
  /** Hauptflughafen am Ziel */
  flughafen: string
  monate: MonatKlima[]
}

export const MONAT_NAMEN = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
] as const

export const MONAT_SLUGS = [
  'januar', 'februar', 'maerz', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'dezember',
] as const

export const reiseKlima: ZielKlima[] = [
  {
    slug: 'mallorca',
    name: 'Mallorca',
    land: 'Spanien',
    flugStunden: 2.2,
    abflug: ['Frankfurt', 'München', 'Düsseldorf', 'Berlin', 'Hamburg'],
    zeitverschiebung: 0,
    flughafen: 'Palma de Mallorca (PMI)',
    monate: [
      { monat: 1, tagMax: 15, tagMin: 6, wasser: 14, sonne: 5, regen: 8, preisAb: 299, andrang: 'niedrig', highlights: ['Mandelblüte beginnt Ende Januar und färbt das Inselinnere rosa-weiß', 'Sant Antoni mit Lagerfeuern und Teufelsläufen in Sa Pobla und Artà', 'Wandersaison auf der Serra de Tramuntana ohne Hitze'] },
      { monat: 2, tagMax: 15, tagMin: 6, wasser: 14, sonne: 6, regen: 7, preisAb: 309, andrang: 'niedrig', highlights: ['Höhepunkt der Mandelblüte rund um Son Servera und Bunyola', 'Karneval (Sa Rua) in Palma mit Umzügen', 'Orangenernte im Tal von Sóller'] },
      { monat: 3, tagMax: 17, tagMin: 7, wasser: 14, sonne: 6, regen: 7, preisAb: 329, andrang: 'niedrig', highlights: ['Frühlingswanderungen mit blühenden Wildblumen am Cap de Formentor', 'Erste Strandtage für Hartgesottene', 'Radsaison startet, Profiteams trainieren auf der Insel'] },
      { monat: 4, tagMax: 19, tagMin: 9, wasser: 15, sonne: 7, regen: 6, preisAb: 379, andrang: 'mittel', highlights: ['Osterprozessionen (Semana Santa) in Palma', 'Grün-üppige Tramuntana vor dem Sommer', 'Mietwagen noch günstig, Buchten menschenleer'] },
      { monat: 5, tagMax: 23, tagMin: 12, wasser: 17, sonne: 9, regen: 5, preisAb: 399, andrang: 'mittel', highlights: ['Beste Wanderzeit vor der Sommerhitze', 'Firó-Vorbereitungen in Sóller', 'Erste warme Badetage an der Ostküste (Cala Millor)'] },
      { monat: 6, tagMax: 27, tagMin: 16, wasser: 21, sonne: 10, regen: 3, preisAb: 549, andrang: 'hoch', highlights: ['Sant Joan in der Nacht zum 24. mit Feuern am Strand', 'Beginn der Strandsaison, Wasser über 20 Grad', 'Lange Tage mit Sonnenuntergang nach 21 Uhr'] },
      { monat: 7, tagMax: 30, tagMin: 19, wasser: 24, sonne: 11, regen: 1, preisAb: 699, andrang: 'hoch', highlights: ['Mare de Déu del Carme: Fischerprozessionen in den Häfen am 16.', 'Hochsommer, Strände und Ballermann auf Anschlag', 'Open-Air-Konzerte in Palma'] },
      { monat: 8, tagMax: 31, tagMin: 19, wasser: 26, sonne: 10, regen: 2, preisAb: 749, andrang: 'hoch', highlights: ['Wärmstes Meer des Jahres mit 26 Grad', 'Sant Bartomeu-Fest in Montuïri mit den Cossiers-Tänzern', 'Teuerster Reisemonat, früh buchen Pflicht'] },
      { monat: 9, tagMax: 27, tagMin: 17, wasser: 25, sonne: 8, regen: 5, preisAb: 549, andrang: 'hoch', highlights: ['Weinlese in Binissalem mit Weinfest (Festa des Vermar)', 'Meer noch sommerwarm, Strände leerer', 'Ideal für Badeurlaub ohne Hitzestress'] },
      { monat: 10, tagMax: 23, tagMin: 13, wasser: 22, sonne: 6, regen: 8, preisAb: 399, andrang: 'mittel', highlights: ['Goldener Herbst, Wandersaison kehrt zurück', 'Botifarró-Fest in Sant Joan', 'Letzte warme Badetage, deutlich günstiger'] },
      { monat: 11, tagMax: 18, tagMin: 9, wasser: 19, sonne: 5, regen: 8, preisAb: 329, andrang: 'niedrig', highlights: ['Dijous Bo, der größte Jahrmarkt der Insel in Inca', 'Olivenernte in der Tramuntana', 'Ruhige Städtetrips nach Palma ohne Menschenmassen'] },
      { monat: 12, tagMax: 16, tagMin: 7, wasser: 16, sonne: 5, regen: 8, preisAb: 309, andrang: 'niedrig', highlights: ['Weihnachtsmärkte in Palma und Lichterglanz an der Kathedrale', 'Cant de la Sibil·la in der Christmette (UNESCO-Kulturerbe)', 'Milde Spaziergänge statt Strand'] },
    ],
  },
  {
    slug: 'kreta',
    name: 'Kreta',
    land: 'Griechenland',
    flugStunden: 3.2,
    abflug: ['Frankfurt', 'München', 'Düsseldorf', 'Stuttgart', 'Hamburg'],
    zeitverschiebung: 1,
    flughafen: 'Heraklion (HER)',
    monate: [
      { monat: 1, tagMax: 16, tagMin: 9, wasser: 16, sonne: 4, regen: 12, preisAb: 319, andrang: 'niedrig', highlights: ['Schnee auf dem Psiloritis bei gleichzeitig mildem Küstenwetter', 'Olivenernte in der Messara-Ebene in vollem Gang', 'Stille Altstadt von Chania ohne Touristen'] },
      { monat: 2, tagMax: 16, tagMin: 9, wasser: 16, sonne: 5, regen: 9, preisAb: 319, andrang: 'niedrig', highlights: ['Karneval von Rethymno, einer der größten Griechenlands', 'Erste Zitrusernte rund um Ierapetra', 'Wandern in der Imbros-Schlucht ohne Hitze'] },
      { monat: 3, tagMax: 17, tagMin: 10, wasser: 16, sonne: 6, regen: 7, preisAb: 349, andrang: 'niedrig', highlights: ['Wildblumenblüte überzieht die Hochebene Lasithi', 'Griechischer Unabhängigkeitstag am 25. mit Paraden', 'Samaria-Schlucht meist noch wegen Schmelzwasser gesperrt'] },
      { monat: 4, tagMax: 20, tagMin: 12, wasser: 17, sonne: 8, regen: 4, preisAb: 399, andrang: 'mittel', highlights: ['Orthodoxes Osterfest mit Lammbraten und Mitternachtsmessen', 'Samaria-Schlucht öffnet meist Anfang Mai, Vorsaison-Wandern startet', 'Erste Strandtage an der windgeschützten Südküste'] },
      { monat: 5, tagMax: 24, tagMin: 15, wasser: 19, sonne: 10, regen: 2, preisAb: 449, andrang: 'mittel', highlights: ['Samaria-Schlucht offen, 16 km Wanderung durch die Weiße-Berge-Schlucht', 'Elafonisi mit rosa Sand noch ruhig', 'Beste Kombi aus Wandern und ersten Badetagen'] },
      { monat: 6, tagMax: 28, tagMin: 19, wasser: 23, sonne: 12, regen: 1, preisAb: 599, andrang: 'hoch', highlights: ['Beginn der Strandsaison, Balos-Lagune in voller Farbe', 'Lange Sonnentage, Meer über 22 Grad', 'Weinfeste in Dafnes starten'] },
      { monat: 7, tagMax: 30, tagMin: 22, wasser: 25, sonne: 13, regen: 0, preisAb: 749, andrang: 'hoch', highlights: ['Rethymno-Renaissancefestival mit Konzerten in der Festung', 'Hochsommer, Südküste (Preveli) am wärmsten', 'Meltemi-Wind kühlt die Nordküste angenehm'] },
      { monat: 8, tagMax: 30, tagMin: 22, wasser: 26, sonne: 12, regen: 0, preisAb: 799, andrang: 'hoch', highlights: ['Wärmstes Meer mit 26 Grad, Schnorcheln vor Chrissi-Insel', 'Mariä Himmelfahrt am 15. mit Dorffesten (Panigiria)', 'Teuerster Monat, Hotels Monate vorher ausgebucht'] },
      { monat: 9, tagMax: 27, tagMin: 19, wasser: 25, sonne: 10, regen: 2, preisAb: 599, andrang: 'hoch', highlights: ['Weinlese rund um Heraklion, Sultaninen-Trocknung', 'Meer noch 25 Grad, Strände leeren sich', 'Ideale Wander-Bade-Kombi vor dem Herbst'] },
      { monat: 10, tagMax: 24, tagMin: 16, wasser: 23, sonne: 7, regen: 6, preisAb: 429, andrang: 'mittel', highlights: ['Kastanienfest in Elos (Westkreta)', 'Letzter Monat der Samaria-Schlucht vor Winterschließung', 'Warmes Meer bei deutlich gesunkenen Preisen'] },
      { monat: 11, tagMax: 20, tagMin: 13, wasser: 21, sonne: 5, regen: 9, preisAb: 349, andrang: 'niedrig', highlights: ['Neue Olivenernte und frisches Öl in den Tavernen', 'Jahrestag der Arkadi-Explosion am 8. mit Gedenkfeiern', 'Milde Spaziergänge durch Chania und Rethymno ohne Trubel'] },
      { monat: 12, tagMax: 17, tagMin: 11, wasser: 18, sonne: 4, regen: 11, preisAb: 319, andrang: 'niedrig', highlights: ['Weihnachten griechisch mit Kalanda-Liedern und Christópsomo-Brot', 'Schnee auf den Lefká Óri, Küste bleibt mild', 'Günstigste Reisezeit für Kulturreisende'] },
    ],
  },
  {
    slug: 'antalya',
    name: 'Antalya',
    land: 'Türkei',
    flugStunden: 3.0,
    abflug: ['Frankfurt', 'München', 'Düsseldorf', 'Berlin', 'Köln', 'Stuttgart'],
    zeitverschiebung: 2,
    flughafen: 'Antalya (AYT)',
    monate: [
      { monat: 1, tagMax: 15, tagMin: 6, wasser: 17, sonne: 5, regen: 11, preisAb: 299, andrang: 'niedrig', highlights: ['Skifahren am Saklıkent nur 50 km von der warmen Küste entfernt', 'Orangen- und Granatapfelernte rund um Finike', 'Altstadt Kaleiçi ohne Touristen erkunden'] },
      { monat: 2, tagMax: 16, tagMin: 6, wasser: 17, sonne: 6, regen: 9, preisAb: 299, andrang: 'niedrig', highlights: ['Doppelsaison: vormittags Ski am Taurus, nachmittags Küstenspaziergang', 'Blüte der Mandelbäume im Hinterland', 'Günstigste Hotelpreise des Jahres'] },
      { monat: 3, tagMax: 18, tagMin: 8, wasser: 17, sonne: 7, regen: 7, preisAb: 319, andrang: 'niedrig', highlights: ['Frühlingsblüte an den antiken Stätten von Perge und Aspendos', 'Wandern auf dem Lykischen Weg bei mildem Wetter', 'Wasserfälle Düden und Kurşunlu führen viel Wasser'] },
      { monat: 4, tagMax: 21, tagMin: 11, wasser: 18, sonne: 9, regen: 5, preisAb: 359, andrang: 'mittel', highlights: ['Internationales Aspendos Opern- und Ballettfestival beginnt', 'Beste Zeit für Sightseeing entlang der Türkischen Riviera', 'Erste Hotels öffnen die Strandanlagen'] },
      { monat: 5, tagMax: 26, tagMin: 15, wasser: 21, sonne: 10, regen: 3, preisAb: 399, andrang: 'mittel', highlights: ['Strandsaison startet, Meer erreicht 21 Grad', 'Rafting am Köprülü-Canyon bei optimalem Wasserstand', 'Warme Tage ohne die Hochsommerhitze'] },
      { monat: 6, tagMax: 31, tagMin: 20, wasser: 24, sonne: 12, regen: 1, preisAb: 499, andrang: 'hoch', highlights: ['Volle Strandsaison an Lara und Konyaaltı', 'Lange heiße Tage, Meer angenehm warm', 'Beginn der Hauptsaison für All-Inclusive-Resorts'] },
      { monat: 7, tagMax: 34, tagMin: 23, wasser: 27, sonne: 13, regen: 0, preisAb: 599, andrang: 'hoch', highlights: ['Hochsommer mit 34 Grad, Sonnengarantie', 'Aspendos-Festival in voller Saison im antiken Theater', 'Resorts auf Anschlag, Poolpartys an der Riviera'] },
      { monat: 8, tagMax: 34, tagMin: 23, wasser: 28, sonne: 12, regen: 0, preisAb: 629, andrang: 'hoch', highlights: ['Wärmstes Meer mit 28 Grad', 'Teuerster Reisemonat für Familien in den Sommerferien', 'Abendliche Bootstouren entlang der Küste'] },
      { monat: 9, tagMax: 31, tagMin: 20, wasser: 27, sonne: 11, regen: 1, preisAb: 499, andrang: 'hoch', highlights: ['Meer noch 27 Grad, perfekte Spätsommer-Badezeit', 'Baumwoll- und Granatapfelernte im Hinterland', 'Sightseeing wieder erträglich, Preise sinken'] },
      { monat: 10, tagMax: 26, tagMin: 15, wasser: 25, sonne: 8, regen: 5, preisAb: 379, andrang: 'mittel', highlights: ['Goldener Oktober mit warmem Meer und mildem Wandern', 'Lykischer Weg wieder begehbar ohne Hitze', 'Antalya International Film Festival (Golden Orange)'] },
      { monat: 11, tagMax: 20, tagMin: 11, wasser: 22, sonne: 6, regen: 7, preisAb: 319, andrang: 'niedrig', highlights: ['Zitrusernte, Märkte voller Orangen und Mandarinen', 'Republikfeiertage-Nachklang, ruhige Strände', 'Meer noch badetauglich für Hartgesottene'] },
      { monat: 12, tagMax: 16, tagMin: 8, wasser: 19, sonne: 5, regen: 11, preisAb: 299, andrang: 'niedrig', highlights: ['Saklıkent-Skigebiet öffnet für die Wintersaison', 'Silvester in den Hotels der Riviera mit Galadinner', 'Kombireisen Kultur und Berge statt Strand'] },
    ],
  },
  {
    slug: 'hurghada',
    name: 'Hurghada',
    land: 'Ägypten',
    flugStunden: 4.5,
    abflug: ['Frankfurt', 'München', 'Düsseldorf', 'Berlin', 'Hannover'],
    zeitverschiebung: 1,
    flughafen: 'Hurghada (HRG)',
    monate: [
      { monat: 1, tagMax: 21, tagMin: 11, wasser: 22, sonne: 8, regen: 0, preisAb: 399, andrang: 'mittel', highlights: ['Mildester Tauchmonat, Sichtweiten am Riff bis 30 Meter', 'Winterflucht-Hochsaison für deutsche Sonnenhungrige', 'Delfinhaus (Sha’ab El Erg) gut erreichbar bei ruhiger See'] },
      { monat: 2, tagMax: 22, tagMin: 12, wasser: 21, sonne: 9, regen: 0, preisAb: 399, andrang: 'mittel', highlights: ['Walhai-Sichtungen am Hausriff beginnen gelegentlich', 'Kitesurf-Saison startet bei kräftigem Nordwind', 'Wüstensafaris angenehm kühl statt Gluthitze'] },
      { monat: 3, tagMax: 25, tagMin: 14, wasser: 21, sonne: 9, regen: 0, preisAb: 429, andrang: 'mittel', highlights: ['Optimale Kitesurf-Bedingungen in El Gouna', 'Quad-Touren in die Ostwüste ohne Hitzestress', 'Schnorcheln an der Giftun-Insel bei klarer Sicht'] },
      { monat: 4, tagMax: 29, tagMin: 18, wasser: 22, sonne: 10, regen: 0, preisAb: 449, andrang: 'mittel', highlights: ['Sham el-Nessim, ägyptisches Frühlingsfest', 'Tagesausflug nach Luxor noch ohne extreme Hitze', 'Beginn der wärmeren Badezeit'] },
      { monat: 5, tagMax: 33, tagMin: 22, wasser: 25, sonne: 12, regen: 0, preisAb: 449, andrang: 'mittel', highlights: ['Wasser erreicht 25 Grad, ideale Schnorchelbedingungen', 'Vor der Sommerhitze gute Kombi aus Baden und Ausflügen', 'Korallengärten von Abu Ramada in Topform'] },
      { monat: 6, tagMax: 35, tagMin: 24, wasser: 27, sonne: 13, regen: 0, preisAb: 499, andrang: 'hoch', highlights: ['Hochsommer mit 35 Grad, Sonnengarantie', 'Luxor-Ausflüge nur frühmorgens empfehlenswert', 'Beste Sicht beim Wracktauchen (SS Thistlegorm)'] },
      { monat: 7, tagMax: 36, tagMin: 26, wasser: 28, sonne: 13, regen: 0, preisAb: 549, andrang: 'hoch', highlights: ['Extreme Hitze, Aktivitäten am Pool und im Meer', 'Sommerferien-Hauptsaison für Familien', 'Warmes 28-Grad-Wasser, lange ohne Frieren tauchen'] },
      { monat: 8, tagMax: 37, tagMin: 26, wasser: 29, sonne: 13, regen: 0, preisAb: 549, andrang: 'hoch', highlights: ['Heißester Monat mit bis zu 37 Grad', 'Wärmstes Meer des Jahres mit 29 Grad', 'Nur frühmorgens oder abends raus, mittags Siesta'] },
      { monat: 9, tagMax: 34, tagMin: 24, wasser: 28, sonne: 11, regen: 0, preisAb: 499, andrang: 'hoch', highlights: ['Spätsommer-Tauchen bei 28 Grad Wasser', 'Hitze lässt nach, Wüstensafaris wieder angenehmer', 'Riffe weiterhin in Bestform'] },
      { monat: 10, tagMax: 31, tagMin: 21, wasser: 27, sonne: 10, regen: 0, preisAb: 459, andrang: 'mittel', highlights: ['El-Gouna-Filmfestival zieht internationales Publikum an', 'Optimale Kombi aus warmem Meer und erträglicher Lufthitze', 'Luxor-Tagesausflüge wieder gut machbar'] },
      { monat: 11, tagMax: 26, tagMin: 16, wasser: 25, sonne: 9, regen: 0, preisAb: 429, andrang: 'mittel', highlights: ['Angenehmster Allround-Monat: 26 Grad Luft, 25 Grad Wasser', 'Beste Zeit für Luxor und Karnak-Tempel', 'Kitesurf-Saison kehrt mit Nordwind zurück'] },
      { monat: 12, tagMax: 22, tagMin: 13, wasser: 23, sonne: 8, regen: 0, preisAb: 399, andrang: 'mittel', highlights: ['Silvester am Roten Meer mit Galadinner in den Resorts', 'Winterflucht-Saison, deutsche Gäste füllen die Hotels', 'Tauchen bei guter Sicht, Neoprenanzug empfohlen'] },
    ],
  },
]
