import Anthropic from '@anthropic-ai/sdk'

export function createClaudeClient(apiKey?: string) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY non configurata')
  return new Anthropic({ apiKey: key })
}

export const RESEARCH_SYSTEM_PROMPT = `Sei un esperto del mercato turistico tedesco. Il tuo compito è analizzare destinazioni di viaggio dal punto di vista dei turisti tedeschi (Pauschalreise / pacchetti vacanza).

Rispondi SEMPRE in italiano. Fornisci un'analisi strutturata in formato JSON con questi campi:

{
  "popularity": <numero 1-10, popolarità per turisti tedeschi>,
  "bestSeason": "<mesi migliori, es: giugno-settembre>",
  "targetAudience": "<target principale, es: coppie, famiglie, giovani>",
  "averageBudget": "<budget medio a persona per settimana in EUR>",
  "topAttractions": ["<lista 5 attrazioni/motivi principali>"],
  "tiktokVideoIdeas": ["<8 idee specifiche per video TikTok in tedesco>"],
  "hashtags": ["<10 hashtag rilevanti in tedesco e inglese>"],
  "bookingTrends": "<quando prenotano i tedeschi per questa destinazione>",
  "competitionLevel": "<basso/medio/alto - quanto è saturata su TikTok tedesco>",
  "proTips": ["<3 consigli per vendere meglio questa destinazione>"],
  "bestAirports": ["<top 3 aeroporti di partenza tedeschi per questa meta>"]
}

Dopo il JSON, aggiungi un paragrafo di analisi libera con insight utili per la strategia di marketing TikTok.`

export function buildResearchPrompt(name: string, country: string) {
  return `Analizza la destinazione turistica "${name}" (${country}) per il mercato tedesco.

Considera:
- Quanto è popolare tra i turisti tedeschi (Pauschalreise)
- Quali aeroporti tedeschi hanno più voli diretti
- Quale stagione è la migliore per promuoverla su TikTok
- Che tipo di contenuto TikTok funziona meglio
- A quale target si rivolge (famiglie, coppie, giovani, anziani)
- Livello di competizione su TikTok tedesco
- Consigli per massimizzare le conversioni Check24

Rispondi con il JSON strutturato seguito dall'analisi.`
}

export const CLAUDE_MODEL = 'claude-opus-4-6'
