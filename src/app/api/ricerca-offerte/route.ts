import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchBestOffers } from '@/lib/offer-search'

export async function POST() {
  try {
    // Get API key from settings or env
    let apiKey = process.env.ANTHROPIC_API_KEY || ''
    try {
      const setting = await prisma.setting.findUnique({ where: { key: 'anthropic_api_key' } })
      if (setting?.value) apiKey = setting.value
    } catch {
      // use env
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key non configurata' }, { status: 400 })
    }

    const offers = await searchBestOffers(apiKey)

    return NextResponse.json({ offers })
  } catch (error) {
    console.error('Offer search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore nella ricerca' },
      { status: 500 },
    )
  }
}
