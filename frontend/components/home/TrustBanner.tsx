/**
 * Trust Banner Component
 * Simple banner with key selling points
 */

'use client'

export default function TrustBanner() {
  const trustPoints = [
    '2 Jahre Rahmengarantie',
    'Lebenslanger Kundensupport',
    'Direktverkauf - Keine Zwischenhändler',
    '95% Vormontiert',
  ]

  return (
    <div className="bg-black text-white py-6">
      <div className="max-w-container mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          {trustPoints.map((point, index) => (
            <div key={index}>
              <span className="text-sm font-light">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
