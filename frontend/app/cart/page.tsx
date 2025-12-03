/**
 * Shopping Cart Page - /warenkorb
 * View and manage cart items
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cartApi, type Cart, type CartItem } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function WarenkorbPage() {
  const router = useRouter()
  const { sessionId, setItemCount, generateSessionId } = useCartStore()
  
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingItem, setUpdatingItem] = useState<number | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)

      // Ensure we have a session ID
      let currentSessionId = sessionId
      if (!currentSessionId) {
        currentSessionId = generateSessionId()
      }

      const data = await cartApi.getCart(currentSessionId)
      setCart(data)
      setItemCount(data.summary.item_count)
    } catch (err) {
      console.error('Fehler beim Laden des Warenkorbs:', err)
      // Empty cart on error
      setCart({
        cart_id: 0,
        guest_session_id: sessionId,
        items: [],
        summary: {
          subtotal: 0,
          tax_rate: 19,
          tax_amount: 0,
          shipping: 0,
          total: 0,
          item_count: 0,
          unique_items: 0,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdatingItem(item.cart_item_id)

      const updatedCart = await cartApi.updateItem(
        item.cart_item_id,
        newQuantity
      )

      setCart(updatedCart)
      setItemCount(updatedCart.summary.item_count)
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Menge:', err)
      alert('Fehler beim Aktualisieren der Menge.')
    } finally {
      setUpdatingItem(null)
    }
  }

  const removeItem = async (item: CartItem) => {
    if (!confirm('Möchten Sie diesen Artikel wirklich entfernen?')) return

    try {
      setUpdatingItem(item.cart_item_id)

      const updatedCart = await cartApi.removeItem(item.cart_item_id)

      setCart(updatedCart)
      setItemCount(updatedCart.summary.item_count)
    } catch (err) {
      console.error('Fehler beim Entfernen des Artikels:', err)
      alert('Fehler beim Entfernen des Artikels.')
    } finally {
      setUpdatingItem(null)
    }
  }

  const clearCart = async () => {
    if (!confirm('Möchten Sie den gesamten Warenkorb leeren?')) return

    try {
      await cartApi.clearCart(sessionId)
      await loadCart()
    } catch (err) {
      console.error('Fehler beim Leeren des Warenkorbs:', err)
      alert('Fehler beim Leeren des Warenkorbs.')
    }
  }

  const proceedToCheckout = () => {
    router.push('/kasse')
  }

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-6 md:px-20 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Lädt Warenkorb...</p>
        </div>
      </div>
    )
  }

  const isEmpty = !cart || cart.items.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-container mx-auto px-6 md:px-20 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Warenkorb</h1>

        {isEmpty ? (
          /* Empty Cart */
          <div className="card text-center py-16 max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ihr Warenkorb ist leer</h2>
            <p className="text-gray-600 mb-6">
              Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen.
            </p>
            <Link href="/produkte" className="btn btn-primary">
              Zu den Produkten
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="card">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image}
                          alt={item.product.articlename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-300">
                          {item.product.articlename.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{item.product.articlename}</h3>
                          <p className="text-sm text-gray-600">Art.-Nr.: {item.product.articlenr}</p>
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
                        </div>
                        <button
                          onClick={() => removeItem(item)}
                          disabled={updatingItem === item.cart_item_id}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Entfernen"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Anzahl:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItem === item.cart_item_id}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-600 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                              disabled={updatingItem === item.cart_item_id}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-600 transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {item.price_at_addition.toFixed(2)} € × {item.quantity}
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {item.subtotal.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Warenkorb leeren
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-xl font-bold mb-4">Zusammenfassung</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zwischensumme</span>
                    <span className="font-medium">
                      {cart.summary.subtotal.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MwSt. ({cart.summary.tax_rate}%)</span>
                    <span className="font-medium">
                      {cart.summary.tax_amount.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Versand</span>
                    <span>{cart.summary.shipping > 0 ? `${cart.summary.shipping.toFixed(2)} €` : 'Kostenlos'}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold">Gesamt</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {cart.summary.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="btn btn-primary w-full btn-lg flex items-center justify-center space-x-2"
                >
                  <span>Zur Kasse</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <Link
                  href="/produkte"
                  className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                >
                  Weiter einkaufen
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="text-2xl">🔒</span>
                    <span>Sichere Zahlung via Stripe</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="text-2xl">🚚</span>
                    <span>Kostenloser Versand</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="text-2xl">✓</span>
                    <span>5 Jahre Garantie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
