/**
 * Category Filters Component
 * Filtering and sorting controls for category pages
 * Based on rinosbike.eu Shopify theme
 */

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CategoryFiltersProps {
  totalProducts: number
  currentSort: string
  onSortChange: (sort: string) => void
  filters?: {
    colors?: string[]
    sizes?: string[]
    priceRange?: { min: number; max: number }
  }
  onFilterChange?: (filters: any) => void
}

export default function CategoryFilters({
  totalProducts,
  currentSort,
  onSortChange,
  filters,
  onFilterChange,
}: CategoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<any>({})

  const sortOptions = [
    { value: 'manual', label: 'Empfohlen' },
    { value: 'best-selling', label: 'Meistverkauft' },
    { value: 'title-ascending', label: 'Alphabetisch, A-Z' },
    { value: 'title-descending', label: 'Alphabetisch, Z-A' },
    { value: 'price-ascending', label: 'Preis, niedrig nach hoch' },
    { value: 'price-descending', label: 'Preis, hoch nach niedrig' },
    { value: 'created-descending', label: 'Datum, neu nach alt' },
    { value: 'created-ascending', label: 'Datum, alt nach neu' },
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Left: Filter Button & Product Count */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>

            <div className="text-sm text-gray-600">
              {totalProducts} {totalProducts === 1 ? 'Produkt' : 'Produkte'}
            </div>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sortieren nach:
            </label>
            <div className="relative">
              <select
                id="sort"
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Expandable Filters Section */}
        {showFilters && (
          <div className="py-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Preis</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Von"
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Bis"
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Color Filter - if available */}
              {filters?.colors && filters.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Farbe</h3>
                  <div className="space-y-2">
                    {filters.colors.map((color) => (
                      <label key={color} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Filter - if available */}
              {filters?.sizes && filters.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Größe</h3>
                  <div className="space-y-2">
                    {filters.sizes.map((size) => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply/Clear Buttons */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                Filter anwenden
              </button>
              <button
                onClick={() => setSelectedFilters({})}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Filter zurücksetzen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
