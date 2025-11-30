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
import { categoriesApi, Category } from '@/lib/api'
import { buildCategoryTree, CategoryNode } from '@/lib/categoryTree'
import MegaMenu, { SimpleDropdown } from './MegaMenu'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  const { itemCount } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoriesApi.getAll()
        const tree = buildCategoryTree(response.categories)
        setCategoryTree(tree)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Shopify Style with Image */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="RINOS Bikes"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Horizontal Menu Bar */}
          <nav className="hidden md:block flex-1">
            <div className="grid grid-cols-8 gap-4 items-center justify-items-center">
              {!loading && categoryTree.length > 0 && (
                <>
                  {/* Fahrräder */}
                  {categoryTree.find(cat => cat.category === 'Fahrräder') && (
                    <MegaMenu
                      title="Fahrräder"
                      categories={categoryTree.find(cat => cat.category === 'Fahrräder')?.children || []}
                    />
                  )}

                  {/* Fahrradteile (Teile) */}
                  {categoryTree.find(cat => cat.category === 'Teile') && (
                    <MegaMenu
                      title="Fahrradteile"
                      categories={categoryTree.find(cat => cat.category === 'Teile')?.children || []}
                    />
                  )}

                  {/* Zubehör */}
                  {categoryTree.find(cat => cat.category === 'Zubehör') && (
                    <MegaMenu
                      title="Zubehör"
                      categories={categoryTree.find(cat => cat.category === 'Zubehör')?.children || []}
                    />
                  )}

                  {/* Bekleidung */}
                  {categoryTree.find(cat => cat.category === 'Bekleidung') && (
                    <MegaMenu
                      title="Bekleidung"
                      categories={categoryTree.find(cat => cat.category === 'Bekleidung')?.children || []}
                    />
                  )}

                  {/* Scooter */}
                  {categoryTree.find(cat => cat.category === 'Scooter') && (
                    <SimpleDropdown
                      title="Scooter"
                      categories={categoryTree.find(cat => cat.category === 'Scooter')?.children || []}
                    />
                  )}

                  {/* Outdoor */}
                  {categoryTree.find(cat => cat.category === 'Outdoor') && (
                    <SimpleDropdown
                      title="Outdoor"
                      categories={categoryTree.find(cat => cat.category === 'Outdoor')?.children || []}
                    />
                  )}
                </>
              )}

              <NavLink href="/ueber-uns">Über uns</NavLink>
              <NavLink href="/kontakt">Kontakt</NavLink>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {/* Search */}
            <button className="p-2 text-rinos-text hover:opacity-70 transition-opacity">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-rinos-text hover:opacity-70 transition-opacity"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rinos-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-rinos-text hover:opacity-70 transition-opacity">
                  <User className="w-5 h-5" />
                  <span className="text-sm">
                    {user?.first_name || 'Konto'}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-sm py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    href="/profil"
                    className="block px-4 py-2 text-rinos-text hover:bg-gray-50"
                  >
                    Mein Profil
                  </Link>
                  <Link
                    href="/bestellungen"
                    className="block px-4 py-2 text-rinos-text hover:bg-gray-50"
                  >
                    Meine Bestellungen
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    className="block w-full text-left px-4 py-2 text-rinos-text hover:bg-gray-50"
                    onClick={() => useAuthStore.getState().logout()}
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/anmelden"
                className="bg-rinos-primary text-white px-6 py-2 hover:opacity-90 transition-opacity text-sm"
              >
                Anmelden
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-rinos-text hover:opacity-70"
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
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <MobileNavLink href="/products">Produkte</MobileNavLink>
            <MobileNavLink href="/ueber-uns">Über uns</MobileNavLink>
            <MobileNavLink href="/kontakt">Kontakt</MobileNavLink>
            <hr className="my-2 border-gray-200" />
            <MobileNavLink href="/cart">
              Warenkorb {itemCount > 0 && `(${itemCount})`}
            </MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/profil">Mein Profil</MobileNavLink>
                <MobileNavLink href="/bestellungen">Meine Bestellungen</MobileNavLink>
                <button
                  className="block w-full text-left px-4 py-2 text-rinos-text hover:bg-gray-50"
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
      className={`text-sm font-normal transition-opacity ${
        isActive
          ? 'text-rinos-text underline'
          : 'text-rinos-text hover:opacity-70'
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
      className={`block px-4 py-2 transition-colors ${
        isActive
          ? 'bg-gray-50 text-rinos-text font-medium'
          : 'text-rinos-text hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}

// Dropdown Menu Component
function DropdownMenu({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <button className="text-sm font-normal text-rinos-text hover:opacity-70 transition-opacity py-2">
        {title}
      </button>
      <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
        {children}
      </div>
    </div>
  )
}

// Dropdown Link Component
function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-rinos-text hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}
