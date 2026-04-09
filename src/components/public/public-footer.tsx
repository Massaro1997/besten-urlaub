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
  { label: 'Pauschalreisen', href: '/pauschalreisen' },
  { label: 'Last Minute', href: '/lastminute' },
  { label: 'All Inclusive', href: '/all-inclusive' },
  { label: 'Mietwagen', href: '/mietwagen' },
  { label: 'Reiseziele', href: '/#reiseziele' },
  { label: 'Ratgeber', href: '/#ratgeber' },
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
        {/* Main footer content */}
        <div className="pt-10 pb-8">
          {/* Top row: Logo + Social */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="shrink-0">
              <Image
                src="/noBgWhite.png"
                alt="Bester Urlaub"
                width={130}
                height={36}
                className="h-8 w-auto"
                style={{ maxWidth: '130px' }}
              />
            </Link>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.tiktok.com/@bestenurlaub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4 text-white/70" />
              </a>
              <a
                href="https://www.instagram.com/bestenurlaub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-white/70" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Reiseziele */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-3">
                Reiseziele
              </h4>
              <ul className="space-y-2">
                {destinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/reiseziel/${d.slug}`}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Angebote */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-3">
                Angebote
              </h4>
              <ul className="space-y-2">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rechtliches */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-3">
                Rechtliches
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/impressum" className="text-sm text-white/55 hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-sm text-white/55 hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Bester Urlaub</p>
          <p className="text-[11px] text-white/20">* Alle Angebote enthalten Affiliate-Links zu Check24</p>
        </div>
      </div>
    </footer>
  )
}
