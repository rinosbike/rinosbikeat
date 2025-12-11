/**
 * Header Component - RINOS Bikes
 * Premium Apple/Framer-inspired design
 * Navigation bar with cart, search, and user menu
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search, ChevronDown, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { categoriesApi, Category, pagesApi, MenuPage } from '@/lib/api'
import { buildCategoryTree, CategoryNode } from '@/lib/categoryTree'
import MegaMenu, { SimpleDropdown } from './MegaMenu'

// Category name mapping for display
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
  const [menuPages, setMenuPages] = useState<MenuPage[]>([])
  const countryCurrencyRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { getItemCount } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  // Track hydration to prevent mismatch between server and client
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Only show cart count and auth state after hydration to prevent mismatch
  const itemCount = isHydrated ? getItemCount() : 0
  const showAuthenticated = isHydrated && isAuthenticated

  // Fetch categories and menu pages on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesResponse = await categoriesApi.getAll()
        const tree = buildCategoryTree(categoriesResponse.categories)
        setCategoryTree(tree)

        const pagesRes = await fetch('/api/pages/public/menu', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (pagesRes.ok) {
          const pagesResponse = await pagesRes.json()
          const pages = pagesResponse.pages || []
          setMenuPages(pages)
        } else {
          setMenuPages([])
        }
      } catch (error) {
        console.error('[Header] Failed to fetch navigation data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
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

  const getCategoryDisplayName = (germanName: string): string => {
    return categoryDisplayNames[germanName] || germanName
  }

  return (
    <>
      {/* Main Header - Premium Design */}
      <header
        className={`relative z-50 transition-all duration-500 ease-out-expo ${
          scrolled
            ? 'bg-white/80 backdrop-blur-premium shadow-soft'
            : 'bg-white'
        }`}
      >
        {/* Top Bar - CMS Pages + Logo + Icons */}
        <div className="border-b border-rinos-border-light">
          <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex items-center justify-between py-5 lg:py-6">
              {/* Left: CMS Pages Navigation */}
              <nav className="hidden lg:flex items-center gap-10 flex-1">
                {!loading && menuPages.map((page) => (
                  <Link
                    key={page.page_id}
                    href={`/p/${page.slug}`}
                    className="text-caption font-medium uppercase tracking-widest text-rinos-text-secondary
                               hover:text-rinos-dark transition-colors duration-300 relative group"
                  >
                    {page.menu_label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-rinos-dark
                                   transition-all duration-300 ease-out-expo group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              {/* Center: Logo */}
              <Link
                href="/"
                className="flex items-center justify-center group flex-shrink-0 mx-8 lg:mx-16"
              >
                <img
                  src="/images/hero/logo.png"
                  alt="RINOS Bikes"
                  className="h-20 md:h-24 lg:h-28 w-auto object-contain
                           transition-all duration-500 ease-out-expo
                           group-hover:scale-[1.02]"
                />
              </Link>

              {/* Right: Icons */}
              <div className="flex items-center justify-end gap-1 lg:gap-2 flex-1">
                {/* Currency Selector */}
                <div className="hidden lg:block relative" ref={countryCurrencyRef}>
                  <button
                    onClick={() => setCountryCurrencyOpen(!countryCurrencyOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 text-caption font-medium
                             text-rinos-text-secondary hover:text-rinos-dark transition-colors duration-200"
                  >
                    <span>EUR €</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        countryCurrencyOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Currency Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-44 bg-white rounded-xl
                               border border-rinos-border-light shadow-elevated py-2
                               transition-all duration-300 ease-out-expo origin-top-right
                               ${countryCurrencyOpen
                                 ? 'opacity-100 visible scale-100'
                                 : 'opacity-0 invisible scale-95'}`}
                  >
                    <button className="w-full text-left px-4 py-2.5 text-body-sm font-medium
                                      text-rinos-dark hover:bg-rinos-bg-secondary transition-colors">
                      EUR €
                    </button>
                  </div>
                </div>

                {/* Search */}
                <Link
                  href="/suche"
                  className="btn-icon"
                  aria-label="Suche"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </Link>

                {/* User Menu */}
                {showAuthenticated ? (
                  <div className="relative group">
                    <button className="btn-icon" aria-label="Profil">
                      <User className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl
                                  border border-rinos-border-light shadow-elevated py-2
                                  invisible group-hover:visible opacity-0 group-hover:opacity-100
                                  transition-all duration-300 ease-out-expo scale-95 group-hover:scale-100 z-50">
                      <Link
                        href="/profil"
                        className="flex items-center justify-between px-4 py-2.5 text-body-sm
                                 text-rinos-dark hover:bg-rinos-bg-secondary transition-colors"
                      >
                        Mein Profil
                        <ArrowRight className="w-4 h-4 text-rinos-text-secondary" />
                      </Link>
                      <Link
                        href="/bestellungen"
                        className="flex items-center justify-between px-4 py-2.5 text-body-sm
                                 text-rinos-dark hover:bg-rinos-bg-secondary transition-colors"
                      >
                        Meine Bestellungen
                        <ArrowRight className="w-4 h-4 text-rinos-text-secondary" />
                      </Link>
                      <div className="my-2 mx-4 h-px bg-rinos-border-light" />
                      <button
                        className="w-full text-left px-4 py-2.5 text-body-sm text-rinos-text-secondary
                                 hover:text-rinos-dark hover:bg-rinos-bg-secondary transition-colors"
                        onClick={() => useAuthStore.getState().logout()}
                      >
                        Abmelden
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/anmelden" className="btn-icon" aria-label="Anmelden">
                    <User className="w-5 h-5" strokeWidth={1.5} />
                  </Link>
                )}

                {/* Cart */}
                <Link
                  href="/cart"
                  className="btn-icon relative"
                  aria-label="Warenkorb"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white
                                   text-[10px] font-semibold rounded-full min-w-[18px] h-[18px]
                                   flex items-center justify-center px-1
                                   animate-scale-in">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden btn-icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Menu className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <div className="hidden lg:block bg-rinos-bg-secondary/50">
          <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
            <nav className="flex items-center justify-center gap-12 py-4">
              {!loading && (
                <>
                  {categoryTree.find(cat => cat.category === 'Fahrräder') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Fahrräder')}
                      categories={categoryTree.find(cat => cat.category === 'Fahrräder')?.children || []}
                    />
                  )}

                  {categoryTree.find(cat => cat.category === 'Teile') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Teile')}
                      categories={categoryTree.find(cat => cat.category === 'Teile')?.children || []}
                    />
                  )}

                  {categoryTree.find(cat => cat.category === 'Zubehör') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Zubehör')}
                      categories={categoryTree.find(cat => cat.category === 'Zubehör')?.children || []}
                    />
                  )}

                  {categoryTree.find(cat => cat.category === 'Bekleidung') && (
                    <MegaMenu
                      title={getCategoryDisplayName('Bekleidung')}
                      categories={categoryTree.find(cat => cat.category === 'Bekleidung')?.children || []}
                    />
                  )}

                  {categoryTree.find(cat => cat.category === 'Wintersport') && (
                    <SimpleDropdown
                      title={getCategoryDisplayName('Wintersport')}
                      categories={categoryTree.find(cat => cat.category === 'Wintersport')?.children || []}
                    />
                  )}

                  {categoryTree.find(cat => cat.category === 'Outdoor') && (
                    <SimpleDropdown
                      title={getCategoryDisplayName('Outdoor')}
                      categories={categoryTree.find(cat => cat.category === 'Outdoor')?.children || []}
                    />
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-out-expo ${
          mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-floating
                     transition-transform duration-500 ease-out-expo overflow-y-auto
                     ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Mobile Menu Header */}
          <div className="sticky top-0 bg-white border-b border-rinos-border-light px-6 py-5
                        flex items-center justify-between z-10">
            <span className="text-title font-semibold">Menü</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn-icon"
              aria-label="Menü schließen"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="px-6 py-6">
            {/* CMS Pages */}
            {!loading && menuPages.length > 0 && (
              <div className="mb-6">
                {menuPages.map((page, index) => (
                  <Link
                    key={page.page_id}
                    href={`/p/${page.slug}`}
                    className="flex items-center justify-between py-3 text-body font-medium
                             text-rinos-dark hover:text-rinos-text-secondary transition-colors
                             animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {page.menu_label}
                    <ArrowRight className="w-4 h-4 text-rinos-text-secondary" />
                  </Link>
                ))}
                <div className="my-4 h-px bg-rinos-border-light" />
              </div>
            )}

            {/* Categories */}
            <div className="space-y-1">
              {!loading && (
                <>
                  {categoryTree.find(cat => cat.category === 'Fahrräder') && (
                    <MobileNavLink
                      href={`/categories/fahrrader?id=${categoryTree.find(cat => cat.category === 'Fahrräder')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Fahrräder')}
                    </MobileNavLink>
                  )}
                  {categoryTree.find(cat => cat.category === 'Teile') && (
                    <MobileNavLink
                      href={`/categories/teile?id=${categoryTree.find(cat => cat.category === 'Teile')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Teile')}
                    </MobileNavLink>
                  )}
                  {categoryTree.find(cat => cat.category === 'Zubehör') && (
                    <MobileNavLink
                      href={`/categories/zubehor?id=${categoryTree.find(cat => cat.category === 'Zubehör')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Zubehör')}
                    </MobileNavLink>
                  )}
                  {categoryTree.find(cat => cat.category === 'Bekleidung') && (
                    <MobileNavLink
                      href={`/categories/bekleidung?id=${categoryTree.find(cat => cat.category === 'Bekleidung')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Bekleidung')}
                    </MobileNavLink>
                  )}
                  {categoryTree.find(cat => cat.category === 'Wintersport') && (
                    <MobileNavLink
                      href={`/categories/wintersport?id=${categoryTree.find(cat => cat.category === 'Wintersport')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Wintersport')}
                    </MobileNavLink>
                  )}
                  {categoryTree.find(cat => cat.category === 'Outdoor') && (
                    <MobileNavLink
                      href={`/categories/outdoor?id=${categoryTree.find(cat => cat.category === 'Outdoor')?.categoryid || ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryDisplayName('Outdoor')}
                    </MobileNavLink>
                  )}
                </>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-rinos-border-light" />

            {/* Utility Links */}
            <div className="space-y-1">
              <MobileNavLink
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                Warenkorb {itemCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-black text-white text-caption rounded-full">
                    {itemCount}
                  </span>
                )}
              </MobileNavLink>

              {showAuthenticated ? (
                <>
                  <MobileNavLink href="/profil" onClick={() => setMobileMenuOpen(false)}>
                    Mein Profil
                  </MobileNavLink>
                  <MobileNavLink href="/bestellungen" onClick={() => setMobileMenuOpen(false)}>
                    Meine Bestellungen
                  </MobileNavLink>
                  <button
                    className="w-full flex items-center justify-between py-3 text-body
                             text-rinos-text-secondary hover:text-rinos-dark transition-colors"
                    onClick={() => {
                      useAuthStore.getState().logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <MobileNavLink href="/anmelden" onClick={() => setMobileMenuOpen(false)}>
                  Anmelden
                </MobileNavLink>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

// Mobile Nav Link Component
function MobileNavLink({
  href,
  children,
  onClick
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(href + '/')

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 text-body font-medium
                transition-colors duration-200 ${
        isActive
          ? 'text-black'
          : 'text-rinos-dark hover:text-rinos-text-secondary'
      }`}
    >
      <span className="flex items-center gap-2">{children}</span>
      <ArrowRight className="w-4 h-4 text-rinos-text-secondary" />
    </Link>
  )
}
