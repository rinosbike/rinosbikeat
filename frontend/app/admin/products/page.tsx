/**
 * Admin Products Management Page
 * List, search, filter and manage products
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Package,
  AlertCircle,
  X,
  RefreshCw
} from 'lucide-react'
import { adminApi, AdminProduct } from '@/lib/api'

type SortField = 'articlename' | 'priceEUR' | 'articlenr' | 'manufacturer'
type SortOrder = 'asc' | 'desc'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const pageSize = 20

  // Filters
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [filterManufacturer, setFilterManufacturer] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showFatherOnly, setShowFatherOnly] = useState(false)
  const [sortField, setSortField] = useState<SortField>('articlename')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Filter options (loaded from API)
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [productTypes, setProductTypes] = useState<string[]>([])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await adminApi.getProducts({
        page,
        page_size: pageSize,
        search: searchDebounced || undefined,
        manufacturer: filterManufacturer || undefined,
        type: filterType || undefined,
        father_only: showFatherOnly || undefined,
        sort_by: sortField,
        sort_order: sortOrder
      })

      setProducts(response.products)
      setTotalPages(response.total_pages)
      setTotalProducts(response.total)

      // Extract filter options from first load
      if (manufacturers.length === 0 && response.manufacturers) {
        setManufacturers(response.manufacturers)
      }
      if (productTypes.length === 0 && response.product_types) {
        setProductTypes(response.product_types)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Produkte konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }, [page, searchDebounced, filterManufacturer, filterType, showFatherOnly, sortField, sortOrder, manufacturers.length, productTypes.length])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const clearFilters = () => {
    setSearch('')
    setFilterManufacturer('')
    setFilterType('')
    setShowFatherOnly(false)
    setPage(1)
  }

  const hasActiveFilters = search || filterManufacturer || filterType || showFatherOnly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Produkte</h1>
          <p className="text-gray-600 mt-1">
            {totalProducts.toLocaleString('de-DE')} Produkte insgesamt
          </p>
        </div>
        <button
          onClick={loadProducts}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          aria-label="Produkte neu laden"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Suche nach Name, Artikelnummer, Hersteller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              aria-label="Produkte durchsuchen"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Suche löschen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors
              ${showFilters || hasActiveFilters
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full">
                {[search, filterManufacturer, filterType, showFatherOnly].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filter-manufacturer" className="block text-sm font-semibold text-gray-700 mb-1">
                Hersteller
              </label>
              <select
                id="filter-manufacturer"
                value={filterManufacturer}
                onChange={(e) => { setFilterManufacturer(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Alle Hersteller</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-type" className="block text-sm font-semibold text-gray-700 mb-1">
                Typ
              </label>
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Alle Typen</option>
                {productTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-field" className="block text-sm font-semibold text-gray-700 mb-1">
                Sortieren nach
              </label>
              <div className="flex gap-2">
                <select
                  id="sort-field"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="articlename">Name</option>
                  <option value="priceEUR">Preis</option>
                  <option value="articlenr">Artikelnr.</option>
                  <option value="manufacturer">Hersteller</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100"
                  aria-label={`Sortierung ${sortOrder === 'asc' ? 'absteigend' : 'aufsteigend'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFatherOnly}
                  onChange={(e) => { setShowFatherOnly(e.target.checked); setPage(1) }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Nur Hauptprodukte</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-500 hover:text-black"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button
            onClick={loadProducts}
            className="text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700">Produkt</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700 hidden md:table-cell">Artikelnr.</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700 hidden lg:table-cell">Hersteller</th>
                <th scope="col" className="text-right px-6 py-4 text-sm font-bold text-gray-700">Preis</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-bold text-gray-700">Typ</th>
                <th scope="col" className="text-right px-6 py-4 text-sm font-bold text-gray-700">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Keine Produkte gefunden</p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-2 text-sm font-medium text-black hover:underline"
                      >
                        Filter zurücksetzen
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.primary_image ? (
                            <Image
                              src={product.primary_image}
                              alt={product.articlename}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-black truncate max-w-xs">
                            {product.articlename}
                          </p>
                          {product.colour && (
                            <p className="text-sm text-gray-500 truncate">
                              {product.colour} {product.size && `• ${product.size}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <code className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.articlenr}
                      </code>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-600 text-sm">
                      {product.manufacturer || '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-black">
                      {(product.priceEUR ?? 0).toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.isfatherarticle ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Hauptprodukt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Variante
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/produkte/${product.articlenr}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label={`Produkt ${product.articlename} ansehen`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.articlenr}`}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label={`Produkt ${product.articlename} bearbeiten`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Seite {page} von {totalPages} ({totalProducts.toLocaleString('de-DE')} Produkte)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Vorherige Seite"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-colors
                        ${page === pageNum
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Nächste Seite"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
