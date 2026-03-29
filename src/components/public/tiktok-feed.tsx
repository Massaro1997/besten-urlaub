'use client'

import { useEffect, useRef } from 'react'

const TIKTOK_USERNAME = 'bestenurlaub'

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
  const scrollRef = useRef<HTMLDivElement>(null)
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

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
  }

  if (TIKTOK_VIDEOS.length === 0) return null

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              <TikTokIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a1a3a]">
                Unsere Videos
              </h2>
              <p className="text-xs sm:text-sm text-[#0a1a3a]/50">
                @{TIKTOK_USERNAME}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll arrows — desktop only */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full bg-[#0a1a3a]/5 hover:bg-[#0a1a3a]/10 flex items-center justify-center transition-colors"
                aria-label="Scroll links"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#0a1a3a]/60">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full bg-[#0a1a3a]/5 hover:bg-[#0a1a3a]/10 flex items-center justify-center transition-colors"
                aria-label="Scroll rechts"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#0a1a3a]/60">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <a
              href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/80 transition-colors"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              Folgen
            </a>
          </div>
        </div>
      </div>

      {/* Scrollable video cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-5 sm:px-6 snap-x snap-mandatory pb-4"
        style={{ scrollPaddingLeft: '20px' }}
      >
        {/* Left spacer for centering on large screens */}
        <div className="hidden xl:block shrink-0" style={{ width: 'calc((100vw - 1280px) / 2)' }} />

        {TIKTOK_VIDEOS.map((videoId) => (
          <div
            key={videoId}
            className="shrink-0 snap-start w-[300px] sm:w-[325px] bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <blockquote
              className="tiktok-embed"
              cite={`https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoId}`}
              data-video-id={videoId}
              style={{ maxWidth: '325px', minWidth: '280px', margin: 0 }}
            >
              <section>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoId}`}
                  className="flex items-center justify-center h-[500px] bg-[#f8f9fc] text-[#0a1a3a]/30 text-sm"
                >
                  Video wird geladen...
                </a>
              </section>
            </blockquote>
          </div>
        ))}

        {/* "More on TikTok" card */}
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 snap-start w-[300px] sm:w-[325px] bg-gradient-to-br from-[#0a1a3a] to-[#1a3a6a] rounded-2xl flex flex-col items-center justify-center gap-4 p-8 group"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <TikTokIcon className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base">Mehr Videos</p>
            <p className="text-white/50 text-sm mt-1">auf TikTok ansehen</p>
          </div>
          <div className="flex items-center gap-2 bg-white text-[#0a1a3a] px-5 py-2.5 rounded-xl text-sm font-semibold group-hover:bg-white/90 transition-colors">
            <TikTokIcon className="w-4 h-4" />
            @{TIKTOK_USERNAME}
          </div>
        </a>

        {/* Right spacer */}
        <div className="hidden xl:block shrink-0" style={{ width: 'calc((100vw - 1280px) / 2)' }} />
      </div>

      {/* Mobile follow button */}
      <div className="flex justify-center mt-6 sm:hidden px-5">
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors w-full justify-center"
        >
          <TikTokIcon className="w-4 h-4" />
          Auf TikTok folgen
        </a>
      </div>
    </section>
  )
}
