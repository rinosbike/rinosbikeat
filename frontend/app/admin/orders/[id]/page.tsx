/**
 * Admin Order Detail Page
 * View and manage individual order
 * Mobile-first responsive design
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Package,
  Truck,
  Clock,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react'
import { adminApi, AdminOrderDetail } from '@/lib/api'

const statusOptions = [
  { value: 'pending', label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'paid', label: 'Bezahlt', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  { value: 'processing', label: 'In Bearbeitung', color: 'bg-blue-100 text-blue-700', icon: Package },
  { value: 'shipped', label: 'Versendet', color: 'bg-purple-100 text-purple-700', icon: Truck },
  { value: 'delivered', label: 'Zugestellt', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  { value: 'cancelled', label: 'Storniert', color: 'bg-red-100 text-red-700', icon: XCircle }
]

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<AdminOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('')
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await adminApi.getOrder(parseInt(orderId))
      setOrder(data)
      setNewStatus(data.payment_status)
      setTrackingNumber(data.tracking_number || '')
      setTrackingCarrier(data.tracking_carrier || '')
      setNotes(data.notes || '')
    } catch (err) {
      console.error('Failed to load order:', err)
      setError('Bestellung konnte nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!order) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      await adminApi.updateOrder(order.web_order_id, {
        payment_status: newStatus,
        tracking_number: trackingNumber || undefined,
        tracking_carrier: trackingCarrier || undefined,
        notes: notes || undefined
      })

      setSuccess('Bestellung erfolgreich aktualisiert')
      loadOrder() // Reload to get updated data
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to update order:', err)
      setError('Bestellung konnte nicht aktualisiert werden')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusConfig = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Lade Bestellung...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Bestellung nicht gefunden</p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-black font-medium hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.payment_status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors self-start"
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-black">{order.ordernr}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString('de-DE', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-lg font-bold">
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3" role="alert">
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm flex-1">{success}</p>
        </div>
      )}

      {/* Order Summary Card */}
      <div className="bg-black text-white rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Betrag</p>
            <p className="text-xl sm:text-2xl font-black mt-1">
              {order.orderamount.toLocaleString('de-DE', {
                style: 'currency',
                currency: order.currency || 'EUR'
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Artikel</p>
            <p className="text-xl sm:text-2xl font-black mt-1">{order.items?.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Zahlung</p>
            <p className="text-lg sm:text-xl font-bold mt-1 capitalize">
              {order.payment_method || 'Stripe'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">ERP Sync</p>
            <p className="text-lg sm:text-xl font-bold mt-1">
              {order.synced_to_erp ? (
                <span className="text-green-400">Ja</span>
              ) : (
                <span className="text-yellow-400">Nein</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Order Items & Status */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-black text-black mb-4">Status verwalten</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bestellstatus
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {(newStatus === 'shipped' || order.tracking_number) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="carrier" className="block text-sm font-semibold text-gray-700 mb-2">
                      Versanddienstleister
                    </label>
                    <select
                      id="carrier"
                      value={trackingCarrier}
                      onChange={(e) => setTrackingCarrier(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Auswählen...</option>
                      <option value="DHL">DHL</option>
                      <option value="DPD">DPD</option>
                      <option value="GLS">GLS</option>
                      <option value="UPS">UPS</option>
                      <option value="Hermes">Hermes</option>
                      <option value="Post">Österreichische Post</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tracking" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sendungsnummer
                    </label>
                    <input
                      id="tracking"
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="z.B. 1234567890"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                  Interne Notizen
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notizen zur Bestellung..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-black text-black">Bestellte Artikel</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="p-4 sm:p-6 flex gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.primary_image ? (
                        <Image
                          src={item.primary_image}
                          alt={item.articlename}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-black text-sm sm:text-base line-clamp-2">
                        {item.articlename}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-mono">
                        {item.articlenr}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Menge: <strong>{item.quantity}</strong>
                        </span>
                        <span className="text-sm text-gray-600">
                          × {item.price_at_addition.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-black text-sm sm:text-base">
                        {(item.quantity * item.price_at_addition).toLocaleString('de-DE', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Keine Artikel gefunden</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-black text-black mb-4">Kunde</h2>

            <div className="space-y-4">
              {order.customer_name && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="font-medium text-black mt-0.5">{order.customer_name}</p>
                  </div>
                </div>
              )}

              {order.customer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">E-Mail</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`mailto:${order.customer_email}`}
                        className="font-medium text-black hover:underline truncate"
                      >
                        {order.customer_email}
                      </a>
                      <button
                        onClick={() => copyToClipboard(order.customer_email!)}
                        className="p-1 text-gray-400 hover:text-black transition-colors flex-shrink-0"
                        aria-label="E-Mail kopieren"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {order.customer_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefon</p>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="font-medium text-black hover:underline mt-0.5 block"
                    >
                      {order.customer_phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-black text-black mb-4">Lieferadresse</h2>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <p className="font-medium text-black">{order.shipping_address.name}</p>
                  <p className="text-gray-600">{order.shipping_address.street}</p>
                  <p className="text-gray-600">
                    {order.shipping_address.postal_code} {order.shipping_address.city}
                  </p>
                  <p className="text-gray-600">{order.shipping_address.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-black text-black mb-4">Zahlung</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Methode</p>
                  <p className="font-medium text-black mt-0.5 capitalize">{order.payment_method || 'Stripe'}</p>
                </div>
              </div>

              {order.stripe_payment_intent_id && (
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stripe ID</p>
                    <p className="font-mono text-xs text-gray-600 mt-0.5 break-all">
                      {order.stripe_payment_intent_id}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</p>
                  <p className="font-medium text-black mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copied Toast */}
      {copied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg z-50">
          Kopiert!
        </div>
      )}
    </div>
  )
}
