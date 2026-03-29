import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_DE_MAP } from '@/lib/public-constants'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Shield } from 'lucide-react'
import { AngebotTracker } from '@/components/public/angebot-tracker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { destination: true },
  })
  if (!offer) return { title: 'Angebot nicht gefunden' }
  return {
    title: `${offer.title} | Besten Urlaub`,
    description: offer.description || `Urlaubsangebot: ${offer.title} — jetzt buchen auf Check24`,
  }
}

export default async function AngebotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { destination: true },
  })

  if (!offer) notFound()

  const categoryLabel = CATEGORY_DE_MAP[offer.destination.category] || ''

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-[#0a1a3a]/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-[#0a1a3a]/60 hover:text-[#2e75fa] transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>

            <div className="h-5 w-px bg-[#0a1a3a]/10 shrink-0" />

            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/symbol.svg"
                alt="Besten Urlaub"
                width={20}
                height={20}
                className="shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0a1a3a] truncate">
                  {offer.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#0a1a3a]/50">
                  <span>{offer.destination.name}, {offer.destination.country}</span>
                  {categoryLabel && (
                    <>
                      <span>·</span>
                      <span>{categoryLabel}</span>
                    </>
                  )}
                  {offer.priceFrom && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-[#2e75fa]">ab {formatPrice(offer.priceFrom)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#0a1a3a]/40">
              <Shield className="w-3.5 h-3.5" />
              <span>Buchung über Check24</span>
            </div>
            <AngebotTracker
              offerId={offer.id}
              offerTitle={offer.title}
              priceFrom={offer.priceFrom}
              affiliateLink={offer.affiliateLink}
            />
          </div>
        </div>
      </div>

      {/* Embedded Check24 iframe */}
      <div className="flex-1 relative">
        <iframe
          src={offer.affiliateLink}
          className="absolute inset-0 w-full h-full border-0"
          title={`${offer.title} — Check24 Buchung`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
        />
      </div>
    </div>
  )
}
