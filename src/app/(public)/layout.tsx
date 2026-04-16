import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { PublicHeader } from '@/components/public/public-header'
import { PublicFooter } from '@/components/public/public-footer'
import { CookieBanner } from '@/components/public/cookie-banner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bestenurlaub.com'),
  title: 'Bester Urlaub — Die besten Urlaubsangebote',
  description:
    'Finde die besten Reiseangebote und Urlaubsschnaeppchen fuer deinen naechsten Traumurlaub. Direkt fuer dich gefunden.',
  openGraph: {
    title: 'Bester Urlaub — Die besten Urlaubsangebote',
    description:
      'Finde die besten Reiseangebote und Urlaubsschnaeppchen fuer deinen naechsten Traumurlaub.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.bestenurlaub.com',
    siteName: 'Bester Urlaub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bester Urlaub — Traumurlaub zum besten Preis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bester Urlaub — Die besten Urlaubsangebote',
    description: 'Finde die besten Reiseangebote fuer deinen naechsten Traumurlaub.',
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
    </div>
  )
}
