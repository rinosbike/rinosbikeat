/**
 * Orders Page - /order
 * Display list of user's orders
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Package, ChevronRight, Calendar, Euro, Truck, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  order_detail_id: number
  articlenr: string
  articlename: string
  quantity: number
  price_per_unit: number
  total_price: number
}

interface Order {
  web_order_id: number
  ordernr: string
  orderamount: number
  currency: string
  payment_status: string
  synced_to_erp: boolean
  created_at: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/anmelden')
      return
    }

    fetchOrders()
  }, [isAuthenticated, user, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/web-orders/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Fehler beim Laden der Bestellungen')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('delivered') || statusLower.includes('geliefert')) {
      return 'bg-green-100 text-green-800'
    }
    if (statusLower.includes('shipped') || statusLower.includes('versandt')) {
      return 'bg-blue-100 text-blue-800'
    }
    if (statusLower.includes('processing') || statusLower.includes('bearbeitung')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (statusLower.includes('cancelled') || statusLower.includes('storniert')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('delivered') || statusLower.includes('geliefert')) {
      return <Package className="h-4 w-4" />
    }
    if (statusLower.includes('shipped') || statusLower.includes('versandt')) {
      return <Truck className="h-4 w-4" />
    }
    return <Package className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bestellungen werden geladen...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profil"
            className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
          >
            ← Zurück zum Profil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Meine Bestellungen</h1>
          <p className="mt-2 text-gray-600">
            Übersicht über alle Ihre Bestellungen bei RINOS Bikes
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Fehler beim Laden</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Bestellungen gefunden
            </h2>
            <p className="text-gray-600 mb-6">
              Sie haben noch keine Bestellungen aufgegeben.
            </p>
            <Link
              href="/produkte"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Produkte durchsuchen
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.web_order_id}
                href={`/order/${order.web_order_id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Bestellung #{order.ordernr}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                        {getStatusIcon(order.payment_status)}
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {order.synced_to_erp && (
                        <span className="text-green-600 text-xs">✓ Synchronisiert</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                      <Euro className="h-5 w-5" />
                      {order.orderamount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{order.currency}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 text-blue-600 text-sm font-medium">
                  Details anzeigen
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Placeholder */}
        {orders.length >= 20 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mehr Bestellungen anzeigen (Pagination kommt bald)
          </div>
        )}
      </div>
    </div>
  )
}
