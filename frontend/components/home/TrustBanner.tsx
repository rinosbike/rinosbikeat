/**
 * Trust Banner Component
 * Scrolling marquee with key selling points
 */

'use client'

export default function TrustBanner() {
  const trustPoints = [
    '2 Jahre Rahmengarantie',
    'Lebenslanger Kundensupport',
    'Direktverkauf - Keine Zwischenhändler',
    '95% Vormontiert',
    'Kostenloser Versand ab 100€',
  ]

  return (
    <div className="bg-black text-white py-3 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Repeat trust points multiple times for continuous scroll */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            {trustPoints.map((point, index) => (
              <div key={`${i}-${index}`} className="flex items-center mx-8">
                <span className="text-sm font-light">{point}</span>
                <span className="mx-8">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
