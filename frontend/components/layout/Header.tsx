/**
 * Header Component - RINOS Bikes
 * Navigation bar with cart, search, and user menu
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  const { itemCount } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              RINOS <span className="text-blue-600">BIKES</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/products">Produkte</NavLink>
            <NavLink href="/ueber-uns">Über uns</NavLink>
            <NavLink href="/kontakt">Kontakt</NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm">
                    {user?.first_name || 'Konto'}
                  </span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <Link 
                    href="/profil" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Mein Profil
                  </Link>
                  <Link 
                    href="/bestellungen" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Meine Bestellungen
                  </Link>
                  <hr className="my-2" />
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => useAuthStore.getState().logout()}
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/anmelden" 
                className="btn btn-primary"
              >
                Anmelden
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container py-4 space-y-2">
            <MobileNavLink href="/products">Produkte</MobileNavLink>
            <MobileNavLink href="/ueber-uns">Über uns</MobileNavLink>
            <MobileNavLink href="/kontakt">Kontakt</MobileNavLink>
            <hr className="my-2" />
            <MobileNavLink href="/cart">
              Warenkorb {itemCount > 0 && `(${itemCount})`}
            </MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/profil">Mein Profil</MobileNavLink>
                <MobileNavLink href="/bestellungen">Meine Bestellungen</MobileNavLink>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    useAuthStore.getState().logout()
                    setMobileMenuOpen(false)
                  }}
                >
                  Abmelden
                </button>
              </>
            ) : (
              <MobileNavLink href="/anmelden">Anmelden</MobileNavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

// Nav Link Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  )
}

// Mobile Nav Link Component
function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  )
}
