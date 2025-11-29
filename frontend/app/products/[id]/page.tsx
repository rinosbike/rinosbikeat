/**
 * Product Detail Page - /produkte/[id]
 * Individual product page with add to cart functionality
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { productsApi, cartApi, type Product, type ProductVariation } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const { sessionId, itemCount, setItemCount, generateSessionId } = useCartStore()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add to cart states
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsApi.getById(parseInt(params.id))
      setProduct(data)
      
      // Pre-select first variation if available
      if (data.variations && data.variations.length > 0) {
        setSelectedVariation(data.variations[0].variation_id)
      }
    } catch (err) {
      console.error('Fehler beim Laden des Produkts:', err)
      setError('Produkt konnte nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      
      // Ensure we have a session ID
      let currentSessionId = sessionId
      if (!currentSessionId) {
        currentSessionId = generateSessionId()
      }

      // Add to cart via API
      const updatedCart = await cartApi.addItem(
        currentSessionId,
        product.product_id,
        quantity,
        selectedVariation || undefined
      )

      // Update cart count
      setItemCount(updatedCart.items.length)
      
      // Show success message
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
      
      // Reset quantity
      setQuantity(1)
    } catch (err) {
      console.error('Fehler beim Hinzufügen zum Warenkorb:', err)
      alert('Fehler beim Hinzufügen zum Warenkorb. Bitte versuchen Sie es erneut.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/warenkorb')
  }

  const getSelectedVariationPrice = () => {
    if (!product || !selectedVariation) return product?.price || 0
    
    const variation = product.variations?.find(v => v.variation_id === selectedVariation)
    if (!variation) return product.price
    
    return product.price + variation.price_adjustment
  }

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Lädt Produkt...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-16">
        <div className="card text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produkt nicht gefunden</h2>
          <p className="text-gray-600 mb-6">{error || 'Dieses Produkt existiert nicht.'}</p>
          <Link href="/produkte" className="btn btn-primary">
            Zurück zu den Produkten
          </Link>
        </div>
      </div>
    )
  }

  const finalPrice = getSelectedVariationPrice()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <Link
          href="/produkte"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zu den Produkten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            <div className="aspect-square w-full max-w-md bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-9xl font-bold text-gray-300">
                {product.articlename.charAt(0)}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-8">
              {/* Category */}
              {product.category && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.articlename}
              </h1>

              {/* Article Number */}
              <p className="text-sm text-gray-500 mb-6">
                Art.-Nr.: {product.articlenr}
              </p>

              {/* Description */}
              {product.description && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div className="mb-6">
                  <label className="label">Variante wählen</label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variations.map((variation) => (
                      <button
                        key={variation.variation_id}
                        onClick={() => setSelectedVariation(variation.variation_id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedVariation === variation.variation_id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{variation.variation_name}</div>
                        {variation.price_adjustment !== 0 && (
                          <div className="text-sm text-gray-600">
                            {variation.price_adjustment > 0 ? '+' : ''}
                            {variation.price_adjustment.toFixed(2)} {product.currency}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="label">Anzahl</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {finalPrice.toFixed(2)} {product.currency}
                  </span>
                  {selectedVariation && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.price.toFixed(2)} {product.currency}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  inkl. MwSt. zzgl. Versandkosten
                </p>
              </div>

              {/* Add to Cart Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_active || addingToCart}
                  className="btn btn-primary w-full btn-lg flex items-center justify-center space-x-2"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Wird hinzugefügt...</span>
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>In den Warenkorb gelegt!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>In den Warenkorb</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.is_active || addingToCart}
                  className="btn btn-outline w-full btn-lg"
                >
                  Jetzt kaufen
                </button>
              </div>

              {/* Status */}
              {!product.is_active && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium">
                    Dieses Produkt ist derzeit nicht verfügbar.
                  </p>
                </div>
              )}

              {/* Success Message */}
              {addedToCart && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 font-medium flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Produkt wurde zum Warenkorb hinzugefügt!
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚚</div>
                <p className="font-medium">Kostenloser Versand</p>
                <p className="text-sm text-gray-600">ab 100€</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="font-medium">Sichere Zahlung</p>
                <p className="text-sm text-gray-600">via Stripe</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">✓</div>
                <p className="font-medium">5 Jahre Garantie</p>
                <p className="text-sm text-gray-600">auf Rahmen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
