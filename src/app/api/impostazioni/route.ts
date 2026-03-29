import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await prisma.setting.findMany()
  const settingsMap: Record<string, string> = {}
  for (const s of settings) {
    settingsMap[s.key] = s.value
  }

  const [destinations, offers, videos, creatives] = await Promise.all([
    prisma.destination.count(),
    prisma.offer.count(),
    prisma.video.count(),
    prisma.creative.count(),
  ])

  return NextResponse.json({
    apiKey: settingsMap.anthropic_api_key || '',
    defaultAirport: settingsMap.default_airport || '',
    stats: { destinations, offers, videos, creatives },
  })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { apiKey, defaultAirport } = body

  if (apiKey !== undefined) {
    await prisma.setting.upsert({
      where: { key: 'anthropic_api_key' },
      update: { value: apiKey },
      create: { key: 'anthropic_api_key', value: apiKey },
    })
  }

  if (defaultAirport !== undefined) {
    await prisma.setting.upsert({
      where: { key: 'default_airport' },
      update: { value: defaultAirport },
      create: { key: 'default_airport', value: defaultAirport },
    })
  }

  return NextResponse.json({ success: true })
}
