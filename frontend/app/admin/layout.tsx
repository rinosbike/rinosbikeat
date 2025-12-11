/**
 * Admin Panel Layout - RINOS CMS
 * Premium Apple/Framer-inspired design
 * Accessible only to users with is_admin = true
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
  ChevronRight,
  Menu,
  X,
  LogOut,
  FileText,
  ArrowRight,
  Bell,
  Search
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produkte', href: '/admin/products', icon: Package },
  { name: 'Bestellungen', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Seiten', href: '/admin/pages', icon: FileText },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const sidebarWidthClass = sidebarCollapsed ? 'w-20' : 'w-72'
  const mainPaddingClass = sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/anmelden?redirect=/admin')
      return
    }

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
      <div className="min-h-screen bg-rinos-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-rinos-border animate-pulse" />
            <div className="absolute inset-2 rounded-full border-2 border-t-rinos-dark border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-body text-rinos-text-secondary">Lade Admin-Bereich...</p>
        </div>
      </div>
    )
  }

  const isAdminUser = user?.is_admin || user?.email === 'fjgbu@icloud.com'
  if (!isAdminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-rinos-bg-secondary">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full ${sidebarWidthClass}
          bg-rinos-dark transform transition-all duration-500 ease-out-expo
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between h-20 px-6 border-b border-white/10 ${sidebarCollapsed ? 'pl-4 pr-4' : 'px-6'}`}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center
                          shadow-soft transition-transform duration-300 group-hover:scale-105">
              <span className="font-bold text-rinos-dark text-title">R</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-white font-semibold text-title block leading-tight">RINOS</span>
                <span className="text-white/50 text-caption uppercase tracking-wider">CMS Admin</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center
                     text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Sidebar schliessen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6" role="navigation" aria-label="Admin Navigation">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3.5 rounded-xl text-body-sm font-medium
                    transition-all duration-300 ease-out-expo
                    focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0
                    ${isActive
                      ? 'bg-white text-rinos-dark shadow-soft'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                  title={sidebarCollapsed ? item.name : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-rinos-dark' : ''
                  }`} aria-hidden="true" />
                  {!sidebarCollapsed && <span className="flex-1">{item.name}</span>}
                  {isActive && !sidebarCollapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-rinos-dark" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-xl text-body-sm font-medium
                     text-white/60 hover:text-white hover:bg-white/5
                     transition-all duration-200 group`}
          >
            <div className="flex items-center gap-3">
              <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
              {!sidebarCollapsed && <span>Zurück zur Website</span>}
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-body-sm font-medium
                     text-red-400/80 hover:text-red-400 hover:bg-red-500/10
                     transition-all duration-200`}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {!sidebarCollapsed && <span>Abmelden</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${mainPaddingClass} min-h-screen transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-premium border-b border-rinos-border-light">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center
                       text-rinos-dark hover:bg-rinos-bg-secondary transition-all duration-200"
              aria-label="Sidebar öffnen"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Collapse Toggle - Desktop */}
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center text-rinos-text-secondary hover:text-rinos-dark hover:bg-rinos-bg-secondary transition-all duration-200"
              aria-label={sidebarCollapsed ? 'Sidebar öffnen' : 'Sidebar einklappen'}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rinos-text-secondary" />
                <input
                  type="text"
                  placeholder="Suchen..."
                  className="w-full pl-11 pr-4 py-2.5 bg-rinos-bg-secondary rounded-xl
                           text-body-sm text-rinos-dark placeholder:text-rinos-text-secondary
                           border border-transparent
                           focus:border-rinos-border focus:bg-white focus:outline-none
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-xl flex items-center justify-center
                               text-rinos-text-secondary hover:text-rinos-dark hover:bg-rinos-bg-secondary
                               transition-all duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {/* User Avatar - Desktop */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-rinos-border-light">
                <div className="text-right">
                  <p className="text-body-sm font-medium text-rinos-dark">
                    {user.first_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-caption text-rinos-text-secondary">Admin</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rinos-dark flex items-center justify-center">
                  <span className="text-white font-semibold text-body-sm">
                    {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8" role="main">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
