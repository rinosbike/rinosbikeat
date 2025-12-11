/**
 * Admin Dashboard - RINOS CMS
 * Premium Apple/Framer-inspired overview page
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
  Euro,
  FileText,
  Home,
  Sparkles
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
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Bestellungen',
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      href: '/admin/orders',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Ausstehend',
      value: stats?.pending_orders ?? 0,
      icon: Clock,
      href: '/admin/orders?status=pending',
      gradient: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Benutzer',
      value: stats?.total_users ?? 0,
      icon: Users,
      href: '/admin/users',
      gradient: 'from-violet-500 to-violet-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-overline uppercase tracking-widest text-rinos-text-secondary mb-2">
            Willkommen zurück
          </p>
          <h1 className="text-display-sm font-bold text-rinos-dark">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caption text-rinos-text-secondary">
            {new Date().toLocaleDateString('de-DE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4"
          role="alert"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-body-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={loadStats}
            className="text-body-sm font-medium text-red-600 hover:text-red-800
                     px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group bg-white rounded-2xl border border-rinos-border-light p-6
                       hover:border-rinos-border hover:shadow-soft
                       transition-all duration-300 ease-out-expo"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient}
                              flex items-center justify-center shadow-soft
                              transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <ArrowRight className="w-5 h-5 text-rinos-text-secondary opacity-0
                                     group-hover:opacity-100 group-hover:translate-x-1
                                     transition-all duration-300" />
              </div>
              <div>
                <p className="text-caption font-medium text-rinos-text-secondary mb-1">
                  {stat.title}
                </p>
                {loading ? (
                  <div className="h-9 w-24 skeleton rounded-lg" />
                ) : (
                  <p className="text-display-sm font-bold text-rinos-dark">
                    {stat.value.toLocaleString('de-DE')}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-rinos-dark to-black rounded-2xl p-8 text-white
                      relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full
                        transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full
                        transform -translate-x-1/2 translate-y-1/2" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs
                            flex items-center justify-center">
                <Euro className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-body-sm font-medium text-white/60">Umsatz heute</span>
            </div>
            {loading ? (
              <div className="h-12 w-40 bg-white/10 rounded-xl animate-pulse" />
            ) : (
              <p className="text-display font-bold">
                {(stats?.revenue_today ?? 0).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl border border-rinos-border-light p-8
                      relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rinos-bg-secondary rounded-full
                        transform translate-x-1/2 -translate-y-1/2" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rinos-dark
                            flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-body-sm font-medium text-rinos-text-secondary">Umsatz diesen Monat</span>
            </div>
            {loading ? (
              <div className="h-12 w-40 skeleton rounded-xl" />
            ) : (
              <p className="text-display font-bold text-rinos-dark">
                {(stats?.revenue_month ?? 0).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-rinos-border-light overflow-hidden">
        <div className="px-6 py-5 border-b border-rinos-border-light flex items-center justify-between">
          <h2 className="text-title font-semibold text-rinos-dark">Letzte Bestellungen</h2>
          <Link
            href="/admin/orders"
            className="text-body-sm font-medium text-rinos-text-secondary hover:text-rinos-dark
                     flex items-center gap-1.5 group transition-colors"
          >
            Alle anzeigen
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="divide-y divide-rinos-border-light">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="h-11 w-11 skeleton rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 skeleton rounded-lg" />
                  <div className="h-3 w-24 skeleton rounded-lg" />
                </div>
                <div className="h-6 w-24 skeleton rounded-full" />
              </div>
            ))
          ) : stats?.recent_orders?.length ? (
            stats.recent_orders.slice(0, 5).map((order, index) => (
              <Link
                key={order.ordernr}
                href={`/admin/orders/${order.web_order_id}`}
                className="px-6 py-4 flex items-center gap-4 hover:bg-rinos-bg-secondary/50
                         transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`
                  h-11 w-11 rounded-xl flex items-center justify-center
                  ${order.payment_status === 'paid'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                  }
                `}>
                  {order.payment_status === 'paid' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-rinos-dark truncate">
                    {order.ordernr}
                  </p>
                  <p className="text-caption text-rinos-text-secondary">
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
                  <p className="text-body-sm font-semibold text-rinos-dark">
                    {order.orderamount.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: order.currency
                    })}
                  </p>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium
                    ${order.payment_status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : order.payment_status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }
                  `}>
                    {order.payment_status === 'paid' ? 'Bezahlt' :
                     order.payment_status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen'}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rinos-bg-secondary
                            flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-rinos-text-secondary" />
              </div>
              <p className="text-body text-rinos-text-secondary">Keine Bestellungen vorhanden</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-title font-semibold text-rinos-dark mb-5">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            href="/admin/products"
            icon={Package}
            title="Produkte"
            description="Preise & Beschreibungen"
          />
          <QuickActionCard
            href="/admin/orders"
            icon={ShoppingCart}
            title="Bestellungen"
            description="Status & Versand"
          />
          <QuickActionCard
            href="/admin/pages"
            icon={FileText}
            title="Seiten"
            description="Content verwalten"
          />
          <QuickActionCard
            href="/admin/homepage"
            icon={Home}
            title="Startseite"
            description="Hero & Banner"
          />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description
}: {
  href: string
  icon: any
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-rinos-border-light p-5
               hover:border-rinos-border hover:shadow-soft
               transition-all duration-300 ease-out-expo"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-rinos-bg-secondary
                      flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      group-hover:bg-rinos-dark group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-rinos-dark">{title}</p>
          <p className="text-caption text-rinos-text-secondary">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-rinos-text-secondary opacity-0
                             group-hover:opacity-100 transition-all duration-300
                             group-hover:translate-x-1 flex-shrink-0 mt-1" />
      </div>
    </Link>
  )
}
