// scenes2.jsx — Destination reel + deal card + CTA

// ══════════════════════════════════════════════════════════════════════════
// SCENE 2 — Destination reel (2.8 – 9.0s)
// Three destinations slide up one after another, each with a caption.
// Between scenes there's a brief transition via vertical swipe.
// ══════════════════════════════════════════════════════════════════════════
function Scene2_Reel() {
  const destinations = [
    { src: 'assets/mallorca.webp',  name: 'Mallorca',   country: 'Spanien',    vibe: 'All Inclusive · 7 Nächte' },
    { src: 'assets/santorini.webp', name: 'Santorini',  country: 'Griechenland', vibe: 'Caldera-Blick · 5 Nächte' },
    { src: 'assets/sansibar.webp',  name: 'Sansibar',   country: 'Tansania',   vibe: 'Traumstrand · 10 Nächte' },
  ];
  const DUR = 1.9; // each card on screen
  const START = 2.8;
  return destinations.map((d, i) => (
    <Sprite key={i} start={START + i * DUR} end={START + (i + 1) * DUR + 0.4}>
      <DestCard {...d} index={i} total={destinations.length} />
    </Sprite>
  ));
}

function DestCard({ src, name, country, vibe, index }) {
  const { localTime, duration } = useSprite();
  const IN = 0.4, OUT = 0.4;
  const hold = duration - IN - OUT;

  // Slide up on entry, slide up off on exit
  let y = 0;
  let opacity = 1;
  let imgScale = 1;

  if (localTime < IN) {
    const t = Easing.easeOutCubic(clmp(localTime / IN, 0, 1));
    y = (1 - t) * 200;
    opacity = t;
    imgScale = 1.08 - t * 0.05;
  } else if (localTime > IN + hold) {
    const t = Easing.easeInCubic(clmp((localTime - IN - hold) / OUT, 0, 1));
    y = -t * 180;
    opacity = 1 - t;
    imgScale = 1.03 + t * 0.05;
  } else {
    // Ken-Burns zoom during hold
    const h = (localTime - IN) / hold;
    imgScale = 1.03 + h * 0.08;
  }

  // Gentle parallax on caption
  const capShift = Math.sin(localTime * 1.2) * 4;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translateY(${y}px)`,
      opacity,
      background: BU.navy,
    }}>
      {/* Photo */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
      }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${imgScale})`,
          transformOrigin: '50% 55%',
          transition: 'none',
        }} />
        {/* Navy protection overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top,
            rgba(10,26,58,0.85) 0%,
            rgba(10,26,58,0.25) 40%,
            rgba(10,26,58,0.15) 60%,
            rgba(10,26,58,0.55) 100%)`,
        }} />
      </div>

      {/* Top eyebrow — reel counter */}
      <div style={{
        position: 'absolute', top: 120, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: BU.orange,
        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
      }}>
        Top-Reiseziele · 2026
      </div>

      {/* Country tag — top */}
      <div style={{
        position: 'absolute', top: 200, left: '50%',
        transform: `translateX(-50%) translateY(${-capShift * 0.4}px)`,
        padding: '12px 28px',
        borderRadius: 9999,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
        fontFamily: FONT,
        fontSize: 28,
        fontWeight: 600,
        color: BU.white,
        letterSpacing: '0.08em',
      }}>
        {country}
      </div>

      {/* Big destination name */}
      <div style={{
        position: 'absolute',
        bottom: 440, left: 60, right: 60,
        fontFamily: FONT,
        fontSize: 200,
        fontWeight: 900,
        color: BU.white,
        letterSpacing: '-0.05em',
        lineHeight: 0.95,
        textShadow: '0 6px 30px rgba(0,0,0,0.45)',
        transform: `translateY(${capShift}px)`,
      }}>
        {name}
      </div>

      {/* Vibe / detail line */}
      <div style={{
        position: 'absolute',
        bottom: 360, left: 60, right: 60,
        fontFamily: FONT,
        fontSize: 38,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '-0.01em',
        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
      }}>
        {vibe}
      </div>

      {/* "ab XXX €" pill */}
      <div style={{
        position: 'absolute',
        bottom: 220, left: 60,
        display: 'flex', alignItems: 'baseline', gap: 16,
        padding: '20px 36px',
        borderRadius: 24,
        background: BU.white,
        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.45)',
      }}>
        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 500, color: BU.ink70 }}>ab</div>
        <div style={{
          fontFamily: FONT,
          fontSize: 86,
          fontWeight: 900,
          color: BU.blue,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>
          {[399, 549, 1299][index]} €
        </div>
        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 500, color: BU.ink70 }}>p.P.</div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 14,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === index ? 44 : 14, height: 8,
            borderRadius: 4,
            background: i === index ? BU.white : 'rgba(255,255,255,0.35)',
            transition: 'all 300ms',
          }} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 3 — Deal card pop (9.0 – 13.5s)
// A realistic BU offer card slides in, price drops from crossed-out to blue
// ══════════════════════════════════════════════════════════════════════════
function Scene3_Deal() {
  return (
    <Sprite start={9.0} end={13.8}>
      {({ localTime, duration }) => {
        // Full bleed navy background with radial accents
        const IN = 0.5, OUT = 0.5;
        const bgFade = clmp(localTime / 0.4, 0, 1) * (1 - clmp((localTime - (duration - OUT)) / OUT, 0, 1));
        const cardY = localTime < IN
          ? (1 - Easing.easeOutBack(clmp(localTime / IN, 0, 1))) * 400
          : localTime > duration - OUT
            ? -Easing.easeInCubic(clmp((localTime - (duration - OUT)) / OUT, 0, 1)) * 200
            : 0;
        const cardO = localTime < IN
          ? Easing.easeOutCubic(clmp(localTime / IN, 0, 1))
          : localTime > duration - OUT
            ? 1 - clmp((localTime - (duration - OUT)) / OUT, 0, 1)
            : 1;

        // Price drop animation: 1.2 → 2.2s, €1299 counts down to €549
        const priceT = clmp((localTime - 1.2) / 1.0, 0, 1);
        const fromPrice = 1299;
        const toPrice = 549;
        const currentPrice = Math.round(lerp(fromPrice, toPrice, Easing.easeOutCubic(priceT)));

        // Strike-through appears right after the drop lands
        const strikeVisible = localTime > 2.3;

        // Badge flash — appears at 1.2s with a little pop
        const badgeT = clmp((localTime - 1.2) / 0.4, 0, 1);
        const badgeScale = Easing.easeOutBack(badgeT);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, ${BU.navy} 0%, #0f2454 50%, ${BU.navy} 100%)`,
            opacity: bgFade,
          }}>
            {/* Radial accent decoration (from guide) */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.25,
              background: `radial-gradient(circle at 20% 30%, ${BU.blue} 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, ${BU.orange} 0%, transparent 50%)`,
            }} />

            {/* Eyebrow */}
            <div style={{
              position: 'absolute', top: 160, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 700,
              color: BU.orange,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: clmp((localTime - 0.3) / 0.3, 0, 1),
            }}>
              Nur heute
            </div>

            {/* Heading */}
            <div style={{
              position: 'absolute', top: 230, left: 60, right: 60,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 86,
              fontWeight: 800,
              color: BU.white,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              opacity: clmp((localTime - 0.4) / 0.3, 0, 1),
              transform: `translateY(${(1 - clmp((localTime - 0.4) / 0.3, 0, 1)) * 20}px)`,
            }}>
              Das Schnäppchen,<br/>
              <span style={{ color: BU.blue }}>das alle wollen.</span>
            </div>

            {/* Offer card */}
            <div style={{
              position: 'absolute',
              left: 60, right: 60,
              top: 520,
              borderRadius: 32,
              background: BU.white,
              overflow: 'hidden',
              boxShadow: '0 30px 80px -12px rgba(0,0,0,0.55)',
              transform: `translateY(${cardY}px)`,
              opacity: cardO,
            }}>
              {/* Image header */}
              <div style={{
                position: 'relative', height: 560,
                overflow: 'hidden',
              }}>
                <img src="assets/santorini.webp" alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: `scale(${1.02 + (localTime / duration) * 0.05})`,
                }} />
                {/* Scrim */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 40%, rgba(0,0,0,0.2))',
                }} />

                {/* Red urgency badge */}
                <div style={{
                  position: 'absolute',
                  top: 24, left: 24,
                  padding: '12px 22px',
                  borderRadius: 9999,
                  background: BU.red,
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 700,
                  color: BU.white,
                  letterSpacing: '0.02em',
                  transform: `scale(${badgeScale})`,
                  opacity: badgeT,
                  boxShadow: '0 8px 20px rgba(255,51,51,0.4)',
                }}>
                  58% günstiger · nur heute
                </div>

                {/* Destination name at bottom-left */}
                <div style={{
                  position: 'absolute',
                  bottom: 28, left: 32, right: 32,
                }}>
                  <div style={{
                    fontFamily: FONT, fontSize: 26, fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    marginBottom: 8,
                  }}>Griechenland · 5 Nächte</div>
                  <div style={{
                    fontFamily: FONT, fontSize: 72, fontWeight: 800,
                    color: BU.white, letterSpacing: '-0.03em', lineHeight: 1,
                    textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  }}>Santorini</div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '36px 40px 40px' }}>
                <div style={{
                  fontFamily: FONT, fontSize: 28, fontWeight: 600,
                  color: BU.navy, marginBottom: 6,
                }}>Hotel Anastasia Princess ★★★★</div>
                <div style={{
                  fontFamily: FONT, fontSize: 22, fontWeight: 500,
                  color: BU.ink70, marginBottom: 30,
                }}>Flug · Transfer · Halbpension inkl.</div>

                {/* Price row */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 500, color: BU.ink70 }}>ab</div>
                    <div style={{
                      fontFamily: FONT,
                      fontSize: 110,
                      fontWeight: 900,
                      color: BU.blue,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {currentPrice} €
                    </div>
                  </div>
                  <div style={{
                    position: 'relative',
                    fontFamily: FONT,
                    fontSize: 44,
                    fontWeight: 500,
                    color: BU.ink50,
                    opacity: strikeVisible ? 1 : 0,
                    transition: 'opacity 240ms',
                    marginBottom: 12,
                    marginLeft: 4,
                  }}>
                    <span style={{ textDecoration: 'line-through' }}>1299 €</span>
                  </div>
                </div>
                <div style={{
                  fontFamily: FONT, fontSize: 22, fontWeight: 500,
                  color: BU.ink70, marginTop: 8,
                }}>pro Person · inkl. Gebühren</div>

                {/* CTA button */}
                <div style={{
                  marginTop: 36,
                  padding: '28px 40px',
                  borderRadius: 18,
                  background: BU.orange,
                  textAlign: 'center',
                  fontFamily: FONT,
                  fontSize: 38,
                  fontWeight: 700,
                  color: BU.white,
                  letterSpacing: '-0.01em',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.45)',
                  transform: `scale(${1 + Math.sin(localTime * 4) * 0.015})`,
                }}>
                  Zum Angebot →
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, { Scene2_Reel, Scene3_Deal });
