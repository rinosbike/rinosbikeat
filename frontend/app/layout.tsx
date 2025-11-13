import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container text-center">
            <p>&copy; 2025 RINOS Bikes GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
