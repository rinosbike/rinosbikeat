/**
 * Orders Page - /order
 * Display list of user's orders with premium design
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Package, ChevronRight, Calendar, Euro, Truck, AlertCircle, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react'
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

  const getPaymentStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('paid')) {
      return 'bg-green-50 border-green-200 text-green-700'
    }
    if (statusLower.includes('pending')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    }
    if (statusLower.includes('failed')) {
      return 'bg-red-50 border-red-200 text-red-700'
    }
    return 'bg-gray-50 border-gray-200 text-gray-700'
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('paid')) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    }
    if (statusLower.includes('pending')) {
      return <Clock className="h-4 w-4 text-yellow-600" />
    }
    return <AlertCircle className="h-4 w-4 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Bestellungen werden geladen...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/profil"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Zurück zum Profil</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Meine Bestellungen</h1>
              <p className="text-gray-300 text-sm mt-1">Alle Ihre Bestellungen bei RINOS Bikes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-900">Fehler beim Laden</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Keine Bestellungen gefunden
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              Sie haben noch keine Bestellungen aufgegeben. Erkunden Sie unsere Produkte und erstellen Sie Ihre erste Bestellung.
            </p>
            <Link
              href="/produkte"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
            >
              Produkte durchsuchen
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Orders Grid */}
            {orders.map((order) => (
              <Link
                key={order.web_order_id}
                href={`/order/${order.web_order_id}`}
                className="block border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-6">
                  {/* Left: Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          Order #{order.ordernr}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString('de-DE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Payment Status Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getPaymentStatusColor(order.payment_status)}`}>
                        {getPaymentStatusBadge(order.payment_status)}
                        <span className="capitalize">
                          {order.payment_status === 'paid' ? 'Bezahlt' : 
                           order.payment_status === 'pending' ? 'Ausstehend' : 
                           order.payment_status}
                        </span>
                      </div>
                      {order.synced_to_erp && (
                        <div className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Synchronisiert
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Arrow */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-3xl font-black text-black">
                        {order.orderamount.toFixed(2)}€
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Gesamtbetrag</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {orders.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Insgesamt <span className="font-bold text-gray-900">{orders.length}</span> {orders.length === 1 ? 'Bestellung' : 'Bestellungen'}
          </div>
        )}
      </div>
    </div>
  )
}

// Import missing Clock icon
import { Clock } from 'lucide-react'

