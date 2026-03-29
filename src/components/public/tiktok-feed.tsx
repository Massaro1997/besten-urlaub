'use client'

import { useEffect, useRef } from 'react'

const TIKTOK_USERNAME = 'bestenurlaub'

const TIKTOK_VIDEOS = [
  // Add TikTok video IDs here as you publish them
  // They will be embedded as TikTok oEmbed widgets
] as string[]

export function TikTokFeed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // Load TikTok embed script once
    if (!scriptLoaded.current) {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
      scriptLoaded.current = true
    }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.5V6.8a4.83 4.83 0 0 1-1-.11z" />
              </svg>
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
        </div>
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.5V6.8a4.83 4.83 0 0 1-1-.11z" />
          </svg>
          Auf TikTok folgen
        </a>
      </div>

      {/* TikTok Profile Embed */}
      <div ref={containerRef} className="flex justify-center">
        <blockquote
          className="tiktok-embed"
          cite={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          data-unique-id={TIKTOK_USERNAME}
          data-embed-from="embed_page"
          data-embed-type="creator"
          style={{ maxWidth: '780px', minWidth: '288px' }}
        >
          <section>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.tiktok.com/@${TIKTOK_USERNAME}?refer=creator_embed`}
            >
              @{TIKTOK_USERNAME}
            </a>
          </section>
        </blockquote>
      </div>

      {/* Mobile follow button */}
      <div className="flex justify-center mt-6 sm:hidden">
        <a
          href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.5V6.8a4.83 4.83 0 0 1-1-.11z" />
          </svg>
          Auf TikTok folgen
        </a>
      </div>
    </section>
  )
}
