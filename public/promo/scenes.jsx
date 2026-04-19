// scenes.jsx — Bester Urlaub 9:16 TikTok ad
// Brand tokens
const BU = {
  blue: '#2e75fa',
  navy: '#0a1a3a',
  navyDark: '#06122b',
  orange: '#ff6b35',
  orangeDark: '#e55a2b',
  red: '#ff3333',
  white: '#ffffff',
  ink70: 'rgba(10,26,58,0.70)',
  ink50: 'rgba(10,26,58,0.50)',
  ink10: 'rgba(10,26,58,0.10)',
  ink06: 'rgba(10,26,58,0.06)',
};

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif';

// Canvas: 1080 x 1920 (9:16)
const W = 1080, H = 1920;

// ── Helper: linear interpolate clamped ────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clmp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// ── Utility: screen-label sync ────────────────────────────────────────────
function ScreenLabel() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) root.setAttribute('data-screen-label', `t=${time.toFixed(1)}s`);
  }, [Math.floor(time)]);
  return null;
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 1 — "Still at the desk" (0.0 – 2.8s)
// A fake calendar/office UI shakes slightly, greys out. Text hook hits.
// ══════════════════════════════════════════════════════════════════════════
function Scene1_Desk() {
  return (
    <Sprite start={0} end={3.0}>
      {({ localTime, progress }) => {
        // Background desaturates as we move away from desk reality
        const desat = clmp(localTime / 2.5, 0, 1);
        // Gentle zoom in
        const zoom = 1 + clmp(localTime / 3, 0, 1) * 0.08;
        // Fade out at end
        const fadeOut = localTime > 2.4 ? clmp((localTime - 2.4) / 0.6, 0, 1) : 0;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#eef1f6',
            filter: `saturate(${1 - desat * 0.7}) brightness(${1 - desat * 0.15})`,
            transform: `scale(${zoom})`,
            opacity: 1 - fadeOut,
          }}>
            {/* Fake office calendar grid */}
            <CalendarBG localTime={localTime} />

            {/* Vignette */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,26,58,0.35) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Hook text — appears at 1.0s */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, top: 420,
              textAlign: 'center',
              opacity: clmp((localTime - 1.0) / 0.35, 0, 1),
              transform: `translateY(${(1 - clmp((localTime - 1.0) / 0.35, 0, 1)) * 20}px)`,
            }}>
              <div style={{
                fontFamily: FONT,
                fontSize: 48,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                marginBottom: 32,
              }}>
                Montag, 9:47 Uhr
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: 140,
                fontWeight: 900,
                color: BU.white,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                padding: '0 60px',
              }}>
                Genug<br/>gearbeitet.
              </div>
            </div>

            {/* Finger tap pulse at bottom to suggest scroll away */}
            <ScrollHint localTime={localTime} />
          </div>
        );
      }}
    </Sprite>
  );
}

function CalendarBG({ localTime }) {
  // Offset grid wiggles on mount to feel anxious
  const wiggle = Math.sin(localTime * 3) * 2;
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const events = [
    { day: 0, start: 0, dur: 2, title: 'Standup', color: '#8a9bb8' },
    { day: 0, start: 2, dur: 3, title: 'Q2 Review', color: '#b39a7a' },
    { day: 1, start: 1, dur: 2, title: 'Sync', color: '#8a9bb8' },
    { day: 1, start: 3, dur: 1, title: 'Lunch', color: '#9fb08a' },
    { day: 1, start: 5, dur: 3, title: 'Budget Call', color: '#c28a8a' },
    { day: 2, start: 0, dur: 4, title: 'Planning', color: '#8a9bb8' },
    { day: 2, start: 5, dur: 2, title: 'Review', color: '#b39a7a' },
    { day: 3, start: 1, dur: 1, title: 'Intro', color: '#8a9bb8' },
    { day: 3, start: 3, dur: 4, title: 'Workshop', color: '#b39a7a' },
    { day: 4, start: 0, dur: 2, title: 'Team', color: '#8a9bb8' },
    { day: 4, start: 3, dur: 2, title: 'Review', color: '#c28a8a' },
    { day: 4, start: 6, dur: 2, title: 'Retro', color: '#8a9bb8' },
  ];
  const cols = 5; // mon-fri
  const gridLeft = 180;
  const gridTop = 260;
  const cellW = 148;
  const cellH = 90;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translate(${wiggle}px, 0)`,
    }}>
      {/* Header bar */}
      <div style={{
        position: 'absolute', top: 80, left: 80, right: 80,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#c7d0de' }} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: '#3a4a68' }}>Kalender</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 28, color: '#7a8299' }}>KW 16 · April</div>
      </div>

      {/* Day headers */}
      <div style={{ position: 'absolute', top: 180, left: gridLeft, display: 'flex' }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((d, i) => (
          <div key={i} style={{
            width: cellW, textAlign: 'center',
            fontFamily: FONT, fontSize: 28, fontWeight: 600,
            color: i === 0 ? '#c22' : '#7a8299',
          }}>
            {d} <span style={{ opacity: 0.6, fontWeight: 400 }}>{13 + i}</span>
          </div>
        ))}
      </div>

      {/* Time labels */}
      {times.map((t, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 80, top: gridTop + i * cellH,
          fontFamily: FONT, fontSize: 22, color: '#9aa3b8',
        }}>{t}</div>
      ))}

      {/* Grid lines */}
      {times.map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: gridLeft, top: gridTop + i * cellH,
          width: cellW * cols, height: 1,
          background: 'rgba(10,26,58,0.08)',
        }} />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: gridLeft + i * cellW, top: gridTop,
          width: 1, height: cellH * (times.length),
          background: 'rgba(10,26,58,0.08)',
        }} />
      ))}

      {/* Events */}
      {events.map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: gridLeft + e.day * cellW + 6,
          top: gridTop + e.start * cellH + 4,
          width: cellW - 12,
          height: e.dur * cellH - 8,
          background: e.color,
          borderRadius: 6,
          padding: '8px 10px',
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.95)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          {e.title}
        </div>
      ))}

      {/* "Now" red line */}
      <div style={{
        position: 'absolute',
        left: gridLeft, top: gridTop + 0.78 * cellH,
        width: cellW, height: 2,
        background: '#e14a4a',
      }}>
        <div style={{
          position: 'absolute', left: -5, top: -4,
          width: 10, height: 10, borderRadius: 5, background: '#e14a4a',
        }} />
      </div>
    </div>
  );
}

function ScrollHint({ localTime }) {
  const pulse = (Math.sin(localTime * 3) + 1) / 2;
  return (
    <div style={{
      position: 'absolute',
      bottom: 180, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      opacity: clmp((localTime - 1.8) / 0.4, 0, 1) * (1 - clmp((localTime - 2.5) / 0.3, 0, 1)),
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 36,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: `0 0 0 ${8 + pulse * 20}px rgba(255,255,255,${0.25 - pulse * 0.2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7-7 7 7" stroke="#0a1a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{
        fontFamily: FONT, fontSize: 26, fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }}>Swipe.</div>
    </div>
  );
}

Object.assign(window, { Scene1_Desk, ScreenLabel, BU, FONT, W, H, lerp, clmp });
