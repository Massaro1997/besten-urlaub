export const GERMAN_AIRPORTS = [
  { code: 'FRA', name: 'Francoforte', city: 'Frankfurt' },
  { code: 'MUC', name: 'Monaco', city: 'München' },
  { code: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf' },
  { code: 'TXL', name: 'Berlino', city: 'Berlin' },
  { code: 'BER', name: 'Berlino Brandenburg', city: 'Berlin' },
  { code: 'HAM', name: 'Amburgo', city: 'Hamburg' },
  { code: 'STR', name: 'Stoccarda', city: 'Stuttgart' },
  { code: 'CGN', name: 'Colonia/Bonn', city: 'Köln/Bonn' },
  { code: 'HAJ', name: 'Hannover', city: 'Hannover' },
  { code: 'NUE', name: 'Norimberga', city: 'Nürnberg' },
  { code: 'LEJ', name: 'Lipsia', city: 'Leipzig' },
  { code: 'DRS', name: 'Dresda', city: 'Dresden' },
  { code: 'DTM', name: 'Dortmund', city: 'Dortmund' },
  { code: 'FMO', name: 'Münster/Osnabrück', city: 'Münster' },
  { code: 'PAD', name: 'Paderborn', city: 'Paderborn' },
  { code: 'BRE', name: 'Brema', city: 'Bremen' },
  { code: 'FDH', name: 'Friedrichshafen', city: 'Friedrichshafen' },
  { code: 'KSF', name: 'Kassel', city: 'Kassel' },
  { code: 'HHN', name: 'Francoforte-Hahn', city: 'Hahn' },
  { code: 'NRN', name: 'Weeze (Niederrhein)', city: 'Weeze' },
  { code: 'FKB', name: 'Karlsruhe/Baden-Baden', city: 'Karlsruhe' },
  { code: 'SCN', name: 'Saarbrücken', city: 'Saarbrücken' },
] as const

export const DESTINATION_CATEGORIES = [
  { value: 'mare', label: 'Mare', emoji: '🏖️' },
  { value: 'montagna', label: 'Montagna', emoji: '🏔️' },
  { value: 'citta', label: 'Città', emoji: '🏙️' },
  { value: 'avventura', label: 'Avventura', emoji: '🌍' },
  { value: 'crociera', label: 'Crociera', emoji: '🚢' },
  { value: 'wellness', label: 'Wellness', emoji: '🧖' },
] as const

export const MEAL_PLANS = [
  { value: 'solo_pernottamento', label: 'Solo pernottamento' },
  { value: 'colazione', label: 'Colazione inclusa' },
  { value: 'mezza_pensione', label: 'Mezza pensione' },
  { value: 'pensione_completa', label: 'Pensione completa' },
  { value: 'tutto_incluso', label: 'Tutto incluso' },
] as const

export const VIDEO_STATUSES = [
  { value: 'pianificato', label: 'Pianificato', color: 'bg-blue-100 text-blue-700' },
  { value: 'ripresa', label: 'In ripresa', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'montaggio', label: 'Montaggio', color: 'bg-purple-100 text-purple-700' },
  { value: 'pubblicato', label: 'Pubblicato', color: 'bg-green-100 text-green-700' },
] as const

export const DESIGN_TYPES = [
  { value: 'tiktok_story', label: 'TikTok Story (9:16)' },
  { value: 'instagram_post', label: 'Instagram Post (1:1)' },
  { value: 'poster', label: 'Poster (A4)' },
] as const
