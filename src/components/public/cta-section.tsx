export function CtaSection() {
  return (
    <section
      className="py-16 sm:py-20"
      style={{
        background: 'linear-gradient(135deg, #2e75fa, #1a5fe0)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Verpasse kein Angebot
        </h2>

        <p className="text-white/70 mt-3 text-sm sm:text-base">
          Folge uns auf TikTok und Instagram f&uuml;r t&auml;gliche
          Urlaubsschn&auml;ppchen
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          {/* TikTok button */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#0a1a3a] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.24 8.24 0 0 0 4.82 1.56V6.89a4.84 4.84 0 0 1-1.06-.2Z" />
            </svg>
            TikTok folgen
          </a>

          {/* Instagram button */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Instagram folgen
          </a>
        </div>
      </div>
    </section>
  )
}
