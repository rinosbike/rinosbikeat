/**
 * Mega Menu Component
 * Multi-level dropdown navigation for categories
 * Features: Smooth hover with delays, proper hover zones, 3-level hierarchy
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { CategoryNode } from '@/lib/categoryTree'

interface MegaMenuProps {
  title: string
  categories: CategoryNode[]
}

// Delay constants for smooth UX
const OPEN_DELAY = 50      // Quick open
const CLOSE_DELAY = 150    // Slower close to allow navigation
const SUBMENU_DELAY = 80   // Delay before switching submenu

export default function MegaMenu({ title, categories }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current)
    }
  }, [])

  // Handle menu open with delay
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true)
      // Auto-select first submenu if exists
      if (categories.length > 0 && categories[0].children.length > 0) {
        setActiveSubmenu(categories[0].categoryid)
      }
    }, OPEN_DELAY)
  }, [categories])

  // Handle menu close with delay
  const handleMouseLeave = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setActiveSubmenu(null)
      setActiveSubSubmenu(null)
    }, CLOSE_DELAY)
  }, [])

  // Handle submenu hover with delay
  const handleSubmenuHover = useCallback((categoryId: number) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
    }
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(categoryId)
      setActiveSubSubmenu(null)
    }, SUBMENU_DELAY)
  }, [])

  // Handle sub-submenu hover
  const handleSubSubmenuHover = useCallback((categoryId: number) => {
    setActiveSubSubmenu(categoryId)
  }, [])

  if (categories.length === 0) return null

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveSubmenu(null)
        setActiveSubSubmenu(null)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const activeCategory = categories.find((cat) => cat.categoryid === activeSubmenu)
  const activeSubCategory = activeCategory?.children.find((cat) => cat.categoryid === activeSubSubmenu)

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-sm font-semibold transition-all py-3 px-2 ${
          isOpen
            ? 'text-black'
            : 'text-gray-700 hover:text-black'
        }`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Invisible bridge to prevent gap issues */}
      {isOpen && (
        <div className="absolute left-0 w-full h-2 top-full" />
      )}

      {/* Mega Dropdown */}
      <div
        className={`absolute left-0 top-full bg-white border border-gray-200 shadow-xl z-50 transition-all duration-200 origin-top ${
          isOpen
            ? 'opacity-100 visible transform scale-100'
            : 'opacity-0 invisible transform scale-95'
        }`}
        style={{ minWidth: '700px' }}
      >
        <div className="flex">
          {/* Level 1: Main Categories Column */}
          <div className="w-56 bg-gray-50 border-r border-gray-200 py-3">
            <div className="px-4 pb-2 mb-2 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {title}
              </span>
            </div>
            {categories.map((category) => (
              <div key={category.categoryid}>
                {category.children.length > 0 ? (
                  <button
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                      activeSubmenu === category.categoryid
                        ? 'bg-white text-rinos-primary font-medium border-l-2 border-rinos-primary'
                        : 'text-rinos-text hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => handleSubmenuHover(category.categoryid)}
                  >
                    <span>{category.category}</span>
                    <ChevronRight className={`w-4 h-4 transition-opacity ${
                      activeSubmenu === category.categoryid ? 'opacity-100' : 'opacity-40'
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={`/categories/${category.category.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
                    className="block px-4 py-2.5 text-sm text-rinos-text hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.category}
                    {category.product_count !== undefined && category.product_count > 0 && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({category.product_count})
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Level 2: Subcategories Column */}
          <div className={`w-56 bg-white border-r border-gray-100 py-3 transition-opacity duration-150 ${
            activeSubmenu !== null ? 'opacity-100' : 'opacity-0'
          }`}>
            {activeCategory && (
              <>
                <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                  <Link
                    href={`/categories/${activeCategory.category.toLowerCase().replace(/\s+/g, '-')}?id=${activeCategory.categoryid}`}
                    className="text-xs font-semibold text-rinos-primary uppercase tracking-wide hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Alle {activeCategory.category} →
                  </Link>
                </div>
                {activeCategory.children.map((subcat) => (
                  <div key={subcat.categoryid}>
                    {subcat.children.length > 0 ? (
                      <button
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                          activeSubSubmenu === subcat.categoryid
                            ? 'bg-gray-50 text-rinos-primary font-medium'
                            : 'text-rinos-text hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => handleSubSubmenuHover(subcat.categoryid)}
                      >
                        <span>{subcat.category}</span>
                        <ChevronRight className={`w-3 h-3 transition-opacity ${
                          activeSubSubmenu === subcat.categoryid ? 'opacity-100' : 'opacity-30'
                        }`} />
                      </button>
                    ) : (
                      <Link
                        href={`/categories/${subcat.category.toLowerCase().replace(/\s+/g, '-')}?id=${subcat.categoryid}`}
                        className="block px-4 py-2 text-sm text-rinos-text hover:bg-gray-50 hover:text-rinos-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                        onMouseEnter={() => setActiveSubSubmenu(null)}
                      >
                        {subcat.category}
                        {subcat.product_count !== undefined && subcat.product_count > 0 && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({subcat.product_count})
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Level 3: Sub-subcategories Column */}
          <div className={`w-56 bg-white py-3 transition-opacity duration-150 ${
            activeSubSubmenu !== null ? 'opacity-100' : 'opacity-0'
          }`}>
            {activeSubCategory && (
              <>
                <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                  <Link
                    href={`/categories/${activeSubCategory.category.toLowerCase().replace(/\s+/g, '-')}?id=${activeSubCategory.categoryid}`}
                    className="text-xs font-semibold text-rinos-primary uppercase tracking-wide hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Alle {activeSubCategory.category} →
                  </Link>
                </div>
                {activeSubCategory.children.map((thirdLevel) => (
                  <Link
                    key={thirdLevel.categoryid}
                    href={`/categories/${thirdLevel.category.toLowerCase().replace(/\s+/g, '-')}?id=${thirdLevel.categoryid}`}
                    className="block px-4 py-2 text-sm text-rinos-text hover:bg-gray-50 hover:text-rinos-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {thirdLevel.category}
                    {thirdLevel.product_count !== undefined && thirdLevel.product_count > 0 && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({thirdLevel.product_count})
                      </span>
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
}

/**
 * Simple Dropdown Menu (for categories without many subcategories)
 * Features: Smooth hover with delays
 */
export function SimpleDropdown({ title, categories }: { title: string; categories: CategoryNode[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true)
    }, OPEN_DELAY)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, CLOSE_DELAY)
  }, [])

  if (categories.length === 0) return null

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-sm font-semibold transition-all py-3 px-2 ${
          isOpen
            ? 'text-black'
            : 'text-gray-700 hover:text-black'
        }`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Invisible bridge to prevent gap issues */}
      {isOpen && (
        <div className="absolute left-0 w-full h-2 top-full" />
      )}

      <div
        className={`absolute left-0 top-full w-56 bg-white border border-gray-200 shadow-xl py-2 z-50 transition-all duration-200 origin-top ${
          isOpen
            ? 'opacity-100 visible transform scale-100'
            : 'opacity-0 invisible transform scale-95'
        }`}
      >
        {categories.map((category) => (
          <Link
            key={category.categoryid}
            href={`/categories/${category.category.toLowerCase().replace(/\s+/g, '-')}?id=${category.categoryid}`}
            className="block px-4 py-2.5 text-sm text-rinos-text hover:bg-gray-50 hover:text-rinos-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {category.category}
            {category.product_count !== undefined && category.product_count > 0 && (
              <span className="text-xs text-gray-400 ml-2">
                ({category.product_count})
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
