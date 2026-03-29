import Image from 'next/image'
import Link from 'next/link'

const destinations = [
  { label: 'Mallorca', slug: 'mallorca' },
  { label: 'Antalya', slug: 'antalya' },
  { label: 'Kreta', slug: 'kreta' },
  { label: 'Hurghada', slug: 'hurghada' },
  { label: 'Fuerteventura', slug: 'fuerteventura' },
  { label: 'Rhodos', slug: 'rhodos' },
]

const legalLinks = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
]

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.78a4.83 4.83 0 0 1-1-.09z" />
    </svg>
  )
}

export function PublicFooter() {
  return (
    <footer className="bg-[#0a1a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Top: Logo + tagline */}
        <div className="mb-10">
          <Image
            src="/noBgWhite.png"
            alt="Besten Urlaub"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <p className="mt-3 text-sm text-white/60 max-w-sm leading-relaxed">
            Die besten Urlaubsangebote &mdash; direkt f&uuml;r dich gefunden.
          </p>
        </div>

        {/* Middle: 3-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Destinations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              Reiseziele
            </h3>
            <ul className="space-y-2.5">
              {destinations.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/reiseziel/${dest.slug}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {dest.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Social */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              Folge uns
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.tiktok.com/@bestenurlaub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/bestenurlaub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; 2026 Besten Urlaub. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-white/40">
            * Alle Angebote enthalten Affiliate-Links.
          </p>
        </div>
      </div>
    </footer>
  )
}
