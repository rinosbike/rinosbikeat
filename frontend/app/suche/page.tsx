/**
 * Search Results Page - /suche
 * Search products by name, article number, or manufacturer
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { productsApi, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'
import { Search, X } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setError('Bitte geben Sie mindestens 2 Zeichen ein')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await fetch(`/api/search/query?q=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error('Suche fehlgeschlagen')
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Suchfehler:', err)
      setError('Suche konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.length >= 2) {
      router.push(`/suche?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setProducts([])
    setSearched(false)
    setError(null)
    router.push('/suche')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6">
            Produktsuche
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suchen Sie nach Produkten, Artikelnummern oder Marken..."
                className="w-full px-4 py-3 pr-20 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-rinos-primary text-white hover:bg-rinos-primary-dark transition-colors"
                disabled={searchQuery.length < 2}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Suche läuft...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-center py-8 px-4 rounded">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searched && products.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-normal text-gray-900 mb-2">
              Keine Produkte gefunden
            </h2>
            <p className="text-gray-600 mb-4">
              Ihre Suche nach "{query}" ergab keine Treffer.
            </p>
            <p className="text-sm text-gray-500">
              Versuchen Sie es mit anderen Suchbegriffen oder überprüfen Sie die Rechtschreibung.
            </p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && products.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'} gefunden für "{query}"
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}

        {/* Initial State */}
        {!loading && !error && !searched && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Geben Sie einen Suchbegriff ein, um Produkte zu finden
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
