import type { MetadataRoute } from 'next'
import { offers } from '@/data/offers'
import { destinations } from '@/data/destinations'
import { ratgeberArticles } from '@/lib/ratgeber-data'
import { getAllReisemonatParams } from '@/lib/reisemonat'

const BASE_URL = 'https://www.besterurlaub.com'

/**
 * Sitemap for Bester Urlaub.
 *
 * Strategy
 * --------
 *  - Homepage = priority 1.0, daily.
 *  - Category landing pages (Pauschalreisen, All-Inclusive, Lastminute,
 *    Frühbucher) = 0.9 / daily — they refresh whenever Check24 widget
 *    inventory updates.
 *  - Mietwagen / alle-angebote / ratgeber index = 0.8 / weekly.
 *  - Individual /angebot/[id] = 0.8 / daily — these are the highest-value
 *    pages from a conversion standpoint and must be discovered fast when
 *    new inventory is exported.
 *  - /reiseziel/[slug] = 0.7 / weekly — destination hubs, content stable.
 *  - /ratgeber/[slug] = 0.6 / monthly — evergreen content.
 *  - Legal pages = 0.3 / yearly.
 *
 * `lastmod` uses today's date for static URLs (acceptable for a hand-curated
 * affiliate site) and the offer/destination data export timestamp for
 * dynamic ones — that keeps Googlebot honest about when content changed.
 *
 * IMPORTANT: keep < 50.000 URLs total. We are at ~80, so single sitemap is
 * fine. If the offer count ever crosses ~10.000, split into sitemap-static.xml,
 * sitemap-offers.xml, sitemap-destinations.xml, sitemap-ratgeber.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    // Top-of-funnel category landings
    { url: `${BASE_URL}/pauschalreisen`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/all-inclusive`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/lastminute`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/fruehbucher`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    // Secondary categories + index hubs
    { url: `${BASE_URL}/alle-angebote`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/mietwagen`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/ratgeber`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // Reisezeit hub (Klima × Monat)
    { url: `${BASE_URL}/reise`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // Legal
    { url: `${BASE_URL}/impressum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Offers: highest priority among detail pages — these convert.
  const offerPages: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${BASE_URL}/angebot/${o.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: o.featured ? 0.9 : 0.8,
  }))

  // Destination hubs — only those that have at least one offer get the higher
  // priority; empty hubs get the baseline so we don't waste crawl budget.
  const offerCountBySlug = new Map<string, number>()
  for (const o of offers) {
    if (o.destination.slug) {
      offerCountBySlug.set(o.destination.slug, (offerCountBySlug.get(o.destination.slug) || 0) + 1)
    }
  }
  const destinationPages: MetadataRoute.Sitemap = destinations
    .filter((d) => d.slug)
    .map((d) => {
      const hasOffers = (offerCountBySlug.get(d.slug!) || 0) > 0
      return {
        url: `${BASE_URL}/reiseziel/${d.slug}`,
        lastModified: now,
        changeFrequency: hasOffers ? 'weekly' : 'monthly',
        priority: hasOffers ? 0.7 : 0.4,
      }
    })

  const ratgeberPages: MetadataRoute.Sitemap = ratgeberArticles.map((r) => ({
    url: `${BASE_URL}/ratgeber/${r.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Reisezeit-Seiten /reise/[ziel]/[monat] — programmatisch, je Monat eigene
  // Klima-/Preis-/Highlight-Daten. Nur PASS-Seiten (forge.py-validiert).
  const reisemonatPages: MetadataRoute.Sitemap = getAllReisemonatParams().map((p) => ({
    url: `${BASE_URL}/reise/${p.ziel}/${p.monat}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...offerPages, ...destinationPages, ...ratgeberPages, ...reisemonatPages]
}
