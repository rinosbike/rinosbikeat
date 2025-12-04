/**
 * Trust Marquee Banner - Animated Scrolling Banner
 * Canyon-style continuous scrolling with trust points
 */

'use client'

export default function TrustBanner() {
  return (
    <div className="w-full bg-black text-white overflow-hidden py-3">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-content {
          display: inline-flex;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 28s;
          }
        }
      `}</style>

      <div className="marquee-container w-full">
        <div className="marquee-content">
          {/* First iteration */}
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">2 Jahre Rahmengarantie</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Lebenslanger Kundensupport</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12l-4.6-9H6.6L2 12m20 0l-4.6 9H6.6L2 12m20 0H2" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Direkt zum Verbraucher - Ohne Zwischenhändler</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">95% Vormontiert</span>
          </span>

          {/* Second iteration */}
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">2 Jahre Rahmengarantie</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Lebenslanger Kundensupport</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12l-4.6-9H6.6L2 12m20 0l-4.6 9H6.6L2 12m20 0H2" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Direkt zum Verbraucher - Ohne Zwischenhändler</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">95% Vormontiert</span>
          </span>

          {/* Third iteration */}
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">2 Jahre Rahmengarantie</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Lebenslanger Kundensupport</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12l-4.6-9H6.6L2 12m20 0l-4.6 9H6.6L2 12m20 0H2" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">Direkt zum Verbraucher - Ohne Zwischenhändler</span>
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">95% Vormontiert</span>
          </span>
        </div>
      </div>
    </div>
  )
}
