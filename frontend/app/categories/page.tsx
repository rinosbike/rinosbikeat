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
    <div className="min-h-screen bg-white">
      {/* Page Header - Shopify Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-2">
            Kategorien
          </h1>
          <p className="text-gray-600 text-base">
            Entdecken Sie unsere Fahrradkategorien
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rinos-primary mb-4"></div>
            <p className="text-gray-600">Lade Kategorien...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-center py-8 px-4">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadCategories}
              className="bg-rinos-primary text-white px-6 py-2 hover:opacity-90 transition-opacity"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.categoryid}
                href={`/categories/${categoryToSlug(category.category)}?id=${category.categoryid}`}
                className="group block"
              >
                <div className="bg-white h-full flex flex-col">
                  {/* Category Image */}
                  {category.categoryimageurl ? (
                    <div className="aspect-square bg-rinos-bg-secondary overflow-hidden mb-3">
                      <img
                        src={category.categoryimageurl}
                        alt={category.category}
                        className="w-full h-full object-contain group-hover:opacity-90 transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 mb-3 flex items-center justify-center">
                      <div className="text-6xl font-bold text-white opacity-30">
                        {category.category.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Category Info */}
                  <div className="flex-grow">
                    <h3 className="text-base font-normal text-rinos-text mb-1 group-hover:underline">
                      {category.category}
                    </h3>

                    {category.product_count !== undefined && (
                      <p className="text-sm text-gray-600">
                        {category.product_count} {category.product_count === 1 ? 'Produkt' : 'Produkte'}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Categories */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">Keine Kategorien gefunden.</p>
          </div>
        )}
      </div>
    </div>
  )
}
