/**
 * User Profile Page - /profil
 * Displays user information and account management
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { User, Mail, Phone, Calendar, Shield, LogOut, Package, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/anmelden')
      return
    }
    setLoading(false)
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  const userFullName = user.first_name || user.last_name 
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Mein Profil'

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-black rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-1">{userFullName}</h1>
                <p className="text-gray-300 font-medium">{user.email}</p>
                {user.is_admin && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white text-black rounded-full text-xs font-black">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-black mb-6">Kontoinformationen</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <Mail className="h-5 w-5 text-black mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-gray-600 mb-1">E-Mail-Adresse</p>
                <p className="text-lg text-black font-medium">{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <Phone className="h-5 w-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-black text-gray-600 mb-1">Telefonnummer</p>
                  <p className="text-lg text-black font-medium">{user.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <Calendar className="h-5 w-5 text-black mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-gray-600 mb-1">Mitglied seit</p>
                <p className="text-lg text-black font-medium">
                  {new Date(user.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 ${user.email_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="text-sm font-black text-gray-600 mb-1">Verifizierungsstatus</p>
                <p className="text-lg text-black font-medium">
                  {user.email_verified ? 'E-Mail verifiziert' : 'E-Mail nicht verifiziert'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/order"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-black text-lg mb-1">Meine Bestellungen</h3>
                <p className="text-sm text-gray-600">Bestellhistorie ansehen</p>
              </div>
              <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0">
                <Package className="h-6 w-6 group-hover:text-black text-white" />
              </div>
            </div>
          </Link>

          <Link
            href="/produkte"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-black text-lg mb-1">Produkte durchsuchen</h3>
                <p className="text-sm text-gray-600">Neue Bikes entdecken</p>
              </div>
              <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0">
                <Heart className="h-6 w-6 group-hover:text-black text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Section */}
        {(user.is_admin || user.email === 'fjgbu@icloud.com') && (
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Administrator-Bereich</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Zugriff auf alle Verwaltungsfunktionen</p>
                </div>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors font-black text-center"
              >
                Admin-Panel öffnen
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-xl hover:bg-gray-700 hover:border-white/40 transition-colors"
              >
                <Package className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Produkte</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-xl hover:bg-gray-700 hover:border-white/40 transition-colors"
              >
                <Package className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Bestellungen</span>
              </Link>
              <Link
                href="/admin/homepage"
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-white/20 rounded-xl hover:bg-gray-700 hover:border-white/40 transition-colors"
              >
                <Package className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Startseite</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
