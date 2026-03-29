import { createClaudeClient, RESEARCH_SYSTEM_PROMPT, buildResearchPrompt, CLAUDE_MODEL } from '@/lib/claude'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, country, destinationId } = body

    if (!name || !country) {
      return NextResponse.json({ error: 'Nome e paese richiesti' }, { status: 400 })
    }

    // Get API key from settings or env
    let apiKey = process.env.ANTHROPIC_API_KEY
    try {
      const setting = await prisma.setting.findUnique({ where: { key: 'anthropic_api_key' } })
      if (setting?.value) apiKey = setting.value
    } catch {
      // use env key
    }

    const client = createClaudeClient(apiKey)

    // Stream the response
    const stream = await client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: RESEARCH_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildResearchPrompt(name, country) },
      ],
    })

    // Collect full response for saving
    let fullText = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text
              fullText += text
              controller.enqueue(new TextEncoder().encode(text))
            }
          }

          // Save research to destination if ID provided
          if (destinationId && fullText) {
            try {
              // Try to parse JSON from response
              const jsonMatch = fullText.match(/\{[\s\S]*?\n\}/)
              let updateData: Record<string, unknown> = {
                aiResearchNotes: fullText,
                aiResearchDate: new Date(),
              }

              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                updateData = {
                  ...updateData,
                  popularity: parsed.popularity || null,
                  bestSeason: parsed.bestSeason || null,
                  targetAudience: parsed.targetAudience || null,
                }
              }

              await prisma.destination.update({
                where: { id: destinationId },
                data: updateData,
              })
            } catch {
              // Save raw text even if JSON parsing fails
              await prisma.destination.update({
                where: { id: destinationId },
                data: {
                  aiResearchNotes: fullText,
                  aiResearchDate: new Date(),
                },
              })
            }
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore sconosciuto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
