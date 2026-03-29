import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const creatives = await prisma.creative.findMany({
    include: { destination: { select: { name: true, country: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(creatives)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { destinationId, designType, queryUsed, canvaDesignId, editUrl, exportUrl, thumbnailUrl } = body

  const creative = await prisma.creative.create({
    data: {
      destinationId: destinationId || null,
      designType: designType || 'tiktok_story',
      queryUsed: queryUsed || null,
      canvaDesignId: canvaDesignId || null,
      editUrl: editUrl || null,
      exportUrl: exportUrl || null,
      thumbnailUrl: thumbnailUrl || null,
    },
    include: { destination: { select: { name: true, country: true } } },
  })

  return NextResponse.json(creative, { status: 201 })
}
