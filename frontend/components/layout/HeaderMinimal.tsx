/**
 * Header Component - Minimal & Edgy Design
 * Modern 2025 aesthetic with bold typography
 * Features: Smooth hover menus with proper delays
 */

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { categoriesApi } from '@/lib/api'
import { buildCategoryTree, CategoryNode } from '@/lib/categoryTree'

// Delay constants for smooth UX
const OPEN_DELAY = 50
const CLOSE_DELAY = 200
const SUBMENU_DELAY = 100

export default function HeaderMinimal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<number | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Mobile menu state - tracks expanded accordion items
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null)
  const [mobileExpandedSub, setMobileExpandedSub] = useState<number | null>(null)
  const [mobileExpandedSubSub, setMobileExpandedSubSub] = useState<number | null>(null)

  // Timeout refs for smooth hover
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { getItemCount } = useCartStore()
  const itemCount = getItemCount()
  const { isAuthenticated } = useAuthStore()

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current)
    }
  }, [])

  // Fetch categories on mount
  useEffect(() => {
    setHydrated(true)
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

  // Handle dropdown open with delay
  const handleDropdownEnter = useCallback((key: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(key)
      setActiveSubmenu(null)
      setActiveSubSubmenu(null)
    }, OPEN_DELAY)
  }, [])

  // Handle dropdown close with delay
  const handleDropdownLeave = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
      setActiveSubmenu(null)
      setActiveSubSubmenu(null)
    }, CLOSE_DELAY)
  }, [])

  // Handle submenu hover
  const handleSubmenuEnter = useCallback((categoryId: number) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
    }
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(categoryId)
      setActiveSubSubmenu(null)
    }, SUBMENU_DELAY)
  }, [])

  // Handle sub-submenu hover
  const handleSubSubmenuEnter = useCallback((categoryId: number) => {
    setActiveSubSubmenu(categoryId)
  }, [])

  const mainCategories = [
    { label: 'Alle Bikes', key: 'Alle Bikes', href: '/produkte' },
    { label: 'Fahrräder', key: 'Fahrräder' },
    { label: 'Teile', key: 'Teile' },
    { label: 'Zubehör', key: 'Zubehör' },
    { label: 'Bekleidung', key: 'Bekleidung' },
    { label: 'Wintersport', key: 'Wintersport' },
  ]

  return (
    <>
      {/* Header */}
      <header className={`relative z-50 bg-white transition-all duration-300 ${
        scrolled ? 'border-b border-gray-200 shadow-sm' : 'border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img src="/images/hero/logo.png" alt="RINOS" className="h-20 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 flex-1 ml-12">
              {/* Direct link to all bikes */}
              <Link
                href="/produkte"
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200"
              >
                Alle Bikes
              </Link>

              {!loading && mainCategories.map((cat) => {
                // Skip "Alle Bikes" since we already rendered it
                if (cat.key === 'Alle Bikes') return null

                const category = categoryTree.find(c => c.category === cat.key)
                if (!category) return null

                const directChildren = category.children || []
                const activeChild = directChildren.find(c => c.categoryid === activeSubmenu)
                const activeGrandchild = activeChild?.children.find(c => c.categoryid === activeSubSubmenu)

                return (
                  <div
                    key={cat.key}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(cat.key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Category Button */}
                    <button
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                        openDropdown === cat.key
                          ? 'text-black'
                          : 'text-gray-900 hover:text-gray-600'
                      }`}
                    >
                      {cat.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === cat.key ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Invisible bridge to prevent gap issues */}
                    {openDropdown === cat.key && (
                      <div className="absolute left-0 w-full h-2 top-full" />
                    )}

                    {/* Mega Dropdown Menu - 3 Column Layout */}
                    <div
                      className={`absolute left-0 top-full bg-white border border-gray-200 shadow-xl z-50 transition-all duration-200 origin-top-left ${
                        openDropdown === cat.key
                          ? 'opacity-100 visible transform scale-100'
                          : 'opacity-0 invisible transform scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="flex">
                        {/* Column 1: Main Subcategories */}
                        <div className="w-56 bg-gray-50 border-r border-gray-200 py-3">
                          <div className="px-4 pb-2 mb-2 border-b border-gray-200">
                            <Link
                              href={`/categories/${cat.key.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
                              className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-black transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              Alle {cat.label} →
                            </Link>
                          </div>
                          {directChildren.map((subcat) => (
                            <div key={subcat.categoryid}>
                              {subcat.children && subcat.children.length > 0 ? (
                                <button
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                    activeSubmenu === subcat.categoryid
                                      ? 'bg-white text-black font-medium border-l-2 border-black'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                  onMouseEnter={() => handleSubmenuEnter(subcat.categoryid)}
                                >
                                  <span>{subcat.category}</span>
                                  <ChevronRight className={`w-4 h-4 transition-opacity ${
                                    activeSubmenu === subcat.categoryid ? 'opacity-100' : 'opacity-40'
                                  }`} />
                                </button>
                              ) : (
                                <Link
                                  href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={() => setOpenDropdown(null)}
                                  onMouseEnter={() => setActiveSubmenu(null)}
                                >
                                  {subcat.category}
                                  {(subcat.product_count || 0) > 0 && (
                                    <span className="text-xs text-gray-400 ml-2">({subcat.product_count})</span>
                                  )}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Column 2: Sub-subcategories */}
                        <div className={`w-56 bg-white border-r border-gray-100 py-3 transition-opacity duration-150 ${
                          activeSubmenu !== null ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {activeChild && (
                            <>
                              <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                                <Link
                                  href={`/categories/${activeChild.category.toLowerCase().replace(/\s+/g, '-')}?id=${activeChild.categoryid}`}
                                  className="text-xs font-semibold text-black uppercase tracking-wide hover:underline"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  Alle {activeChild.category} →
                                </Link>
                              </div>
                              {activeChild.children.map((nested) => (
                                <div key={nested.categoryid}>
                                  {nested.children && nested.children.length > 0 ? (
                                    <button
                                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                                        activeSubSubmenu === nested.categoryid
                                          ? 'bg-gray-50 text-black font-medium'
                                          : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                      onMouseEnter={() => handleSubSubmenuEnter(nested.categoryid)}
                                    >
                                      <span>{nested.category}</span>
                                      <ChevronRight className={`w-3 h-3 transition-opacity ${
                                        activeSubSubmenu === nested.categoryid ? 'opacity-100' : 'opacity-30'
                                      }`} />
                                    </button>
                                  ) : (
                                    <Link
                                      href={`/categories/${nested.category.toLowerCase().replace(/\s+/g, '-')}?id=${nested.categoryid}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                      onClick={() => setOpenDropdown(null)}
                                      onMouseEnter={() => setActiveSubSubmenu(null)}
                                    >
                                      {nested.category}
                                      {(nested.product_count || 0) > 0 && (
                                        <span className="text-xs text-gray-400 ml-1">({nested.product_count})</span>
                                      )}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </>
                          )}
                        </div>

                        {/* Column 3: Third level items */}
                        <div className={`w-56 bg-white py-3 transition-opacity duration-150 ${
                          activeSubSubmenu !== null ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {activeGrandchild && (
                            <>
                              <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                                <Link
                                  href={`/categories/${activeGrandchild.category.toLowerCase().replace(/\s+/g, '-')}?id=${activeGrandchild.categoryid}`}
                                  className="text-xs font-semibold text-black uppercase tracking-wide hover:underline"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  Alle {activeGrandchild.category} →
                                </Link>
                              </div>
                              {activeGrandchild.children.map((item) => (
                                <Link
                                  key={item.categoryid}
                                  href={`/categories/${item.category.toLowerCase().replace(/\s+/g, '-')}?id=${item.categoryid}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {item.category}
                                  {(item.product_count || 0) > 0 && (
                                    <span className="text-xs text-gray-400 ml-1">({item.product_count})</span>
                                  )}
                                </Link>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search - Desktop Only */}
              <Link
                href="/suche"
                className="hidden md:flex p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group hidden md:block">
                  <button className="p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <Link href="/profil" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link href="/bestellungen" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50">
                      Orders
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => useAuthStore.getState().logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/anmelden" className="p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200 hidden md:flex">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200">
                <ShoppingCart className="w-5 h-5" />
                {hydrated && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-24 z-40 bg-white overflow-y-auto">
          <nav className="px-4 py-4">
            {/* All Bikes Link */}
            <Link
              href="/produkte"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-lg font-semibold text-gray-900 border-b border-gray-100"
            >
              Alle Bikes
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>

            {/* Category Accordions */}
            {!loading && mainCategories.map((cat) => {
              if (cat.key === 'Alle Bikes') return null
              const category = categoryTree.find(c => c.category === cat.key)
              if (!category) return null

              const isExpanded = mobileExpandedCategory === cat.key

              return (
                <div key={cat.key} className="border-b border-gray-100">
                  {/* Level 1: Main Category */}
                  <button
                    onClick={() => {
                      setMobileExpandedCategory(isExpanded ? null : cat.key)
                      setMobileExpandedSub(null)
                      setMobileExpandedSubSub(null)
                    }}
                    className="w-full flex items-center justify-between py-4 text-lg font-semibold text-gray-900"
                  >
                    {cat.label}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Level 1 Expanded Content */}
                  {isExpanded && (
                    <div className="pb-4">
                      {/* View All Link */}
                      <Link
                        href={`/categories/${cat.key.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gray-50 rounded-lg mb-2"
                      >
                        Alle {cat.label} ansehen
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      {/* Level 2: Subcategories */}
                      {category.children.map((subcat) => {
                        const isSubExpanded = mobileExpandedSub === subcat.categoryid
                        const hasChildren = subcat.children && subcat.children.length > 0

                        return (
                          <div key={subcat.categoryid}>
                            {hasChildren ? (
                              <>
                                <button
                                  onClick={() => {
                                    setMobileExpandedSub(isSubExpanded ? null : subcat.categoryid)
                                    setMobileExpandedSubSub(null)
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm ${
                                    isSubExpanded ? 'text-black font-medium bg-gray-50' : 'text-gray-700'
                                  }`}
                                >
                                  {subcat.category}
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Level 2 Expanded Content */}
                                {isSubExpanded && (
                                  <div className="ml-4 border-l-2 border-gray-200">
                                    {/* View All Subcat Link */}
                                    <Link
                                      href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500 hover:text-black"
                                    >
                                      Alle {subcat.category} →
                                    </Link>

                                    {/* Level 3: Sub-subcategories */}
                                    {subcat.children.map((nested) => {
                                      const isNestedExpanded = mobileExpandedSubSub === nested.categoryid
                                      const hasNestedChildren = nested.children && nested.children.length > 0

                                      return (
                                        <div key={nested.categoryid}>
                                          {hasNestedChildren ? (
                                            <>
                                              <button
                                                onClick={() => setMobileExpandedSubSub(isNestedExpanded ? null : nested.categoryid)}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${
                                                  isNestedExpanded ? 'text-black font-medium' : 'text-gray-600'
                                                }`}
                                              >
                                                {nested.category}
                                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isNestedExpanded ? 'rotate-180' : ''}`} />
                                              </button>

                                              {/* Level 3 Expanded Content */}
                                              {isNestedExpanded && (
                                                <div className="ml-4 border-l border-gray-100">
                                                  <Link
                                                    href={`/categories/${nested.category.toLowerCase().replace(/\s+/g, '-')}?id=${nested.categoryid}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block px-4 py-2 text-xs font-medium text-gray-500 hover:text-black"
                                                  >
                                                    Alle {nested.category} →
                                                  </Link>
                                                  {nested.children.map((item) => (
                                                    <Link
                                                      key={item.categoryid}
                                                      href={`/categories/${item.category.toLowerCase().replace(/\s+/g, '-')}?id=${item.categoryid}`}
                                                      onClick={() => setMobileMenuOpen(false)}
                                                      className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                                                    >
                                                      {item.category}
                                                    </Link>
                                                  ))}
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <Link
                                              href={`/categories/${nested.category.toLowerCase().replace(/\s+/g, '-')}?id=${nested.categoryid}`}
                                              onClick={() => setMobileMenuOpen(false)}
                                              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-black"
                                            >
                                              {nested.category}
                                            </Link>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-sm text-gray-700 hover:text-black"
                              >
                                {subcat.category}
                              </Link>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Bottom Section: Search, Account */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <Link
                href="/suche"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-base font-medium text-gray-900"
              >
                <Search className="w-5 h-5" />
                Suche
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-base font-medium text-gray-900"
                  >
                    <User className="w-5 h-5" />
                    Mein Profil
                  </Link>
                  <button
                    onClick={() => {
                      useAuthStore.getState().logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 py-3 text-base font-medium text-gray-500 w-full text-left"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <Link
                  href="/anmelden"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-base font-medium text-gray-900"
                >
                  <User className="w-5 h-5" />
                  Anmelden
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
