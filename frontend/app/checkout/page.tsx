/**
 * Checkout Page - Premium Design
 * Customer information and payment processing
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ordersApi, paymentsApi } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { loadStripe } from '@stripe/stripe-js'
import { AlertCircle, Lock, CreditCard, ShieldCheck, Truck, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    customer_frontname: '',
    customer_surname: '',
    customer_email: '',
    customer_telephone: '',
    customer_adress: '',
    customer_postalcode: '',
    customer_city: '',
    customer_country: 'Österreich',
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
      const taxRate = 20 // Austrian VAT
      const tax = subtotal * (taxRate / 100)
      const shipping = subtotal >= 100 ? 0 : 0.20 // Testing: 20 cents shipping
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
        `${window.location.origin}/order/${order.web_order_id}`
      )

      // Step 3: Show success and redirect
      console.log('Payment intent created successfully:', payment)
      
      // Clear cart after successful order creation
      clearCart()

      // Show success message briefly then redirect
      setError(null)
      
      // Redirect to Stripe Checkout Session URL
      // payment.client_secret now contains the full checkout URL
      const redirectUrl = payment.client_secret
      console.log('Redirecting to Stripe Checkout:', redirectUrl)
      
      // Use setTimeout to ensure UI updates before redirect
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 500)

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
  const taxRate = 20 // Austrian VAT
  const tax = subtotal * (taxRate / 100)
  const shipping = subtotal >= 100 ? 0 : 0.20 // Testing: 20 cents shipping
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Zurück zum Warenkorb</span>
            </Link>
            <h1 className="text-2xl font-black">Checkout</h1>
            <div className="flex items-center gap-2 text-green-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Sichere Zahlung</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold">Persönliche Angaben</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vorname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_frontname"
                      value={formData.customer_frontname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                        errors.customer_frontname
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-black'
                      } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                      placeholder="Max"
                    />
                    {errors.customer_frontname && (
                      <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.customer_frontname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nachname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_surname"
                      value={formData.customer_surname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                        errors.customer_surname
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-black'
                      } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                      placeholder="Mustermann"
                    />
                    {errors.customer_surname && (
                      <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.customer_surname}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-Mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                      errors.customer_email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-black'
                    } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                    placeholder="max@beispiel.at"
                  />
                  {errors.customer_email && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.customer_email}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="customer_telephone"
                    value={formData.customer_telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black bg-gray-50 focus:bg-white outline-none transition-all duration-200"
                    placeholder="+43 123 456 7890"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold">Lieferadresse</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Straße und Hausnummer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_adress"
                    value={formData.customer_adress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                      errors.customer_adress
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-black'
                    } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                    placeholder="Musterstraße 123"
                  />
                  {errors.customer_adress && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.customer_adress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postleitzahl <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_postalcode"
                      value={formData.customer_postalcode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                        errors.customer_postalcode
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-black'
                      } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                      placeholder="1010"
                    />
                    {errors.customer_postalcode && (
                      <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.customer_postalcode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stadt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_city"
                      value={formData.customer_city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                        errors.customer_city
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-black'
                      } bg-gray-50 focus:bg-white outline-none transition-all duration-200`}
                      placeholder="Wien"
                    />
                    {errors.customer_city && (
                      <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.customer_city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Land <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="customer_country"
                    value={formData.customer_country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-black bg-gray-50 focus:bg-white outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="Österreich">Österreich</option>
                    <option value="Deutschland">Deutschland</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Fehler bei der Bestellung</p>
                      <p className="text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Wird verarbeitet...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Jetzt bezahlen • {total.toFixed(2)} €</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 space-y-6">

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Bestellübersicht
                  </h2>
                </div>

                <div className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.articlenr}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product.primary_image ? (
                            <img
                              src={item.product.primary_image}
                              alt={item.product.articlename}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.product.articlename}</p>
                          {item.product.colour && (
                            <p className="text-sm text-gray-500">Farbe: {item.product.colour}</p>
                          )}
                          {item.product.size && (
                            <p className="text-sm text-gray-500">Größe: {item.product.size}</p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">Menge: {item.quantity}</span>
                            <span className="font-bold">
                              {(item.price_at_addition * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Zwischensumme</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>MwSt. ({taxRate}%)</span>
                      <span>{tax.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Versand
                      </span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2)} €`}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-bold">Gesamt</span>
                      <span className="text-2xl font-black text-black">
                        {total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  form="checkout-form"
                  onClick={handleSubmit}
                  disabled={processing}
                  className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Wird verarbeitet...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Jetzt sicher bezahlen</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-900">Sichere Zahlung via Stripe</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>SSL-verschlüsselte Verbindung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Keine Speicherung von Kartendaten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>PCI DSS Level 1 zertifiziert</span>
                  </div>
                </div>

                {/* Payment Method Icons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Akzeptierte Zahlungsmethoden</p>
                  <div className="flex gap-2">
                    {['Visa', 'Mastercard', 'AMEX', 'SEPA'].map((method) => (
                      <div
                        key={method}
                        className="bg-white rounded-md px-2 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legal Text */}
              <p className="text-xs text-gray-500 text-center px-4">
                Mit dem Absenden der Bestellung akzeptieren Sie unsere{' '}
                <Link href="/agb" className="underline hover:text-black">AGB</Link> und{' '}
                <Link href="/datenschutz" className="underline hover:text-black">Datenschutzerklärung</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
