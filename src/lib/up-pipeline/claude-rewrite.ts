import { createClaudeClient } from '@/lib/claude'

export interface RewriteInput {
  rawTitle: string
  rawDescription: string | null
  hotelName: string | null
  hotelStars: number | null
  nights: number | null
  board: string | null
  destinationCountry: string | null
  priceFrom: number | null
}

export interface RewriteOutput {
  title: string         // emoji + flag + benefit (2-3 emoji at end)
  description: string   // 1 line 80-120 char, ihr-voice, no em/en dashes
}

const SYSTEM_PROMPT = `Du bist Copywriter für besterurlaub.com, eine deutsche Travel-Deal-Plattform.
Du schreibst Travel-Deal-Kürzeltexte im Stil von urlaubspiraten.de.

REGELN:
- Voice: "ihr/euch" (formal Du-Plural), NIE "Sie", NIE "du" (singular)
- 2-3 Emojis MAX, am Ende des Titels oder strategisch in der Description
- Flag-Emoji für Destination (🇮🇹 🇹🇷 🇪🇸 🇬🇷 etc.)
- NIE em-dash (—) oder en-dash (–). Nutze normale Bindestriche (-) oder " | "
- Preis-Format: "Ab X € p.P." mit Spaces
- Stars-Format: "4*" oder "5-Sterne"
- Action-Verben: "entdecken", "erleben", "genießen", "sichern"
- Hooks: "UNTER {price}€❗️", "HOT DEAL ✈️", "Schnäppchen", "Bestpreis"
- Description: 1 Zeile 80-120 Zeichen, beschreibe Inklusivleistungen + Highlight
- KEINE wörtliche Kopie des Originals — schreibe völlig neu

Output ALWAYS valid JSON: { "title": "...", "description": "..." }`

export async function rewriteUpDeal(input: RewriteInput): Promise<RewriteOutput> {
  const client = createClaudeClient()

  const userPrompt = `Schreibe diesen Travel-Deal um:

Original Titel: ${input.rawTitle}
Original Beschreibung: ${input.rawDescription || '(keine)'}
Hotel: ${input.hotelName || 'unbekannt'}
Sterne: ${input.hotelStars ? `${input.hotelStars}*` : 'unbekannt'}
Nächte: ${input.nights || 'unbekannt'}
Verpflegung: ${input.board || 'unbekannt'}
Destination: ${input.destinationCountry || 'unbekannt'}
Preis ab: ${input.priceFrom ? `${input.priceFrom}€` : 'unbekannt'}

Beispiele für besten besterurlaub-Stil:
- "Santorini Caldera-Traum 🇬🇷✨"
- "Mallorca UNTER 500€❗️😎 1 Woche Adults Only"
- "HOT DEAL ✈️ Sizilien-Flüge nur 63€ Hin & Zurück 🇮🇹"
- "Belek Luxus All Inclusive: 5* Granada 🇹🇷✨"

Output JSON: { "title": "...", "description": "..." }`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim()

  // Extract JSON (might be wrapped in ```json ... ```)
  const jsonMatch = text.match(/\{[\s\S]*?\}/)
  if (!jsonMatch) throw new Error('Claude did not return JSON: ' + text.slice(0, 200))

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.title || !parsed.description) {
    throw new Error('Missing title/description in Claude output: ' + text.slice(0, 200))
  }

  return { title: parsed.title, description: parsed.description }
}
