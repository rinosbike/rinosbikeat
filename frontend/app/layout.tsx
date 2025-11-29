import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RINOS Bikes - Premium Fahrräder aus Deutschland',
  description: 'Hochwertige Gravel, Road, Mountain und Falträder von RINOS Bikes. Made in Frankfurt (Oder).',
  keywords: 'Fahrräder, Bikes, Gravel, Rennrad, Mountainbike, Faltrad, Deutschland',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={assistant.className}>
        {/* Trust Banner - Above Header */}
        <section className="bg-black text-white py-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm mx-4">★ Sehen Sie unsere Bewertungen auf Trustpilot (130+) 4.5★</span>
            <span className="text-sm mx-4">★ Sehen Sie unsere Bewertungen auf Trustpilot (130+) 4.5★</span>
            <span className="text-sm mx-4">★ Sehen Sie unsere Bewertungen auf Trustpilot (130+) 4.5★</span>
          </div>
        </section>

        {/* Promotional Bar - Above Header */}
        <section className="bg-rinos-accent text-white text-center py-2">
          <p className="text-sm font-normal">2025 NEUE MODELLE | Sparen Sie bis zu 300€</p>
        </section>

        {/* Sticky Header */}
        <Header />

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}
