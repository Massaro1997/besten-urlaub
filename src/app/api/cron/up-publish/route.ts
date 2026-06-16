import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rewriteUpDeal } from '@/lib/up-pipeline/claude-rewrite'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Stage 3/3: Publish top matched UpDeals as live Offer rows on besterurlaub.
 *
 * Pipeline:
 *  - Pick UpDeal matched=true AND published=false, ordered by publishedAt DESC
 *  - Run Claude rewrite (title + description in besterurlaub voice)
 *  - Create Offer row pointing to existing Destination (best-effort match)
 *  - Mark UpDeal published=true, link publishedOfferId
 *
 * Budget: max 5 deal/run (Claude API costs).
 * Frequency: 4x/day via vercel.json (06/10/14/18) → ~20 deal pubblicabili/day.
 *
 * NOTE: usa upImageUrl as gallery[0] per ora (CDN Cloudinary UP, technically
 * borderline — TODO: download + reupload own CDN per legalmente safe).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const stats = { processed: 0, published: 0, errors: 0, skipped: 0 }

  // Take ALL matched-but-unpublished, processed entry-by-entry until timeout (120s max).
  // User request: 1 run/day, but publish ALL Check24-matchable deals.
  const queue = await prisma.upDeal.findMany({
    where: {
      matched: true,
      published: false,
      check24Url: { not: null },
    },
    orderBy: { publishedAt: 'desc' },
    take: 100, // hard cap per evitare runaway (Claude API costs)
  })

  for (const deal of queue) {
    stats.processed++
    try {
      // Match destination on bester urlaub side (by country/city heuristic)
      const destination = await findBestDestination(deal.destinationCountry, deal.hotelName, deal.upSlug)
      if (!destination) {
        await prisma.upDeal.update({
          where: { id: deal.id },
          data: { skipReason: 'no_destination_match' },
        })
        stats.skipped++
        continue
      }

      // Rewrite copy via Claude
      const rewrite = await rewriteUpDeal({
        rawTitle: deal.rawTitle,
        rawDescription: deal.rawDescription,
        hotelName: deal.hotelName,
        hotelStars: deal.hotelStars,
        nights: deal.nights,
        board: deal.board,
        destinationCountry: deal.destinationCountry,
        priceFrom: deal.priceFromUp,
      })

      // Create Offer row — placeholder affiliateLink, user genera manuale via admin
      const offer = await prisma.offer.create({
        data: {
          destinationId: destination.id,
          title: rewrite.title,
          description: rewrite.description,
          priceFrom: deal.priceFromUp || 0,
          // Placeholder: temporaneo, user incollerà link Check24 vero via admin
          affiliateLink: '#pending',
          affiliateLinkPending: true,
          upSourceUrl: deal.upUrl,
          hotelName: deal.hotelName,
          hotelStars: deal.hotelStars,
          board: deal.board,
          nights: deal.nights,
          adultsCount: 2,
          featured: false,
          usedInVideo: false,
          notes: `Auto-imported from urlaubspiraten: ${deal.upUrl}`,
        },
      })

      await prisma.upDeal.update({
        where: { id: deal.id },
        data: {
          published: true,
          publishedOfferId: offer.id,
          rewrittenTitle: rewrite.title,
          rewrittenDesc: rewrite.description,
          publishedAtBu: new Date(),
        },
      })

      stats.published++
    } catch (err) {
      stats.errors++
      console.error('UP publish error', deal.id, err)
      await prisma.upDeal.update({
        where: { id: deal.id },
        data: { skipReason: `publish_error: ${String(err).slice(0, 100)}` },
      }).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true, stats })
}

/**
 * Mapping country tedesco (UP) → italiano (destinations.ts statico).
 * destinations.ts usa nomi italiani — UP fornisce tedeschi.
 */
const DE_TO_IT: Record<string, string[]> = {
  'Ägypten': ['Egitto'],
  'Türkei': ['Turchia'],
  'Spanien': ['Spagna'],
  'Italien': ['Italia'],
  'Griechenland': ['Grecia'],
  'Frankreich': ['Francia'],
  'Portugal': ['Portogallo'],
  'Niederlande': ['Olanda', 'Paesi Bassi'],
  'Österreich': ['Austria'],
  'Schweiz': ['Svizzera'],
  'Kroatien': ['Croazia'],
  'Bulgarien': ['Bulgaria'],
  'Polen': ['Polonia'],
  'Thailand': ['Tailandia', 'Thailandia'],
  'Mauritius': ['Mauritius'],
  'Mexiko': ['Messico'],
  'Dänemark': ['Danimarca'],
  'Südafrika': ['Sud Africa'],
  'Aruba': ['Karibik', 'Aruba'],
  'Zypern': ['Cipro'],
  'Tansania': ['Tanzania'],
  'Dominikanische Republik': ['Repubblica Dominicana'],
  'Deutschland': ['Germania'],
}

/**
 * Best-effort destination match: country → first destination with matching country.
 * Fallback: search by hotel name token in destination name.
 */
async function findBestDestination(
  country: string | null,
  hotelName: string | null,
  slug: string,
): Promise<{ id: string } | null> {
  if (country) {
    // Try direct match first
    const candidates = [country, ...(DE_TO_IT[country] || [])]
    for (const c of candidates) {
      const dest = await prisma.destination.findFirst({
        where: { country: { contains: c, mode: 'insensitive' } },
        select: { id: true },
      })
      if (dest) return dest
    }
  }

  if (hotelName) {
    const tokens = hotelName.split(/\s+/).filter(t => t.length > 3)
    for (const token of tokens) {
      const dest = await prisma.destination.findFirst({
        where: { name: { contains: token, mode: 'insensitive' } },
        select: { id: true },
      })
      if (dest) return dest
    }
  }

  // Slug keyword DE → country (matches destinations.ts italian countries)
  const slugCountryMap: Record<string, string> = {
    'aegypten': 'Egitto',
    'tuerkei': 'Turchia',
    'spanien': 'Spagna',
    'italien': 'Italia',
    'griechenland': 'Grecia',
    'frankreich': 'Francia',
    'kroatien': 'Croazia',
    'mallorca': 'Spagna',
    'kreta': 'Grecia',
    'rhodos': 'Grecia',
    'mauritius': 'Mauritius',
    'thailand': 'Tailandia',
    'phuket': 'Tailandia',
    'mexiko': 'Messico',
  }
  for (const [keyword, countryIt] of Object.entries(slugCountryMap)) {
    if (slug.toLowerCase().includes(keyword)) {
      const dest = await prisma.destination.findFirst({
        where: { country: { contains: countryIt, mode: 'insensitive' } },
        select: { id: true },
      })
      if (dest) return dest
    }
  }

  // Fallback: slug keyword match
  const slugTokens = slug.split('-').filter(t => t.length > 4)
  for (const token of slugTokens) {
    const dest = await prisma.destination.findFirst({
      where: {
        OR: [
          { slug: { contains: token, mode: 'insensitive' } },
          { name: { contains: token, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    })
    if (dest) return dest
  }

  return null
}
