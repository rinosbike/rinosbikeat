/**
 * Admin Orders Management Page
 * Mobile-first design with card layout for small screens
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  AlertCircle,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Package
} from 'lucide-react'
import { adminApi, AdminOrder } from '@/lib/api'

type OrderStatus = 'all' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  paid: { label: 'Bezahlt', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  processing: { label: 'In Bearbeitung', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Versendet', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Zugestellt', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-700', icon: XCircle },
  failed: { label: 'Fehlgeschlagen', color: 'bg-red-100 text-red-700', icon: XCircle }
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStatus = (searchParams.get('status') as OrderStatus) || 'all'

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const pageSize = 20

  // Filters
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus>(initialStatus)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await adminApi.getOrders({
        page,
        page_size: pageSize,
        search: searchDebounced || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined
      })

      setOrders(response.orders)
      setTotalPages(response.total_pages)
      setTotalOrders(response.total)
    } catch (err) {
      console.error('Failed to load orders:', err)
      setError('Bestellungen konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }, [page, searchDebounced, statusFilter, dateFrom, dateTo])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Update URL when status filter changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') {
      params.set('status', statusFilter)
    }
    router.replace(`/admin/orders${params.toString() ? `?${params}` : ''}`, { scroll: false })
  }, [statusFilter, router])

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const hasActiveFilters = search || statusFilter !== 'all' || dateFrom || dateTo

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="h-3 w-3" aria-hidden="true" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">Bestellungen</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {totalOrders.toLocaleString('de-DE')} Bestellungen insgesamt
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
          aria-label="Bestellungen neu laden"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </button>
      </div>

      {/* Status Quick Filters - Mobile-friendly horizontal scroll */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2">
          {[
            { value: 'all', label: 'Alle' },
            { value: 'pending', label: 'Ausstehend' },
            { value: 'paid', label: 'Bezahlt' },
            { value: 'processing', label: 'Bearbeitung' },
            { value: 'shipped', label: 'Versendet' },
            { value: 'delivered', label: 'Zugestellt' }
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => { setStatusFilter(status.value as OrderStatus); setPage(1) }}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
                ${statusFilter === status.value
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Bestellnr., E-Mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              aria-label="Bestellungen durchsuchen"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
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
              inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors
              ${showFilters || hasActiveFilters
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4" />
            <span className="sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full">!</span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date-from" className="block text-sm font-semibold text-gray-700 mb-1">
                Von Datum
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="date-to" className="block text-sm font-semibold text-gray-700 mb-1">
                Bis Datum
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {hasActiveFilters && (
              <div className="sm:col-span-2">
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-500 hover:text-black"
                >
                  Alle Filter zurücksetzen
                </button>
              </div>
            )}
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
            onClick={loadOrders}
            className="text-red-600 hover:text-red-800 text-sm font-semibold whitespace-nowrap"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Orders List - Mobile Cards / Desktop Table */}
      {loading ? (
        // Loading skeleton - Cards for mobile
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-48 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-2">Keine Bestellungen gefunden</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-black hover:underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <Link
                key={order.web_order_id}
                href={`/admin/orders/${order.web_order_id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-black hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-black">{order.ordernr}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.payment_status)}
                </div>

                {order.customer_email && (
                  <p className="text-sm text-gray-600 truncate mb-3">
                    {order.customer_name || order.customer_email}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-lg font-black text-black">
                    {order.orderamount.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: order.currency || 'EUR'
                    })}
                  </p>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    Details <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700">Bestellung</th>
                    <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700">Kunde</th>
                    <th scope="col" className="text-left px-6 py-4 text-sm font-bold text-gray-700">Datum</th>
                    <th scope="col" className="text-right px-6 py-4 text-sm font-bold text-gray-700">Betrag</th>
                    <th scope="col" className="text-center px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                    <th scope="col" className="text-right px-6 py-4 text-sm font-bold text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.web_order_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-black">{order.ordernr}</p>
                        {order.synced_to_erp && (
                          <span className="text-xs text-gray-500">Sync: ERP</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          {order.customer_name && (
                            <p className="font-medium text-black truncate">{order.customer_name}</p>
                          )}
                          <p className="text-sm text-gray-500 truncate">{order.customer_email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-black whitespace-nowrap">
                        {order.orderamount.toLocaleString('de-DE', {
                          style: 'currency',
                          currency: order.currency || 'EUR'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/admin/orders/${order.web_order_id}`}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label={`Bestellung ${order.ordernr} anzeigen`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600 order-2 sm:order-1">
            Seite {page} von {totalPages}
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex-1 sm:flex-none p-2 sm:px-4 sm:py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
              aria-label="Vorherige Seite"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </button>

            {/* Page number input for mobile */}
            <div className="sm:hidden flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value)
                  if (newPage >= 1 && newPage <= totalPages) {
                    setPage(newPage)
                  }
                }}
                className="w-16 px-2 py-2 text-center border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Seitennummer"
              />
              <span className="text-gray-500 text-sm">/ {totalPages}</span>
            </div>

            {/* Page numbers for desktop */}
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
              className="flex-1 sm:flex-none p-2 sm:px-4 sm:py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
              aria-label="Nächste Seite"
            >
              <span className="hidden sm:inline">Weiter</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
