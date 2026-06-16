import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchUpRss, filterMatchable, extractSlug } from '@/lib/up-pipeline/rss-parser'
import { scrapeUpDeal } from '@/lib/up-pipeline/scraper'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Cron: ingest urlaubspiraten.de RSS feed → scrape detail → save to UpDeal table.
 * Runs every 1h via vercel.json. Protected via CRON_SECRET.
 *
 * Pipeline stage 1/3. Solo dati factuali, no copy verbatim.
 *
 * Strategia:
 * 1. Fetch RSS (60 item rolling)
 * 2. Filter Pauschal+Hotels last 48h
 * 3. Diff vs DB (skip già visti)
 * 4. Scrape detail per ognuno: partner URL, GIATA, prezzo, hotel
 * 5. Insert UpDeal row
 *
 * Rate limit: 1 req/sec verso urlaubspiraten.de
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const stats = { fetched: 0, filtered: 0, alreadySeen: 0, scraped: 0, errors: 0 }

  let rssItems
  try {
    rssItems = await fetchUpRss()
    stats.fetched = rssItems.length
  } catch (err) {
    return NextResponse.json({ error: 'RSS fetch failed', detail: String(err) }, { status: 500 })
  }

  const matchable = filterMatchable(rssItems)
  stats.filtered = matchable.length

  // Bulk check which URLs already exist
  const urls = matchable.map(i => i.link)
  const existing = await prisma.upDeal.findMany({
    where: { upUrl: { in: urls } },
    select: { upUrl: true },
  })
  const existingSet = new Set(existing.map(e => e.upUrl))
  stats.alreadySeen = existing.length

  // Scrape only new ones — rate limit ~1.5 req/sec to stay polite
  for (const item of matchable) {
    if (existingSet.has(item.link)) continue
    try {
      await sleep(700)
      const detail = await scrapeUpDeal(item.link)
      await prisma.upDeal.create({
        data: {
          upUrl: item.link,
          upSlug: extractSlug(item.link),
          category: item.category,
          rawTitle: item.title || detail.title,
          rawDescription: detail.description || item.description,
          publishedAt: item.pubDate,
          upImageUrl: detail.ogImage,
          partnerUrl: detail.partnerUrl,
          partnerName: detail.partnerName,
          giataId: detail.giataId,
          hotelName: detail.hotelName,
          hotelStars: detail.hotelStars,
          destinationCountry: detail.destinationCountry,
          priceFromUp: detail.priceFrom,
          nights: detail.nights,
          board: detail.board,
        },
      })
      stats.scraped++
    } catch (err) {
      stats.errors++
      console.error('UP scrape error', item.link, err)
    }
  }

  return NextResponse.json({ ok: true, stats })
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
