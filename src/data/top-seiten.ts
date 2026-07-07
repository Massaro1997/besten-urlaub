// Top-Seiten nach GSC-Impressionen (28 Tage, Stand 2026-07-07).
// Interne Links von Home und Hubs pushen genau die Seiten, die schon ranken
// (Position 7 bis 17) Richtung Top 5. Liste bei jedem SEO-Check aktualisieren.
export type TopSeite = { href: string; label: string; hint: string }

export const topSeiten: TopSeite[] = [
  { href: '/reise/bodrum/oktober', label: 'Bodrum im Oktober', hint: '26°C, Meer 23°C' },
  { href: '/reise/alanya/oktober', label: 'Alanya im Oktober', hint: '27°C, Meer 25°C' },
  { href: '/reise/antalya/oktober', label: 'Antalya im Oktober', hint: 'Wetter und Preise' },
  { href: '/fragen/anreise-kreta', label: 'Flugzeit nach Kreta', hint: 'ca. 3,2 Stunden' },
  { href: '/fragen/anreise-sardinien', label: 'Flugzeit nach Sardinien', hint: 'ca. 1,9 Stunden' },
  { href: '/fragen/anreise-dubai', label: 'Flugzeit nach Dubai', hint: 'ab Deutschland' },
  { href: '/fragen/klimatabelle-korfu', label: 'Klimatabelle Korfu', hint: 'alle Monate' },
  { href: '/fragen/klimatabelle-bodrum', label: 'Klimatabelle Bodrum', hint: 'alle Monate' },
  { href: '/fragen/guenstigste-reisezeit-kreta', label: 'Kreta günstig buchen', hint: 'Preistabelle' },
  { href: '/ratgeber/bodrum', label: 'Bodrum Ratgeber', hint: 'Buchten und Tipps' },
]
