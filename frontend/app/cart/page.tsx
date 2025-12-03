/**
 * Shopping Cart Page - /cart
 * View and manage cart items (client-side only)
 */

'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getItemCount, getSubtotal, getTotal } = useCartStore()

  const subtotal = getSubtotal()
  const taxRate = 19 // 19% VAT
  const tax = subtotal * (taxRate / 100)
  const shipping = subtotal >= 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleUpdateQuantity = (articlenr: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(articlenr)
    } else {
      updateQuantity(articlenr, newQuantity)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-gray-600 mb-8">
              Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen.
            </p>
            <Link href="/produkte" className="btn btn-primary">
              Produkte ansehen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Warenkorb</h1>
          <p className="text-gray-600 mt-2">
            {getItemCount()} {getItemCount() === 1 ? 'Artikel' : 'Artikel'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.articlenr}
                  className="flex items-center gap-4 p-6 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product.primary_image ? (
                      <Image
                        src={item.product.primary_image}
                        alt={item.product.articlename}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produkte/${item.articlenr}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {item.product.articlename}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Artikel-Nr: {item.articlenr}
                    </p>
                    {item.product.colour && (
                      <p className="text-sm text-gray-600">
                        Farbe: {item.product.colour}
                      </p>
                    )}
                    {item.product.size && (
                      <p className="text-sm text-gray-600">
                        Größe: {item.product.size}
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {item.price_at_addition.toFixed(2)} €
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.articlenr, item.quantity - 1)}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      aria-label="Menge verringern"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.articlenr, item.quantity + 1)}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      disabled={item.quantity >= 100}
                      aria-label="Menge erhöhen"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right w-32">
                    <p className="text-lg font-bold text-gray-900">
                      {(item.price_at_addition * item.quantity).toFixed(2)} €
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.articlenr)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    aria-label="Entfernen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Warenkorb leeren
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Bestellübersicht</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischensumme</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>MwSt. ({taxRate}%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Versand</span>
                  <span>{shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2)} €`}</span>
                </div>

                {subtotal < 100 && (
                  <p className="text-sm text-gray-500 pt-2">
                    Noch {(100 - subtotal).toFixed(2)} € bis zum kostenlosen Versand
                  </p>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Gesamt</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full mb-3 flex items-center justify-center gap-2"
              >
                <span>Zur Kasse</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/produkte"
                className="btn btn-outline w-full text-center block"
              >
                Weiter einkaufen
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sichere Zahlung</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Kostenloser Versand ab 100€</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>14 Tage Rückgaberecht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
