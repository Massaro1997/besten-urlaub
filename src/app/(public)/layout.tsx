import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { PublicHeader } from '@/components/public/public-header'
import { PublicFooter } from '@/components/public/public-footer'
import { CookieBanner } from '@/components/public/cookie-banner'
import { MobileStickyCta } from '@/components/public/mobile-sticky-cta'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.besterurlaub.com'),
  title: 'Pauschalreisen günstig buchen: Deals, Preise und beste Reisezeit',
  description:
    'Pauschalreisen zum Bestpreis: handgepickte Deals, Preistabellen pro Monat und die beste Reisezeit für über 50 Reiseziele. Verglichen mit Check24.',
  openGraph: {
    title: 'Pauschalreisen günstig buchen: Deals, Preise und beste Reisezeit',
    description:
      'Handgepickte Deals, Preistabellen pro Monat und die beste Reisezeit für über 50 Reiseziele.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.besterurlaub.com',
    siteName: 'Bester Urlaub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bester Urlaub: Traumurlaub zum besten Preis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pauschalreisen günstig buchen: Deals, Preise und beste Reisezeit',
    description: 'Handgepickte Deals, Preistabellen pro Monat und die beste Reisezeit für über 50 Reiseziele.',
    images: ['/og-image.jpg'],
  },
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${poppins.variable} font-[family-name:var(--font-poppins)] flex flex-col min-h-screen bg-white`}>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <CookieBanner />
      <MobileStickyCta />
    </div>
  )
}
