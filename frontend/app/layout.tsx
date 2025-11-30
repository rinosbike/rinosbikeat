import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PromoBar from '@/components/layout/PromoBar'

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
        {/* Promotional Bar - Above Header */}
        <PromoBar />

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
