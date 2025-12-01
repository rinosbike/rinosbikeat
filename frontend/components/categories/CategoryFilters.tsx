/**
 * Category Filters Component
 * Filtering and sorting controls for category pages
 * Based on rinosbike.eu Shopify theme
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export interface FilterState {
  availability: 'all' | 'in-stock' | 'out-of-stock'
  priceMin: number | null
  priceMax: number | null
}

interface CategoryFiltersProps {
  totalProducts: number
  currentSort: string
  onSortChange: (sort: string) => void
  onFilterChange?: (filters: FilterState) => void
  minPrice?: number
  maxPrice?: number
}

const sortOptions = [
  { value: 'manual', label: 'Empfohlen' },
  { value: 'best-selling', label: 'Meistverkauft' },
  { value: 'title-ascending', label: 'Alphabetisch, A-Z' },
  { value: 'title-descending', label: 'Alphabetisch, Z-A' },
  { value: 'price-ascending', label: 'Preis, niedrig nach hoch' },
  { value: 'price-descending', label: 'Preis, hoch nach niedrig' },
  { value: 'created-descending', label: 'Datum, neu nach alt' },
  { value: 'created-ascending', label: 'Datum, alt nach neu' }
]

export default function CategoryFilters({
  totalProducts,
  currentSort,
  onSortChange,
  onFilterChange,
  minPrice = 0,
  maxPrice = 10000
}: CategoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    availability: 'all',
    priceMin: null,
    priceMax: null
  })

  const sortRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange?.(updatedFilters)
  }

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      availability: 'all',
      priceMin: null,
      priceMax: null
    }
    setFilters(resetFilters)
    onFilterChange?.(resetFilters)
  }

  const activeFilterCount = [
    filters.availability !== 'all',
    filters.priceMin !== null,
    filters.priceMax !== null
  ].filter(Boolean).length

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Empfohlen'

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Filter Toggle & Product Count */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-sm text-gray-600">
              {totalProducts} {totalProducts === 1 ? 'Produkt' : 'Produkte'}
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
            >
              <span className="text-sm truncate">{currentSortLabel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setShowSortDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === option.value ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-gray-600">Aktive Filter:</span>

            {filters.availability !== 'all' && (
              <button
                onClick={() => handleFilterChange({ availability: 'all' })}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                <span>
                  {filters.availability === 'in-stock' ? 'Auf Lager' : 'Ausverkauft'}
                </span>
                <X className="w-3 h-3" />
              </button>
            )}

            {(filters.priceMin !== null || filters.priceMax !== null) && (
              <button
                onClick={() => handleFilterChange({ priceMin: null, priceMax: null })}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                <span>
                  Preis: {filters.priceMin || minPrice}€ - {filters.priceMax || maxPrice}€
                </span>
                <X className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={handleResetFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
            >
              Alle Filter zurücksetzen
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div
            ref={filterRef}
            className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Availability Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Verfügbarkeit</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Alle' },
                    { value: 'in-stock', label: 'Auf Lager' },
                    { value: 'out-of-stock', label: 'Ausverkauft' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={filters.availability === option.value}
                        onChange={(e) => handleFilterChange({ availability: e.target.value as any })}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Preis</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ''}
                      onChange={(e) => handleFilterChange({ priceMin: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min={minPrice}
                      max={maxPrice}
                    />
                    <span className="text-gray-600">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ''}
                      onChange={(e) => handleFilterChange({ priceMax: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min={minPrice}
                      max={maxPrice}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{minPrice}€</span>
                    <span>{maxPrice}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Zurücksetzen
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Filter anwenden
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
