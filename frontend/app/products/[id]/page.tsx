/**
 * Product Detail Page - /produkte/[id]
 * Individual product page with add to cart functionality
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { productsApi, cartApi, variationsApi, type Product, type ProductVariation, type ProductVariationsResponse } from '@/lib/api'
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
  const [variationData, setVariationData] = useState<ProductVariationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add to cart states
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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
      // params.id can be either a numeric product ID or an article number string
      const data = await productsApi.getById(params.id)
      setProduct(data)

      // If product has variations and is a father article, load detailed variation data
      console.log('Product data loaded:', {
        is_father_article: data.is_father_article,
        has_variations: !!data.variations,
        variations_count: data.variations?.length || 0,
        articlenr: data.articlenr
      })

      if (data.is_father_article && data.variations && data.variations.length > 0) {
        try {
          console.log('Loading variation data for:', data.articlenr)
          const varData = await variationsApi.getVariations(data.articlenr)
          console.log('Variation data loaded:', varData)
          setVariationData(varData)

          // Pre-select first variation
          if (varData.variations.length > 0) {
            setSelectedVariation(varData.variations[0].productid)

            // Initialize selected attributes from first variation
            const firstVar = varData.variations[0]
            const attrs: Record<string, string> = {}
            if (firstVar.colour) attrs['colour'] = firstVar.colour
            if (firstVar.size) attrs['size'] = firstVar.size
            if (firstVar.component) attrs['component'] = firstVar.component
            if (firstVar.type) attrs['type'] = firstVar.type
            setSelectedAttributes(attrs)
          }
        } catch (varErr) {
          console.error('Could not load variation data, using basic variations:', varErr)
          console.log('Error details:', varErr)
          // Fallback to basic variation handling
          if (data.variations && data.variations.length > 0) {
            setSelectedVariation(data.variations[0].productid)
          }
        }
      } else if (data.variations && data.variations.length > 0) {
        // Simple variation handling for non-father articles
        setSelectedVariation(data.variations[0].productid)
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
        product.productid,
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

  const handleAttributeChange = (attributeType: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [attributeType]: value }
    setSelectedAttributes(newAttrs)

    // Find matching variation based on all selected attributes
    if (variationData) {
      const matchingVariation = variationData.variations.find(v => {
        return Object.entries(newAttrs).every(([key, val]) => {
          const varValue = v[key as keyof typeof v]
          return varValue === val
        })
      })

      if (matchingVariation) {
        setSelectedVariation(matchingVariation.productid)
      }
    }
  }

  const getAvailableValuesForAttribute = (attributeType: string): string[] => {
    if (!variationData) return []

    const values = new Set<string>()
    variationData.variations.forEach(v => {
      const value = v[attributeType as keyof typeof v]
      if (value && typeof value === 'string') {
        values.add(value)
      }
    })

    const result = Array.from(values).sort()
    console.log(`Available ${attributeType} values:`, result)
    return result
  }

  const getSelectedVariationPrice = () => {
    if (!product || !selectedVariation) return product?.price || 0

    // Check variation data first for more accurate pricing
    if (variationData) {
      const variation = variationData.variations.find(v => v.productid === selectedVariation)
      if (variation) return variation.price
    }

    // Fallback to basic variations
    const variation = product.variations?.find(v => v.productid === selectedVariation)
    if (!variation) return product.price

    // Variations are full products with their own prices
    return variation.price
  }

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rinos-primary mb-4"></div>
          <p className="text-gray-600">Lädt Produkt...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produkt nicht gefunden</h2>
          <p className="text-gray-600 mb-6">{error || 'Dieses Produkt existiert nicht.'}</p>
          <Link href="/products" className="bg-rinos-primary text-white px-6 py-3 hover:opacity-90 transition-opacity">
            Zurück zu den Produkten
          </Link>
        </div>
      </div>
    )
  }

  const finalPrice = getSelectedVariationPrice()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/produkte"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zu den Produkten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="bg-white rounded-lg p-4">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square w-full bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.articlename} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="text-center text-sm text-gray-600">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}

                {/* Thumbnail Navigation */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded border-2 overflow-hidden transition-all ${
                          selectedImageIndex === index
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : product.primary_image ? (
              <div className="aspect-square w-full bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src={product.primary_image}
                  alt={product.articlename}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-9xl font-bold text-gray-300">
                  {product.articlename.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-8">
              {/* Category */}
              {product.categories && product.categories.length > 0 && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded">
                    {product.categories[0].category}
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

              {/* Variations - Grouped by Attribute */}
              {variationData && variationData.variations.length > 0 ? (
                <div className="mb-6 space-y-4">
                  {/* Colour Selection */}
                  {getAvailableValuesForAttribute('colour').length > 0 && (
                    <div>
                      <label className="label">Farbe</label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableValuesForAttribute('colour').map((colour) => (
                          <button
                            key={colour}
                            onClick={() => handleAttributeChange('colour', colour)}
                            className={`px-4 py-2 border-2 transition-all ${
                              selectedAttributes['colour'] === colour
                                ? 'border-blue-600 bg-blue-50 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {colour}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {getAvailableValuesForAttribute('size').length > 0 && (
                    <div>
                      <label className="label">Größe</label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableValuesForAttribute('size').map((size) => (
                          <button
                            key={size}
                            onClick={() => handleAttributeChange('size', size)}
                            className={`px-4 py-2 border-2 transition-all ${
                              selectedAttributes['size'] === size
                                ? 'border-blue-600 bg-blue-50 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Component Selection */}
                  {getAvailableValuesForAttribute('component').length > 0 && (
                    <div>
                      <label className="label">Komponente</label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableValuesForAttribute('component').map((component) => (
                          <button
                            key={component}
                            onClick={() => handleAttributeChange('component', component)}
                            className={`px-4 py-2 border-2 transition-all ${
                              selectedAttributes['component'] === component
                                ? 'border-blue-600 bg-blue-50 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {component}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Type Selection */}
                  {getAvailableValuesForAttribute('type').length > 0 && (
                    <div>
                      <label className="label">Typ</label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableValuesForAttribute('type').map((type) => (
                          <button
                            key={type}
                            onClick={() => handleAttributeChange('type', type)}
                            className={`px-4 py-2 border-2 transition-all ${
                              selectedAttributes['type'] === type
                                ? 'border-blue-600 bg-blue-50 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Variation Info */}
                  {selectedVariation && (
                    <div className="text-sm text-gray-600 pt-2 border-t">
                      Art.-Nr.: {variationData.variations.find(v => v.productid === selectedVariation)?.articlenr}
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback: Simple Variation List */
                product.variations && product.variations.length > 0 && (
                  <div className="mb-6">
                    <label className="label">Variante wählen</label>
                    <div className="grid grid-cols-2 gap-3">
                      {product.variations.map((variation) => (
                        <button
                          key={variation.productid}
                          onClick={() => setSelectedVariation(variation.productid)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedVariation === variation.productid
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">
                            {variation.colour || variation.size || variation.component || variation.type || variation.articlenr}
                          </div>
                          {variation.price !== product.price && (
                            <div className="text-sm text-gray-600">
                              {variation.price.toFixed(2)} EUR
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
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
                    {finalPrice.toFixed(2)} {product.currency || '€'}
                  </span>
                  {selectedVariation && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.price.toFixed(2)} {product.currency || '€'}
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
                  disabled={addingToCart}
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
                  disabled={addingToCart}
                  className="btn btn-outline w-full btn-lg"
                >
                  Jetzt kaufen
                </button>
              </div>

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

        {/* Product Descriptions */}
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
          {/* Short Description */}
          {product.shortdescription && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Produktinformationen</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.shortdescription }}
              />
            </div>
          )}

          {/* Long Description */}
          {product.longdescription && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Produktbeschreibung</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.longdescription }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
