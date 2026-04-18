'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Flame, MapPin, Check, Phone, Share2, Heart, X, ChevronDown, Plane, Moon, Utensils, Shield } from 'lucide-react'
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

// 29 destination photos available in /public/destinations/
const ALL_DEST_PHOTOS = [
  'antalya', 'aruba', 'bad-griesbach', 'canarie', 'chalkidiki', 'corf', 'creta',
  'fuessen', 'holland', 'hurghada', 'istanbul', 'korfu', 'lago-di-garda',
  'mallorca', 'marbella', 'mauritius', 'mont-saint-michel', 'nordkroatien',
  'playa-del-carmen', 'punta-cana', 'rodi', 'salento', 'sansibar', 'santorini',
  'sardegna', 'sharm-el-sheikh', 'sicilia', 'thailandia', 'zypern',
]

function seededShuffle<T>(arr: T[], seed: string): T[] {
  // Deterministic shuffle based on offer id — so each offer has consistent gallery across renders
  const a = [...arr]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  for (let i = a.length - 1; i > 0; i--) {
    hash = (hash * 16807 + 1) % 2147483647
    const j = Math.abs(hash) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildGallery(offer: OfferData): string[] {
  if (offer.gallery && offer.gallery.length > 0) return offer.gallery

  const destSlug = offer.destination.slug || offer.destination.name.toLowerCase()
  const primary = ALL_DEST_PHOTOS.includes(destSlug) ? destSlug : null

  // Primary first, then 4 random others
  const others = ALL_DEST_PHOTOS.filter((s) => s !== primary)
  const shuffled = seededShuffle(others, offer.id)
  const picks = [primary, ...shuffled.slice(0, 4)].filter(Boolean) as string[]
  return picks.map((s) => `/destinations/${s}.webp`)
}

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
  const [lightbox, setLightbox] = useState(false)
  const [faved, setFaved] = useState(false)

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const images = useMemo(() => buildGallery(offer), [offer])

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: NAVY, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <Header faved={faved} onFav={() => setFaved(!faved)} isDesktop={isDesktop} />
      <HeroGallery images={images} active={active} setActive={setActive} offer={offer} isDesktop={isDesktop} onOpenLightbox={() => setLightbox(true)} />

      {isDesktop ? (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
          <div style={{ minWidth: 0 }}>
            <TitleBlock offer={offer} mobile={false} />
            <div style={{ marginTop: 24 }}><HighlightsBar offer={offer} /></div>
            <div style={{ marginTop: 40 }}><Description offer={offer} /></div>
            <Divider />
            <Amenities offer={offer} />
            <Divider />
            <LocationMap offer={offer} />
            <Divider />
            <Reviews offer={offer} />
            <Divider />
            <FAQ />
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
        <div style={{ padding: '20px 16px 120px' }}>
          <TitleBlock offer={offer} mobile />
          <div style={{ marginTop: 16 }}><HighlightsBarMobile offer={offer} /></div>
          <div style={{ marginTop: 28 }}><Description offer={offer} /></div>
          <Divider mobile />
          <BookingCard offer={offer} affiliateLink={affiliateLinkWithSubid} />
          <Divider mobile />
          <Amenities offer={offer} />
          <Divider mobile />
          <LocationMap offer={offer} />
          <Divider mobile />
          <Reviews offer={offer} />
          <Divider mobile />
          <FAQ />
          <Divider mobile />
          <PhoneCTA />
        </div>
      )}

      <TrustBar />
      <Footer />

      {!isDesktop && <StickyMobileCTA offer={offer} affiliateLink={affiliateLinkWithSubid} />}
      {lightbox && <Lightbox images={images} startIdx={active} onClose={() => setLightbox(false)} />}
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
    <button type="button" aria-label="Action" onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%',
      background: bg, border: '1px solid rgba(10,26,58,0.06)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color,
      boxShadow: tone === 'glass' ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>{children}</button>
  )
}

function HeroGallery({ images, active, setActive, offer, isDesktop, onOpenLightbox }: { images: string[]; active: number; setActive: (i: number) => void; offer: OfferData; isDesktop: boolean; onOpenLightbox: () => void }) {
  if (!isDesktop) {
    return (
      <div style={{ position: 'relative' }}>
        <button type="button" aria-label="Galerie öffnen" onClick={onOpenLightbox} style={{
          position: 'relative', width: '100%', height: 'min(56vh, 420px)', minHeight: 300, background: '#eee', overflow: 'hidden',
          border: 'none', padding: 0, cursor: 'pointer', display: 'block',
        }}>
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
          <div style={{ position: 'absolute', bottom: 16, right: 16, padding: '6px 10px', background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
            {active + 1} / {images.length}
          </div>
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '12px 0 4px' }}>
          {images.map((_, i) => (
            <button key={i} type="button" aria-label={`Foto ${i + 1}`} onClick={() => setActive(i)} style={{
              width: active === i ? 22 : 7, height: 7, borderRadius: 9999,
              background: active === i ? NAVY : 'rgba(10,26,58,0.25)',
              border: 'none', cursor: 'pointer', transition: 'all 200ms',
            }} />
          ))}
        </div>
      </div>
    )
  }
  // Desktop: main + 2x2 grid + "view all" button
  const main = images[0]
  const thumbs = images.slice(1, 5)
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, height: 460, borderRadius: 24, overflow: 'hidden' }}>
        <button type="button" aria-label="Galerie öffnen" onClick={onOpenLightbox} style={{ position: 'relative', background: '#eee', gridRow: '1 / span 2', border: 'none', padding: 0, cursor: 'pointer' }}>
          <Image src={main} alt={offer.hotelName || offer.title} fill sizes="800px" style={{ objectFit: 'cover' }} priority />
        </button>
        {thumbs.map((src, i) => (
          <button key={i} type="button" aria-label={`Galerie Foto ${i + 2}`} onClick={onOpenLightbox} style={{ position: 'relative', background: '#eee', border: 'none', padding: 0, cursor: 'pointer' }}>
            <Image src={src} alt="" fill sizes="400px" style={{ objectFit: 'cover' }} />
            {i === 3 && images.length > 5 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,26,58,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800 }}>
                +{images.length - 5} Fotos
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function Lightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <button type="button" aria-label="Schließen" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={22} />
      </button>
      <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length) }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={24} />
      </button>
      <div style={{ position: 'relative', width: '80vw', height: '80vh' }} onClick={(e) => e.stopPropagation()}>
        <Image src={images[idx]} alt="" fill sizes="80vw" style={{ objectFit: 'contain' }} />
      </div>
      <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length) }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={24} />
      </button>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>
        {idx + 1} / {images.length}
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

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {eyebrow && (
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: BLUE, marginBottom: 6 }}>{eyebrow}</div>
      )}
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: NAVY }}>{title}</h2>
    </div>
  )
}

function TitleBlock({ offer, mobile }: { offer: OfferData; mobile: boolean }) {
  return (
    <div>
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
          <h1 style={{ fontSize: 'clamp(20px, 5.5vw, 24px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '4px 0 0', color: NAVY, textWrap: 'balance' as 'balance' }}>
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
  const items: { icon: React.ReactNode; title: string; sub: string }[] = []

  if (offer.departureFrom) {
    items.push({ icon: <Plane size={22} strokeWidth={1.75} />, title: 'Hin-/Rückflug', sub: offer.departureFrom })
  } else {
    items.push({ icon: <Plane size={22} strokeWidth={1.75} />, title: 'Hin-/Rückflug', sub: 'inklusive' })
  }

  if (offer.nights != null) {
    items.push({ icon: <Moon size={22} strokeWidth={1.75} />, title: `${offer.nights} Nächte`, sub: `${offer.adultsCount || 2} Erw. · Doppelzimmer` })
  }

  if (offer.board) {
    items.push({ icon: <Utensils size={22} strokeWidth={1.75} />, title: offer.board, sub: 'inklusive' })
  }

  items.push({ icon: <Shield size={22} strokeWidth={1.75} />, title: 'Stornierbar', sub: 'bis 24h vor Abflug' })

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
      border: '1px solid rgba(10,26,58,0.08)', borderRadius: 16,
      overflow: 'hidden', background: '#fff',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '18px 18px 20px',
          borderRight: i < items.length - 1 ? '1px solid rgba(10,26,58,0.08)' : 'none',
          minWidth: 0,
        }}>
          <div style={{ color: BLUE, marginBottom: 12 }}>{it.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(10,26,58,0.55)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.sub}</div>
        </div>
      ))}
    </div>
  )
}

function HighlightsBarMobile({ offer }: { offer: OfferData }) {
  const items: { icon: React.ReactNode; title: string; sub: string }[] = []
  items.push({ icon: <Plane size={18} strokeWidth={1.75} />, title: 'Flug', sub: offer.departureFrom || 'inkl.' })
  if (offer.nights != null) items.push({ icon: <Moon size={18} strokeWidth={1.75} />, title: `${offer.nights} Nächte`, sub: `${offer.adultsCount || 2} Erw.` })
  if (offer.board) items.push({ icon: <Utensils size={18} strokeWidth={1.75} />, title: offer.board, sub: 'inkl.' })
  items.push({ icon: <Shield size={18} strokeWidth={1.75} />, title: 'Storno', sub: '24h' })

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      border: '1px solid rgba(10,26,58,0.08)', borderRadius: 16,
      overflow: 'hidden', background: '#fff',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '14px 14px 16px',
          borderRight: i % 2 === 0 ? '1px solid rgba(10,26,58,0.08)' : 'none',
          borderBottom: i < 2 ? '1px solid rgba(10,26,58,0.08)' : 'none',
          minWidth: 0,
        }}>
          <div style={{ color: BLUE, marginBottom: 8 }}>{it.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(10,26,58,0.55)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.sub}</div>
        </div>
      ))}
    </div>
  )
}

function Description({ offer }: { offer: OfferData }) {
  const text = offer.longDescription || offer.description
  const fallback = `Entdecke ${offer.hotelName || 'dieses Angebot'} in ${offer.region || offer.destination.name}. ${offer.nights ? `${offer.nights} Nächte` : ''}${offer.board ? ` mit ${offer.board}` : ''}. Hand verlesen und geprüft von unserem Team.`
  return (
    <div>
      <SectionTitle eyebrow="Überblick" title="Was dich erwartet" />
      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(10,26,58,0.8)', margin: 0, whiteSpace: 'pre-wrap' }}>
        {text || fallback}
      </p>
    </div>
  )
}

function Amenities({ offer }: { offer: OfferData }) {
  const amenities = offer.amenities && offer.amenities.length > 0 ? offer.amenities : ['WLAN', 'Pool', 'Restaurant', 'Klimaanlage', 'Strand in der Nähe']
  return (
    <div>
      <SectionTitle eyebrow="Ausstattung" title="Was im Hotel drin ist" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        {amenities.map((a) => (
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

function LocationMap({ offer }: { offer: OfferData }) {
  // Build query: hotel name + region + country for best accuracy
  const parts = [
    offer.hotelName,
    offer.region,
    offer.destination.name,
    offer.destination.country,
  ].filter(Boolean).join(', ')
  const query = encodeURIComponent(parts || offer.destination.name)
  const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`

  return (
    <div>
      <SectionTitle eyebrow="Lage" title={offer.region || `${offer.destination.name}${offer.destination.country ? ', ' + offer.destination.country : ''}`} />
      <div style={{
        position: 'relative', height: 320, borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(10,26,58,0.08)',
        background: '#eef2f6',
      }}>
        <iframe
          title={`Karte ${offer.hotelName || offer.destination.name}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      </div>
      {offer.hotelName && (
        <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(10,26,58,0.65)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} color={ORANGE} />
          <span style={{ fontWeight: 600, color: NAVY }}>{offer.hotelName}</span>
          {offer.region && <span>· {offer.region}</span>}
        </div>
      )}
    </div>
  )
}

function Reviews({ offer }: { offer: OfferData }) {
  if (!offer.rating || !offer.reviews) return null
  const avatarBg = 'rgba(10,26,58,0.08)'
  const avatarColor = NAVY
  const reviews = [
    { name: 'Lena K.', avatar: 'L', stars: 5, date: 'März 2026', title: 'Besser als gedacht', text: 'Wir waren zu zweit eine Woche dort und können das Hotel nur empfehlen. Pool riesig, Essen gut, Personal super nett.' },
    { name: 'Markus B.', avatar: 'M', stars: 5, date: 'Februar 2026', title: 'Perfekt für Familien', text: 'Mit zwei Kindern dort gewesen. Kids-Club top, Zimmer geräumig, wir konnten entspannen.' },
    { name: 'Sarah W.', avatar: 'S', stars: 4, date: 'Januar 2026', title: 'Top Lage', text: 'Lage unschlagbar — Strand in 3 Min. zu Fuß, Zentrum mit dem Bus in 10 Min.' },
  ]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SectionTitle eyebrow={`${offer.reviews.toLocaleString('de-DE')} verifizierte Bewertungen`} title="Das sagen andere Urlauber" />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: NAVY, letterSpacing: '-0.03em' }}>{offer.rating.toFixed(1)}</span>
          <span style={{ fontSize: 13, color: 'rgba(10,26,58,0.55)' }}>/ 10</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ padding: 18, background: '#fff', borderRadius: 16, border: '1px solid rgba(10,26,58,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarBg, color: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{r.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(10,26,58,0.5)' }}>{r.date}</div>
              </div>
              <div style={{ display: 'inline-flex', gap: 1, color: '#ffb703' }}>
                {Array.from({ length: r.stars }).map((_, j) => <Star key={j} size={12} fill="#ffb703" />)}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{r.title}</div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(10,26,58,0.7)', margin: 0 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FAQ() {
  const items = [
    { q: 'Wann muss ich bezahlen?', a: 'Eine Anzahlung ist bei Buchung fällig, der Rest meist 28 Tage vor Abflug. Bei Last-Minute wird sofort gezahlt.' },
    { q: 'Kann ich kostenlos stornieren?', a: 'Viele Angebote erlauben kostenlose Stornierung bis 24 h vor Abflug. Die Bedingungen findest du in der Buchungsbestätigung.' },
    { q: 'Gibt es einen Flughafentransfer?', a: 'Bei den meisten Angeboten ist der Transfer im Preis enthalten. Prüfe die Details im Buchungsschritt.' },
    { q: 'Wie funktioniert die Buchung über Bester Urlaub?', a: 'Wir sind Partner von CHECK24. Du wirst zum Buchungsabschluss direkt auf CHECK24 weitergeleitet. Der Preis bleibt identisch.' },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div>
      <SectionTitle eyebrow="Häufige Fragen" title="Was du vor der Buchung wissen solltest" />
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ borderRadius: 14, background: '#f5f5f7', overflow: 'hidden' }}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)} style={{
              width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              fontSize: 14, fontWeight: 700, color: NAVY,
            }}>
              <span>{it.q}</span>
              <ChevronDown size={16} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
            </button>
            {open === i && (
              <div style={{ padding: '0 18px 14px', fontSize: 13, lineHeight: 1.55, color: 'rgba(10,26,58,0.75)' }}>{it.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BookingCard({ offer, affiliateLink }: { offer: OfferData; affiliateLink: string }) {
  return (
    <div data-booking style={{ background: '#fff', border: '1px solid rgba(10,26,58,0.08)', borderRadius: 20, padding: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(10,26,58,0.5)' }}>ab</span>
        <span style={{ fontSize: 'clamp(28px, 8vw, 36px)', fontWeight: 900, color: BLUE, letterSpacing: '-0.03em', lineHeight: 1 }}>
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

function Divider({ mobile = false }: { mobile?: boolean }) {
  return <div style={{ height: 1, background: 'rgba(10,26,58,0.08)', margin: mobile ? '28px 0' : '40px 0' }} />
}

function PhoneCTA() {
  return (
    <div style={{
      position: 'relative', padding: '32px 24px',
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
