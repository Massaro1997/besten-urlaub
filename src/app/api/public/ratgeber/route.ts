import { NextResponse } from 'next/server'
import { ratgeberArticles } from '@/lib/ratgeber-data'

export async function GET() {
  const data = ratgeberArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    destination: a.destination,
    country: a.country,
    heroImage: a.heroImage,
    metaDescription: a.metaDescription,
    intro: a.intro,
    sections: a.sections,
    tips: a.tips,
    offerTitle: a.offerTitle,
    offerPrice: a.offerPrice,
    offerLink: a.offerLink,
  }))

  return NextResponse.json(data, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}
