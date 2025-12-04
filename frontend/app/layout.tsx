import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import HeaderMinimal from '@/components/layout/HeaderMinimal'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RINOS Bikes - Premium Bicycles Austria',
  description: 'Minimal. Edgy. Built Right. Premium bikes crafted for performance. No compromise. No nonsense.',
  keywords: 'Fahrräder, Bikes, Gravel, Rennrad, Mountainbike, Faltrad, Österreich',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Sticky Header */}
        <HeaderMinimal />

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
