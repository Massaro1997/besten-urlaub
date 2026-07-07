/**
 * Schema.org JSON-LD builders for SEO + AI Overview citation.
 *
 * Each builder returns a plain object that should be serialized into
 * a <script type="application/ld+json"> tag inside server components.
 *
 * Reference:
 *   - https://schema.org/TravelAgency
 *   - https://schema.org/TouristDestination
 *   - https://schema.org/Product (for hotel offers)
 *   - https://schema.org/Article
 *   - https://schema.org/FAQPage
 *   - https://schema.org/BreadcrumbList
 */

export const SITE_URL = 'https://www.besterurlaub.com'
export const SITE_NAME = 'Bester Urlaub'

/** Build-Datum (SSG): dient als dateModified-Frische-Signal. Ein Deploy pro Monat haelt es aktuell. */
export const BUILD_DATE = new Date().toISOString().slice(0, 10)
export const SITE_LOGO = `${SITE_URL}/noBgColor.png`

/* ------------------------------------------------------------------ */
/*  Organization / TravelAgency (homepage + footer once)              */
/* ------------------------------------------------------------------ */

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Handgepickte Reiseangebote: Pauschalreisen, All-Inclusive, Lastminute, Frühbucher. Affiliate-Vergleich mit Check24.',
    email: 'info@besterurlaub.com',
    telephone: '+49-176-82405507',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Brüsseler Straße 39',
      postalCode: '51149',
      addressLocality: 'Köln',
      addressCountry: 'DE',
    },
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    sameAs: [
      'https://www.tiktok.com/@bestenurlaub',
      'https://www.instagram.com/bestenurlaub',
    ],
  }
}

/* ------------------------------------------------------------------ */
/*  WebSite (with SearchAction — enables Google sitelinks searchbox)  */
/* ------------------------------------------------------------------ */

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'de-DE',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/alle-angebote?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Breadcrumb                                                        */
/* ------------------------------------------------------------------ */

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  Article (Ratgeber)                                                */
/* ------------------------------------------------------------------ */

export function articleJsonLd(args: {
  headline: string
  description: string
  url: string
  image: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}) {
  const datePub = args.datePublished || '2026-04-01'
  const dateMod = args.dateModified || datePub
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    headline: args.headline,
    description: args.description,
    image: args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}`,
    inLanguage: 'de-DE',
    datePublished: datePub,
    dateModified: dateMod,
    author: {
      '@type': args.authorName ? 'Person' : 'Organization',
      name: args.authorName || SITE_NAME,
      url: SITE_URL,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/* ------------------------------------------------------------------ */
/*  FAQPage                                                           */
/* ------------------------------------------------------------------ */

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  Product (hotel/offer detail)                                      */
/*  Using Product (not Hotel) because every offer is a packaged       */
/*  bundle (flight + hotel + board) sold via Check24 affiliate link,  */
/*  not a hotel reservation we control.                               */
/* ------------------------------------------------------------------ */

export function offerProductJsonLd(args: {
  id: string
  title: string
  description: string
  image: string
  brand?: string
  price: number | null
  currency?: string
  url: string
  availability?: 'InStock' | 'LimitedAvailability' | 'PreOrder'
  rating?: number | null
  reviewCount?: number | null
  priceValidUntil?: string // ISO date
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${args.url}#product`,
    name: args.title,
    description: args.description,
    image: args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}`,
    brand: { '@type': 'Brand', name: args.brand || SITE_NAME },
    sku: args.id,
  }
  if (args.price !== null && args.price !== undefined) {
    out.offers = {
      '@type': 'Offer',
      url: args.url,
      priceCurrency: args.currency || 'EUR',
      price: args.price,
      availability: `https://schema.org/${args.availability || 'InStock'}`,
      ...(args.priceValidUntil && { priceValidUntil: args.priceValidUntil }),
    }
  }
  if (args.rating != null && args.reviewCount != null && args.reviewCount > 0) {
    out.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: args.rating,
      reviewCount: args.reviewCount,
      bestRating: 10,
      worstRating: 1,
    }
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  TouristDestination (reiseziel/[slug])                             */
/* ------------------------------------------------------------------ */

export function touristDestinationJsonLd(args: {
  name: string
  country: string
  description: string
  image: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': `${args.url}#destination`,
    name: args.name,
    description: args.description,
    image: args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}`,
    url: args.url,
    containedInPlace: {
      '@type': 'Country',
      name: args.country,
    },
    touristType: ['Pauschalurlauber', 'Familien', 'Paare'],
  }
}

/* ------------------------------------------------------------------ */
/*  ItemList wrapper (for collections of offers on a destination)     */
/* ------------------------------------------------------------------ */

export function itemListJsonLd(args: {
  name: string
  url: string
  items: Array<{ url: string; name: string; price?: number | null }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${args.url}#offers-list`,
    name: args.name,
    numberOfItems: args.items.length,
    itemListElement: args.items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
      name: it.name,
      ...(it.price != null && {
        offers: {
          '@type': 'Offer',
          price: it.price,
          priceCurrency: 'EUR',
        },
      }),
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  Helper: serialize for inline <script>                             */
/*  We escape '</' to prevent a closing tag inside JSON breaking the  */
/*  HTML parser. Single object or array of objects both supported.    */
/* ------------------------------------------------------------------ */

export function jsonLdString(data: unknown | unknown[]): string {
  const json = JSON.stringify(data)
  return json.replace(/</g, '\\u003c')
}
