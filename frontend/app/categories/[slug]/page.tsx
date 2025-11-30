/**
 * Category Products Page - /categories/[slug]
 * Browse products in a specific category
 * Based on rinosbike.eu Shopify collection pages
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { categoriesApi, type Category, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'
import CategoryFilters from '@/components/categories/CategoryFilters'
import Pagination from '@/components/categories/Pagination'

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('id')

  const [category, setCategory] = useState<Category | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 16

  // Sort state
  const [sortBy, setSortBy] = useState('manual')

  useEffect(() => {
    if (categoryId) {
      loadCategoryProducts(parseInt(categoryId))
    }
  }, [categoryId])

  useEffect(() => {
    // Apply sorting and pagination
    let sorted = [...allProducts]

    // Apply sorting
    switch (sortBy) {
      case 'price-ascending':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-descending':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'title-ascending':
        sorted.sort((a, b) => a.articlename.localeCompare(b.articlename))
        break
      case 'title-descending':
        sorted.sort((a, b) => b.articlename.localeCompare(a.articlename))
        break
      case 'created-descending':
        sorted.sort((a, b) => b.productid - a.productid)
        break
      case 'created-ascending':
        sorted.sort((a, b) => a.productid - b.productid)
        break
      default:
        // manual/best-selling - keep original order
        break
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    setDisplayedProducts(sorted.slice(startIndex, endIndex))
  }, [allProducts, sortBy, currentPage])

  const loadCategoryProducts = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Loading products for category:', id)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )

      const apiPromise = categoriesApi.getProducts(id, 0, 100) // Load more products

      const response = await Promise.race([apiPromise, timeoutPromise]) as any

      console.log('Products loaded:', response.products?.length || 0)
      setCategory(response.category)
      setAllProducts(response.products || [])
      setCurrentPage(1) // Reset to first page
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

  const totalPages = Math.ceil(allProducts.length / productsPerPage)

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product grid
    document.getElementById('product-grid-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      {category && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-2">
              {category.category}
            </h1>
            {category.categorypath && (
              <p className="text-sm text-gray-600">
                {category.categorypath}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Filters & Sorting */}
      {!loading && !error && allProducts.length > 0 && (
        <CategoryFilters
          totalProducts={allProducts.length}
          currentSort={sortBy}
          onSortChange={handleSortChange}
        />
      )}

      <div id="product-grid-container" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Lade Produkte...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-center py-8 px-4 rounded">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => categoryId && loadCategoryProducts(parseInt(categoryId))}
              className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* No Products */}
        {!loading && !error && allProducts.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-normal text-gray-900 mb-2">
              Keine Produkte gefunden
            </h2>
            <p className="text-gray-600">
              In dieser Kategorie sind derzeit keine Produkte verfügbar.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && displayedProducts.length > 0 && (
          <>
            <ProductGrid products={displayedProducts} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
