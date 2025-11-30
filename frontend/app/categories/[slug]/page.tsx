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
    setLoading(true)
    setError(null)

    try {
      console.log('Loading products for category:', id)

      // Set a timeout for the API call
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )

      const apiPromise = categoriesApi.getProducts(id)

      const response = await Promise.race([apiPromise, timeoutPromise]) as any

      console.log('Products loaded:', response.products?.length || 0)
      setCategory(response.category)
      setProducts(response.products || [])
    } catch (err: any) {
      console.error('Fehler beim Laden der Produkte:', err)
      const errorMessage = err.message === 'Request timeout'
        ? 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.'
        : err.response?.data?.detail || 'Produkte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header - Shopify Style */}
      {category && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-2">
              {category.category}
            </h1>
            {category.categorypath && (
              <p className="text-gray-600 text-sm">
                {category.categorypath}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rinos-primary mb-4"></div>
            <p className="text-gray-600">Lade Produkte...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-center py-8 px-4">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => categoryId && loadCategoryProducts(parseInt(categoryId))}
              className="bg-rinos-primary text-white px-6 py-2 hover:opacity-90 transition-opacity"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Results Header */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {products.length} {products.length === 1 ? 'Fahrrad' : 'Fahrräder'}
            </p>
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
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
