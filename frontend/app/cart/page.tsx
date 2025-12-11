/**
 * Shopping Cart Page - /cart
 * View and manage cart items (client-side only)
 */

'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import RockBrosRecommendations from '@/components/cart/RockBrosRecommendations'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getItemCount, getSubtotal, getTotal } = useCartStore()

  // Note: Tax will be calculated based on customer's country at checkout
  // Cart shows subtotal only - prices already include German VAT (19%)
  const subtotal = getSubtotal()
  const shipping = subtotal >= 100 ? 0 : 9.99
  const total = subtotal + shipping

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
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-black to-gray-900 rounded-2xl mb-8">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-black mb-4">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
              Entdecken Sie unsere Premium-Bikes und finden Sie das perfekte Abenteuer.
            </p>
            <Link href="/produkte" className="inline-block px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-900 transition-all duration-300 hover:shadow-2xl">
              Zum Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-black mb-2">Warenkorb</h1>
          <p className="text-gray-600 text-lg">
            {getItemCount()} {getItemCount() === 1 ? 'Artikel' : 'Artikel'} • {getItemCount() > 1 ? 'Bereit für Ihr Abenteuer' : 'Wählen Sie weitere Produkte'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.articlenr}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="p-8">
                  {/* Product Image - Compact Gallery */}
                  <div className="mb-8">
                    <div className="aspect-square w-80 mx-auto bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                      {item.product.primary_image ? (
                        <Image
                          src={item.product.primary_image}
                          alt={item.product.articlename}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <ShoppingBag className="w-24 h-24 text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left - Product Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-black text-black mb-2">
                        {item.product.articlename}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        SKU: {item.articlenr}
                      </p>

                      {/* Attributes */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {item.product.colour && (
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Farbe</p>
                            <p className="text-black font-bold">{item.product.colour}</p>
                          </div>
                        )}
                        {item.product.size && (
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Größe</p>
                            <p className="text-black font-bold">{item.product.size}</p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Einzelpreis</p>
                          <p className="text-black font-bold">{item.price_at_addition.toFixed(2)} €</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Zwischensumme</p>
                          <p className="text-black font-bold text-lg">{(item.price_at_addition * item.quantity).toFixed(2)} €</p>
                        </div>
                      </div>
                    </div>

                    {/* Right - Quick Actions */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Menge</p>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.articlenr, item.quantity - 1)}
                            className="p-3 rounded-lg hover:bg-gray-200 transition-colors"
                            aria-label="Menge verringern"
                          >
                            <Minus className="w-4 h-4 text-black" />
                          </button>
                          <span className="text-lg font-bold w-12 text-center text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.articlenr, item.quantity + 1)}
                            className="p-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= 100}
                            aria-label="Menge erhöhen"
                          >
                            <Plus className="w-4 h-4 text-black" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.articlenr)}
                        className="w-full py-3 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                      >
                        Entfernen
                      </button>

                      <Link
                        href={`/produkte/${item.articlenr}`}
                        className="block w-full py-3 px-4 bg-gray-100 text-black font-semibold text-center rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* RockBros Cycling Bags Recommendation */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-black mb-2">
                  Komplettiere dein Bike
                </h3>
                <p className="text-gray-600">
                  Hochwertige Taschen und Zubehör für dein Abenteuer.
                </p>
              </div>

              {/* Frame Bags Grid */}
              <RockBrosRecommendations />
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Warenkorb leeren
              </button>
            </div>
          </div>

          {/* Order Summary - Premium Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black text-white rounded-2xl p-8 sticky top-24">
              <h2 className="text-2xl font-black mb-2">Bestellübersicht</h2>
              <p className="text-xs text-gray-400 mb-8">Steuern werden beim Checkout berechnet</p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-300 pb-4 border-b border-gray-800">
                  <span className="text-sm uppercase tracking-wider">Zwischensumme</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span className="text-sm uppercase tracking-wider">Versand</span>
                  <span className="font-semibold">{shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2)} €`}</span>
                </div>

                {subtotal < 100 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400">
                      Noch {(100 - subtotal).toFixed(2)} € bis zum kostenlosen Versand
                    </p>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm uppercase tracking-wider text-gray-400">Gesamt</span>
                    <span className="text-4xl font-black">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 mb-4 text-lg"
              >
                <Lock className="w-5 h-5" />
                <span>Zur Kasse</span>
              </button>

              <Link
                href="/produkte"
                className="block w-full py-3 border-2 border-gray-700 text-white font-semibold text-center rounded-xl hover:border-white transition-all duration-300"
              >
                Weiter einkaufen
              </Link>

              {/* Premium Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5">Sichere Zahlung</p>
                    <p className="text-xs text-gray-400">SSL-Verschlüsselte Transaktionen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5">Kostenloser Versand</p>
                    <p className="text-xs text-gray-400">Ab 100€ Bestellwert</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5">14 Tage Rückgabe</p>
                    <p className="text-xs text-gray-400">Volle Rückerstattung garantiert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
