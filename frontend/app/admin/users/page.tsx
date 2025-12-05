/**
 * Admin Users Management
 * View and manage all registered users
 * Mobile-first responsive design
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ChevronRight,
  Shield,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreVertical
} from 'lucide-react'
import { adminApi, AdminUser, AdminUsersResponse } from '@/lib/api'

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminUsersResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load users
  useEffect(() => {
    loadUsers()
  }, [debouncedSearch, currentPage])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminApi.getUsers({
        page: currentPage,
        page_size: 50,
        search: debouncedSearch
      })
      setData(response)
    } catch (err) {
      console.error('Failed to load users:', err)
      setError('Benutzer konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">Benutzer</h1>
          <p className="text-gray-600 mt-1 text-sm">Verwalte alle registrierten Kunden ({data?.total || 0})</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-lg font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Nach E-Mail oder Name suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Lade Benutzer...</p>
            </div>
          </div>
        ) : data && data.users.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">E-Mail</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Beigetreten</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-black">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.first_name || user.last_name || 'Unbekannt'}
                            </p>
                            {user.is_admin && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <Shield className="h-3 w-3 text-black" />
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline break-all">
                          {user.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{formatDate(user.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleUserClick(user)}
                          className="inline-flex items-center gap-2 text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {data.users.map((user) => (
                <button
                  key={user.user_id}
                  onClick={() => handleUserClick(user)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-black text-sm line-clamp-1">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.first_name || user.last_name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">{user.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Zeige {(currentPage - 1) * 50 + 1} bis {Math.min(currentPage * 50, data.total)} von {data.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Seite {currentPage} von {data.total_pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(data.total_pages, currentPage + 1))}
                    disabled={currentPage === data.total_pages}
                    className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 sm:p-12 text-center">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Keine Benutzer gefunden</p>
          </div>
        )}
      </div>

      {/* User Details Modal/Drawer */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
          <div
            className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-black">Benutzerdetails</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Name */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-black font-medium">
                  {selectedUser.first_name && selectedUser.last_name
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : selectedUser.first_name || selectedUser.last_name || '-'}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">E-Mail</p>
                <a
                  href={`mailto:${selectedUser.email}`}
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {selectedUser.email}
                </a>
              </div>

              {/* Phone */}
              {selectedUser.phone && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Telefon</p>
                  <a
                    href={`tel:${selectedUser.phone}`}
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedUser.phone}
                  </a>
                </div>
              )}

              {/* Joined Date */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Beigetreten</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedUser.created_at)}</span>
                </div>
              </div>

              {/* Last Login */}
              {selectedUser.last_login && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Letzter Login</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(selectedUser.last_login).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedUser.is_active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>

                {selectedUser.is_admin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Rolle</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-xs font-semibold">
                      <Shield className="h-3 w-3" />
                      Administrator
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">E-Mail verifiziert</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.email_verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedUser.email_verified ? 'Ja' : 'Nein'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Newsletter</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.newsletter_subscribed
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedUser.newsletter_subscribed ? 'Abonniert' : 'Nicht abonniert'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
