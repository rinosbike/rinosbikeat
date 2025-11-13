/**
 * Order Confirmation Page - /bestellung/[id]
 * Shows order details after successful purchase
 */

'use client'

import { useEffect, useState } from 'react'
import { ordersApi, type Order } from '@/lib/api'
import { CheckCircle, Package, Mail, Printer } from 'lucide-react'
import Link from 'next/link'

interface OrderConfirmationPageProps {
  params: {
    id: string
  }
}

export default function BestellungPage({ params }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ordersApi.getById(parseInt(params.id))
      setOrder(data)
    } catch (err) {
      console.error('Fehler beim Laden der Bestellung:', err)
      setError('Bestellung konnte nicht gefunden werden.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Lädt Bestellung...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-16">
        <div className="card text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Bestellung nicht gefunden</h2>
          <p className="text-gray-600 mb-6">{error || 'Diese Bestellung existiert nicht.'}</p>
          <Link href="/produkte" className="btn btn-primary">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    )
  }

  const isPaymentComplete = order.payment_status === 'paid' || order.payment_status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="container py-8">
        {/* Success Header */}
        <div className="card text-center mb-8 print:shadow-none">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isPaymentComplete ? 'Vielen Dank für Ihre Bestellung!' : 'Bestellung erhalten'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {isPaymentComplete
              ? 'Ihre Zahlung wurde erfolgreich verarbeitet.'
              : 'Ihre Bestellung wurde erfolgreich aufgenommen.'}
          </p>
          <p className="text-sm text-gray-600">
            Bestellnummer: <span className="font-bold">{order.order_number}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="card print:shadow-none">
              <h2 className="text-xl font-bold mb-4">Bestelldetails</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Bestellnummer</p>
                  <p className="font-bold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bestelldatum</p>
                  <p className="font-bold">
                    {new Date(order.order_date).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Bestellstatus</p>
                  <p className="font-bold">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        order.order_status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : order.order_status === 'processing'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {getOrderStatusText(order.order_status)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Zahlungsstatus</p>
                  <p className="font-bold">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        isPaymentComplete
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="card print:shadow-none">
              <h2 className="text-xl font-bold mb-4">Kundendaten</h2>
              <div className="space-y-2 text-sm">
                <p className="font-bold">{order.customer_name}</p>
                <p className="text-gray-600">{order.customer_email}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card bg-blue-50 border-blue-200 print:hidden">
              <h2 className="text-xl font-bold mb-4">Nächste Schritte</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Bestätigungs-E-Mail</p>
                    <p className="text-sm text-gray-600">
                      Sie erhalten eine Bestätigungs-E-Mail an {order.customer_email} mit allen Details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Versandbenachrichtigung</p>
                    <p className="text-sm text-gray-600">
                      Sie werden per E-Mail benachrichtigt, sobald Ihre Bestellung versandt wurde.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 print:shadow-none">
              <h2 className="text-xl font-bold mb-4">Zusammenfassung</h2>

              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span className="font-medium">
                    {(order.total_amount / 1.19).toFixed(2)} {order.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MwSt. (19%)</span>
                  <span className="font-medium">
                    {(order.total_amount - order.total_amount / 1.19).toFixed(2)} {order.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Versand</span>
                  <span className="font-medium">Kostenlos</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-baseline">
                <span className="font-bold">Gesamt</span>
                <span className="text-2xl font-bold text-blue-600">
                  {order.total_amount.toFixed(2)} {order.currency}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="btn btn-outline w-full flex items-center justify-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Bestellung drucken</span>
                </button>

                <Link href="/produkte" className="btn btn-primary w-full text-center">
                  Weiter einkaufen
                </Link>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                <p className="font-medium mb-2">Fragen zu Ihrer Bestellung?</p>
                <p>Kontaktieren Sie uns unter:</p>
                <p className="text-blue-600 font-medium">info@rinosbike.eu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getOrderStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: 'Ausstehend',
    processing: 'In Bearbeitung',
    shipped: 'Versandt',
    delivered: 'Zugestellt',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
  }
  return statusMap[status] || status
}

function getPaymentStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: 'Ausstehend',
    paid: 'Bezahlt',
    completed: 'Abgeschlossen',
    failed: 'Fehlgeschlagen',
    refunded: 'Erstattet',
  }
  return statusMap[status] || status
}
