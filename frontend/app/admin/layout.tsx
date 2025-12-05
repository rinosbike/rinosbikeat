/**
 * Admin Panel Layout
 * Accessible only to users with is_admin = true
 * Black/white design matching the site aesthetic
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Home,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Shield
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produkte', href: '/admin/products', icon: Package },
  { name: 'Bestellungen', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Startseite', href: '/admin/homepage', icon: Home },
  { name: 'Benutzer', href: '/admin/users', icon: Users },
  { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check authentication and admin status
    if (!isAuthenticated || !user) {
      router.push('/anmelden?redirect=/admin')
      return
    }

    // Check admin status - also check by email for known admins until backend is updated
    const isAdmin = user.is_admin || user.email === 'fjgbu@icloud.com'
    if (!isAdmin) {
      router.push('/profil')
      return
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Lade Admin-Bereich...</p>
        </div>
      </div>
    )
  }

  // Check admin status - also check by email for known admins until backend is updated
  const isAdminUser = user?.is_admin || user?.email === 'fjgbu@icloud.com'
  if (!isAdminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-black transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-black" />
            </div>
            <span className="text-white font-black text-lg">RINOS Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
            aria-label="Sidebar schliessen"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1" role="navigation" aria-label="Admin Navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                  ${isActive
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/profil"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all mb-2"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            Zurück zum Profil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
              aria-label="Sidebar öffnen"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            {/* User info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-black">
                  {user.first_name || user.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
