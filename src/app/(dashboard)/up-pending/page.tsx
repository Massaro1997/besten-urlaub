import { prisma } from '@/lib/prisma'
import { PendingOfferRow } from '@/components/dashboard/pending-offer-row'

export const dynamic = 'force-dynamic'

/**
 * Admin dashboard: offerte UP pubblicate placeholder, in attesa del link
 * Check24 generato manualmente dall'utente.
 *
 * Workflow:
 * 1. Pipeline scrape UP + Claude rewrite → crea Offer affiliateLinkPending=true
 * 2. User vede deal qui, clicca "Open UP source" per vedere hotel
 * 3. User va su Check24 partner tool, cerca stesso hotel, genera deeplink
 * 4. User incolla deeplink in input → save → affiliateLinkPending=false → live
 */
export default async function UpPendingPage() {
  const pending = await prisma.offer.findMany({
    where: { affiliateLinkPending: true },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1a3a]">Pending Affiliate Links</h1>
          <p className="text-sm text-[#0a1a3a]/60 mt-1">
            {pending.length} Angebote — generiere Check24 Deep-Link manuell und füge ihn ein
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white border border-[#0a1a3a]/10 rounded-xl p-8 text-center">
          <p className="text-sm text-[#0a1a3a]/55">Keine pending Angebote. Pipeline triggern via /up-pipeline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((o) => (
            <PendingOfferRow
              key={o.id}
              offer={{
                id: o.id,
                title: o.title,
                description: o.description,
                priceFrom: o.priceFrom,
                hotelName: o.hotelName,
                hotelStars: o.hotelStars,
                board: o.board,
                nights: o.nights,
                upSourceUrl: o.upSourceUrl,
                destination: {
                  name: o.destination.name,
                  country: o.destination.country,
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
