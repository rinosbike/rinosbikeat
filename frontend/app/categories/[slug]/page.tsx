/**
 * Category Products Page - /categories/[slug]
 * Browse products in a specific category
 * Based on rinosbike.eu Shopify collection pages
 * Updated: MTB and Road bike sections fixed
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { categoriesApi, type Category, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'
import CategoryFilters from '@/components/categories/CategoryFilters'
import Pagination from '@/components/categories/Pagination'
import BikeComparisonSection from '@/components/produkte/BikeComparisonSection'
import FeaturesHighlight from '@/components/produkte/FeaturesHighlight'
import AssemblyGuideSection from '@/components/categories/AssemblyGuideSection'
import SizingChartSection from '@/components/categories/SizingChartSection'
import FrameTestingSection from '@/components/categories/FrameTestingSection'

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()

  // Get category ID from either query param (?id=103) or slug (if slug is numeric)
  const queryId = searchParams.get('id')
  const categoryId = queryId || (params.slug && !isNaN(Number(params.slug)) ? params.slug : null)

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
    } else {
      setError('Keine Kategorie-ID gefunden')
      setLoading(false)
    }
  }, [categoryId])

  // SEO: Update document title and meta tags based on category
  useEffect(() => {
    if (category) {
      const categoryType = getCategoryType()
      let title = ''
      let description = ''

      switch (categoryType) {
        case 'gravel':
          title = 'RINOS Sandman Gravel Bikes | Premium Carbon Gravel Bikes kaufen'
          description = 'Hochwertige Carbon Gravel Bikes von RINOS. Shimano GRX Komponenten, bis 50mm Reifenbreite, perfekt für Bikepacking. 2 Jahre Garantie. Jetzt online kaufen!'
          break
        case 'road':
          title = 'RINOS ODIN Rennräder | Carbon Road Bikes online kaufen'
          description = 'Premium Carbon Rennräder von RINOS. UCI-zertifiziert, Shimano 105 & Ultegra Komponenten, Made in Germany. 2 Jahre Garantie. Jetzt bestellen!'
          break
        case 'mtb':
          title = 'RINOS Mountain Bikes | MTB Carbon Bikes kaufen'
          description = 'Hochwertige Mountain Bikes von RINOS. Robuste Carbon-Rahmen für Trail und Enduro. Premium Komponenten. 2 Jahre Garantie.'
          break
        default:
          title = `${category.category} | RINOS Bikes`
          description = `Entdecke ${category.category} von RINOS. Premium Bikes mit hochwertigen Komponenten zu fairen Preisen.`
      }

      // Update document title
      document.title = title

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)

      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (!ogTitle) {
        ogTitle = document.createElement('meta')
        ogTitle.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitle)
      }
      ogTitle.setAttribute('content', title)

      let ogDescription = document.querySelector('meta[property="og:description"]')
      if (!ogDescription) {
        ogDescription = document.createElement('meta')
        ogDescription.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescription)
      }
      ogDescription.setAttribute('content', description)

      let ogType = document.querySelector('meta[property="og:type"]')
      if (!ogType) {
        ogType = document.createElement('meta')
        ogType.setAttribute('property', 'og:type')
        document.head.appendChild(ogType)
      }
      ogType.setAttribute('content', 'website')
    }
  }, [category])

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

  // Determine category type for conditional rendering
  const getCategoryType = (): 'gravel' | 'road' | 'mtb' | 'default' => {
    const catName = category?.category?.toLowerCase() || ''
    const catPath = category?.categorypath?.toLowerCase() || ''

    if (catName.includes('gravel') || catPath.includes('gravel')) return 'gravel'
    if (catName.includes('road') || catName.includes('straße') || catName.includes('rennrad') || catPath.includes('road')) return 'road'
    if (catName.includes('mtb') || catName.includes('mountain') || catPath.includes('mtb')) return 'mtb'

    return 'default'
  }

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    if (!category || allProducts.length === 0) return null

    const categoryType = getCategoryType()
    let categoryName = category.category

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': categoryName,
      'description': category.categorypath || `${categoryName} von RINOS`,
      'url': typeof window !== 'undefined' ? window.location.href : '',
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': allProducts.length,
        'itemListElement': allProducts.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Product',
            'name': product.articlename,
            'description': product.shortdescription || product.longdescription || product.articlename,
            'offers': {
              '@type': 'Offer',
              'price': product.price,
              'priceCurrency': 'EUR',
              'availability': 'https://schema.org/InStock',
              'seller': {
                '@type': 'Organization',
                'name': 'RINOS Bikes'
              }
            }
          }
        }))
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': typeof window !== 'undefined' ? window.location.origin : ''
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': categoryName
          }
        ]
      }
    }

    return structuredData
  }

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      {category && allProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData())
          }}
        />
      )}

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

      {/* Category-Specific Sections (matching rinosbike.eu sequences) */}
      {!loading && !error && allProducts.length > 0 && (() => {
        const categoryType = getCategoryType()

        switch (categoryType) {
          case 'gravel':
            // Sequence from rinosbike.eu/collections/gravel-bikes
            return (
              <>
                <FeaturesHighlight
                  title="Was macht RINOS Sandman Gravel Bikes besonders?"
                  description="Premium Carbon Gravel Bikes mit hochwertigen Komponenten zu fairen Preisen. Entwickelt für Abenteuer auf jedem Untergrund."
                  columns={4}
                />
                <BikeComparisonSection comparisonType="sandman" />
                <AssemblyGuideSection />
                <SizingChartSection />
                <FrameTestingSection />
              </>
            )

          case 'road':
            // Sequence from rinosbike.eu/collections/road-bikes
            return (
              <>
                <FeaturesHighlight
                  title="Was macht RINOS ODIN Road Bikes besonders?"
                  description="UCI-zertifizierte Carbon-Rahmen, 2 Jahre Garantie, kostenloser EU-Versand, Made in Germany. Hochwertige Rennräder mit Premium-Komponenten."
                  columns={4}
                />
                <SizingChartSection />
              </>
            )

          case 'mtb':
            // Sequence from rinosbike.eu/collections/mtb
            return (
              <>
                <FeaturesHighlight
                  title="Was macht RINOS MTB Bikes besonders?"
                  description="Robuste Mountain Bikes für anspruchsvolles Gelände. Entwickelt für Trail und Enduro."
                  columns={4}
                />
              </>
            )

          default:
            // Default sections for other categories
            return (
              <FeaturesHighlight
                title="Was macht RINOS Bikes besonders?"
                description="Premium Bikes mit hochwertigen Komponenten zu fairen Preisen"
                columns={4}
              />
            )
        }
      })()}
    </div>
  )
}
