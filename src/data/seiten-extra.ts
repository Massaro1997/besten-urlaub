// Handgeschriebener Zusatzcontent fuer die Top-Seiten (GSC-Impressionen).
// Zweck: die Seiten, die schon auf Position 7 bis 17 ranken, mit einzigartigem
// destinationsspezifischem Inhalt von Position 8 auf Top 5 bringen.
// Key: fuer /reise = "ziel/monat", fuer /fragen = frage-slug.
// Regeln: Voce umana, konkrete Orte und Fakten, KEINE Gedankenstriche.

export type SeitenExtra = { titel: string; absaetze: string[] }

export const seitenExtra: Record<string, SeitenExtra> = {
  'bodrum/oktober': {
    titel: 'Was den Oktober in Bodrum besonders macht',
    absaetze: [
      'Der Oktober ist der Monat, in dem Bodrum wieder den Einheimischen gehört. Die Buchten von Bitez und Gümbet sind halb leer, das Wasser hat noch angenehme 23 Grad und die Strandclubs bleiben bis Ende des Monats geöffnet. Wer das Kastell von Bodrum mit dem Unterwasserarchäologie-Museum besichtigen will, tut das jetzt ohne Schlange und ohne Mittagshitze.',
      'Auch die Bootstouren fahren im Oktober noch täglich ab dem Hafen: Tagesausflüge zur Insel Orak oder in die Aquarium-Bucht kosten jetzt spürbar weniger als im August. Abends lohnt der Sprung nach Gümüşlük, wo die Fischrestaurants direkt am Wasser stehen. Eine dünne Jacke reicht für die Abende, tagsüber bleibt es T-Shirt-Wetter.',
    ],
  },
  'alanya/oktober': {
    titel: 'Was den Oktober in Alanya besonders macht',
    absaetze: [
      'Alanya hat im Oktober das wärmste Meer der türkischen Riviera: 25 Grad Wassertemperatur, mehr als Bodrum oder Antalya. Der Kleopatra-Strand ist jetzt so leer wie sonst nie in der Saison, und die Seilbahn auf den Burgberg fährt ohne Wartezeit. Oben wartet der Blick über die ganze Küste, unten die rote Festung und der alte Hafen.',
      'Die All-inclusive-Preise fallen ab Mitte Oktober deutlich, viele Hotels geben Zimmer mit Meerblick zum Preis der Nebensaison ab. Wer es aktiver mag: Der Dim-Fluss oberhalb der Stadt ist im Oktober noch angenehm zum Baden, die Flussrestaurants auf den Holzplattformen haben geöffnet. Regen fällt statistisch an drei Tagen im Monat, meist kurz und abends.',
    ],
  },
  'antalya/oktober': {
    titel: 'Was den Oktober in Antalya besonders macht',
    absaetze: [
      'Antalya ist im Oktober die Kombination aus Badeurlaub und Städtereise: Am Konyaaltı-Strand und in Lara liegt man noch bei 26 Grad Lufttemperatur am Meer, und die Altstadt Kaleiçi mit dem Hadrianstor lässt sich endlich ohne Hochsommerhitze erkunden. Die Düden-Wasserfälle führen nach dem Sommer wieder mehr Wasser.',
      'Für Golfer beginnt in Belek, eine halbe Stunde östlich, im Oktober die Hauptsaison. Familien profitieren doppelt: Die Schulferien sind vorbei, die Hotelanlagen leeren sich und die Kinderclubs laufen trotzdem weiter. Direktflüge ab fast allen deutschen Flughäfen machen Antalya im Oktober zum unkompliziertesten Warmwasserziel Europas.',
    ],
  },
  'sardinien/oktober': {
    titel: 'Was den Oktober auf Sardinien besonders macht',
    absaetze: [
      'Im Oktober teilt sich Sardinien in zwei Hälften: Der Süden um Chia und Villasimius bleibt spürbar wärmer als die Costa Smeralda im Norden, das Meer hält dort noch rund 22 Grad. Die berühmten Strände wie Su Giudeu, im August überlaufen, gehören jetzt Spaziergängern und ein paar Hartgesottenen im Wasser.',
      'Die meisten Restaurants und Strandbars bleiben bis Ende Oktober geöffnet, danach macht die Insel Winterpause. Flüge nach Cagliari oder Olbia kosten im Oktober oft nur die Hälfte des Sommerpreises. Wer Wandern und Meer verbinden will, hat jetzt die beste Zeit: Die Küstenpfade am Capo Spartivento laufen sich bei 24 Grad deutlich besser als bei 35.',
    ],
  },
  'anreise-kreta': {
    titel: 'Welcher Flughafen auf Kreta: Heraklion oder Chania?',
    absaetze: [
      'Kreta hat zwei internationale Flughäfen, und die Wahl entscheidet über die Transferzeit. Heraklion (HER) liegt zentral und bedient die Hotelburgen an der Nordküste: Nach Chersonissos oder Malia fährt der Transfer 30 bis 45 Minuten, nach Rethymno etwa eine Stunde. Chania (CHQ) im Westen ist die bessere Wahl für Platanias, Agia Marina und die Strände Richtung Elafonissi.',
      'Direktflüge starten von fast allen deutschen Flughäfen: Frankfurt, München, Düsseldorf, Hamburg, Berlin, Stuttgart und Köln fliegen Heraklion in der Saison täglich an, Chania wird seltener und vor allem von Ferienfliegern bedient. Viele Kreta-Flüge gehen früh morgens oder spät abends, was einen zusätzlichen halben Urlaubstag bringen kann.',
    ],
  },
  'anreise-sardinien': {
    titel: 'Welcher Flughafen auf Sardinien passt zu welcher Küste?',
    absaetze: [
      'Sardinien hat drei Flughäfen, und der falsche kostet zwei Stunden Mietwagenfahrt. Olbia (OLB) im Nordosten ist der Flughafen für die Costa Smeralda, San Teodoro und Budoni. Cagliari (CAG) im Süden bedient Chia, Villasimius und die Südküste. Alghero (AHO) im Nordwesten passt für die Riviera del Corallo und Stintino.',
      'Ab Deutschland fliegen vor allem Eurowings, Ryanair und easyJet, im Sommer fast täglich, im Winter deutlich ausgedünnt. Eine Alternative für Familien mit viel Gepäck oder eigenem Auto ist die Fähre ab Genua oder Livorno nach Olbia: über Nacht mit Kabine, morgens auf der Insel.',
    ],
  },
  'anreise-dubai': {
    titel: 'Nonstop nach Dubai: Airlines, Abflughäfen, beste Ankunftszeit',
    absaetze: [
      'Nonstop nach Dubai (DXB) fliegen ab Deutschland vor allem Emirates ab Frankfurt, München, Düsseldorf und Hamburg sowie Lufthansa ab Frankfurt und München. Die reine Flugzeit liegt bei rund sechs Stunden auf dem Hinweg, zurück meist etwas länger gegen den Wind. Die Zeitverschiebung beträgt im Winter plus drei Stunden, im Sommer plus zwei.',
      'Die meisten Emirates-Flüge landen entweder früh morgens oder spät abends. Für den ersten Urlaubstag ist die Abendankunft entspannter: einchecken, schlafen, am nächsten Morgen ohne Jetlag an den Pool. Wer früh morgens landet, bekommt das Hotelzimmer oft erst mittags und sollte den Early Check-in vorab dazubuchen.',
    ],
  },
  'klimatabelle-korfu': {
    titel: 'Warum Korfu grüner ist als jede andere griechische Insel',
    absaetze: [
      'Korfu liegt im Ionischen Meer und fängt im Winter deutlich mehr Regen als die Ägäis-Inseln. Genau das macht die Insel so grün: Olivenhaine, Zypressen und im Frühjahr blühende Wiesen, die man auf Santorin oder Mykonos vergeblich sucht. Für die Klimatabelle heißt das: nasse, milde Winter und trockene, aber selten extreme Sommer.',
      'Die Badesaison läuft von Juni bis Mitte Oktober, das Meer erreicht im August seinen Höchstwert. Der Mai ist der Geheimtipp für Wanderer: alles blüht, 24 Grad, und die Strände von Paleokastritsa sind noch leer. Im Hochsommer bleibt Korfu dank der Westlage meist zwei bis drei Grad kühler als Rhodos oder Kos.',
    ],
  },
  'klimatabelle-bodrum': {
    titel: 'Ägäis statt Riviera: was das Bodrum-Klima anders macht',
    absaetze: [
      'Bodrum liegt an der türkischen Ägäis, und das Klima unterscheidet sich spürbar von Antalya an der Riviera: trockener, windiger und nachts angenehmer. Im Hochsommer kühlt der Meltemi, der ägäische Sommerwind, die Halbinsel regelmäßig ab. Deshalb fühlen sich 34 Grad in Bodrum weniger drückend an als 34 Grad in Side.',
      'Die Wassertemperatur hinkt der Riviera immer zwei bis drei Grad hinterher, erreicht aber im August und September ihre 26 Grad. Der Winter ist mild und regnerisch, viele Hotels schließen von November bis April. Beste Kombination aus Badewetter und leeren Stränden: Juni und die zweite Septemberhälfte bis Mitte Oktober.',
    ],
  },
  'klimatabelle-apulien': {
    titel: 'Zwei Küsten, zwei Klimazonen: so tickt das Wetter in Apulien',
    absaetze: [
      'Apulien hat zwei Meere, und das merkt man am Wetter: Die Adriaküste um Bari und Polignano a Mare bekommt im Sommer die kühlende Brise aus Nordost, die Ionische Küste um Gallipoli ist windgeschützter und heißer. Im Landesinneren, etwa im Itria-Tal bei Alberobello, klettern die Temperaturen im August regelmäßig über die Werte der Küste.',
      'Das Meer bleibt lang warm: Noch im Oktober hat das Ionische Meer um die 22 Grad, ideal für Nachsaison-Urlaub in Salento. Regen konzentriert sich auf die Monate November bis Februar. Wer Städte wie Lecce oder Ostuni besichtigen will, nimmt Mai, Juni oder den Oktober, nicht den glühenden August.',
    ],
  },
}

export function getSeitenExtra(key: string): SeitenExtra | null {
  return seitenExtra[key] ?? null
}
