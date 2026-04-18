'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Flame, MapPin, Check, Phone, Share2, Heart } from 'lucide-react'
import { AngebotTracker } from '@/components/public/angebot-tracker'

type OfferData = {
  id: string
  title: string
  hotelName: string | null
  hotelStars: number | null
  board: string | null
  nights: number | null
  adultsCount: number | null
  departureFrom: string | null
  dateFrom: Date | null
  dateTo: Date | null
  region: string | null
  rating: number | null
  reviews: number | null
  priceFrom: number | null
  priceStrike: number | null
  discount: number | null
  limitedText: string | null
  gallery: string[]
  amenities: string[]
  description: string | null
  longDescription: string | null
  destination: { name: string; country: string | null; slug: string | null }
  affiliateLink: string
}

const NAVY = '#0a1a3a'
const ORANGE = '#ff6b35'
const BLUE = '#2e75fa'

function formatDate(d: Date | null): string {
  if (!d) return ''
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(d)
}

function formatPrice(n: number | null): string {
  if (n === null) return ''
  return new Intl.NumberFormat('de-DE').format(Math.round(n))
}

function ratingLabel(r: number | null): string {
  if (!r) return ''
  if (r >= 9) return 'Hervorragend'
  if (r >= 8.5) return 'Fabelhaft'
  if (r >= 8) return 'Sehr gut'
  if (r >= 7) return 'Gut'
  return 'Akzeptabel'
}

export function OfferDetailView({ offer, affiliateLinkWithSubid }: { offer: OfferData; affiliateLinkWithSubid: string }) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [active, setActive] = useState(0)
  const [faved, setFaved] = useState(false)

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const destSlug = offer.destination.slug || offer.destination.name.toLowerCase()
  const fallbackImg = `/destinations/${destSlug}.webp`
  const images = offer.gallery && offer.gallery.length > 0 ? offer.gallery : [fallbackImg, fallbackImg, fallbackImg]

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: NAVY, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <Header faved={faved} onFav={() => setFaved(!faved)} isDesktop={isDesktop} />
      <HeroGallery images={images} active={active} setActive={setActive} offer={offer} isDesktop={isDesktop} />

      {isDesktop ? (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
          <div style={{ minWidth: 0 }}>
            <TitleBlock offer={offer} mobile={false} />
            <HighlightsBar offer={offer} />
            <Description offer={offer} />
            <Divider />
            <Amenities offer={offer} />
            <Divider />
            <PhoneCTA />
          </div>
          <div>
            <div style={{ position: 'sticky', top: 24 }}>
              <BookingCard offer={offer} affiliateLink={affiliateLinkWithSubid} />
              <TrustSeals />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 20px 120px' }}>
          <TitleBlock offer={offer} mobile />
          <HighlightsBar offer={offer} />
          <Description offer={offer} />
          <Divider />
          <BookingCard offer={offer} affiliateLink={affiliateLinkWithSubid} />
          <Divider />
          <Amenities offer={offer} />
          <Divider />
          <PhoneCTA />
        </div>
      )}

      <TrustBar />
      <Footer />

      {!isDesktop && <StickyMobileCTA offer={offer} affiliateLink={affiliateLinkWithSubid} />}
    </div>
  )
}

function Header({ faved, onFav, isDesktop }: { faved: boolean; onFav: () => void; isDesktop: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const solid = isDesktop || scrolled
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: solid ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: solid ? 'blur(10px)' : 'none',
      borderBottom: solid ? '1px solid rgba(10,26,58,0.06)' : '1px solid transparent',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <IconBtn tone={solid ? 'light' : 'glass'}><ArrowLeft size={18} /></IconBtn>
          </Link>
          {isDesktop && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 6, textDecoration: 'none' }}>
              <Image src="/symbol.svg" alt="Bester Urlaub" width={22} height={22} />
              <span style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: '-0.02em' }}>Bester Urlaub</span>
            </Link>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBtn tone={solid ? 'light' : 'glass'}><Share2 size={16} /></IconBtn>
          <IconBtn tone={solid ? 'light' : 'glass'} onClick={onFav} active={faved}>
            <Heart size={16} color={faved ? '#ff3b30' : 'currentColor'} fill={faved ? '#ff3b30' : 'none'} />
          </IconBtn>
        </div>
      </div>
    </header>
  )
}

function IconBtn({ children, onClick, tone = 'light', active = false }: { children: React.ReactNode; onClick?: () => void; tone?: 'light' | 'glass'; active?: boolean }) {
  const bg = tone === 'glass' ? 'rgba(255,255,255,0.92)' : '#fff'
  const color = active ? '#ff3b30' : NAVY
  return (
    <button type="button" aria-label="Button" onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%',
      background: bg, border: '1px solid rgba(10,26,58,0.06)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color,
      boxShadow: tone === 'glass' ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 150ms',
    }}>{children}</button>
  )
}

function HeroGallery({ images, active, setActive, offer, isDesktop }: { images: string[]; active: number; setActive: (i: number) => void; offer: OfferData; isDesktop: boolean }) {
  if (!isDesktop) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: 380, background: '#eee', overflow: 'hidden' }}>
          {images.map((src, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: active === i ? 1 : 0, transition: 'opacity 400ms' }}>
              <Image src={src} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,58,0.75) 0%, rgba(10,26,58,0.15) 35%, rgba(10,26,58,0.2) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 72, left: 16, right: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {offer.discount && <Badge color={ORANGE}>-{offer.discount}%</Badge>}
            {offer.limitedText && <Badge color="#ff3333" icon={<Flame size={11} />}>{offer.limitedText}</Badge>}
            {offer.hotelStars && <Badge color="rgba(255,255,255,0.95)" textColor={NAVY}>{'★'.repeat(offer.hotelStars)}</Badge>}
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {images.map((_, i) => (
              <button key={i} type="button" aria-label={`Foto ${i + 1}`} onClick={() => setActive(i)} style={{
                width: active === i ? 22 : 7, height: 7, borderRadius: 9999,
                background: active === i ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer', transition: 'all 200ms',
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  // Desktop: 2x2 grid + main image
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, height: 460, borderRadius: 24, overflow: 'hidden' }}>
        <div style={{ position: 'relative', background: '#eee' }}>
          <Image src={images[0]} alt={offer.hotelName || offer.title} fill sizes="800px" style={{ objectFit: 'cover' }} priority />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
          <div style={{ position: 'relative', background: '#eee' }}>
            <Image src={images[1] || images[0]} alt="" fill sizes="400px" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative', background: '#eee' }}>
            <Image src={images[2] || images[0]} alt="" fill sizes="400px" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, color, textColor = '#fff', icon }: { children: React.ReactNode; color: string; textColor?: string; icon?: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', background: color, color: textColor,
      borderRadius: 9999, fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }}>
      {icon}{children}
    </span>
  )
}

function TitleBlock({ offer, mobile }: { offer: OfferData; mobile: boolean }) {
  return (
    <div style={{ marginBottom: 14, marginTop: mobile ? 0 : 8 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <Chip icon={<MapPin size={12} />}>{offer.destination.name}{offer.destination.country ? `, ${offer.destination.country}` : ''}</Chip>
        {offer.rating && (
          <Chip icon={<span style={{ color: '#ffb703', display: 'inline-flex' }}><Star size={12} fill="#ffb703" /></span>}>
            {offer.rating.toFixed(1)} · {offer.reviews?.toLocaleString('de-DE') || '0'} Bewertungen
          </Chip>
        )}
        {offer.limitedText && (
          <Chip icon={<span style={{ color: '#ff3333', display: 'inline-flex' }}><Flame size={12} /></span>}>{offer.limitedText}</Chip>
        )}
      </div>
      {!mobile && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: BLUE, marginBottom: 10 }}>
            {offer.destination.name}{offer.destination.country ? ` · ${offer.destination.country}` : ''}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, margin: 0, color: NAVY }}>
            {offer.title}
          </h1>
          {offer.hotelName && (
            <div style={{ fontSize: 15, color: 'rgba(10,26,58,0.6)', marginTop: 8 }}>
              {offer.hotelName}{offer.region ? ` · ${offer.region}` : ''}
            </div>
          )}
        </>
      )}
      {mobile && (
        <>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '4px 0 0', color: NAVY }}>
            {offer.title}
          </h1>
          {offer.hotelName && (
            <div style={{ fontSize: 13, color: 'rgba(10,26,58,0.6)', marginTop: 6 }}>
              {offer.hotelName}{offer.region ? ` · ${offer.region}` : ''}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', background: 'rgba(10,26,58,0.05)',
      borderRadius: 9999, fontSize: 12, fontWeight: 500, color: NAVY,
    }}>
      {icon}{children}
    </span>
  )
}

function HighlightsBar({ offer }: { offer: OfferData }) {
  const items = [
    offer.nights != null && { k: 'Nächte', v: String(offer.nights) },
    offer.board && { k: 'Verpflegung', v: offer.board },
    offer.adultsCount != null && { k: 'Reisende', v: `${offer.adultsCount} Erw.` },
    offer.rating && { k: 'Bewertung', v: `${offer.rating.toFixed(1)} ${ratingLabel(offer.rating)}` },
  ].filter(Boolean) as { k: string; v: string }[]

  return (
    <div style={{
      marginTop: 20, padding: '16px 18px',
      background: '#f5f5f7', borderRadius: 16,
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 12,
    }}>
      {items.map((it) => (
        <div key={it.k} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(10,26,58,0.5)' }}>{it.k}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginTop: 3 }}>{it.v}</div>
        </div>
      ))}
    </div>
  )
}

function Description({ offer }: { offer: OfferData }) {
  const text = offer.longDescription || offer.description
  if (!text) return null
  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px', color: NAVY }}>Über dieses Angebot</h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(10,26,58,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
    </div>
  )
}

function Amenities({ offer }: { offer: OfferData }) {
  if (!offer.amenities || offer.amenities.length === 0) return null
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: NAVY }}>Ausstattung</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        {offer.amenities.map((a) => (
          <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: NAVY }}>
            <span style={{ width: 24, height: 24, borderRadius: 9999, background: 'rgba(46,117,250,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: BLUE, flexShrink: 0 }}>
              <Check size={14} />
            </span>
            {a}
          </div>
        ))}
      </div>
    </div>
  )
}

function BookingCard({ offer, affiliateLink }: { offer: OfferData; affiliateLink: string }) {
  return (
    <div data-booking style={{ background: '#fff', border: '1px solid rgba(10,26,58,0.08)', borderRadius: 24, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(10,26,58,0.5)' }}>ab</span>
        <span style={{ fontSize: 36, fontWeight: 900, color: BLUE, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {formatPrice(offer.priceFrom)} €
        </span>
        {offer.priceStrike && (
          <span style={{ fontSize: 14, color: 'rgba(10,26,58,0.4)', textDecoration: 'line-through' }}>
            {formatPrice(offer.priceStrike)} €
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(10,26,58,0.6)', marginBottom: 14 }}>
        {offer.nights && `${offer.nights} Nächte`}{offer.board && ` · ${offer.board}`}{offer.adultsCount && ` · ${offer.adultsCount} Erw.`}
      </div>

      <div style={{ display: 'grid', gap: 8, marginBottom: 16, fontSize: 13 }}>
        {offer.dateFrom && offer.dateTo && (
          <Row label="Reisezeitraum" value={`${formatDate(offer.dateFrom)} – ${formatDate(offer.dateTo)}`} />
        )}
        {offer.departureFrom && <Row label="Abflug" value={offer.departureFrom} />}
      </div>

      <AngebotTracker
        offerId={offer.id}
        offerTitle={offer.title}
        priceFrom={offer.priceFrom}
        affiliateLink={affiliateLink}
      />

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11, color: 'rgba(10,26,58,0.5)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Sichere Buchung über CHECK24
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ color: 'rgba(10,26,58,0.55)' }}>{label}</span>
      <span style={{ color: NAVY, fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function TrustSeals() {
  return (
    <div style={{ marginTop: 20, padding: 18, background: '#f5f5f7', borderRadius: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,26,58,0.5)', marginBottom: 14 }}>Ausgezeichnet</div>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(10,26,58,0.7)' }}>
        Testsieger Pauschalreisen 2025 · TÜV Kundenzufriedenheit 2024 · 1 Mio+ Kunden
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(10,26,58,0.08)', margin: '32px 0' }} />
}

function PhoneCTA() {
  return (
    <div style={{
      position: 'relative', marginTop: 24, padding: '32px 24px',
      background: 'linear-gradient(135deg, #0a1a3a 0%, #0f2454 60%, #0a1a3a 100%)',
      borderRadius: 24, color: '#fff', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, #2e75fa 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ff6b35 0%, transparent 50%)', opacity: 0.08, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ORANGE, marginBottom: 8 }}>Persönliche Beratung</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px', color: '#fff' }}>Brauchst du Hilfe bei deiner Buchung?</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 18px' }}>Ruf uns direkt an. Kostenlos. Keine Warteschlange.</p>
        <a href="tel:+4930123456789" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', background: ORANGE, color: '#fff',
          borderRadius: 9999, textDecoration: 'none', fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
        }}>
          <Phone size={16} /> Jetzt anrufen
        </a>
      </div>
    </div>
  )
}

function StickyMobileCTA({ offer, affiliateLink }: { offer: OfferData; affiliateLink: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: '#fff', borderTop: '1px solid rgba(10,26,58,0.08)',
      padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 -6px 24px rgba(0,0,0,0.08)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'rgba(10,26,58,0.55)' }}>ab</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: BLUE, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {formatPrice(offer.priceFrom)} €
        </div>
      </div>
      <a href={affiliateLink} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '14px 22px', background: ORANGE, color: '#fff',
        borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700,
        boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
      }}>Jetzt buchen <ChevronRight size={16} /></a>
    </div>
  )
}

function TrustBar() {
  const items = [
    { k: '1 Mio+', v: 'zufriedene Reisende' },
    { k: 'Bestpreis', v: 'Garantie' },
    { k: '24h', v: 'Kundenservice' },
    { k: 'Bis -60%', v: 'Frühbucher-Rabatt' },
  ]
  return (
    <div style={{ background: '#f5f5f7', padding: '28px 20px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
        {items.map((i) => (
          <div key={i.k} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: '-0.02em' }}>{i.k}</div>
            <div style={{ fontSize: 12, color: 'rgba(10,26,58,0.6)', marginTop: 3 }}>{i.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: NAVY, color: 'rgba(255,255,255,0.7)', padding: '36px 20px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Bester Urlaub</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          © 2026 · Partner von CHECK24 · AGB · Datenschutz
        </div>
      </div>
    </footer>
  )
}

// Unused helper to satisfy lint if label unused
export { ratingLabel }
