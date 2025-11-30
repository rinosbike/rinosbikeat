/**
 * Homepage - RINOS Bikes Austria
 * Simplified homepage design
 */

'use client'

import TrustBanner from '@/components/home/TrustBanner'

export default function HomePage() {

  return (
    <div className="bg-white">
      {/* Welcome Section - Rich Text */}
      <section className="py-10 md:py-[52px] bg-white">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Willkommen in der Welt von Rinos
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              Hier finden Sie alle unsere Fahrradmodelle sowie eine vielfältige Auswahl an Zubehör
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <TrustBanner />
    </div>
  )
}
