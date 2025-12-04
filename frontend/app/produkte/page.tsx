/**
 * Product Catalog Page - /produkte
 * Browse RINOS Bikes - Premium Bike Models + Other Brands
 */

'use client'

import { useEffect, useState } from 'react'
import { categoriesApi, type Product } from '@/lib/api'
import ProductGrid from '@/components/produkte/ProductGrid'
import { Search, X } from 'lucide-react'

interface BikeModel {
  name: string
  slug: string
  searchTerm: string
  description: string
}

const bikeModels: BikeModel[] = [
  {
    name: 'Sandman',
    slug: 'sandman',
    searchTerm: 'sandman',
    description: 'Premium Gravel Bikes für Abenteuer ohne Grenzen'
  },
  {
    name: 'ODIN',
    slug: 'odin',
    searchTerm: 'odin',
    description: 'UCI-zertifizierte Carbon Rennräder für pure Performance'
  },
  {
    name: 'Gaia',
    slug: 'gaia',
    searchTerm: 'gaia',
    description: 'Robuste Mountain Bikes für anspruchsvolles Gelände'
  },
]

export default function ProduktePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brands, setBrands] = useState<string[]>([])

  // Filter states
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters()
  }, [products, selectedModel, selectedBrand, searchQuery])

  const loadProducts = async () => {
    try {
      // Fetch bikes from the three main bike categories
      // 103 = Gravel Bikes (Sandman)
      // 46 = Straßenrennräder (ODIN)
      // 102 = MTB (Gaia)
      const [gravelRes, roadRes, mtbRes] = await Promise.all([
        categoriesApi.getProducts(103, 0, 100),
        categoriesApi.getProducts(46, 0, 100),
        categoriesApi.getProducts(102, 0, 100),
      ])

      const allProducts = [
        ...(gravelRes.products || []),
        ...(roadRes.products || []),
        ...(mtbRes.products || []),
      ]

      setProducts(allProducts)

      // Extract unique brands
      const uniqueBrands = Array.from(
        new Set(
          allProducts
            .map((p: any) => p.manufacturer)
            .filter(Boolean)
            .map((b: string) => b?.trim())
            .sort()
        )
      ) as string[]

      setBrands(uniqueBrands)
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err)
      setError('Produkte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by bike model - case insensitive search
    if (selectedModel !== 'all') {
      const model = bikeModels.find(m => m.slug === selectedModel)
      if (model) {
        filtered = filtered.filter((product) => {
          const articleName = product.articlename?.toLowerCase() || ''
          const shortDesc = product.shortdescription?.toLowerCase() || ''
          const searchTerm = model.searchTerm.toLowerCase()
          
          return articleName.includes(searchTerm) || shortDesc.includes(searchTerm)
        })
      }
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((product) =>
        product.manufacturer?.toLowerCase() === selectedBrand.toLowerCase()
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

    setFilteredProducts(filtered)
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setSelectedBrand('all') // Reset brand when changing model
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedModel('all') // Reset model when changing brand
  }

  const clearFilters = () => {
    setSelectedModel('all')
    setSelectedBrand('all')
    setSearchQuery('')
  }

  const rinosBikes = products.filter(p => p.manufacturer?.toLowerCase().includes('rinos'))
  const otherBikes = products.filter(p => !p.manufacturer?.toLowerCase().includes('rinos'))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
      {/* Premium Hero Banner with Image */}
      <div className="relative h-96 md:h-[500px] bg-black overflow-hidden">
        {/* Background Image */}
        <img
          src="https://rinosbike.com/cdn/shop/files/SnapInsta.to_545505071_18075032927516140_6687439362698984429_n.jpg?v=1762244599&width=3000"
          alt="RINOS Bikes Hero"
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content Overlay - Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Alle Bikes
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl">
            RINOS Premium Bikes + exklusive Partnermarken. Insgesamt {products.length} Fahrräder.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Compact Search & Filter Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Nach Bike-Modell, Marke oder Größe suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-colors text-sm md:text-base"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Modern Compact Filter Bar */}
        <div className="mb-10 bg-gradient-to-r from-white via-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
          {/* RINOS Models Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-sm font-black text-black uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="bg-black text-white px-2.5 py-1 rounded-full text-xs">RINOS</span>
              Premium Bikes
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleModelChange('all')}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                  selectedModel === 'all' && selectedBrand === 'all'
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-gray-300 text-black hover:border-black'
                }`}
              >
                Alle RINOS
              </button>
              
              {bikeModels.map((model) => {
                const count = products.filter(p => {
                  const name = p.articlename?.toLowerCase() || ''
                  const desc = p.shortdescription?.toLowerCase() || ''
                  const term = model.searchTerm.toLowerCase()
                  return name.includes(term) || desc.includes(term)
                }).length
                return (
                  <button
                    key={model.slug}
                    onClick={() => handleModelChange(model.slug)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                      selectedModel === model.slug
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-gray-300 text-black hover:border-black'
                    }`}
                  >
                    {model.name} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Partner Brands Section */}
          <div>
            <h2 className="text-sm font-black text-black uppercase tracking-wider mb-3">
              Partner Marken
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBrandChange('all')}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                  selectedBrand === 'all' && selectedModel === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 text-black hover:border-blue-600'
                }`}
              >
                Alle ({otherBikes.length})
              </button>
              
              {brands.slice(0, 8).map((brand) => {
                const brandCount = products.filter(p =>
                  p.manufacturer?.toLowerCase() === brand.toLowerCase()
                ).length
                const isRinos = brand.toLowerCase().includes('rinos')

                if (isRinos) return null

                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                      selectedBrand === brand
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-300 text-black hover:border-blue-600'
                    }`}
                  >
                    {brand} ({brandCount})
                  </button>
                )
              })}
              
              {brands.length > 8 && (
                <button
                  onClick={() => handleBrandChange('all')}
                  className="px-4 py-2 rounded-full font-semibold text-sm bg-white border-2 border-gray-300 text-black hover:border-gray-400 transition-all duration-300"
                >
                  +{brands.length - 8} mehr
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedModel !== 'all' || selectedBrand !== 'all' || searchQuery) && (
          <div className="mb-6 pb-6 border-b border-gray-200 flex flex-wrap gap-2 items-center">
            {selectedModel !== 'all' && (
              <button
                onClick={() => setSelectedModel('all')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full hover:bg-gray-900 transition-colors font-semibold text-xs"
              >
                {bikeModels.find(m => m.slug === selectedModel)?.name}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedBrand !== 'all' && (
              <button
                onClick={() => setSelectedBrand('all')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold text-xs"
              >
                {selectedBrand}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition-colors font-semibold text-xs"
              >
                "{searchQuery}"
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {(selectedModel !== 'all' || selectedBrand !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-gray-600 hover:text-black transition-colors ml-auto"
              >
                Alle Filter löschen
              </button>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-black">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Bike' : 'Bikes'}
          </h2>
          {(selectedModel !== 'all' || selectedBrand !== 'all' || searchQuery) && (
            <p className="text-sm text-gray-600 mt-1">
              Aus {products.length} verfügbaren Produkten
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600 text-lg">Lade Bikes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl text-center py-12 px-6">
            <p className="text-red-600 mb-6 text-lg font-semibold">{error}</p>
            <button
              onClick={loadProducts}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 text-center py-20 px-6">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black text-black mb-3">
              Keine Bikes gefunden
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery
                ? `Keine Ergebnisse für "${searchQuery}"`
                : 'Versuche einen anderen Filter'}
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  )
}
