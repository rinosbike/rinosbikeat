/**
 * Header Component - RINOS Bikes
 * Navigation bar with cart, search, and user menu
 * Matches rinosbike.eu design
 * German language interface
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search, ChevronDown, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { categoriesApi, Category } from '@/lib/api'
import { buildCategoryTree, CategoryNode } from '@/lib/categoryTree'
import MegaMenu, { SimpleDropdown } from './MegaMenu'

// Category name mapping for display (keep German names, map Teile to Fahrradteile)
const categoryDisplayNames: Record<string, string> = {
  'Fahrräder': 'Fahrräder',
  'Teile': 'Fahrradteile',
  'Zubehör': 'Zubehör',
  'Bekleidung': 'Bekleidung',
  'Wintersport': 'Wintersport',
  'Outdoor': 'Outdoor',
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const [countryCurrencyOpen, setCountryCurrencyOpen] = useState(false)
  const countryCurrencyRef = useRef<HTMLDivElement>(null)
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

  // Close country/currency dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryCurrencyRef.current && !countryCurrencyRef.current.contains(event.target as Node)) {
        setCountryCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper function to get display category name
  const getCategoryDisplayName = (germanName: string): string => {
    return categoryDisplayNames[germanName] || germanName
  }

  return (
    <>
      {/* Promotional Banner - Above Header */}
      <div className="bg-black text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 py-2 text-sm">
            <Link
              href="/categories/gravel-bikes?id=103"
              className="hover:opacity-80 transition-opacity"
            >
              <span className="font-semibold">2025 NEUE MODELLE | Sparen Sie bis zu 300€</span>
            </Link>
            <span className="hidden sm:inline">→</span>
            <a
              href="https://de.trustpilot.com/review/rinosbike.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span>Sehen Sie unsere Bewertungen auf</span>
              <span className="flex items-center gap-1 text-green-400 font-semibold">
                <Star className="w-4 h-4 fill-green-400" />
                Trustpilot (130+) 4.5★
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Logo, Navigation, Icons on same level */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="RINOS Bikes"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {!loading && categoryTree.length > 0 && (
                <>
                  {/* Fahrräder */}
                  {categoryTree.find(cat => cat.category === 'Fahrräder') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Fahrräder')}
                      categories={categoryTree.find(cat => cat.category === 'Fahrräder')?.children || []}
                    />
                  )}

                  {/* Fahrradteile */}
                  {categoryTree.find(cat => cat.category === 'Teile') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Teile')}
                      categories={categoryTree.find(cat => cat.category === 'Teile')?.children || []}
                    />
                  )}

                  {/* Zubehör */}
                  {categoryTree.find(cat => cat.category === 'Zubehör') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Zubehör')}
                      categories={categoryTree.find(cat => cat.category === 'Zubehör')?.children || []}
                    />
                  )}

                  {/* Bekleidung */}
                  {categoryTree.find(cat => cat.category === 'Bekleidung') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Bekleidung')}
                      categories={categoryTree.find(cat => cat.category === 'Bekleidung')?.children || []}
                    />
                  )}

                  {/* Wintersport */}
                  {categoryTree.find(cat => cat.category === 'Wintersport') && (
                    <SimpleDropdown
                      title={getCategoryDisplayName('Wintersport')}
                      categories={categoryTree.find(cat => cat.category === 'Wintersport')?.children || []}
                    />
                  )}

                  {/* Outdoor */}
                  {categoryTree.find(cat => cat.category === 'Outdoor') && (
                    <SimpleDropdown
                      title={getCategoryDisplayName('Outdoor')}
                      categories={categoryTree.find(cat => cat.category === 'Outdoor')?.children || []}
                    />
                  )}
                </>
              )}
            </nav>

            {/* Right Side: Country Selector & Icons */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Country/Currency Selector - Desktop */}
              <div className="hidden lg:block relative" ref={countryCurrencyRef}>
                <button
                  onClick={() => setCountryCurrencyOpen(!countryCurrencyOpen)}
                  className="flex items-center gap-1 text-sm text-rinos-text hover:opacity-70 transition-opacity"
                >
                  <span>DE | EUR €</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {countryCurrencyOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg py-2 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-rinos-text hover:bg-gray-50">
                      Deutschland | EUR €
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                      Österreich | EUR €
                    </button>
                  </div>
                )}
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-2">
            {/* Search */}
            <Link
              href="/suche"
              className="p-2 text-rinos-text hover:opacity-70 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-rinos-text hover:opacity-70 transition-opacity">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-sm py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
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
                className="p-2 text-rinos-text hover:opacity-70 transition-opacity"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

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

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-rinos-text hover:opacity-70"
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
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            {!loading && categoryTree.length > 0 && (
              <>
                {categoryTree.find(cat => cat.category === 'Fahrräder') && (
                  <MobileNavLink href={`/categories/fahrrader?id=${categoryTree.find(cat => cat.category === 'Fahrräder')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Fahrräder')}
                  </MobileNavLink>
                )}
                {categoryTree.find(cat => cat.category === 'Teile') && (
                  <MobileNavLink href={`/categories/teile?id=${categoryTree.find(cat => cat.category === 'Teile')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Teile')}
                  </MobileNavLink>
                )}
                {categoryTree.find(cat => cat.category === 'Zubehör') && (
                  <MobileNavLink href={`/categories/zubehor?id=${categoryTree.find(cat => cat.category === 'Zubehör')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Zubehör')}
                  </MobileNavLink>
                )}
                {categoryTree.find(cat => cat.category === 'Bekleidung') && (
                  <MobileNavLink href={`/categories/bekleidung?id=${categoryTree.find(cat => cat.category === 'Bekleidung')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Bekleidung')}
                  </MobileNavLink>
                )}
                {categoryTree.find(cat => cat.category === 'Wintersport') && (
                  <MobileNavLink href={`/categories/wintersport?id=${categoryTree.find(cat => cat.category === 'Wintersport')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Wintersport')}
                  </MobileNavLink>
                )}
                {categoryTree.find(cat => cat.category === 'Outdoor') && (
                  <MobileNavLink href={`/categories/outdoor?id=${categoryTree.find(cat => cat.category === 'Outdoor')?.categoryid || ''}`}>
                    {getCategoryDisplayName('Outdoor')}
                  </MobileNavLink>
                )}
              </>
            )}
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
    </>
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
