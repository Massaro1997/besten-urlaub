import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, spend, impressions, clicks, campaign, notes } = body
    if (!date || typeof spend !== 'number' || isNaN(spend)) {
      return NextResponse.json({ error: 'Missing date or spend' }, { status: 400 })
    }
    const dateUtc = new Date(date + 'T00:00:00.000Z')
    const row = await prisma.adSpend.upsert({
      where: { date: dateUtc },
      create: {
        date: dateUtc,
        spend,
        impressions: impressions ?? 0,
        clicks: clicks ?? 0,
        campaign: campaign || null,
        notes: notes || null,
      },
      update: {
        spend,
        impressions: impressions ?? 0,
        clicks: clicks ?? 0,
        campaign: campaign || null,
        notes: notes || null,
      },
    })
    return NextResponse.json({ ok: true, row })
  } catch (e) {
    console.error('adspend POST error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await prisma.adSpend.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('adspend DELETE error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
