'use client'

import { usePathname } from 'next/navigation'
import HeaderMinimal from './HeaderMinimal'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Admin pages have their own layout - don't show site header/footer
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    // Admin pages render directly without site chrome
    return <>{children}</>
  }

  // Regular pages get header and footer
  return (
    <>
      <HeaderMinimal />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
