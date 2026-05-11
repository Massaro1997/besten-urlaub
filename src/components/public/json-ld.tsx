import { jsonLdString } from '@/lib/seo-jsonld'

/**
 * Inline server-rendered JSON-LD <script>.
 * Place inside any server component (no 'use client' needed).
 *
 * Pass a single schema.org object, or an array of objects (the array is
 * serialized as one JSON document so Googlebot parses both as one block).
 */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  )
}
