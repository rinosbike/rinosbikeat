/**
 * Homepage - RINOS Bikes Austria
 * Modern minimal design with 2025 best practices
 */

'use client'

import Link from 'next/link'
import { ArrowRight, Award, Zap, MessageCircle } from 'lucide-react'
import TrustBanner from '@/components/home/TrustBanner'
import FeaturedProducts from '@/components/home/FeaturedProducts'

export default function HomePage() {
  return (
    <>
      {/* Trust Banner - Top of page */}
      <TrustBanner />
      
      <div className="bg-gradient-to-b from-white via-white to-gray-50">
        {/* Hero Section - Image Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 md:py-0 overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://cdn.shopify.com/s/files/1/0720/5794/6377/files/dominika.pairofwheels_453056389_850498639917776_8492373170969487287_n.jpg?v=1759994817"
            alt="Bikepacking Adventure"
            className="w-full h-full object-cover object-[center_75%]"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="max-w-4xl w-full relative z-10">
          <div className="space-y-6">
            {/* Main Headline */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.2] text-white mb-4">
                Entdecke den Geist<br />des Bikepackings<br />mit dem Sandman
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                Ausgestattet mit GRX 400, GRX 600, GRX 820 und mehr – finde deine perfekte Konfiguration.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/categories/gravel-bikes?id=103"
                className="group inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3 text-sm font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                Jetzt kaufen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/produktsuche"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-7 py-3 text-sm font-bold rounded-2xl hover:bg-white hover:text-black transition-all duration-300"
              >
                Alle Bikes entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Featured Categories - Premium Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-black">Nach Kategorie shoppen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Cards */}
            {[
              { title: 'Gravel', href: '/categories/gravel-bikes?id=103', desc: 'Abenteuer wartet' },
              { title: 'Mountain', href: '/categories/mountainbike?id=59', desc: 'Abseits der Pfade' },
              { title: 'Rennrad', href: '/categories/rennraeder?id=2', desc: 'Geschwindigkeit neu definiert' },
            ].map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden bg-black aspect-square flex flex-col justify-between p-8 text-white hover:shadow-2xl transition-all duration-300 rounded-2xl"
              >
                <div>
                  <h3 className="text-3xl md:text-4xl font-black mb-2">{cat.title}</h3>
                  <p className="text-gray-300 text-sm font-medium">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Entdecken <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition - Premium Layout */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Premium Qualität', desc: 'Handverlesene Komponenten. Rigorose Tests.', icon: Award },
              { title: 'Schneller Versand', desc: 'Heute bestellen. Morgen fahren.', icon: Zap },
              { title: 'Experten Support', desc: 'Echte Menschen. Echte Antworten. Schnell.', icon: MessageCircle },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-black rounded-xl mb-6 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
