// scenes3.jsx — Trust row + final CTA

// ══════════════════════════════════════════════════════════════════════════
// SCENE 4 — Trust row (13.5 – 16.5s)
// Three circles pop in: 24h · 60% · Bestpreis
// ══════════════════════════════════════════════════════════════════════════
function Scene4_Trust() {
  return (
    <Sprite start={13.5} end={16.7}>
      {({ localTime, duration }) => {
        const bgOpacity = clmp(localTime / 0.3, 0, 1) * (1 - clmp((localTime - (duration - 0.4)) / 0.4, 0, 1));

        const items = [
          { big: '24h', small: 'vor Abflug\nstornieren', color: BU.blue, delay: 0.3 },
          { big: '60%', small: 'bis zu\nRabatt', color: BU.orange, delay: 0.6 },
          { big: '✓', small: 'Bestpreis-\nGarantie', color: BU.blue, delay: 0.9, isCheck: true },
        ];

        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: BU.navy,
            opacity: bgOpacity,
          }}>
            {/* Subtle radial accents */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.2,
              background: `radial-gradient(circle at 30% 20%, ${BU.blue} 0%, transparent 45%),
                           radial-gradient(circle at 70% 80%, ${BU.orange} 0%, transparent 45%)`,
            }} />

            {/* Eyebrow */}
            <div style={{
              position: 'absolute', top: 280, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: BU.orange,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: clmp((localTime - 0.1) / 0.3, 0, 1),
            }}>
              Sicher buchen
            </div>

            {/* Heading */}
            <div style={{
              position: 'absolute', top: 360, left: 60, right: 60,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 90,
              fontWeight: 800,
              color: BU.white,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              opacity: clmp((localTime - 0.2) / 0.3, 0, 1),
              transform: `translateY(${(1 - clmp((localTime - 0.2) / 0.3, 0, 1)) * 20}px)`,
            }}>
              Entspannt buchen.<br/>
              <span style={{ color: BU.blue }}>Ohne Risiko.</span>
            </div>

            {/* Trust circles stacked */}
            <div style={{
              position: 'absolute',
              top: 700, left: 0, right: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
            }}>
              {items.map((it, i) => {
                const t = clmp((localTime - it.delay) / 0.5, 0, 1);
                const s = Easing.easeOutBack(t);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 40,
                    transform: `translateX(${(1 - s) * (i % 2 === 0 ? -120 : 120)}px)`,
                    opacity: t,
                  }}>
                    {/* Circle with big value */}
                    <div style={{
                      width: 220, height: 220, borderRadius: 110,
                      background: BU.white,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 20px 60px -12px rgba(0,0,0,0.45)',
                      flexShrink: 0,
                      transform: `scale(${s})`,
                    }}>
                      <div style={{
                        fontFamily: FONT,
                        fontSize: it.isCheck ? 120 : 82,
                        fontWeight: 900,
                        color: it.color,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                      }}>{it.big}</div>
                    </div>
                    {/* Label */}
                    <div style={{
                      fontFamily: FONT,
                      fontSize: 44,
                      fontWeight: 700,
                      color: BU.white,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      whiteSpace: 'pre-line',
                    }}>{it.small}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 5 — Final CTA (16.5 – 20.0s)
// Logo + tagline + big orange CTA + "@besterurlaub"
// ══════════════════════════════════════════════════════════════════════════
function Scene5_CTA() {
  return (
    <Sprite start={16.5} end={20.0}>
      {({ localTime, duration }) => {
        const IN = 0.5;
        const bgOpacity = clmp(localTime / 0.3, 0, 1);

        // Logo scale-in
        const logoT = clmp(localTime / IN, 0, 1);
        const logoScale = Easing.easeOutBack(logoT);

        // Tagline
        const taglineT = clmp((localTime - 0.4) / 0.4, 0, 1);

        // Destination carousel behind — three photos slowly pan
        const carouselT = localTime / duration;

        // CTA
        const ctaT = clmp((localTime - 0.8) / 0.4, 0, 1);
        const ctaScale = Easing.easeOutBack(ctaT);

        // Handle pulse
        const handlePulse = Math.sin(localTime * 3) * 0.5 + 0.5;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: BU.navy,
            opacity: bgOpacity,
            overflow: 'hidden',
          }}>
            {/* Photo backdrop — mosaic */}
            <PhotoMosaic t={carouselT} />

            {/* Dark overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg,
                rgba(10,26,58,0.82) 0%,
                rgba(10,26,58,0.70) 50%,
                rgba(10,26,58,0.95) 100%)`,
            }} />

            {/* Radial accents */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.3,
              background: `radial-gradient(circle at 50% 40%, ${BU.blue} 0%, transparent 50%)`,
            }} />

            {/* Bester Urlaub wordmark (real logo) */}
            <div style={{
              position: 'absolute',
              top: 440, left: 80, right: 80,
              textAlign: 'center',
              transform: `scale(${logoScale})`,
              opacity: logoT,
            }}>
              <img
                src="/promo/assets/logo-white.png"
                alt="Bester Urlaub"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 820,
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.35))',
                }}
              />
            </div>

            {/* Tagline */}
            <div style={{
              position: 'absolute',
              top: 780, left: 60, right: 60,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 600,
              color: BU.white,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              opacity: taglineT,
              transform: `translateY(${(1 - taglineT) * 16}px)`,
            }}>
              Dein nächster Urlaub<br/>
              <span style={{ color: BU.blue }}>ist einen Klick entfernt.</span>
            </div>

            {/* CTA button */}
            <div style={{
              position: 'absolute',
              bottom: 480, left: 80, right: 80,
              transform: `scale(${ctaScale})`,
              opacity: ctaT,
            }}>
              <div style={{
                padding: '36px 40px',
                borderRadius: 22,
                background: BU.orange,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 52,
                fontWeight: 700,
                color: BU.white,
                letterSpacing: '-0.02em',
                boxShadow: `0 ${8 + handlePulse * 8}px ${25 + handlePulse * 15}px rgba(255,107,53,${0.45 + handlePulse * 0.15})`,
              }}>
                Jetzt Deals sichern
              </div>
            </div>

            {/* Handle */}
            <div style={{
              position: 'absolute',
              bottom: 280, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 700,
              color: BU.white,
              letterSpacing: '-0.01em',
              opacity: clmp((localTime - 1.2) / 0.3, 0, 1),
            }}>
              @bester.urlaub
            </div>

            {/* Tiny trust line */}
            <div style={{
              position: 'absolute',
              bottom: 180, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: clmp((localTime - 1.4) / 0.3, 0, 1),
            }}>
              Buchung über CHECK24 · Bestpreis Garantie
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function PhotoMosaic({ t }) {
  // Six tiles that slowly pan upward
  const photos = [
    '/promo/assets/mallorca.webp',
    '/promo/assets/santorini.webp',
    '/promo/assets/sansibar.webp',
    '/promo/assets/antalya.webp',
    '/promo/assets/hurghada.webp',
    '/promo/assets/thailandia.webp',
  ];
  const shift = -t * 120;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'repeat(3, 1fr)',
      transform: `translateY(${shift}px) scale(1.08)`,
      gap: 4,
    }}>
      {photos.map((p, i) => (
        <div key={i} style={{
          overflow: 'hidden',
        }}>
          <img src={p} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${1.05 + (i % 2) * 0.05})`,
          }} />
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PERSISTENT UI — TikTok-style overlay (top safe area, bottom chrome) ──────
// ══════════════════════════════════════════════════════════════════════════
function TikTokChrome() {
  return (
    <>
      {/* Top safe-area gradient so status bar stays legible */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 110,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      {/* Status bar (iOS) */}
      <div style={{
        position: 'absolute', top: 26, left: 50, right: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 11,
        fontFamily: FONT,
        fontSize: 30, fontWeight: 600, color: BU.white,
        letterSpacing: '-0.01em',
      }}>
        <div>9:41</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* signal */}
          <svg width="30" height="18" viewBox="0 0 30 18"><g fill="#fff">
            <rect x="0" y="12" width="4" height="6" rx="1"/>
            <rect x="6" y="8" width="4" height="10" rx="1"/>
            <rect x="12" y="4" width="4" height="14" rx="1"/>
            <rect x="18" y="0" width="4" height="18" rx="1"/>
          </g></svg>
          {/* battery */}
          <svg width="34" height="18" viewBox="0 0 34 18">
            <rect x="0.5" y="0.5" width="28" height="17" rx="4" fill="none" stroke="#fff" strokeWidth="1"/>
            <rect x="2.5" y="2.5" width="24" height="13" rx="2" fill="#fff"/>
            <rect x="30" y="5" width="3" height="8" rx="1.5" fill="#fff"/>
          </svg>
        </div>
      </div>

      {/* Right action rail — like TikTok */}
      <div style={{
        position: 'absolute',
        right: 28, bottom: 220,
        display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center',
        zIndex: 11,
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: 48,
            background: BU.navy,
            border: '3px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src="/promo/assets/symbol.svg" alt="" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
          </div>
          <div style={{
            position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)',
            width: 36, height: 36, borderRadius: 18,
            background: BU.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid transparent',
            fontFamily: FONT, fontSize: 28, fontWeight: 900, color: BU.white, lineHeight: 1,
            paddingBottom: 4,
          }}>+</div>
        </div>
        <RailIcon icon="heart" label="124.5K" />
        <RailIcon icon="comment" label="2.3K" />
        <RailIcon icon="bookmark" label="9.8K" />
        <RailIcon icon="share" label="Teilen" />
      </div>

      {/* Bottom caption + username */}
      <div style={{
        position: 'absolute',
        left: 40, right: 180, bottom: 180,
        zIndex: 11,
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 38, fontWeight: 700,
          color: BU.white, letterSpacing: '-0.01em',
          marginBottom: 14,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          @bester.urlaub
        </div>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          Santorini für 549 € 😮‍💨 Link in Bio ✈️
          <div style={{ color: BU.blue, fontWeight: 600, marginTop: 4 }}>
            #urlaub2026 #santorini #lastminute #pauschalreise
          </div>
        </div>
      </div>

      {/* Bottom TikTok nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 140,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        zIndex: 10,
      }} />
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 11, padding: '0 40px',
      }}>
        {['Startseite', 'Freunde', '', 'Posteingang', 'Profil'].map((l, i) => (
          <div key={i} style={{
            fontFamily: FONT, fontSize: 22, fontWeight: 600,
            color: i === 0 ? '#fff' : 'rgba(255,255,255,0.7)',
            textAlign: 'center',
          }}>
            {i === 2 ? (
              <div style={{
                width: 72, height: 48, borderRadius: 10,
                background: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #25F4EE 0%, transparent 50%, #FE2C55 100%)', opacity: 0.8 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 32, fontWeight: 900, color: '#000' }}>+</div>
              </div>
            ) : l}
          </div>
        ))}
      </div>

      {/* Bottom-right music disc */}
      <div style={{
        position: 'absolute',
        right: 28, bottom: 80,
        width: 80, height: 80, borderRadius: 40,
        background: 'radial-gradient(circle at center, #333 30%, #111 31%, #111 60%, #333 61%)',
        border: '3px solid #fff',
        zIndex: 11,
        animation: 'bu-spin 3s linear infinite',
      }} />
      <style>{`@keyframes bu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function RailIcon({ icon, label }) {
  const iconSvg = {
    heart: <svg width="52" height="52" viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-7-4.5-9.5-9C.8 9 2 5 6 5c2 0 3.5 1 4 2 .5-1 2-2 4-2 4 0 5.2 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" stroke="#fff" strokeWidth="1.5"/></svg>,
    comment: <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#fff" stroke="#fff"/></svg>,
    bookmark: <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    share: <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {iconSvg[icon]}
      <div style={{
        fontFamily: FONT, fontSize: 22, fontWeight: 600,
        color: '#fff', letterSpacing: '-0.01em',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
      }}>{label}</div>
    </div>
  );
}

// ── Progress bar at top (TikTok style) ─────────────────────────────────────
function ProgressBar({ duration }) {
  const time = useTime();
  const pct = clmp(time / duration, 0, 1) * 100;
  return (
    <div style={{
      position: 'absolute',
      top: 100, left: 40, right: 40,
      height: 4,
      background: 'rgba(255,255,255,0.25)',
      borderRadius: 2,
      zIndex: 11,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: '#fff',
        borderRadius: 2,
      }} />
    </div>
  );
}

Object.assign(window, { Scene4_Trust, Scene5_CTA, TikTokChrome, ProgressBar });
