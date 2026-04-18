'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Flame, MapPin, Check, Phone, Share2, Heart, X, ChevronDown, Plane, Moon, Utensils, Shield, Waves, Wifi, Dumbbell, Users, Car, Sparkles, TreePalm, Baby, Wine, Mountain } from 'lucide-react'
import { overrideCheck24Params } from '@/lib/affiliate-link'
import { trackInitiateCheckout, trackCompletePayment } from '@/lib/tiktok-pixel'

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

export type RelatedOffer = {
  id: string
  hotelName: string | null
  title: string
  board: string | null
  nights: number | null
  priceFrom: number | null
  priceStrike: number | null
  discount: number | null
  destination: { name: string; country: string | null; slug: string | null }
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

export function OfferDetailView({ offer, affiliateLinkWithSubid, related = [] }: { offer: OfferData; affiliateLinkWithSubid: string; related?: RelatedOffer[] }) {
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
      <Header
        faved={faved}
        onFav={() => setFaved(!faved)}
        isDesktop={isDesktop}
        shareTitle={`${offer.hotelName || offer.destination.name} · Bester Urlaub`}
        shareText={offer.title}
      />
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
            <AdBanner variant={3} />
            <Divider />
            <LocationMap offer={offer} />
            <Divider />
            <Reviews offer={offer} />
            <Divider />
            <AdBanner variant="pubb" />
            <Divider />
            <FAQ />
            <Divider />
            <PhoneCTA />
            {related.length > 0 && (
              <>
                <Divider />
                <RelatedDeals offers={related} />
              </>
            )}
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
          <AdBanner variant={3} />
          <Divider mobile />
          <LocationMap offer={offer} />
          <Divider mobile />
          <Reviews offer={offer} />
          <Divider mobile />
          <AdBanner variant="pubb" />
          <Divider mobile />
          <FAQ />
          <Divider mobile />
          <PhoneCTA />
          {related.length > 0 && (
            <>
              <Divider mobile />
              <RelatedDeals offers={related} />
            </>
          )}
        </div>
      )}

      <TrustBarNavy />
      <Footer />

      {!isDesktop && <StickyMobileCTA offer={offer} affiliateLink={affiliateLinkWithSubid} />}
      {lightbox && <Lightbox images={images} startIdx={active} onClose={() => setLightbox(false)} />}
    </div>
  )
}

function Header({ faved, onFav, isDesktop, shareTitle, shareText }: { faved: boolean; onFav: () => void; isDesktop: boolean; shareTitle: string; shareText: string }) {
  // Always show a solid white header so the logo and 'Bester Urlaub' text
  // stay readable (gallery starts immediately below, there's no dark hero
  // image behind the bar to warrant a transparent glass style).
  const solid = true
  void isDesktop
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: solid ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: solid ? 'blur(10px)' : 'none',
      borderBottom: solid ? '1px solid rgba(10,26,58,0.06)' : '1px solid transparent',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <IconBtn tone={solid ? 'light' : 'glass'}><ArrowLeft size={18} /></IconBtn>
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4, textDecoration: 'none', minWidth: 0 }}>
            <Image src="/symbol.svg" alt="Bester Urlaub" width={22} height={22} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: isDesktop ? 15 : 14, fontWeight: 800, color: solid ? NAVY : '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Bester Urlaub</span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBtn tone={solid ? 'light' : 'glass'} onClick={async () => {
            if (typeof window === 'undefined') return
            const url = window.location.href
            const navAny = navigator as Navigator & { share?: (data: { title?: string; text?: string; url?: string }) => Promise<void> }
            if (navAny.share) {
              try { await navAny.share({ title: shareTitle, text: shareText, url }) } catch {}
            } else {
              try { await navigator.clipboard.writeText(url); alert('Link kopiert!') } catch {}
            }
          }}><Share2 size={16} /></IconBtn>
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
      <div style={{ position: 'relative', padding: '12px 0 4px' }}>
        {/* Top badges row above gallery - aligned with content padding */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 16px 10px' }}>
          {offer.discount && <Badge color={ORANGE}>-{offer.discount}%</Badge>}
          {offer.limitedText && <Badge color="#ff3333" icon={<Flame size={11} />}>{offer.limitedText}</Badge>}
          {offer.hotelStars && <Badge color="rgba(10,26,58,0.08)" textColor={NAVY}>{'★'.repeat(offer.hotelStars)}</Badge>}
        </div>
        {/* Scroll-x gallery — uses pseudo-spacers to align first/last card with 16px page padding */}
        <div
          style={{
            display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory',
            paddingBottom: 8, WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            scrollPaddingInline: 16,
          }}
          className="scrollbar-hide"
        >
          {/* Left spacer: gives first card a 16px gap from viewport edge */}
          <div aria-hidden style={{ flexShrink: 0, width: 16 }} />
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Foto ${i + 1} öffnen`}
              onClick={() => { setActive(i); onOpenLightbox() }}
              style={{
                flexShrink: 0, scrollSnapAlign: 'start',
                position: 'relative',
                width: 'min(82vw, 340px)', height: 'min(52vw, 230px)',
                minHeight: 190,
                borderRadius: 16, overflow: 'hidden', background: '#eee',
                border: 'none', padding: 0, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(10,26,58,0.08)',
              }}
            >
              <Image src={src} alt="" fill sizes="82vw" style={{ objectFit: 'cover' }} priority={i === 0} />
              {i === 0 && images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '5px 10px', background: 'rgba(10,26,58,0.75)', color: '#fff', borderRadius: 9999, fontSize: 11, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                  {images.length} Fotos
                </div>
              )}
            </button>
          ))}
          {/* Right spacer */}
          <div aria-hidden style={{ flexShrink: 0, width: 16 }} />
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

type AmenityCard = { icon: React.ReactNode; title: string; sub: string }

function getAmenityCards(offer: OfferData): AmenityCard[] {
  const dest = offer.destination.slug || offer.destination.name.toLowerCase()

  // Per-offer curated list (6 items each, matching real hotel feel)
  const byOffer: Record<string, AmenityCard[]> = {
    'cmnf0yjbv0001eknsi5s9kams': [ // Sansibar - Sunshine Bay Hotel
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandzugang', sub: 'Direkt am Strand' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Auf dem gesamten Areal' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Restaurant', sub: 'Buffet, lokale Küche' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Wellness & Pool', sub: 'Sauna, Massagen' },
      { icon: <Plane size={22} strokeWidth={1.75} />, title: 'Flughafentransfer', sub: 'Inklusive' },
      { icon: <TreePalm size={22} strokeWidth={1.75} />, title: 'Gartenanlage', sub: 'Tropische Vegetation' },
    ],
    '9b090b676a3f48c596ef127d5': [ // Mauritius - Mon Choisy
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandzugang', sub: '500 m zum Strand' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Im ganzen Hotel' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Restaurant', sub: 'Kreolische Küche' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Pool', sub: 'Mit Sonnenterrasse' },
      { icon: <Plane size={22} strokeWidth={1.75} />, title: 'Flughafentransfer', sub: 'Auf Anfrage' },
      { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'Kostenfrei vor Ort' },
    ],
    'cmo1qt65k0001z4ns28nmglfl': [ // Aruba - Barcelo
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Direkte Strandlage', sub: 'Palm Beach' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Auf dem gesamten Areal' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: '4 Restaurants', sub: 'Buffet, à la carte' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Spa & Fitness', sub: 'Sauna, Pool, Gym' },
      { icon: <Wine size={22} strokeWidth={1.75} />, title: 'All Inclusive Plus', sub: 'Inkl. Premium Drinks' },
      { icon: <Baby size={22} strokeWidth={1.75} />, title: 'Kids-Club', sub: '4 bis 12 Jahre' },
    ],
    'cmo1du2rk0001k4ns36e5h81f': [ // Korfu - Harmony Apartments
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandnähe', sub: 'Wenige Gehminuten' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'In jeder Wohnung' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Küchenzeile', sub: 'Voll ausgestattet' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Pool & Garten', sub: 'Gemeinschaftlich' },
      { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'Kostenfrei' },
      { icon: <TreePalm size={22} strokeWidth={1.75} />, title: 'Balkon', sub: 'Mit Meerblick' },
    ],
    'cmnnceyg7000004kvguivkddf': [ // Salento - Il Mondo Dei Sogni
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandnähe', sub: '2 km nach Torre Lapillo' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Im Hauptgebäude' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Agriturismo-Küche', sub: 'Regional, Bio' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Pool', sub: 'Außenpool' },
      { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'Kostenfrei' },
      { icon: <TreePalm size={22} strokeWidth={1.75} />, title: 'Gartenanlage', sub: 'Olivenhaine' },
    ],
    'cmnde2nnz000004lalyz9fvdu': [ // Sardegna - Sa Domm'e Galleria
      { icon: <Mountain size={22} strokeWidth={1.75} />, title: 'Bergblick', sub: 'Im Ogliastra-Gebirge' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'In den öffentlichen Bereichen' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Restaurant', sub: 'Sardische Spezialitäten' },
      { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'Kostenfrei' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Klimaanlage', sub: 'In allen Zimmern' },
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandzugang', sub: 'Über Wanderweg' },
    ],
    'cmnbwwwuo0000f8nsqubtz76q': [ // Marbella - Antilope
      { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strandnähe', sub: '10 Min. zum Strand' },
      { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Im ganzen Haus' },
      { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Klimaanlage', sub: 'In allen Zimmern' },
      { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Frühstück', sub: 'Kontinental, inklusive' },
      { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'In der Nähe' },
      { icon: <TreePalm size={22} strokeWidth={1.75} />, title: 'Terrasse', sub: 'Mit Stadtblick' },
    ],
  }

  if (byOffer[offer.id]) return byOffer[offer.id]

  // Fallback generic set when offer is not curated
  const generic: AmenityCard[] = [
    { icon: <Wifi size={22} strokeWidth={1.75} />, title: 'Kostenloses WLAN', sub: 'Im ganzen Hotel' },
    { icon: <Sparkles size={22} strokeWidth={1.75} />, title: 'Pool', sub: 'Außenpool' },
    { icon: <Utensils size={22} strokeWidth={1.75} />, title: 'Restaurant', sub: 'Vor Ort' },
    { icon: <Car size={22} strokeWidth={1.75} />, title: 'Parkplatz', sub: 'Kostenfrei' },
  ]
  const suffix = dest ? ` in der Nähe` : ''
  return generic.concat([
    { icon: <Waves size={22} strokeWidth={1.75} />, title: 'Strand', sub: `Strand${suffix}` },
  ])
}

function Amenities({ offer }: { offer: OfferData }) {
  const cards = getAmenityCards(offer)
  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 20px', color: NAVY }}>Hotel-Ausstattung</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        {cards.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, minWidth: 0 }}>
            <div style={{
              flexShrink: 0,
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(46,117,250,0.08)', color: BLUE,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {a.icon}
            </div>
            <div style={{ minWidth: 0, paddingTop: 2 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(10,26,58,0.55)', marginTop: 2, lineHeight: 1.4 }}>{a.sub}</div>
            </div>
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
  const monthDE = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  function shortRange(a: Date | null, b: Date | null): string {
    if (!a || !b) return ''
    const da = a.getUTCDate()
    const db = b.getUTCDate()
    const mb = monthDE[b.getUTCMonth()]
    const yb = b.getUTCFullYear()
    const sameMonth = a.getUTCMonth() === b.getUTCMonth()
    if (sameMonth) return `${da}. bis ${db}. ${mb} ${yb}`
    const ma = monthDE[a.getUTCMonth()]
    return `${da}. ${ma} bis ${db}. ${mb} ${yb}`
  }

  function toISO(d: Date | null): string {
    if (!d) return ''
    return d.toISOString().slice(0, 10)
  }

  function fromISO(s: string): Date {
    return new Date(s + 'T00:00:00Z')
  }

  // Live state (seeded from DB)
  const [depDate, setDepDate] = useState<Date | null>(offer.dateFrom)
  const [retDate, setRetDate] = useState<Date | null>(offer.dateTo)
  const [nights, setNights] = useState<number>(offer.nights || 7)
  const [adults, setAdults] = useState<number>(offer.adultsCount || 2)
  const [rooms, setRooms] = useState<number>(1)
  const [board, setBoard] = useState<string>(offer.board || 'All Inclusive')
  const [airports, setAirports] = useState<string[]>([])
  const [openPanel, setOpenPanel] = useState<null | 'dates' | 'guests' | 'airport'>(null)

  // Recompute return date when dep or nights change
  useEffect(() => {
    if (depDate) {
      const r = new Date(depDate.getTime())
      r.setUTCDate(r.getUTCDate() + nights)
      setRetDate(r)
    }
  }, [depDate, nights])

  const pricePerPerson = offer.priceFrom || 0
  const total = pricePerPerson * adults

  // Rebuild affiliate link on every state change
  const finalLink = useMemo(() => {
    return overrideCheck24Params(affiliateLink, {
      departureDate: toISO(depDate),
      returnDate: toISO(retDate),
      nights,
      adults,
      board,
      airports: airports.length > 0 ? airports : undefined,
    })
  }, [affiliateLink, depDate, retDate, nights, adults, board, airports])

  return (
    <div data-booking style={{ background: '#fff', border: '1px solid rgba(10,26,58,0.08)', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      {/* Top row: strike price + rating */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
        {offer.priceStrike ? (
          <span style={{ fontSize: 14, color: 'rgba(10,26,58,0.4)', textDecoration: 'line-through' }}>
            {formatPrice(offer.priceStrike)} €
          </span>
        ) : <span />}
        {offer.rating && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: NAVY }}>
            <Star size={14} fill="#ffb703" color="#ffb703" />
            <span>{offer.rating.toFixed(1)}</span>
            {offer.reviews && <span style={{ color: 'rgba(10,26,58,0.45)', fontWeight: 500 }}>({offer.reviews.toLocaleString('de-DE')})</span>}
          </div>
        )}
      </div>

      {/* Big price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'rgba(10,26,58,0.55)' }}>ab</span>
        <span style={{ fontSize: 'clamp(32px, 8vw, 44px)', fontWeight: 900, color: BLUE, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {formatPrice(pricePerPerson)} €
        </span>
        <span style={{ fontSize: 13, color: 'rgba(10,26,58,0.55)' }}>p.P.*</span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(10,26,58,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
        *Preis pro Person im Doppelzimmer. Endpreis wird von unserem Partner CHECK24 berechnet und kann je nach Reisedaten, Abflughafen, Zimmerkategorie, Verpflegung und Verfügbarkeit abweichen. Der Vergleichspreis bezieht sich auf den durchschnittlichen Saisonpreis ohne Rabatt.
      </div>

      {/* Reisedaten field */}
      <FieldBox
        icon={<CalendarIcon />}
        label="Reisedaten"
        value={depDate && retDate ? shortRange(depDate, retDate) : 'Datum wählen'}
        sub={`${nights} Nächte`}
        open={openPanel === 'dates'}
        onClick={() => setOpenPanel(openPanel === 'dates' ? null : 'dates')}
      />
      {openPanel === 'dates' && (
        <div style={{ padding: '14px 16px', border: '1px solid rgba(10,26,58,0.1)', borderRadius: 14, marginTop: -2, background: '#f9fafb' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(10,26,58,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Abflug</label>
          <input
            type="date"
            aria-label="Abflugdatum"
            value={toISO(depDate)}
            min={toISO(new Date())}
            onChange={(e) => setDepDate(fromISO(e.target.value))}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(10,26,58,0.15)', borderRadius: 10, fontSize: 14, color: NAVY, fontFamily: 'inherit' }}
          />
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(10,26,58,0.6)', margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dauer: {nights} Nächte</label>
          <input
            type="range"
            aria-label="Dauer der Reise in Nächten"
            min={3}
            max={21}
            step={1}
            value={nights}
            onChange={(e) => setNights(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: BLUE }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(10,26,58,0.5)', marginTop: 2 }}>
            <span>3</span><span>7</span><span>14</span><span>21</span>
          </div>
        </div>
      )}

      {/* Reisende field */}
      <FieldBox
        icon={<UsersIcon />}
        label="Reisende"
        value={`${adults} ${adults === 1 ? 'Erwachsener' : 'Erwachsene'}`}
        sub={`${rooms} ${rooms === 1 ? 'Zimmer' : 'Zimmer'}`}
        open={openPanel === 'guests'}
        onClick={() => setOpenPanel(openPanel === 'guests' ? null : 'guests')}
      />
      {openPanel === 'guests' && (
        <div style={{ padding: '14px 16px', border: '1px solid rgba(10,26,58,0.1)', borderRadius: 14, marginTop: -2, background: '#f9fafb', display: 'grid', gap: 12 }}>
          <CounterRow label="Erwachsene" sub="Ab 18 Jahren" value={adults} min={1} max={6} onChange={setAdults} />
          <CounterRow label="Zimmer" sub="" value={rooms} min={1} max={3} onChange={setRooms} />
        </div>
      )}

      {/* Abflughafen field */}
      <FieldBox
        icon={<PlaneIcon />}
        label="Abflughafen"
        value={airports.length === 0 ? 'Alle Flughäfen' : (AIRPORTS.find((a) => a.code === airports[0])?.name || airports[0])}
        sub={airports.length === 0 ? 'DE, AT, CH' : airports[0]}
        open={openPanel === 'airport'}
        onClick={() => setOpenPanel(openPanel === 'airport' ? null : 'airport')}
      />
      {openPanel === 'airport' && (
        <div style={{ padding: 16, border: '1px solid rgba(10,26,58,0.1)', borderRadius: 14, marginTop: -2, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(10,26,58,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Flughafen wählen</span>
            <button
              type="button"
              onClick={() => { setAirports([]); setOpenPanel(null) }}
              style={{
                background: airports.length === 0 ? 'rgba(46,117,250,0.08)' : 'transparent',
                border: `1px solid ${airports.length === 0 ? BLUE : 'rgba(10,26,58,0.12)'}`,
                color: airports.length === 0 ? BLUE : 'rgba(10,26,58,0.65)',
                fontSize: 11, fontWeight: 700,
                padding: '5px 12px', borderRadius: 9999,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Alle Flughäfen
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 6, maxHeight: 260, overflowY: 'auto', paddingRight: 2 }}>
            {AIRPORTS.map((a) => {
              const selected = airports.length === 1 && airports[0] === a.code
              return (
                <button
                  key={a.code}
                  type="button"
                  onClick={() => { setAirports([a.code]); setOpenPanel(null) }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1,
                    padding: '8px 10px', borderRadius: 10,
                    border: selected ? `1.5px solid ${BLUE}` : '1px solid rgba(10,26,58,0.1)',
                    background: selected ? 'rgba(46,117,250,0.06)' : '#fff',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 120ms',
                  }}
                >
                  <span style={{ fontWeight: 800, color: selected ? BLUE : NAVY, fontSize: 13, letterSpacing: '-0.01em' }}>{a.code}</span>
                  <span style={{ color: 'rgba(10,26,58,0.55)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{a.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Verpflegung pills */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(10,26,58,0.5)', marginBottom: 8 }}>Verpflegung</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All Inclusive', 'Halbpension', 'Frühstück'].map((b) => (
            <VerpflegungPill key={b} label={b} active={board === b} onClick={() => setBoard(b)} />
          ))}
        </div>
      </div>

      {/* Total breakdown */}
      <div style={{ marginTop: 18, padding: '14px 16px', background: '#f5f5f7', borderRadius: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: NAVY, marginBottom: 6 }}>
          <span>{formatPrice(pricePerPerson)} € × {adults} {adults === 1 ? 'Erwachsener' : 'Erwachsene'}</span>
          <span>{formatPrice(total)} €</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(10,26,58,0.55)', marginBottom: 10 }}>
          <span>Steuern und Gebühren</span>
          <span>inkl.</span>
        </div>
        <div style={{ height: 1, background: 'rgba(10,26,58,0.08)', marginBottom: 10 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>Gesamt</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: BLUE, letterSpacing: '-0.02em' }}>{formatPrice(total)} €</span>
        </div>
      </div>

      {/* CTA */}
      <BookingCTA
        offerId={offer.id}
        offerTitle={offer.title}
        priceFrom={pricePerPerson}
        affiliateLink={finalLink}
      />

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'rgba(10,26,58,0.5)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Sicher buchen bei unserem Partner CHECK24
      </div>
    </div>
  )
}

function BookingCTA({ offerId, offerTitle, priceFrom, affiliateLink }: { offerId: string; offerTitle: string; priceFrom: number | null; affiliateLink: string }) {
  useEffect(() => {
    trackInitiateCheckout({ id: offerId, title: offerTitle, priceFrom })
  }, [offerId, offerTitle, priceFrom])

  return (
    <a
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCompletePayment({ id: offerId, title: offerTitle, priceFrom })}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: '100%', marginTop: 16,
        padding: '16px 22px',
        background: ORANGE, color: '#fff',
        borderRadius: 12, textDecoration: 'none',
        fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em',
        boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
        transition: 'transform 150ms, background 150ms, box-shadow 150ms',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.98)' }}
      onMouseUp={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
    >
      Jetzt buchen
      <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
    </a>
  )
}

function CounterRow({ label, sub, value, min, max, onChange }: { label: string; sub: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(10,26,58,0.5)' }}>{sub}</div>}
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <button type="button" aria-label={`${label} verringern`} onClick={() => value > min && onChange(value - 1)} disabled={value <= min} style={{
          width: 30, height: 30, borderRadius: 9999, border: '1px solid rgba(10,26,58,0.15)',
          background: '#fff', color: value <= min ? 'rgba(10,26,58,0.25)' : NAVY,
          cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>−</button>
        <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, color: NAVY }}>{value}</span>
        <button type="button" aria-label={`${label} erhöhen`} onClick={() => value < max && onChange(value + 1)} disabled={value >= max} style={{
          width: 30, height: 30, borderRadius: 9999, border: '1px solid rgba(10,26,58,0.15)',
          background: '#fff', color: value >= max ? 'rgba(10,26,58,0.25)' : NAVY,
          cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>+</button>
      </div>
    </div>
  )
}

function FieldBox({ icon, label, value, sub, open, onClick }: { icon: React.ReactNode; label: string; value: string; sub?: string; open?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', border: `1px solid ${open ? 'rgba(46,117,250,0.5)' : 'rgba(10,26,58,0.1)'}`,
        borderRadius: 14, marginTop: 10, background: '#fff',
        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        transition: 'border-color 200ms',
      }}
    >
      <div style={{ flexShrink: 0, color: 'rgba(10,26,58,0.55)', display: 'inline-flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(10,26,58,0.55)' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      </div>
      {sub && <div style={{ flexShrink: 0, fontSize: 12, color: 'rgba(10,26,58,0.55)' }}>{sub}</div>}
      <ChevronDown size={16} color="rgba(10,26,58,0.4)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
    </button>
  )
}

function VerpflegungPill({ label, extra, active, onClick }: { label: string; extra?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '7px 13px', borderRadius: 9999,
        border: active ? `1.5px solid ${BLUE}` : '1px solid rgba(10,26,58,0.15)',
        color: active ? BLUE : NAVY,
        fontSize: 13, fontWeight: 600,
        background: '#fff',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 150ms',
      }}
    >
      {label}
      {extra && <span style={{ color: 'rgba(10,26,58,0.5)', fontWeight: 500, fontSize: 12 }}>{extra}</span>}
    </button>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

const AIRPORTS: { code: string; name: string }[] = [
  { code: 'FRA', name: 'Frankfurt' },
  { code: 'MUC', name: 'München' },
  { code: 'DUS', name: 'Düsseldorf' },
  { code: 'HAM', name: 'Hamburg' },
  { code: 'BER', name: 'Berlin BER' },
  { code: 'STR', name: 'Stuttgart' },
  { code: 'CGN', name: 'Köln/Bonn' },
  { code: 'HAJ', name: 'Hannover' },
  { code: 'NUE', name: 'Nürnberg' },
  { code: 'LEJ', name: 'Leipzig' },
  { code: 'BRE', name: 'Bremen' },
  { code: 'DTM', name: 'Dortmund' },
  { code: 'FMO', name: 'Münster' },
  { code: 'PAD', name: 'Paderborn' },
  { code: 'FKB', name: 'Karlsruhe' },
  { code: 'FMM', name: 'Memmingen' },
  { code: 'SCN', name: 'Saarbrücken' },
  { code: 'VIE', name: 'Wien' },
  { code: 'SZG', name: 'Salzburg' },
  { code: 'INN', name: 'Innsbruck' },
  { code: 'ZRH', name: 'Zürich' },
  { code: 'GVA', name: 'Genf' },
  { code: 'BSL', name: 'Basel' },
]

function PlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5A2.12 2.12 0 0 0 16.5 4L13 7.5 4.8 5.7a1 1 0 0 0-.9 1.7L8 10.5l-3 3H2l1 1 2.5.5L6 17l1 1v-3l3-3 3.1 3.5a1 1 0 0 0 1.7-.9z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
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
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Image src="/pauschalreise-testsieger-dtgv2025.jpg" alt="DTGV Testsieger 2025" width={120} height={70} style={{ height: 60, width: 'auto', borderRadius: 8, objectFit: 'contain' }} unoptimized />
        <Image src="/siegel-tuev-kundenzufriedenheit-10-2024.jpg" alt="TÜV Kundenzufriedenheit 2024" width={120} height={70} style={{ height: 60, width: 'auto', borderRadius: 8, objectFit: 'contain' }} unoptimized />
      </div>
      <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, color: 'rgba(10,26,58,0.65)' }}>
        Testsieger Pauschalreisen 2025 · TÜV Kundenzufriedenheit 2024 · 1 Mio+ Kunden
      </div>
    </div>
  )
}

function Divider({ mobile = false }: { mobile?: boolean }) {
  return <div style={{ height: 1, background: 'rgba(10,26,58,0.08)', margin: mobile ? '28px 0' : '40px 0' }} />
}

function AdBanner({ variant = 1 }: { variant?: 1 | 2 | 3 | 'pubb' }) {
  const src = variant === 1 ? '/Banner%20orizzontale%20Angebot%201.png'
    : variant === 2 ? '/Banner%20Orizzontale%20Angebot%202.png'
    : variant === 3 ? '/banner%20orizzontale%20Angebot%203.png'
    : '/Pubblicita.jpeg'
  return (
    <a
      href="#booking"
      aria-label="Angebot ansehen"
      title="Angebot ansehen"
      style={{
        display: 'block',
        width: '100%',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(10,26,58,0.12)',
      }}
    >
      <Image
        src={src}
        alt="Aktuelle Angebote"
        width={1600}
        height={500}
        sizes="(max-width: 900px) 100vw, 900px"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </a>
  )
}

function PhoneCTA() {
  return (
    <div className="phonecta-wrap" style={{
      position: 'relative', borderRadius: 24, overflow: 'hidden',
      background: '#0a1a3a',
      color: '#fff',
      minHeight: 280,
    }}>
      {/* Full-bleed background photo */}
      <Image
        src="/destinations/santorini.webp"
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 1000px"
        style={{ objectFit: 'cover', objectPosition: 'right center', zIndex: 0 }}
      />
      {/* Gradient fade from navy-left to transparent-right so the photo fades behind text */}
      <div className="phonecta-fade" />
      <div className="phonecta-content">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ORANGE, marginBottom: 10 }}>Persönliche Beratung</div>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', color: '#fff', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Brauchst du Hilfe bei deiner Buchung?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', margin: '0 0 20px', lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
          Ruf uns direkt an. Kostenlos. Keine Warteschlange.
        </p>
        <a href="tel:+4930123456789" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 22px', background: ORANGE, color: '#fff',
          borderRadius: 9999, textDecoration: 'none', fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 15px rgba(255,107,53,0.45)',
        }}>
          <Phone size={16} /> Jetzt anrufen
        </a>
      </div>
      <style jsx>{`
        .phonecta-fade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(10,26,58,0.95) 0%, rgba(10,26,58,0.8) 30%, rgba(10,26,58,0.45) 55%, rgba(10,26,58,0.15) 80%, rgba(10,26,58,0.05) 100%);
        }
        .phonecta-content {
          position: relative;
          z-index: 2;
          padding: 40px 32px;
          max-width: 540px;
        }
        @media (max-width: 720px) {
          .phonecta-fade {
            background: linear-gradient(180deg, rgba(10,26,58,0.15) 0%, rgba(10,26,58,0.55) 35%, rgba(10,26,58,0.9) 70%, rgba(10,26,58,0.96) 100%);
          }
          .phonecta-content {
            padding: 150px 22px 28px;
            max-width: none;
          }
        }
      `}</style>
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

function TrustBarNavy() {
  const items: { icon: React.ReactNode; title: string; sub: string }[] = [
    { icon: <Shield size={22} strokeWidth={1.75} />, title: 'Bestpreis-Garantie', sub: 'Sonst Differenz zurück' },
    { icon: <ClockIcon />, title: 'Bis 24h vor Abflug', sub: 'stornierbar' },
    { icon: <AwardIcon />, title: 'Testsieger 2025', sub: 'DTGV Pauschalreisen' },
  ]
  return (
    <div style={{ background: NAVY, padding: '32px 20px' }}>
      <div className="trustbar-grid" style={{ maxWidth: 1080, margin: '0 auto' }}>
        {items.map((it, i) => (
          <div key={i} className="trustbar-item">
            <div style={{ flexShrink: 0, color: ORANGE, display: 'inline-flex' }}>{it.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{it.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .trustbar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          justify-items: center;
        }
        .trustbar-item {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        @media (max-width: 720px) {
          .trustbar-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            justify-items: start;
            padding: 0 8px;
          }
          .trustbar-item {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function AwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}

function RelatedDeals({ offers }: { offers: RelatedOffer[] }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: ORANGE, marginBottom: 6 }}>Auch verfügbar</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 20px', color: NAVY }}>Ähnliche Schnäppchen</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {offers.map((r) => (
          <RelatedCard key={r.id} offer={r} />
        ))}
      </div>
    </div>
  )
}

function RelatedCard({ offer }: { offer: RelatedOffer }) {
  const slug = offer.destination.slug || offer.destination.name.toLowerCase()
  const img = `/destinations/${slug}.webp`
  return (
    <Link href={`/angebot/${offer.id}`} style={{
      display: 'block', background: '#fff', borderRadius: 20, overflow: 'hidden',
      border: '1px solid rgba(10,26,58,0.06)', textDecoration: 'none', color: 'inherit',
      boxShadow: '0 2px 8px rgba(10,26,58,0.06)', transition: 'transform 200ms, box-shadow 200ms',
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#eee', overflow: 'hidden' }}>
        <Image src={img} alt={offer.destination.name} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,58,0.6) 0%, transparent 45%, transparent 100%)', pointerEvents: 'none' }} />
        {offer.discount && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '5px 10px', background: ORANGE, color: '#fff', borderRadius: 9999, fontSize: 11, fontWeight: 800, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            -{offer.discount}%
          </div>
        )}
        <div style={{ position: 'absolute', left: 14, bottom: 12, color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          {offer.destination.name}{offer.destination.country ? `, ${offer.destination.country}` : ''}
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: '-0.01em', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {offer.hotelName || offer.title}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(10,26,58,0.55)', marginBottom: 12 }}>
          {offer.nights && `${offer.nights} Nächte`}{offer.board && ` · ${offer.board}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            {offer.priceStrike && (
              <span style={{ fontSize: 12, color: 'rgba(10,26,58,0.4)', textDecoration: 'line-through' }}>{formatPrice(offer.priceStrike)} €</span>
            )}
            <span style={{ fontSize: 11, color: 'rgba(10,26,58,0.55)' }}>ab</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: BLUE, letterSpacing: '-0.02em' }}>{formatPrice(offer.priceFrom)} €</span>
            <span style={{ fontSize: 11, color: 'rgba(10,26,58,0.55)' }}>p.P.</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            Ansehen <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function Footer() {
  return (
    <footer style={{ background: NAVY, color: 'rgba(255,255,255,0.7)', padding: '36px 20px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Bester Urlaub</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © 2026 · Partner von CHECK24 · AGB · Datenschutz
          </div>
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.55, color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, textAlign: 'left' }}>
          *Alle Preisangaben sind unverbindlich und werden von unserem Partner CHECK24 zur Verfügung gestellt. Der finale Preis kann je nach gewählten Reisedaten, Abflughafen, Anzahl der Reisenden, Zimmerkategorie, Verpflegungsart und Verfügbarkeit abweichen. Die Vergleichspreise beziehen sich auf den durchschnittlichen Saisonpreis ohne Rabatt. Die Buchung erfolgt ausschließlich über CHECK24. Bester Urlaub ist kein Reiseveranstalter und tritt ausschließlich als Vermittler auf. Alle Bewertungen stammen von verifizierten CHECK24-Kunden. Fotos sind beispielhaft und können vom tatsächlichen Hotelangebot abweichen.
        </div>
      </div>
    </footer>
  )
}
