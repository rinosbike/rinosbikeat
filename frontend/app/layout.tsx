import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

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
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
