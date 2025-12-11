/**
 * Admin Users Management - RINOS CMS
 * Premium Apple/Framer-inspired design
 * View and manage all registered users
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  ChevronRight,
  Shield,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Eye,
  ChevronLeft,
  Users,
  UserPlus,
  Filter,
  Download,
  MoreHorizontal,
  X,
  CheckCircle,
  XCircle,
  ArrowRight
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    loadUsers()
  }, [debouncedSearch, currentPage, filterStatus])

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

  const filteredUsers = data?.users.filter(user => {
    if (filterStatus === 'active') return user.is_active
    if (filterStatus === 'inactive') return !user.is_active
    return true
  }) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-overline uppercase tracking-widest text-rinos-text-secondary mb-2">
            Kundenverwaltung
          </p>
          <h1 className="text-display-sm font-bold text-rinos-dark">Benutzer</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportieren</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Gesamt"
          value={data?.total || 0}
          icon={Users}
        />
        <StatCard
          label="Aktiv"
          value={data?.users.filter(u => u.is_active).length || 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Newsletter"
          value={data?.users.filter(u => u.newsletter_subscribed).length || 0}
          icon={Mail}
          variant="info"
        />
        <StatCard
          label="Admins"
          value={data?.users.filter(u => u.is_admin).length || 0}
          icon={Shield}
          variant="warning"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4" role="alert">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-body-sm font-medium text-red-800 flex-1">{error}</p>
          <button
            onClick={() => loadUsers()}
            className="text-body-sm font-medium text-red-600 hover:text-red-800 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rinos-text-secondary" />
          <input
            type="text"
            placeholder="Nach E-Mail oder Name suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-rinos-dark text-white'
                  : 'bg-rinos-bg-secondary text-rinos-text-secondary hover:text-rinos-dark'
              }`}
            >
              {status === 'all' ? 'Alle' : status === 'active' ? 'Aktiv' : 'Inaktiv'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-rinos-border-light overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-rinos-border animate-pulse" />
                <div className="absolute inset-2 rounded-full border-2 border-t-rinos-dark border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-body-sm text-rinos-text-secondary">Lade Benutzer...</p>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rinos-border-light bg-rinos-bg-secondary/50">
                    <th className="px-6 py-4 text-left text-overline font-medium text-rinos-text-secondary uppercase tracking-wider">Benutzer</th>
                    <th className="px-6 py-4 text-left text-overline font-medium text-rinos-text-secondary uppercase tracking-wider">E-Mail</th>
                    <th className="px-6 py-4 text-left text-overline font-medium text-rinos-text-secondary uppercase tracking-wider">Beigetreten</th>
                    <th className="px-6 py-4 text-left text-overline font-medium text-rinos-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-overline font-medium text-rinos-text-secondary uppercase tracking-wider">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rinos-border-light">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-rinos-bg-secondary/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-rinos-dark text-white flex items-center justify-center text-body-sm font-semibold flex-shrink-0">
                            {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-body-sm font-semibold text-rinos-dark truncate">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.first_name || user.last_name || 'Kein Name'}
                            </p>
                            {user.is_admin && (
                              <span className="inline-flex items-center gap-1 text-caption text-rinos-text-secondary mt-0.5">
                                <Shield className="h-3 w-3" />
                                Administrator
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${user.email}`} className="text-body-sm text-rinos-dark hover:text-blue-600 transition-colors">
                          {user.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-body-sm text-rinos-text-secondary">{formatDate(user.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rinos-bg-tertiary text-rinos-text-secondary'}`}>
                          {user.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleUserClick(user)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-rinos-text-secondary hover:text-rinos-dark hover:bg-rinos-bg-secondary transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-rinos-border-light">
              {filteredUsers.map((user) => (
                <button
                  key={user.user_id}
                  onClick={() => handleUserClick(user)}
                  className="w-full p-4 text-left hover:bg-rinos-bg-secondary/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 rounded-xl bg-rinos-dark text-white flex items-center justify-center text-body-sm font-semibold flex-shrink-0">
                      {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-semibold text-rinos-dark truncate">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.first_name || user.last_name || user.email}
                      </p>
                      <p className="text-caption text-rinos-text-secondary truncate">{user.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-rinos-text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
              <div className="border-t border-rinos-border-light px-6 py-4 flex items-center justify-between">
                <p className="text-caption text-rinos-text-secondary">
                  Zeige {(currentPage - 1) * 50 + 1} bis {Math.min(currentPage * 50, data.total)} von {data.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border border-rinos-border-light flex items-center justify-center hover:bg-rinos-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-body-sm text-rinos-text-secondary px-3">
                    {currentPage} / {data.total_pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(data.total_pages, currentPage + 1))}
                    disabled={currentPage === data.total_pages}
                    className="w-10 h-10 rounded-xl border border-rinos-border-light flex items-center justify-center hover:bg-rinos-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rinos-bg-secondary flex items-center justify-center">
              <Users className="h-8 w-8 text-rinos-text-secondary" />
            </div>
            <p className="text-body text-rinos-text-secondary">Keine Benutzer gefunden</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-end lg:items-center lg:justify-center">
          <div
            className="w-full lg:max-w-xl bg-white rounded-t-2xl lg:rounded-2xl shadow-floating max-h-[90vh] overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-rinos-border-light px-6 py-5 flex items-center justify-between">
              <h2 className="text-title font-semibold text-rinos-dark">Benutzerdetails</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-rinos-text-secondary hover:text-rinos-dark hover:bg-rinos-bg-secondary transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-rinos-dark text-white flex items-center justify-center text-headline font-semibold">
                  {(selectedUser.first_name?.[0] || selectedUser.email?.[0] || '?').toUpperCase()}
                </div>
                <div>
                  <p className="text-title font-semibold text-rinos-dark">
                    {selectedUser.first_name && selectedUser.last_name
                      ? `${selectedUser.first_name} ${selectedUser.last_name}`
                      : selectedUser.first_name || selectedUser.last_name || 'Kein Name'}
                  </p>
                  <p className="text-body-sm text-rinos-text-secondary">{selectedUser.email}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  icon={Mail}
                  label="E-Mail"
                  value={selectedUser.email}
                  href={`mailto:${selectedUser.email}`}
                />
                {selectedUser.phone && (
                  <DetailItem
                    icon={Phone}
                    label="Telefon"
                    value={selectedUser.phone}
                    href={`tel:${selectedUser.phone}`}
                  />
                )}
                <DetailItem
                  icon={Calendar}
                  label="Beigetreten"
                  value={formatDate(selectedUser.created_at)}
                />
                {selectedUser.last_login && (
                  <DetailItem
                    icon={Calendar}
                    label="Letzter Login"
                    value={new Date(selectedUser.last_login).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  />
                )}
              </div>

              {/* Status Section */}
              <div className="pt-4 border-t border-rinos-border-light space-y-3">
                <p className="text-overline uppercase tracking-widest text-rinos-text-secondary mb-3">Status & Rollen</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    active={selectedUser.is_active}
                    activeLabel="Aktiv"
                    inactiveLabel="Inaktiv"
                  />
                  {selectedUser.is_admin && (
                    <span className="badge badge-dark flex items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      Administrator
                    </span>
                  )}
                  <StatusBadge
                    active={selectedUser.email_verified}
                    activeLabel="E-Mail verifiziert"
                    inactiveLabel="E-Mail nicht verifiziert"
                    variant="info"
                  />
                  {selectedUser.newsletter_subscribed && (
                    <span className="badge bg-blue-50 text-blue-700">Newsletter abonniert</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-rinos-border-light bg-rinos-bg-secondary/50 px-6 py-4">
              <button
                onClick={() => setShowDetails(false)}
                className="btn btn-secondary w-full"
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

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default'
}: {
  label: string
  value: number
  icon: any
  variant?: 'default' | 'success' | 'info' | 'warning'
}) {
  const variantStyles = {
    default: 'bg-rinos-bg-secondary text-rinos-dark',
    success: 'bg-emerald-50 text-emerald-600',
    info: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-600'
  }

  return (
    <div className="bg-white rounded-2xl border border-rinos-border-light p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${variantStyles[variant]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-display-sm font-bold text-rinos-dark">{value.toLocaleString('de-DE')}</p>
      <p className="text-caption text-rinos-text-secondary mt-1">{label}</p>
    </div>
  )
}

// Detail Item Component
function DetailItem({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: any
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-rinos-bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-rinos-text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="text-caption text-rinos-text-secondary mb-0.5">{label}</p>
        <p className="text-body-sm font-medium text-rinos-dark truncate">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="hover:opacity-70 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}

// Status Badge Component
function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
  variant = 'default'
}: {
  active: boolean
  activeLabel: string
  inactiveLabel: string
  variant?: 'default' | 'info'
}) {
  if (active) {
    return (
      <span className={`badge ${variant === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
        {activeLabel}
      </span>
    )
  }
  return (
    <span className="badge bg-rinos-bg-tertiary text-rinos-text-secondary">
      {inactiveLabel}
    </span>
  )
}
