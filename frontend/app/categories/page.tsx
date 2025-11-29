/**
 * Categories Page - /kategorie
 * Browse all product categories
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { categoriesApi, type Category } from '@/lib/api'

export default function KategoriePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.categories)
    } catch (err) {
      console.error('Fehler beim Laden der Kategorien:', err)
      setError('Kategorien konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  // Convert category name to URL slug
  const categoryToSlug = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Kategorien
          </h1>
          <p className="text-gray-600 text-lg">
            Entdecken Sie unsere Fahrradkategorien
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Lade Kategorien...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card bg-red-50 border-red-200 text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadCategories} className="btn btn-primary">
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.categoryid}
                href={`/categories/${categoryToSlug(category.category)}?id=${category.categoryid}`}
              >
                <div className="card group cursor-pointer h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Category Image */}
                  {category.categoryimageurl ? (
                    <div className="aspect-video bg-gray-100 overflow-hidden mb-4 rounded-lg">
                      <img
                        src={category.categoryimageurl}
                        alt={category.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-4xl font-bold text-blue-300">
                        {category.category.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Category Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.category}
                    </h3>

                    {category.categorypath && (
                      <p className="text-sm text-gray-600 mb-4">
                        {category.categorypath}
                      </p>
                    )}
                  </div>

                  {/* Product Count */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      {category.product_count} {category.product_count === 1 ? 'Produkt' : 'Produkte'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Categories */}
        {!loading && !error && categories.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-gray-600">Keine Kategorien gefunden.</p>
          </div>
        )}
      </div>
    </div>
  )
}
