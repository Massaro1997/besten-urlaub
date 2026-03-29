'use client'

import { useEffect, useRef } from 'react'

const TIKTOK_USERNAME = 'bestenurlaub'

// Aggiungi qui i video ID quando li pubblichi su TikTok
// Esempio: '7389234567890123456'
// L'ID lo trovi nell'URL del video: tiktok.com/@bestenurlaub/video/7389234567890123456
const TIKTOK_VIDEOS: string[] = [
  '7622735656665533728',
  '7622739776348704032',
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.5V6.8a4.83 4.83 0 0 1-1-.11z" />
    </svg>
  )
}

export function TikTokFeed() {
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (!scriptLoaded.current) {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
      scriptLoaded.current = true
    }
  }, [])

  const hasVideos = TIKTOK_VIDEOS.length > 0

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <TikTokIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0a1a3a]">
              Unsere TikTok Videos
            </h2>
            <p className="text-sm text-[#0a1a3a]/60">
              @{TIKTOK_USERNAME} — Folge uns f&uuml;r t&auml;gliche Urlaubsinspiration
            </p>
          </div>
        </div>
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors"
        >
          <TikTokIcon className="w-4 h-4" />
          Auf TikTok folgen
        </a>
      </div>

      {hasVideos ? (
        /* Video Grid — embedded TikTok videos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {TIKTOK_VIDEOS.map((videoId) => (
            <div key={videoId} className="w-full max-w-[325px]">
              <blockquote
                className="tiktok-embed"
                cite={`https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoId}`}
                data-video-id={videoId}
                style={{ maxWidth: '325px', minWidth: '250px' }}
              >
                <section>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoId}`}
                  >
                    Video laden...
                  </a>
                </section>
              </blockquote>
            </div>
          ))}
        </div>
      ) : (
        /* Coming soon — placeholder cards */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { title: 'Mallorca', subtitle: 'Die Lieblingsinsel der Deutschen', img: '/maldives.png' },
            { title: 'Antalya', subtitle: '5 Sterne zum besten Preis', img: '/santorini.png' },
            { title: 'Sharm el-Sheikh', subtitle: 'Sonne, Meer & Entspannung', img: '/maldives.png' },
            { title: 'Hurghada', subtitle: 'All Inclusive am Roten Meer', img: '/bali.png' },
          ].map((item) => (
            <a
              key={item.title}
              href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-2xl overflow-hidden aspect-[9/16] group cursor-pointer"
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* TikTok play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TikTokIcon className="w-3.5 h-3.5 text-white" />
                  <span className="text-white/70 text-xs">@{TIKTOK_USERNAME}</span>
                </div>
                <p className="text-white font-semibold text-sm leading-tight">
                  {item.title}
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  {item.subtitle}
                </p>
                <span className="inline-block mt-2 bg-white/20 backdrop-blur rounded-full px-2.5 py-0.5 text-[10px] text-white font-medium">
                  Bald verfügbar
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Mobile follow button */}
      <div className="flex justify-center mt-8 sm:hidden">
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors"
        >
          <TikTokIcon className="w-4 h-4" />
          Auf TikTok folgen
        </a>
      </div>
    </section>
  )
}
