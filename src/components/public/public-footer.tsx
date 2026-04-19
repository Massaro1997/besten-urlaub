import Image from 'next/image'
import Link from 'next/link'
import { TrackedPhoneLink } from './tracked-phone-link'
import { NewsletterForm } from './newsletter-form'

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

          {/* Newsletter */}
          <div className="mb-10 pb-8 border-b border-white/[0.08]">
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-2">
              Newsletter
            </h4>
            <p className="text-sm text-white/55 mb-3">
              Erhalte die besten Urlaubsangebote direkt per E-Mail.
            </p>
            <NewsletterForm />
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

            {/* Rechtliches & Kontakt */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-3">
                Kontakt & Rechtliches
              </h4>
              <ul className="space-y-2">
                <li>
                  <TrackedPhoneLink
                    href="tel:+4917682405507"
                    source="footer"
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                    0176 824 055 07
                  </TrackedPhoneLink>
                </li>
                <li>
                  <a
                    href="mailto:info@besterurlaub.com"
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    info@besterurlaub.com
                  </a>
                </li>
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
