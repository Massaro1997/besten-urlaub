import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const creative = await prisma.creative.findUnique({
    where: { id },
    include: { destination: { select: { name: true, country: true } } },
  })
  if (!creative) {
    return NextResponse.json({ error: 'Non trovato' }, { status: 404 })
  }
  return NextResponse.json(creative)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await prisma.creative.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
