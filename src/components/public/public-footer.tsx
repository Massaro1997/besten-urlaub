import Image from 'next/image'
import Link from 'next/link'

const destinations = [
  { label: 'Mallorca', slug: 'mallorca' },
  { label: 'Antalya', slug: 'antalya' },
  { label: 'Creta', slug: 'creta' },
  { label: 'Hurghada', slug: 'hurghada' },
  { label: 'Sardegna', slug: 'sardegna' },
  { label: 'Marbella', slug: 'marbella' },
]

const services = [
  { label: 'Last Minute', href: '/lastminute' },
  { label: 'Mietwagen', href: '/mietwagen' },
  { label: 'Reiseziele', href: '/#reiseziele' },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.78a4.83 4.83 0 0 1-1-.09z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PublicFooter() {
  return (
    <footer className="bg-[#0a1a3a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Single compact row: Logo | Links | Social */}
        <div className="py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Logo */}
          <Image src="/noBgWhite.png" alt="Bester Urlaub" width={120} height={32} className="h-7 w-auto" />

          {/* Links — inline */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {destinations.slice(0, 4).map((d) => (
              <Link key={d.slug} href={`/reiseziel/${d.slug}`} className="text-xs text-white/50 hover:text-white transition-colors">{d.label}</Link>
            ))}
            <span className="hidden sm:block w-px h-3 bg-white/10" />
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="text-xs text-white/50 hover:text-white transition-colors">{s.label}</Link>
            ))}
            <span className="hidden sm:block w-px h-3 bg-white/10" />
            <Link href="/impressum" className="text-xs text-white/50 hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-xs text-white/50 hover:text-white transition-colors">Datenschutz</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-2">
            <a href="https://www.tiktok.com/@bestenurlaub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center transition-colors" aria-label="TikTok">
              <TikTokIcon className="w-4 h-4 text-white/60" />
            </a>
            <a href="https://www.instagram.com/bestenurlaub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center transition-colors" aria-label="Instagram">
              <InstagramIcon className="w-4 h-4 text-white/60" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[11px] text-white/25">&copy; {new Date().getFullYear()} Bester Urlaub</p>
          <p className="text-[11px] text-white/20">* Alle Angebote enthalten Affiliate-Links zu Check24</p>
        </div>
      </div>
    </footer>
  )
}
