/**
 * Header Component - Minimal & Edgy Design
 * Modern 2025 aesthetic with bold typography
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { categoriesApi, Category } from '@/lib/api'
import { buildCategoryTree, CategoryNode } from '@/lib/categoryTree'

export default function HeaderMinimal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const { getItemCount } = useCartStore()
  const itemCount = getItemCount()
  const { user, isAuthenticated } = useAuthStore()

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
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
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

                // Collect all subcategories recursively (including nested ones)
                const getAllSubcategories = (node: CategoryNode): CategoryNode[] => {
                  let allSubs: CategoryNode[] = []
                  if (node.children && node.children.length > 0) {
                    for (const child of node.children) {
                      allSubs.push(child)
                      // Recursively get children of children
                      const nested = getAllSubcategories(child)
                      allSubs = allSubs.concat(nested)
                    }
                  }
                  return allSubs
                }

                const allSubcategories = getAllSubcategories(category)

                return (
                  <div
                    key={cat.key}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(cat.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={`/categories/${cat.key.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
                      className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      {cat.label}
                      <ChevronDown className="w-4 h-4" />
                    </Link>

                    {/* Mega Dropdown Menu - Full Width */}
                    <div className="absolute left-0 top-full mt-0 w-[700px] max-h-[70vh] overflow-y-auto bg-white border border-gray-200 shadow-xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1 p-6">
                        {allSubcategories.map((subcat) => (
                          <Link
                            key={subcat.categoryid}
                            href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                            className="group/item flex items-center justify-between px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-150"
                          >
                            <span className="font-medium group-hover/item:text-black truncate">{subcat.category}</span>
                            {(subcat.product_count || 0) > 0 && (
                              <span className="text-xs text-gray-500 font-normal ml-2 flex-shrink-0">({subcat.product_count})</span>
                            )}
                          </Link>
                        ))}
                      </div>
                      {allSubcategories.length > 0 && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <Link
                            href={`/categories/${cat.key.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
                            className="text-sm font-semibold text-black hover:text-gray-600 transition-colors flex items-center gap-2"
                          >
                            View All {cat.label} →
                          </Link>
                        </div>
                      )}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/produktsuche"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Shop
            </Link>

            {!loading && mainCategories.map((cat) => {
              const category = categoryTree.find(c => c.category === cat.key)
              if (!category) return null

              return (
                <div key={cat.key}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === cat.key ? null : cat.key)}
                    className="w-full text-left text-base font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center justify-between"
                  >
                    {cat.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === cat.key ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === cat.key && (
                    <div className="ml-4 mt-2 space-y-2">
                      {category.children.slice(0, 5).map((subcat) => (
                        <Link
                          key={subcat.categoryid}
                          href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {subcat.category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            <hr className="my-3" />
            <Link
              href="/suche"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Search
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    useAuthStore.getState().logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/anmelden"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
