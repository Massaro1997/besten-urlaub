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
    <footer className="bg-[#0a1a3a] relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2e75fa]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        {/* Main content */}
        <div className="pt-14 pb-10 sm:pt-16 sm:pb-12">
          {/* Top row: Logo + Social */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-12">
            <div className="max-w-xs">
              <Image
                src="/noBgWhite.png"
                alt="Bester Urlaub"
                width={150}
                height={40}
                className="h-9 w-auto"
              />
              <p className="mt-4 text-[13px] text-white/50 leading-relaxed">
                Finde die besten Urlaubsangebote und spare bei deinem Traumurlaub. Vergleiche und buche direkt.
              </p>
            </div>

            {/* Social buttons */}
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@bestenurlaub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-[18px] h-[18px] text-white/70" />
              </a>
              <a
                href="https://www.instagram.com/bestenurlaub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-[18px] h-[18px] text-white/70" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6 sm:gap-x-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
                Top Reiseziele
              </p>
              <ul className="space-y-3">
                {destinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/reiseziel/${d.slug}`}
                      className="text-[13px] text-white/60 hover:text-white transition-colors"
                    >
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
                Services
              </p>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="text-[13px] text-white/60 hover:text-white transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
                Rechtliches
              </p>
              <ul className="space-y-3">
                <li>
                  <Link href="/impressum" className="text-[13px] text-white/60 hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-[13px] text-white/60 hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Bester Urlaub
          </p>
          <p className="text-[11px] text-white/25">
            * Alle Angebote enthalten Affiliate-Links zu Check24
          </p>
        </div>
      </div>
    </footer>
  )
}
