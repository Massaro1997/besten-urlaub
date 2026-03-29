export const PUBLIC_CATEGORIES = [
  { value: 'alle', filter: null, label: 'Alle' },
  { value: 'strand', filter: 'mare', label: 'Strand', emoji: '🏖️' },
  { value: 'berge', filter: 'montagna', label: 'Berge', emoji: '🏔️' },
  { value: 'stadt', filter: 'citta', label: 'Stadt', emoji: '🏙️' },
  { value: 'abenteuer', filter: 'avventura', label: 'Abenteuer', emoji: '🌍' },
  { value: 'kreuzfahrt', filter: 'crociera', label: 'Kreuzfahrt', emoji: '🚢' },
  { value: 'wellness', filter: 'wellness', label: 'Wellness', emoji: '🧖' },
] as const

export const CATEGORY_DE_MAP: Record<string, string> = {
  mare: 'Strand',
  montagna: 'Berge',
  citta: 'Stadt',
  avventura: 'Abenteuer',
  crociera: 'Kreuzfahrt',
  wellness: 'Wellness',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  mare: 'from-blue-400 to-cyan-300',
  montagna: 'from-emerald-500 to-green-300',
  citta: 'from-violet-500 to-purple-300',
  avventura: 'from-amber-500 to-orange-300',
  crociera: 'from-sky-500 to-blue-300',
  wellness: 'from-pink-400 to-rose-300',
}
