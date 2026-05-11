import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.besterurlaub.com'

/**
 * robots.txt for besterurlaub.com.
 *
 * Notes
 * -----
 *  - Public site lives under (public)/, /angebot, /reiseziel, /ratgeber and
 *    the category routes (all-inclusive, lastminute, fruehbucher, mietwagen,
 *    pauschalreisen, alle-angebote). Everything else is the internal CRM
 *    dashboard (route group `(dashboard)`) and is NEVER linked from the
 *    public surface, but we still hard-disallow each known path so it can't
 *    leak via a stray external link.
 *  - GPTBot / ClaudeBot / PerplexityBot / Googlebot AI crawlers are *not*
 *    blocked. Bester Urlaub WANTS to appear in AI Overview citations because
 *    the affiliate model is paid by referrals, not by ad impressions.
 *  - We block `/api/` to avoid indexing JSON endpoints (lead capture,
 *    tracking, postbacks, GA4 proxy).
 *  - `/redirect`, `/_next/`, `/static/` are auto-handled by Next/Vercel.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // Dashboard CRM (route group rendered at root URLs)
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
          // No-track query short-circuit (internal staff)
          '/*?no-track=1',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
