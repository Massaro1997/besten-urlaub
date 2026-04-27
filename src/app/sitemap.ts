import type { MetadataRoute } from 'next'
import { offers } from '@/data/offers'
import { destinations } from '@/data/destinations'
import { ratgeberArticles } from '@/lib/ratgeber-data'

const BASE_URL = 'https://www.besterurlaub.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/alle-angebote`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/pauschalreisen`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/all-inclusive`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/lastminute`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/fruehbucher`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/mietwagen`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/ratgeber`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/impressum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const offerPages: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${BASE_URL}/angebot/${o.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const destinationPages: MetadataRoute.Sitemap = destinations
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${BASE_URL}/reiseziel/${d.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  const ratgeberPages: MetadataRoute.Sitemap = ratgeberArticles.map((r) => ({
    url: `${BASE_URL}/ratgeber/${r.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticPages, ...offerPages, ...destinationPages, ...ratgeberPages]
}
