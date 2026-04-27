import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.besterurlaub.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/analytics',
          '/contenuti',
          '/creativi',
          '/destinazioni',
          '/impostazioni',
          '/leads',
          '/offerte',
          '/sales',
          '/tiktok-intel',
          '/tiktok-organic',
          '/tracking',
          '/admin',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
