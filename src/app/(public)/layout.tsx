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
  title: 'Bester Urlaub -- Die besten Urlaubsangebote',
  description:
    'Finde die besten Reiseangebote und Urlaubsschnaeppchen fuer deinen naechsten Traumurlaub. Direkt fuer dich gefunden.',
  openGraph: {
    title: 'Bester Urlaub -- Die besten Urlaubsangebote',
    description:
      'Finde die besten Reiseangebote und Urlaubsschnaeppchen fuer deinen naechsten Traumurlaub.',
    type: 'website',
    locale: 'de_DE',
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
