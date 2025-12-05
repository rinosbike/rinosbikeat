/**
 * Admin Dashboard - Overview Page
 * Shows key metrics and quick actions
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Euro
} from 'lucide-react'
import { adminApi, AdminStats } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
      setError('Statistiken konnten nicht geladen werden')
      // Set default stats for display
      setStats({
        total_products: 0,
        total_orders: 0,
        pending_orders: 0,
        total_users: 0,
        revenue_today: 0,
        revenue_month: 0,
        recent_orders: []
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Produkte',
      value: stats?.total_products ?? 0,
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Bestellungen',
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-green-500'
    },
    {
      title: 'Ausstehend',
      value: stats?.pending_orders ?? 0,
      icon: Clock,
      href: '/admin/orders?status=pending',
      color: 'bg-yellow-500'
    },
    {
      title: 'Benutzer',
      value: stats?.total_users ?? 0,
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">Willkommen im Admin-Bereich</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={loadStats}
            className="ml-auto text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  {loading ? (
                    <div className="h-9 w-20 bg-gray-200 rounded animate-pulse mt-1" />
                  ) : (
                    <p className="text-3xl font-black text-black mt-1">
                      {stat.value.toLocaleString('de-DE')}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
                Details anzeigen
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Euro className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-white/70">Umsatz heute</span>
          </div>
          {loading ? (
            <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black">
              {(stats?.revenue_today ?? 0).toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          )}
        </div>

        <div className="bg-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-black p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-gray-600">Umsatz diesen Monat</span>
          </div>
          {loading ? (
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-black">
              {(stats?.revenue_month ?? 0).toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-black text-black">Letzte Bestellungen</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1"
          >
            Alle anzeigen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))
          ) : stats?.recent_orders?.length ? (
            stats.recent_orders.slice(0, 5).map((order) => (
              <Link
                key={order.ordernr}
                href={`/admin/orders/${order.web_order_id}`}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center
                  ${order.payment_status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}
                `}>
                  {order.payment_status === 'paid' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate">{order.ordernr}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    {order.orderamount.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: order.currency
                    })}
                  </p>
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : order.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }
                  `}>
                    {order.payment_status === 'paid' ? 'Bezahlt' :
                     order.payment_status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen'}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Keine Bestellungen vorhanden</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
        >
          <Package className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-black transition-colors" />
          <p className="font-bold text-black">Produkte verwalten</p>
          <p className="text-sm text-gray-500 mt-1">Preise, Bilder, Beschreibungen</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
        >
          <ShoppingCart className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-black transition-colors" />
          <p className="font-bold text-black">Bestellungen verwalten</p>
          <p className="text-sm text-gray-500 mt-1">Status, Versand, Details</p>
        </Link>

        <Link
          href="/admin/homepage"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
        >
          <TrendingUp className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-black transition-colors" />
          <p className="font-bold text-black">Startseite bearbeiten</p>
          <p className="text-sm text-gray-500 mt-1">Hero, Kategorien, Banner</p>
        </Link>
      </div>
    </div>
  )
}
