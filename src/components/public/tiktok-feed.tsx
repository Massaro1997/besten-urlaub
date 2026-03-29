'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const TIKTOK_USERNAME = 'bestenurlaub'

const TIKTOK_VIDEOS = [
  { id: '7622735656665533728', title: 'Urlaub Mallorca', cover: '/destinations/mallorca.png' },
  { id: '7622739776348704032', title: 'Urlaub Marbella', cover: '/destinations/marbella.png' },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.5V6.8a4.83 4.83 0 0 1-1-.11z" />
    </svg>
  )
}

export function TikTokFeed() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeVideo])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveVideo(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (TIKTOK_VIDEOS.length === 0) return null

  return (
    <>
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              <TikTokIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1a3a] tracking-tight">Schon gesehen?</h2>
              <p className="text-xs text-[#0a1a3a]/50">@{TIKTOK_USERNAME}</p>
            </div>
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

        {/* Video cards — horizontal scroll */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
          {TIKTOK_VIDEOS.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video.id)}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer text-left shrink-0 w-[45%] sm:w-[30%] lg:w-[22%] snap-start"
            >
              <Image
                src={video.cover}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-colors" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <TikTokIcon className="w-3 h-3 text-white/80" />
                  <span className="text-[10px] sm:text-xs text-white/60">@{TIKTOK_USERNAME}</span>
                </div>
                <p className="text-white font-medium text-xs sm:text-sm leading-tight">{video.title}</p>
              </div>
            </button>
          ))}

          {/* "Mehr" card */}
          <a
            href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1a3a] to-[#2e75fa] flex flex-col items-center justify-center gap-3 group shrink-0 w-[45%] sm:w-[30%] lg:w-[22%] snap-start"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 group-hover:scale-110 transition-all">
              <TikTokIcon className="w-7 h-7 text-white" />
            </div>
            <div className="text-center px-4">
              <p className="text-white font-semibold text-sm">Mehr Videos</p>
              <p className="text-white/50 text-xs mt-0.5">auf TikTok ansehen</p>
            </div>
          </a>
        </div>

        {/* Mobile follow */}
        <div className="flex justify-center mt-6 sm:hidden">
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

      {/* Video popup modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            aria-label="Schliessen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Video container */}
          <div
            className="w-[340px] sm:w-[400px] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.tiktok.com/player/v1/${activeVideo}?autoplay=1&loop=1`}
              className="w-full aspect-[9/16] border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="TikTok Video"
            />
          </div>
        </div>
      )}
    </>
  )
}
