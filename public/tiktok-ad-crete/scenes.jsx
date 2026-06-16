// scenes.jsx, Bester Urlaub Kreta 9:16 TikTok ad v5 (30s, story arc, elegant captions)
const BU = {
  blue: '#2e75fa', blueLight: '#e8f0ff',
  navy: '#0a1a3a', navySoft: '#0f2454',
  orange: '#ff6b35',
  red: '#ff3333',
  bg: '#ffffff', surface: '#f5f5f7',
  ink100: 'rgba(10,26,58,1)', ink80: 'rgba(10,26,58,0.8)',
  ink65: 'rgba(10,26,58,0.65)', ink50: 'rgba(10,26,58,0.5)',
  ink35: 'rgba(10,26,58,0.35)', ink10: 'rgba(10,26,58,0.1)',
  ink06: 'rgba(10,26,58,0.06)',
  snow90: 'rgba(255,255,255,0.9)', snow70: 'rgba(255,255,255,0.7)',
  snow15: 'rgba(255,255,255,0.15)', snow08: 'rgba(255,255,255,0.08)',
  success: '#34c759',
};

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif';
const W = 1080, H = 1920;

const SHADOW = {
  card: '0 4px 12px rgba(0,0,0,0.06)',
  pop: '0 12px 40px -8px rgba(0,0,0,0.15)',
  widget: '0 20px 60px -12px rgba(0,0,0,0.35)',
  cta: '0 4px 15px rgba(255,107,53,0.35)',
  ctaH: '0 6px 20px rgba(255,107,53,0.45)',
};

const lerp = (a, b, t) => a + (b - a) * t;
const clmp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

function ScreenLabel() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) root.setAttribute('data-screen-label', `t=${time.toFixed(1)}s`);
  }, [Math.floor(time)]);
  return null;
}

// ── Elegant top caption TikTok style (no card box) ──
// Counter pill (Day 1) + Big white title with text shadow + sub
function ElegantCaption({ counter, title, sub, opacity = 1, transform = '' }) {
  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, top: 130,
      fontFamily: FONT, color: '#fff',
      opacity, transform,
    }}>
      {counter && (
        <div style={{
          display: 'inline-block',
          padding: '8px 18px',
          background: 'rgba(255,107,53,0.95)',
          color: '#fff',
          borderRadius: 9999,
          fontSize: 24, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          marginBottom: 18,
          boxShadow: '0 6px 18px rgba(255,107,53,0.5)',
        }}>{counter}</div>
      )}
      <div style={{
        fontSize: 96, fontWeight: 800,
        letterSpacing: '-0.02em', lineHeight: 1.0,
        textShadow: '0 6px 24px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)',
      }}>{title}</div>
      {sub && (
        <div style={{
          marginTop: 18,
          fontSize: 34, fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.01em', lineHeight: 1.25,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>{sub}</div>
      )}
    </div>
  );
}

// Bottom elegant label (story-narrative position)
function StoryCaption({ counter, title, sub, opacity = 1, transform = '' }) {
  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, bottom: 380,
      fontFamily: FONT, color: '#fff',
      opacity, transform, textAlign: 'left',
    }}>
      {counter && (
        <div style={{
          display: 'inline-block',
          padding: '8px 18px',
          background: 'rgba(255,107,53,0.95)',
          color: '#fff',
          borderRadius: 9999,
          fontSize: 24, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          marginBottom: 18,
          boxShadow: '0 6px 18px rgba(255,107,53,0.5)',
        }}>{counter}</div>
      )}
      <div style={{
        fontSize: 96, fontWeight: 800,
        letterSpacing: '-0.02em', lineHeight: 0.98,
        textShadow: '0 6px 24px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.5)',
      }}>{title}</div>
      {sub && (
        <div style={{
          marginTop: 16,
          fontSize: 32, fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.01em', lineHeight: 1.3,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>{sub}</div>
      )}
    </div>
  );
}

// Progress segments top (story bar style TikTok)
function ProgressBar({ segments, current, time, segmentDuration, opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', top: 30, left: 60, right: 60,
      display: 'flex', gap: 8, opacity,
    }}>
      {Array.from({ length: segments }).map((_, i) => {
        let fill = 0;
        if (i < current) fill = 1;
        else if (i === current) fill = clmp(time / segmentDuration, 0, 1);
        return (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: 'rgba(255,255,255,0.3)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${fill * 100}%`, height: '100%',
              background: '#fff',
            }} />
          </div>
        );
      })}
    </div>
  );
}

// Section eyebrow chip
function SectionChip({ children, opacity = 1, transform = '' }) {
  return (
    <div style={{
      position: 'absolute', top: 80, left: 60,
      display: 'inline-block',
      padding: '10px 22px',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: 9999,
      fontFamily: FONT, fontSize: 24, fontWeight: 700,
      color: '#fff',
      textTransform: 'uppercase', letterSpacing: '0.2em',
      opacity, transform,
    }}>{children}</div>
  );
}

// Persistent brand watermark, small logo top-right
function BrandWatermark({ opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', top: 30, right: 60, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: opacity * 0.92,
      pointerEvents: 'none',
    }}>
      <img src="assets/logo-white.png" alt="" style={{
        height: 56, width: 'auto', objectFit: 'contain',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
      }} />
    </div>
  );
}

function FullBleedShot({ src, fit = 'center', filter = '', zoom = 1, opacity = 1 }) {
  return (
    <img src={src} alt="" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: fit, filter,
      transform: `scale(${zoom})`, opacity,
    }} />
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 1, Hook (0 to 3.5s) — testo CENTRO-BASSO
// "Entdecke deine perfekte Woche auf Kreta. Mit Bester Urlaub."
// ══════════════════════════════════════════════════════════════════════════
function Scene1_Hook() {
  return (
    <Sprite start={0} end={3.7}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const zoom = 1 + clmp(localTime / 3.5, 0, 1) * 0.10;
        const chipT = clmp((localTime - 0.2) / 0.4, 0, 1);
        const head1T = clmp((localTime - 0.5) / 0.5, 0, 1);
        const head2T = clmp((localTime - 1.1) / 0.5, 0, 1);
        const subT = clmp((localTime - 1.7) / 0.5, 0, 1);
        const fadeOut = localTime > 3.3 ? clmp((localTime - 3.3) / 0.4, 0, 1) : 0;
        return (
          <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut), overflow: 'hidden', background: BU.navy }}>
            <FullBleedShot src="assets/kreta.webp" zoom={zoom} />
            <BrandWatermark opacity={fadeIn} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.4) 0%, rgba(10,26,58,0) 30%, rgba(10,26,58,0) 50%, rgba(10,26,58,0.85) 100%)' }} />

            {/* Chip top */}
            <div style={{
              position: 'absolute', top: 100, left: 60,
              opacity: chipT,
              padding: '10px 22px',
              background: 'rgba(255,107,53,0.95)',
              borderRadius: 9999,
              fontFamily: FONT, fontSize: 24, fontWeight: 700, color: '#fff',
              textTransform: 'uppercase', letterSpacing: '0.2em',
              boxShadow: '0 6px 18px rgba(255,107,53,0.5)',
            }}>Bester Urlaub presents</div>

            {/* Headline CENTRO-BASSO */}
            <div style={{
              position: 'absolute', left: 60, right: 60, bottom: 360,
              fontFamily: FONT, color: '#fff',
              textShadow: '0 6px 24px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                fontSize: 110, fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 0.98,
                opacity: head1T,
                transform: `translateY(${lerp(-20, 0, Easing.easeOutBack(head1T))}px)`,
              }}>Deine perfekte<br/>
                <span style={{
                  color: BU.orange,
                  opacity: head2T,
                  display: 'inline-block',
                  transform: `translateY(${lerp(-20, 0, Easing.easeOutBack(head2T))}px)`,
                }}>Woche auf Kreta.</span>
              </div>
              <div style={{
                marginTop: 26,
                fontSize: 36, fontWeight: 500,
                color: 'rgba(255,255,255,0.92)',
                opacity: subT,
                transform: `translateY(${lerp(15, 0, Easing.easeOutCubic(subT))}px)`,
              }}>Flug, Hotel, Frühstück. Ab 449 €.</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 2, Cosa vedere (3.5 to 9.5s) — 4 cuts da 1.5s, testo elegante in alto
// ══════════════════════════════════════════════════════════════════════════
function Scene2_Places() {
  // FOTO COERENZA:
  // crete-coastline.jpg     = aerial Balos lagoon vero (turchese, sandbar)
  // crete-village-sunset.jpg = vicolo greco con bouganville + sunset
  // creta.webp              = costa con villaggi bianchi sul promontorio
  const SHOTS = [
    { src: 'assets/crete-coastline.jpg', counter: 'Tag 1', title: 'Balos Lagune', sub: 'Türkises Wasser, weißer Sand' },
    { src: 'assets/crete-village-sunset.jpg', counter: 'Tag 2', title: 'Chania Altstadt', sub: 'Gassen, Bougainvillea, Sonnenuntergang' },
    { src: 'assets/creta.webp', counter: 'Tag 3', title: 'Küstendörfer', sub: 'Weiße Häuser über dem Meer' },
  ];
  const SHOT_DURATION = 1.6;
  return (
    <Sprite start={3.5} end={8.5}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const fadeOut = localTime > 5.7 ? clmp((localTime - 5.7) / 0.4, 0, 1) : 0;
        const idx = Math.min(Math.floor(localTime / SHOT_DURATION), SHOTS.length - 1);
        const localShot = localTime - idx * SHOT_DURATION;
        const shot = SHOTS[idx];
        const shotProgress = clmp(localShot / SHOT_DURATION, 0, 1);
        const inOpacity = clmp(localShot / 0.28, 0, 1);
        const outOpacity = 1 - clmp((localShot - (SHOT_DURATION - 0.22)) / 0.22, 0, 1);
        const opacity = inOpacity * outOpacity;
        const zoom = 1.05 + shotProgress * 0.10;
        const labelT = clmp((localShot - 0.15) / 0.35, 0, 1);
        const labelY = lerp(20, 0, Easing.easeOutCubic(labelT));

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut), background: BU.navy, overflow: 'hidden' }}>
            <FullBleedShot src={shot.src} zoom={zoom} opacity={opacity} />
            <div style={{ position: 'absolute', inset: 0, opacity,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.55) 0%, rgba(10,26,58,0.08) 35%, rgba(10,26,58,0) 60%, rgba(10,26,58,0.65) 100%)' }} />

            <ProgressBar segments={SHOTS.length} current={idx} time={localShot} segmentDuration={SHOT_DURATION} opacity={fadeIn} />
            <BrandWatermark opacity={fadeIn} />
            <SectionChip opacity={fadeIn}>Was du siehst</SectionChip>

            <ElegantCaption
              counter={shot.counter}
              title={shot.title}
              sub={shot.sub}
              opacity={labelT * opacity}
              transform={`translateY(${labelY}px)`}
            />
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 3, Cosa mangiare (9.5 to 15.5s) — 4 foto DIVERSE 1.5s ognuna
// ══════════════════════════════════════════════════════════════════════════
function Scene3_Food() {
  const SHOTS = [
    { src: 'assets/food-dakos.jpg?v=ugc', title: 'Dakos', sub: 'Knuspriges Brot, Tomate, Feta' },
    { src: 'assets/food-sfakianopita.jpg?v=ugc', title: 'Sfakianopita', sub: 'Crêpe mit Käse und Honig' },
    { src: 'assets/food-apaki.jpg?v=ugc', title: 'Apaki', sub: 'Geräuchertes Schwein, würzig' },
  ];
  const SHOT_DURATION = 1.6;
  return (
    <Sprite start={8.4} end={13.4}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const fadeOut = localTime > 5.7 ? clmp((localTime - 5.7) / 0.4, 0, 1) : 0;
        const idx = Math.min(Math.floor(localTime / SHOT_DURATION), SHOTS.length - 1);
        const localShot = localTime - idx * SHOT_DURATION;
        const shot = SHOTS[idx];
        const shotProgress = clmp(localShot / SHOT_DURATION, 0, 1);
        const inOpacity = clmp(localShot / 0.28, 0, 1);
        const outOpacity = 1 - clmp((localShot - (SHOT_DURATION - 0.22)) / 0.22, 0, 1);
        const opacity = inOpacity * outOpacity;
        const zoom = 1.06 + shotProgress * 0.08;
        const labelT = clmp((localShot - 0.15) / 0.35, 0, 1);
        const labelY = lerp(20, 0, Easing.easeOutCubic(labelT));

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut), background: BU.navy, overflow: 'hidden' }}>
            <FullBleedShot src={shot.src} zoom={zoom} opacity={opacity} />
            <div style={{ position: 'absolute', inset: 0, opacity,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.55) 0%, rgba(10,26,58,0.08) 35%, rgba(10,26,58,0) 60%, rgba(10,26,58,0.7) 100%)' }} />

            <ProgressBar segments={SHOTS.length} current={idx} time={localShot} segmentDuration={SHOT_DURATION} opacity={fadeIn} />
            <BrandWatermark opacity={fadeIn} />
            <SectionChip opacity={fadeIn}>Was du isst</SectionChip>

            <StoryCaption
              title={shot.title}
              sub={shot.sub}
              opacity={labelT * opacity}
              transform={`translateY(${labelY}px)`}
            />
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 4, Hotel storia (15.5 to 21.5s) — 4 foto 1.5s con narrativa
// ══════════════════════════════════════════════════════════════════════════
function Scene4_Hotel() {
  // FOTO COERENZA VERIFICATA:
  // hotel-room.jpg = vista aerea Aphea Village exterior + logo
  // hotel-1.jpg    = piscina reale Aphea con lettini, vista mare
  // hotel-beach.jpg = soggiorno apartment con divani + kitchenette
  const SHOTS = [
    { src: 'assets/hotel-room.jpg', title: 'Aphea Village', sub: 'Klein, ruhig, drei Sterne' },
    { src: 'assets/hotel-1.jpg', title: 'Pool mit Meerblick', sub: 'Sonnenliegen frei am Morgen' },
    { src: 'assets/hotel-beach.jpg', title: 'Dein Apartment', sub: 'Wohnzimmer und Küchenzeile' },
  ];
  const SHOT_DURATION = 1.6;
  return (
    <Sprite start={13.3} end={18.3}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const fadeOut = localTime > 5.7 ? clmp((localTime - 5.7) / 0.4, 0, 1) : 0;
        const idx = Math.min(Math.floor(localTime / SHOT_DURATION), SHOTS.length - 1);
        const localShot = localTime - idx * SHOT_DURATION;
        const shot = SHOTS[idx];
        const inOpacity = clmp(localShot / 0.28, 0, 1);
        const outOpacity = 1 - clmp((localShot - (SHOT_DURATION - 0.22)) / 0.22, 0, 1);
        const opacity = inOpacity * outOpacity;
        const cardScale = lerp(0.94, 1, Easing.easeOutCubic(clmp(localShot / 0.4, 0, 1)));
        const labelT = clmp((localShot - 0.15) / 0.35, 0, 1);
        const labelY = lerp(20, 0, Easing.easeOutCubic(labelT));

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut), background: BU.navy, overflow: 'hidden' }}>
            {/* Background image full-bleed BLURRED dark */}
            <img src={shot.src} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transform: 'scale(1.15)',
              filter: 'brightness(0.35) blur(28px) saturate(1.1)',
            }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.55) 0%, rgba(10,26,58,0.55) 100%)' }} />

            <ProgressBar segments={SHOTS.length} current={idx} time={localShot} segmentDuration={SHOT_DURATION} opacity={fadeIn} />
            <BrandWatermark opacity={fadeIn} />
            <SectionChip opacity={fadeIn}>Dein Hotel</SectionChip>

            {/* Card image centered, photo SMALL (840×840) -> hides low-res */}
            <div style={{
              position: 'absolute', top: 250, left: 60, right: 60,
              borderRadius: 32, overflow: 'hidden',
              boxShadow: SHADOW.widget,
              transform: `scale(${cardScale})`,
              opacity, aspectRatio: '1 / 1',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <img src={shot.src} alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 50%)' }} />
              <div style={{
                position: 'absolute', bottom: 24, left: 30,
                fontFamily: FONT, fontSize: 22, fontWeight: 600, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>{`0${idx + 1} / 0${SHOTS.length}`}</div>
            </div>

            {/* Title + sub BELOW the card */}
            <div style={{
              position: 'absolute', left: 60, right: 60, bottom: 280,
              fontFamily: FONT, color: '#fff',
              textShadow: '0 4px 16px rgba(0,0,0,0.55)',
              opacity: labelT * opacity, transform: `translateY(${labelY}px)`,
            }}>
              <div style={{
                fontSize: 80, fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 1.05,
              }}>{shot.title}</div>
              <div style={{
                marginTop: 14,
                fontSize: 30, fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
              }}>{shot.sub}</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 5, Offer card TWO-PART (19.6 to 25.7s) — 6.1s
// TOP HALF: hotel card piccola centrata (continuità con Scene4 hotel)
// BOTTOM HALF: animazione prezzo dramatic
//   0.0  card hotel emerge top
//   0.7  "Super Angebot" pill
//   1.0  prezzo originale appare (random alto 2.187 €)
//   1.5  counter live decremento dramatic da 2.187 → 449 (1.5s easeOutExpo)
//   3.2  -50% badge pop
//   3.6  "pro Person" caption
//   4.5  CTA hint
//   5.5  hold
// ══════════════════════════════════════════════════════════════════════════
function Scene5_OfferCard() {
  // Random-looking high starting price (deterministic so animation stable)
  const ORIGINAL_PRICE = 2187;  // bei Reiseveranstalter
  const FINAL_PRICE = 449;
  return (
    <Sprite start={18.1} end={24.5}>
      {({ localTime }) => {
        const t = localTime;
        const fadeIn = clmp(t / 0.4, 0, 1);
        const fadeOut = t > 5.7 ? clmp((t - 5.7) / 0.4, 0, 1) : 0;
        const bgZoom = 1.05 + clmp(t / 6.1, 0, 1) * 0.05;

        // Hotel CARD top (continua da Scene4 visual)
        const cardT = clmp(t / 0.6, 0, 1);
        const cardEase = Easing.easeOutBack(cardT);
        const cardScale = lerp(0.88, 1, cardEase);
        const cardY = lerp(120, 0, cardEase);
        const cardOpacity = clmp(t / 0.4, 0, 1);

        // SUPER ANGEBOT pill (0.7s)
        const pillT = clmp((t - 0.7) / 0.4, 0, 1);
        const pillScale = lerp(0, 1, Easing.easeOutBack(pillT));
        const pillPulse = 1 + Math.sin(t * 3.5) * 0.025;

        // Original price (1.0s)
        const oldPriceT = clmp((t - 1.0) / 0.4, 0, 1);
        const oldPriceFadeIn = oldPriceT;
        const oldPriceScale = lerp(0.6, 1, Easing.easeOutBack(oldPriceT));

        // Counter animation (1.5s → 3.0s)
        const counterStart = 1.5;
        const counterDuration = 1.5;
        const counterT = clmp((t - counterStart) / counterDuration, 0, 1);
        const counterEased = Easing.easeOutExpo(counterT);
        const currentPrice = Math.round(lerp(ORIGINAL_PRICE, FINAL_PRICE, counterEased));

        // Strike line, draws DURING counter
        const strikeT = clmp((t - 1.7) / 0.6, 0, 1);

        // Counter shake when nearly done (jitter)
        const counterShake = (t > 1.5 && t < 3.0)
          ? Math.sin(t * 60) * (1 - counterT) * 4 : 0;

        // Final price color shift to BLUE happens when counter near end (t > 2.9)
        const isLanded = counterT > 0.96;
        const priceColor = isLanded ? BU.blue : BU.red;

        // -50% badge (3.0s)
        const badgeT = clmp((t - 3.0) / 0.4, 0, 1);
        const badgeScale = lerp(0, 1, Easing.easeOutBack(badgeT));
        const badgeRotate = lerp(-30, -10, Easing.easeOutBack(badgeT));

        // Pro Person tag (3.5s)
        const ppT = clmp((t - 3.5) / 0.4, 0, 1);

        // CTA hint (4.3s)
        const ctaT = clmp((t - 4.3) / 0.4, 0, 1);
        const ctaY = lerp(20, 0, Easing.easeOutCubic(ctaT));

        return (
          <div style={{
            position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut),
            background: BU.navy, overflow: 'hidden',
          }}>
            {/* Blurred background */}
            <img src="assets/crete-resort-pool.jpg" alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transform: `scale(${bgZoom})`,
              filter: 'brightness(0.32) blur(18px) saturate(1.1)',
            }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.72) 0%, rgba(10,26,58,0.88) 100%)' }} />

            <SectionChip opacity={fadeIn}>Das Angebot</SectionChip>
            <BrandWatermark opacity={fadeIn} />

            {/* ─── TOP HALF: HOTEL CARD (small centered, like Scene 4) ─── */}
            <div style={{
              position: 'absolute', top: 220, left: 60, right: 60,
              borderRadius: 32, overflow: 'hidden',
              boxShadow: '0 24px 60px -10px rgba(0,0,0,0.5)',
              transform: `translateY(${cardY}px) scale(${cardScale})`,
              opacity: cardOpacity, aspectRatio: '4 / 3',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src="assets/crete-resort-pool.jpg" alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%)' }} />
              {/* Hotel name overlay bottom */}
              <div style={{
                position: 'absolute', bottom: 30, left: 36, right: 36,
                fontFamily: FONT, color: '#fff',
              }}>
                <div style={{
                  fontSize: 18, fontWeight: 700, color: BU.orange,
                  textTransform: 'uppercase', letterSpacing: '0.22em',
                  marginBottom: 8, textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}>Pauschalreise · 7 Nächte</div>
                <div style={{
                  fontSize: 52, fontWeight: 800,
                  letterSpacing: '-0.02em', lineHeight: 1.05,
                  textShadow: '0 4px 16px rgba(0,0,0,0.55)',
                }}>Aphea Village</div>
                <div style={{
                  fontSize: 24, fontWeight: 500,
                  color: 'rgba(255,255,255,0.92)', marginTop: 8,
                  textShadow: '0 2px 6px rgba(0,0,0,0.45)',
                }}>Kolymbari, Kreta · ★ ★ ★ · Frühstück inklusive</div>
              </div>
              {/* -50% badge top-right */}
              <div style={{
                position: 'absolute', top: 30, right: 30,
                transform: `scale(${badgeScale}) rotate(${badgeRotate}deg)`,
                fontFamily: FONT, fontSize: 50, fontWeight: 900, color: '#fff',
                background: BU.red, padding: '20px 28px', borderRadius: 22,
                letterSpacing: '-0.02em', lineHeight: 1,
                boxShadow: '0 16px 38px rgba(255,51,51,0.6)',
                textAlign: 'center',
              }}>
                -80%
                <div style={{ fontSize: 16, marginTop: 6, letterSpacing: '0.16em', fontWeight: 700 }}>RABATT</div>
              </div>
            </div>

            {/* ─── BOTTOM HALF: PRICE ANIMATION ─── */}
            <div style={{
              position: 'absolute', left: 60, right: 60, bottom: 180,
              fontFamily: FONT, textAlign: 'center',
            }}>
              {/* Super Angebot pill */}
              <div style={{
                display: 'inline-block',
                transform: `scale(${pillScale * pillPulse})`,
                padding: '14px 32px',
                background: BU.red, color: '#fff',
                borderRadius: 9999,
                fontSize: 26, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.18em',
                boxShadow: '0 10px 28px rgba(255,51,51,0.6)',
                marginBottom: 30,
              }}>⚡ Super Angebot</div>

              {/* Original price text */}
              <div style={{
                opacity: oldPriceFadeIn,
                fontSize: 26, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase', letterSpacing: '0.22em',
                marginBottom: 12,
              }}>Normalpreis bei anderen</div>

              {/* PRICE COUNTER (single element, transforms over time) */}
              <div style={{
                position: 'relative', display: 'inline-block',
                transform: `scale(${oldPriceScale}) translateX(${counterShake}px)`,
                opacity: oldPriceFadeIn,
              }}>
                <div style={{
                  fontSize: 240, fontWeight: 900,
                  color: priceColor,
                  letterSpacing: '-0.04em', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: isLanded
                    ? '0 12px 50px rgba(46,117,250,0.65)'
                    : '0 8px 28px rgba(255,51,51,0.5)',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}>
                  {currentPrice.toLocaleString('de-DE')} €
                </div>
              </div>

              {/* "pro Person" sub */}
              <div style={{
                opacity: ppT,
                fontSize: 38, fontWeight: 700, color: BU.orange,
                letterSpacing: '-0.01em', marginTop: 16,
              }}>pro Person · alles inklusive</div>

              {/* CTA hint */}
              <div style={{
                opacity: ctaT, transform: `translateY(${ctaY}px)`,
                fontSize: 22, fontWeight: 600,
                color: 'rgba(255,255,255,0.75)', marginTop: 18,
              }}>↓ Klicke den Link unten</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 6, Urgency (26 to 28s)
// ══════════════════════════════════════════════════════════════════════════
function Scene6_Urgency() {
  return (
    <Sprite start={24.2} end={26.7}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const zoom = 1.05 + clmp(localTime / 2.2, 0, 1) * 0.08;
        const head1T = clmp(localTime / 0.4, 0, 1);
        const head2T = clmp((localTime - 0.5) / 0.4, 0, 1);
        const statT = clmp((localTime - 1.0) / 0.4, 0, 1);
        const fadeOut = localTime > 1.8 ? clmp((localTime - 1.8) / 0.4, 0, 1) : 0;
        return (
          <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * (1 - fadeOut), overflow: 'hidden', background: BU.navy }}>
            <FullBleedShot src="assets/crete-resort-pool.jpg" zoom={zoom} filter="brightness(0.55) saturate(1.1)" />
            <BrandWatermark opacity={fadeIn} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,26,58,0.65) 0%, rgba(10,26,58,0.2) 50%, rgba(10,26,58,0.85) 100%)' }} />

            <SectionChip opacity={fadeIn}>Limitiert</SectionChip>

            <div style={{
              position: 'absolute', left: 60, right: 60, top: 600,
              fontFamily: FONT, color: '#fff',
              textShadow: '0 6px 24px rgba(0,0,0,0.65)',
            }}>
              <div style={{
                fontSize: 110, fontWeight: 800,
                letterSpacing: '-0.02em', lineHeight: 0.95,
                opacity: head1T,
                transform: `translateY(${lerp(-20, 0, Easing.easeOutBack(head1T))}px)`,
              }}>Sichere dir</div>
              <div style={{
                fontSize: 110, fontWeight: 800,
                color: BU.blue,
                letterSpacing: '-0.02em', lineHeight: 0.95,
                marginTop: 8,
                opacity: head2T,
                transform: `translateY(${lerp(-20, 0, Easing.easeOutBack(head2T))}px)`,
              }}>deinen Platz.</div>
            </div>

            <div style={{
              position: 'absolute', bottom: 320, left: 60,
              opacity: statT, transform: `translateY(${lerp(20, 0, Easing.easeOutCubic(statT))}px) scale(${statT})`,
              background: '#fff', borderRadius: 22,
              padding: '20px 26px', boxShadow: SHADOW.pop,
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 72, fontWeight: 900,
                color: BU.orange, letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>50%</div>
              <div style={{
                fontFamily: FONT, fontSize: 24, fontWeight: 500,
                color: BU.ink65, lineHeight: 1.3,
              }}>Rabatt auf<br/>diese Reise</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 7, CTA + brand info finale (26.4 to 30s)
// Logo BIG + headline + CTA + phone + url + email + trust trio
// ══════════════════════════════════════════════════════════════════════════
function Scene7_CTA() {
  return (
    <Sprite start={26.4} end={30.0}>
      {({ localTime }) => {
        const fadeIn = clmp(localTime / 0.3, 0, 1);
        const logoScale = lerp(0.7, 1, Easing.easeOutBack(clmp(localTime / 0.45, 0, 1)));
        const headT = clmp((localTime - 0.3) / 0.4, 0, 1);
        const ctaT = clmp((localTime - 0.7) / 0.4, 0, 1);
        const phoneT = clmp((localTime - 1.1) / 0.4, 0, 1);
        const trustT = clmp((localTime - 1.5) / 0.4, 0, 1);
        const arrowBounce = Math.sin(localTime * 5.5) * 14;
        const ctaPulse = 1 + Math.sin(localTime * 6) * 0.035;

        return (
          <div style={{
            position: 'absolute', inset: 0, opacity: fadeIn,
            background: BU.navy,
            fontFamily: FONT,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 30%, rgba(46,117,250,0.22) 0%, transparent 60%)',
            }} />

            {/* Logo top BIG */}
            <div style={{
              position: 'absolute', top: 140, left: 60, right: 60,
              display: 'flex', justifyContent: 'center',
              transform: `scale(${logoScale})`,
            }}>
              <img src="assets/logo-white.png" alt="Bester Urlaub" style={{
                width: 480, height: 'auto', objectFit: 'contain',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.45))',
              }} />
            </div>

            {/* Headline */}
            <div style={{
              position: 'absolute', top: 380, left: 60, right: 60,
              opacity: headT,
              transform: `translateY(${lerp(20, 0, Easing.easeOutCubic(headT))}px)`,
              fontSize: 60, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 1.1, textAlign: 'center',
            }}>
              Kreta, sieben Tage<br/>
              <span style={{ color: BU.orange }}>ab 449 €</span>
            </div>

            {/* CTA box */}
            <div style={{
              position: 'absolute', top: 580, left: 60, right: 60,
              display: 'flex', justifyContent: 'center',
            }}>
              <div style={{
                opacity: ctaT,
                transform: `scale(${ctaPulse})`,
                padding: '24px 44px',
                background: BU.orange, color: '#fff',
                fontSize: 38, fontWeight: 800,
                borderRadius: 18,
                boxShadow: SHADOW.ctaH,
                textAlign: 'center', letterSpacing: '-0.5',
              }}>
                Klicke den Link unten
              </div>
            </div>

            <div style={{
              position: 'absolute', top: 690, left: 60, right: 60,
              opacity: ctaT, fontSize: 24, fontWeight: 600,
              color: 'rgba(255,255,255,0.78)', textAlign: 'center',
            }}>für unser ganzes Angebot</div>

            {/* Animated arrow */}
            <div style={{
              position: 'absolute', top: 770, left: '50%',
              transform: `translateX(-50%) translateY(${arrowBounce}px)`,
              opacity: ctaT,
              fontSize: 70, color: BU.orange,
              filter: 'drop-shadow(0 4px 12px rgba(255,107,53,0.55))',
              lineHeight: 1,
            }}>↓</div>

            {/* Brand contact panel */}
            <div style={{
              position: 'absolute', top: 950, left: 60, right: 60,
              opacity: phoneT,
              transform: `translateY(${lerp(30, 0, Easing.easeOutCubic(phoneT))}px)`,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
              padding: '28px 32px',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              {/* URL */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 18,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: BU.orange,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 32, fontWeight: 900, color: '#fff',
                }}>🌐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Website</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginTop: 2 }}>besterurlaub.com</div>
                </div>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 18,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: BU.blue,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 32, fontWeight: 900, color: '#fff',
                }}>📞</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Persönliche Beratung</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>+49 176 82405507</div>
                </div>
              </div>

              {/* Email */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 18,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 28, fontWeight: 900, color: '#fff',
                }}>✉️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Anfrage per Mail</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginTop: 2 }}>info@besterurlaub.com</div>
                </div>
              </div>
            </div>

            {/* Trust trio at bottom */}
            <div style={{
              position: 'absolute', bottom: 100, left: 60, right: 60,
              opacity: trustT,
              transform: `translateY(${lerp(20, 0, Easing.easeOutCubic(trustT))}px)`,
              display: 'flex', justifyContent: 'space-between', gap: 12,
            }}>
              {[
                ['24h', 'Storno'],
                ['Best', 'Preis'],
                ['24/7', 'Support'],
              ].map(([n, t], i) => (
                <div key={i} style={{
                  flex: 1, padding: '14px 8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: BU.orange, lineHeight: 1, letterSpacing: '-0.01em' }}>{n}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 6, letterSpacing: '0.05em' }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}
