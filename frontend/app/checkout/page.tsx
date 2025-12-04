/**
 * Checkout Page - /kasse
 * Customer information and payment processing
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cartApi, ordersApi, paymentsApi } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { loadStripe } from '@stripe/stripe-js'
import { AlertCircle, Lock, CreditCard } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

export default function KassePage() {
  const router = useRouter()
  const { items, getSubtotal, getTotal, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is buying a bike
  const hasBike = items.some(item => 
    item.product.articlename?.toLowerCase().includes('bike') || 
    item.product.articlename?.toLowerCase().includes('fahrrad') ||
    item.product.articlename?.toLowerCase().includes('gravel') ||
    item.product.articlename?.toLowerCase().includes('rennrad') ||
    item.product.articlename?.toLowerCase().includes('mountain')
  )

  // Form data
  const [formData, setFormData] = useState({
    customer_frontname: '',
    customer_surname: '',
    customer_email: '',
    customer_telephone: '',
    customer_adress: '',
    customer_postalcode: '',
    customer_city: '',
    customer_country: 'Deutschland',
  })

  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.customer_frontname.trim()) {
      newErrors.customer_frontname = 'Vorname ist erforderlich'
    }
    if (!formData.customer_surname.trim()) {
      newErrors.customer_surname = 'Nachname ist erforderlich'
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Ungültige E-Mail-Adresse'
    }
    if (!formData.customer_adress.trim()) {
      newErrors.customer_adress = 'Adresse ist erforderlich'
    }
    if (!formData.customer_postalcode.trim()) {
      newErrors.customer_postalcode = 'Postleitzahl ist erforderlich'
    }
    if (!formData.customer_city.trim()) {
      newErrors.customer_city = 'Stadt ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Calculate totals
      const subtotal = getSubtotal()
      const taxRate = 19
      const tax = subtotal * (taxRate / 100)
      const shipping = subtotal >= 100 ? 0 : 9.99
      const total = subtotal + tax + shipping

      // Step 1: Create order with cart items from localStorage
      const orderPayload = {
        customer_info: formData,
        cart_items: items.map(item => ({
          articlenr: item.articlenr,
          articlename: item.product.articlename,
          quantity: item.quantity,
          price_at_addition: item.price_at_addition,
        })),
        subtotal,
        tax_amount: tax,
        shipping,
        total_amount: total,
        payment_method: 'stripe'
      }

      const order = await ordersApi.createOrderFromCart(orderPayload)

      // Step 2: Create payment intent
      const payment = await paymentsApi.createPaymentIntent(
        order.web_order_id,
        `${window.location.origin}/bestellung/${order.web_order_id}`
      )

      // Step 3: Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe konnte nicht geladen werden')
      }

      // Redirect to Stripe
      window.location.href = `https://checkout.stripe.com/pay/${payment.client_secret}`

      // Clear cart after successful order creation
      clearCart()
    } catch (err: any) {
      console.error('Fehler beim Checkout:', err)
      setError(
        err.response?.data?.detail ||
        'Fehler beim Verarbeiten der Bestellung. Bitte versuchen Sie es erneut.'
      )
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  // Calculate totals
  const subtotal = getSubtotal()
  const taxRate = 19
  const tax = subtotal * (taxRate / 100)
  const shipping = subtotal >= 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-container mx-auto px-6 md:px-20 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Kasse</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="card">
                <h2 className="text-xl font-bold mb-6">Persönliche Angaben</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Vorname *</label>
                    <input
                      type="text"
                      name="customer_frontname"
                      value={formData.customer_frontname}
                      onChange={handleInputChange}
                      className={`input ${errors.customer_frontname ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.customer_frontname && (
                      <p className="text-red-600 text-sm mt-1">{errors.customer_frontname}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Nachname *</label>
                    <input
                      type="text"
                      name="customer_surname"
                      value={formData.customer_surname}
                      onChange={handleInputChange}
                      className={`input ${errors.customer_surname ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.customer_surname && (
                      <p className="text-red-600 text-sm mt-1">{errors.customer_surname}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">E-Mail *</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className={`input ${errors.customer_email ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.customer_email && (
                    <p className="text-red-600 text-sm mt-1">{errors.customer_email}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="label">Telefon</label>
                  <input
                    type="tel"
                    name="customer_telephone"
                    value={formData.customer_telephone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card">
                <h2 className="text-xl font-bold mb-6">Lieferadresse</h2>
                
                <div>
                  <label className="label">Straße und Hausnummer *</label>
                  <input
                    type="text"
                    name="customer_adress"
                    value={formData.customer_adress}
                    onChange={handleInputChange}
                    className={`input ${errors.customer_adress ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.customer_adress && (
                    <p className="text-red-600 text-sm mt-1">{errors.customer_adress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="label">Postleitzahl *</label>
                    <input
                      type="text"
                      name="customer_postalcode"
                      value={formData.customer_postalcode}
                      onChange={handleInputChange}
                      className={`input ${errors.customer_postalcode ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.customer_postalcode && (
                      <p className="text-red-600 text-sm mt-1">{errors.customer_postalcode}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Stadt *</label>
                    <input
                      type="text"
                      name="customer_city"
                      value={formData.customer_city}
                      onChange={handleInputChange}
                      className={`input ${errors.customer_city ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.customer_city && (
                      <p className="text-red-600 text-sm mt-1">{errors.customer_city}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">Land *</label>
                  <select
                    name="customer_country"
                    value={formData.customer_country}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="card bg-red-50 border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Product Recommendations for Bike Purchase */}
              {hasBike && (
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        🎒 Perfekt für dein Bikepacking
                      </h3>
                      <p className="text-sm text-gray-700 mb-4">
                        RockBros Taschen & Zubehör machen dein Abenteuer noch besser. Sichere Verstaung, Premium-Qualität.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="/categories/zubehör?search=rockbros"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Entdecke RockBros Zubehör
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary w-full btn-lg flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Wird verarbeitet...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Jetzt sicher bezahlen</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Mit dem Absenden der Bestellung akzeptieren Sie unsere AGB und Datenschutzerklärung.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold mb-4">Bestellübersicht</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.articlenr}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-grow">
                      <p className="font-medium">{item.product.articlename}</p>
                      {item.product.colour && (
                        <p className="text-gray-600 text-xs">Farbe: {item.product.colour}</p>
                      )}
                      {item.product.size && (
                        <p className="text-gray-600 text-xs">Größe: {item.product.size}</p>
                      )}
                      <p className="text-gray-600">Anzahl: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {(item.price_at_addition * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MwSt. ({taxRate}%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Versand</span>
                  <span>{shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2)} €`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-baseline">
                  <span className="font-bold">Gesamt</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <CreditCard className="w-5 h-5" />
                  <span>Sichere Zahlung via Stripe</span>
                </div>
                <p className="text-xs text-gray-500">
                  Ihre Zahlungsinformationen werden sicher über Stripe verarbeitet.
                  Wir speichern keine Kreditkartendaten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
