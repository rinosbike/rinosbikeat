/**
 * Category Products Page - /kategorie/[slug]
 * Browse products in a specific category
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { categoriesApi, type Category, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('id')

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (categoryId) {
      loadCategoryProducts(parseInt(categoryId))
    }
  }, [categoryId])

  const loadCategoryProducts = async (id: number) => {
    try {
      const response = await categoriesApi.getProducts(id)
      setCategory(response.category)
      setProducts(response.products)
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err)
      setError('Produkte konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      {category && (
        <div className="bg-white border-b">
          <div className="container py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {category.category}
            </h1>
            {category.categorypath && (
              <p className="text-gray-600">
                {category.categorypath}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="container py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Lade Produkte...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card bg-red-50 border-red-200 text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => categoryId && loadCategoryProducts(parseInt(categoryId))}
              className="btn btn-primary"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Results Header */}
        {!loading && !error && (
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {products.length} {products.length === 1 ? 'Fahrrad' : 'Fahrräder'}
            </h2>
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-gray-600">Keine Produkte in dieser Kategorie gefunden.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
