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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'Mein Profil'}
                </h1>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.is_admin && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontoinformationen</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">E-Mail-Adresse</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefonnummer</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Mitglied seit</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className={`h-2 w-2 rounded-full ${user.email_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {user.email_verified ? 'E-Mail verifiziert' : 'E-Mail nicht verifiziert'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/order"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Meine Bestellungen</h3>
                <p className="text-sm text-gray-600">Bestellhistorie ansehen</p>
              </div>
            </div>
          </Link>

          <Link
            href="/produkte"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Produkte durchsuchen</h3>
                <p className="text-sm text-gray-600">Neue Bikes entdecken</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Section */}
        {user.is_admin && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Administrator-Bereich</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Als Administrator haben Sie Zugriff auf erweiterte Funktionen zur Verwaltung der Website.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Produkte verwalten
              </button>
              <button className="px-4 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                Bestellungen verwalten
              </button>
              <button className="px-4 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                Benutzer verwalten
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
