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
      <div className="max-w-container mx-auto px-6 md:px-20 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Lädt Bestellung...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-container mx-auto px-6 md:px-20 py-16">
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
    <div className="min-h-screen bg-white print:bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Success Header - Premium Black/White Design */}
        <div className="mb-12 print:shadow-none">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white border border-gray-200">
                <CheckCircle className="h-12 w-12 text-black" />
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                {isPaymentComplete ? 'Vielen Dank!' : 'Bestellung erhalten'}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {isPaymentComplete
                  ? 'Ihre Zahlung wurde erfolgreich verarbeitet. Wir machen Ihre Bestellung bereit.'
                  : 'Ihre Bestellung wurde erfolgreich aufgenommen.'}
              </p>
              <p className="text-base font-medium text-black">
                Bestellnummer: <span className="font-black text-lg">{order.ordernr}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Details - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Information - Premium Card */}
            <div className="border border-gray-200 rounded-2xl p-8 print:shadow-none bg-white">
              <h2 className="text-2xl font-black mb-6 text-black">Bestelldetails</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="pb-4 border-b border-gray-100 md:border-b-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Bestellnummer</p>
                  <p className="text-xl font-black text-black">{order.ordernr}</p>
                </div>
                <div className="pb-4 border-b border-gray-100 md:border-b-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Bestelldatum</p>
                  <p className="text-lg font-semibold text-black">
                    {new Date(order.created_at).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Zahlungsstatus</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      isPaymentComplete
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">System-Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      order.synced_to_erp
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.synced_to_erp ? '✓ Verarbeitet' : 'Wird bearbeitet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps - Premium Black Section */}
            <div className="bg-black rounded-2xl p-8 print:hidden text-white">
              <h2 className="text-2xl font-black mb-6">Was passiert jetzt?</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Bestätigungs-E-Mail</p>
                    <p className="text-gray-300 text-sm">
                      Sie erhalten sofort eine E-Mail mit allen Bestelldetails und Tracking-Informationen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Versand wird vorbereitet</p>
                    <p className="text-gray-300 text-sm">
                      Wir machen Ihre Bestellung bereit und versenden diese innerhalb von 24-48 Stunden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Premium Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 border border-gray-200 rounded-2xl p-8 print:shadow-none bg-white">
              <h2 className="text-2xl font-black mb-6 text-black">Gesamtübersicht</h2>

              <div className="space-y-4 pb-6 border-b-2 border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Summe netto</span>
                  <span className="text-lg font-bold text-black">
                    {(order.orderamount / 1.19).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">MwSt. (19%)</span>
                  <span className="text-lg font-bold text-black">
                    {(order.orderamount - order.orderamount / 1.19).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Versand</span>
                  <span className="text-lg font-bold text-green-600">Kostenlos</span>
                </div>
              </div>

              <div className="py-6 flex justify-between items-baseline">
                <span className="text-gray-600 font-medium">Gesamt</span>
                <span className="text-4xl font-black text-black">
                  {order.orderamount.toFixed(2)}€
                </span>
              </div>

              {/* Action Buttons - Black/White Premium Style */}
              <div className="space-y-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Bestellung drucken
                </button>

                <Link 
                  href="/produkte" 
                  className="block w-full border-2 border-black text-black px-6 py-3 rounded-xl font-bold text-center hover:bg-black hover:text-white transition-all duration-300"
                >
                  Weiter einkaufen
                </Link>
              </div>

              {/* Support */}
              <div className="mt-8 pt-6 border-t-2 border-gray-100">
                <p className="text-sm font-black text-black mb-3">Du brauchst Hilfe?</p>
                <p className="text-sm text-gray-600 mb-2">Kontaktiere uns unter:</p>
                <a href="mailto:info@rinosbike.eu" className="text-lg font-black text-black hover:text-gray-600 transition">
                  info@rinosbike.eu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function
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
