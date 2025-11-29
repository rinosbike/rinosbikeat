/**
 * Product Catalog Page - /produkte
 * Browse all RINOS Bikes products with filtering
 */

'use client'

import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'
import ProductFilters from '@/components/produkte/ProductFilters'
import { Search } from 'lucide-react'

export default function ProduktePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters()
  }, [products, selectedCategory, searchQuery])

  const loadProducts = async () => {
  try {
    const response = await productsApi.getAll()
    setProducts(response.products)
    setFilteredProducts(response.products)
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err)
      setError('Produkte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.productgroup?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.articlename.toLowerCase().includes(query) ||
          product.articlenr.toLowerCase().includes(query) ||
          product.shortdescription?.toLowerCase().includes(query)
      )
    }

    // Only show active products
    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Unsere Fahrräder
          </h1>
          <p className="text-gray-600 text-lg">
            Entdecken Sie unsere Premium-Auswahl an Fahrrädern
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilters
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                productsCount={filteredProducts.length}
                totalCount={products.length}
              />

              {/* Search */}
              <div className="card mt-6">
                <h3 className="font-bold mb-3">Suche</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Fahrrad suchen..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="input pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory !== 'all' || searchQuery) && (
                <div className="card mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">Aktive Filter</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Zurücksetzen
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedCategory !== 'all' && (
                      <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm">{getCategoryName(selectedCategory)}</span>
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {searchQuery && (
                      <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm">"{searchQuery}"</span>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <main className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Fahrrad' : 'Fahrräder'}
                </h2>
                {(selectedCategory !== 'all' || searchQuery) && (
                  <p className="text-sm text-gray-600 mt-1">
                    Gefiltert aus {products.filter((p) => p.is_active).length} Produkten
                  </p>
                )}
              </div>

              {/* Sort (for future implementation) */}
              {/* <select className="input w-auto">
                <option>Preis: Niedrig zu Hoch</option>
                <option>Preis: Hoch zu Niedrig</option>
                <option>Name: A-Z</option>
              </select> */}
            </div>

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
                <button onClick={loadProducts} className="btn btn-primary">
                  Erneut versuchen
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="card text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">
                  Keine Produkte gefunden
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `Keine Ergebnisse für "${searchQuery}"`
                    : 'Versuchen Sie andere Filter'}
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Filter zurücksetzen
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <ProductGrid products={filteredProducts} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// Helper function to get category display name
function getCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    gravel: 'Gravel Bikes',
    road: 'Rennräder',
    mountain: 'Mountainbikes',
    foldable: 'Falträder',
  }
  return names[category.toLowerCase()] || category
}
