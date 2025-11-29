/**
 * Product Filters Component
 * Category filters for product catalog
 */

'use client'

import { Bike, Mountain, Package, CircleDot } from 'lucide-react'

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  productsCount: number
  totalCount: number
}

const categories = [
  {
    id: 'all',
    name: 'Alle Fahrräder',
    icon: CircleDot,
  },
  {
    id: 'gravel',
    name: 'Gravel Bikes',
    icon: Bike,
  },
  {
    id: 'road',
    name: 'Rennräder',
    icon: Bike,
  },
  {
    id: 'mountain',
    name: 'Mountainbikes',
    icon: Mountain,
  },
  {
    id: 'foldable',
    name: 'Falträder',
    icon: Package,
  },
]

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  productsCount,
  totalCount,
}: ProductFiltersProps) {
  return (
    <div className="card">
      <h3 className="font-bold mb-4">Kategorien</h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </div>
              {category.id === 'all' && (
                <span
                  className={`text-sm ${
                    isSelected ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {totalCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Results Summary */}
      {selectedCategory !== 'all' && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-blue-600">{productsCount}</span>{' '}
            {productsCount === 1 ? 'Produkt' : 'Produkte'} gefunden
          </p>
        </div>
      )}
    </div>
  )
}
