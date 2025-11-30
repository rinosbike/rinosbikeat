/**
 * Mega Menu Component
 * Multi-level dropdown navigation for categories
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { CategoryNode } from '@/lib/categoryTree'

interface MegaMenuProps {
  title: string
  categories: CategoryNode[]
  maxColumns?: number
}

export default function MegaMenu({ title, categories, maxColumns = 4 }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  if (categories.length === 0) return null

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveSubmenu(null)
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
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false)
        setActiveSubmenu(null)
      }}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-normal text-rinos-text hover:opacity-70 transition-opacity py-2"
      >
        <span>{title}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Mega Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-0 bg-white border border-gray-200 shadow-lg z-50 min-w-[600px]">
          <div className="grid grid-cols-3 gap-4 p-6">
            {/* Main Categories Column */}
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.categoryid}>
                  {category.children.length > 0 ? (
                    <button
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between group/item ${
                        activeSubmenu === category.categoryid
                          ? 'bg-gray-100 text-rinos-primary font-medium'
                          : 'text-rinos-text hover:bg-gray-50'
                      }`}
                      onMouseEnter={() => setActiveSubmenu(category.categoryid)}
                    >
                      <span>{category.category}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ) : (
                    <Link
                      href={`/categories/${category.categoryid}`}
                      className="block px-3 py-2 text-sm text-rinos-text hover:bg-gray-50 transition-colors"
                    >
                      {category.category}
                      {category.product_count && category.product_count > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({category.product_count})
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Submenu Column */}
            <div className="col-span-2">
              {activeSubmenu !== null && (
                <div className="grid grid-cols-2 gap-4">
                  {categories
                    .find((cat) => cat.categoryid === activeSubmenu)
                    ?.children.map((subcat) => (
                      <div key={subcat.categoryid} className="space-y-2">
                        <Link
                          href={`/categories/${subcat.categoryid}`}
                          className="block px-3 py-2 text-sm font-medium text-rinos-text hover:text-rinos-primary transition-colors"
                        >
                          {subcat.category}
                          {subcat.product_count && subcat.product_count > 0 && (
                            <span className="text-xs text-gray-500 ml-2 font-normal">
                              ({subcat.product_count})
                            </span>
                          )}
                        </Link>

                        {/* Third Level */}
                        {subcat.children.length > 0 && (
                          <div className="pl-3 space-y-1">
                            {subcat.children.slice(0, 5).map((thirdLevel) => (
                              <Link
                                key={thirdLevel.categoryid}
                                href={`/categories/${thirdLevel.categoryid}`}
                                className="block px-2 py-1 text-xs text-gray-600 hover:text-rinos-primary transition-colors"
                              >
                                {thirdLevel.category}
                                {thirdLevel.product_count && thirdLevel.product_count > 0 && (
                                  <span className="text-xs text-gray-400 ml-1">
                                    ({thirdLevel.product_count})
                                  </span>
                                )}
                              </Link>
                            ))}
                            {subcat.children.length > 5 && (
                              <Link
                                href={`/categories/${subcat.categoryid}`}
                                className="block px-2 py-1 text-xs text-rinos-primary hover:underline"
                              >
                                Alle anzeigen ({subcat.children.length})
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Simple Dropdown Menu (for categories without many subcategories)
 */
export function SimpleDropdown({ title, categories }: { title: string; categories: CategoryNode[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-normal text-rinos-text hover:opacity-70 transition-opacity py-2"
      >
        <span>{title}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 shadow-lg py-2 z-50">
          {categories.map((category) => (
            <Link
              key={category.categoryid}
              href={`/categories/${category.categoryid}`}
              className="block px-4 py-2 text-sm text-rinos-text hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {category.category}
              {category.product_count && category.product_count > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({category.product_count})
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
