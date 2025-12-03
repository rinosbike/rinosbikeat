/**
 * Product Detail Page - /produkte/[slug]
 * Individual product page with add to cart functionality
 * slug = article number (e.g., RINOS24GRX400)
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { productsApi, cartApi, variationsApi, type Product, type ProductVariation, type ProductVariationsResponse } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Check, AlertCircle, ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

interface ProductDetailPagePropsOld {
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
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null) // Changed to article number
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [zoomImageIndex, setZoomImageIndex] = useState(0)

  // No translation needed - values come directly from database in correct language

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      // params.slug is the article number (e.g., RINOS24GRX400)
      const data = await productsApi.getById(params.slug)
      setProduct(data)

      // Determine the article number to use for fetching variations
      // If this is a child article, use the father's article number
      // If this is a father article, use its own article number
      const fatherArticleNr = data.father_article || data.articlenr

      console.log('Product data loaded:', {
        is_father_article: data.is_father_article,
        has_variations: !!data.variations,
        variations_count: data.variations?.length || 0,
        articlenr: data.articlenr,
        father_article: data.father_article,
        using_articlenr: fatherArticleNr
      })

      // Load detailed variation data if this product has variations (either as father or child)
      if ((data.is_father_article && data.variations && data.variations.length > 0) || data.father_article) {
        try {
          console.log('Loading variation data for father article:', fatherArticleNr)
          const varData = await variationsApi.getVariations(fatherArticleNr)
          console.log('Variation data loaded:', varData)
          setVariationData(varData)

          // Pre-select first variation from variation_combinations
          if (varData.variation_combinations && varData.variation_combinations.length > 0) {
            const firstCombo = varData.variation_combinations[0]
            setSelectedVariation(firstCombo.articlenr)

            // Initialize selected attributes from first combination
            const attrs: Record<string, string> = {}
            firstCombo.variations.forEach(v => {
              if (v.type && v.value) {
                attrs[v.type] = v.value
              }
            })
            setSelectedAttributes(attrs)
            console.log('Pre-selected variation:', firstCombo.articlenr, attrs)
          }
        } catch (varErr) {
          console.error('Could not load variation data:', varErr)
          console.log('Error details:', varErr)
          // Fallback to basic variation handling
          if (data.variations && data.variations.length > 0) {
            const firstVar = data.variations[0]
            setSelectedVariation(firstVar.articlenr)

            // Initialize selected attributes from first variation
            const attrs: Record<string, string> = {}
            if (firstVar.colour) attrs['Farbe'] = firstVar.colour
            if (firstVar.size) attrs['Größe'] = firstVar.size
            setSelectedAttributes(attrs)
            console.log('Pre-selected fallback variation:', firstVar.articlenr, attrs)
          }
        }
      } else if (data.variations && data.variations.length > 0) {
        // Simple variation handling for non-father articles
        const firstVar = data.variations[0]
        setSelectedVariation(firstVar.articlenr)

        // Initialize selected attributes
        const attrs: Record<string, string> = {}
        if (firstVar.colour) attrs['Farbe'] = firstVar.colour
        if (firstVar.size) attrs['Größe'] = firstVar.size
        setSelectedAttributes(attrs)
        console.log('Pre-selected simple variation:', firstVar.articlenr, attrs)
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

      // Convert article number to product ID
      let productIdToAdd = product.productid
      if (selectedVariation && variationData && variationData.variations) {
        const selectedVar = variationData.variations.find(v => v.articlenr === selectedVariation)
        if (selectedVar) {
          productIdToAdd = selectedVar.productid
        }
      }

      // Add to cart via API
      const updatedCart = await cartApi.addItem(
        currentSessionId,
        productIdToAdd,
        quantity
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

  const openImageZoom = (index: number) => {
    setZoomImageIndex(index)
    setIsImageZoomed(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeImageZoom = () => {
    setIsImageZoomed(false)
    document.body.style.overflow = 'unset'
  }

  const nextZoomImage = () => {
    if (product?.images && zoomImageIndex < product.images.length - 1) {
      setZoomImageIndex(zoomImageIndex + 1)
    }
  }

  const previousZoomImage = () => {
    if (zoomImageIndex > 0) {
      setZoomImageIndex(zoomImageIndex - 1)
    }
  }

  // Handle keyboard navigation for zoom
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!isImageZoomed) return

      if (e.key === 'Escape') {
        closeImageZoom()
      } else if (e.key === 'ArrowLeft') {
        previousZoomImage()
      } else if (e.key === 'ArrowRight') {
        nextZoomImage()
      }
    }
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [isImageZoomed, zoomImageIndex, product?.images])

  const handleAttributeChange = async (attributeType: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [attributeType]: value }
    setSelectedAttributes(newAttrs)

    // Find matching variation from variation_combinations (if available)
    if (variationData && variationData.variation_combinations) {
      const matchingCombo = variationData.variation_combinations.find(combo => {
        // Check if all selected attributes match this combination
        return Object.entries(newAttrs).every(([type, val]) => {
          return combo.variations.some(v => v.type === type && v.value === val)
        })
      })

      if (matchingCombo) {
        setSelectedVariation(matchingCombo.articlenr)
        console.log('Matched variation:', matchingCombo.articlenr, newAttrs)

        // Update URL with variant query parameter (like Shopify)
        const url = new URL(window.location.href)
        url.searchParams.set('variant', matchingCombo.articlenr)
        window.history.replaceState({}, '', url.toString())

        // Load variant product data to get its specific images
        if (attributeType === 'Farbe') {
          try {
            const variantProduct = await productsApi.getById(matchingCombo.articlenr)
            if (variantProduct && variantProduct.images && variantProduct.images.length > 0) {
              // Update the product's images to show variant images
              setProduct(prevProduct => prevProduct ? {
                ...prevProduct,
                images: variantProduct.images,
                primary_image: variantProduct.primary_image
              } : null)
              setSelectedImageIndex(0) // Reset to first image
              console.log('Loaded variant images:', variantProduct.images.length, 'images for', matchingCombo.articlenr)
            }
          } catch (err) {
            console.error('Could not load variant product images:', err)
            // Fallback: just reset to first image of current images
            setSelectedImageIndex(0)
          }
        }
      }
    } else if (product && product.variations) {
      // Fallback: Use product.variations with colour and size fields
      const matchingVariation = product.variations.find(v => {
        let matches = true
        if (newAttrs['Farbe'] && v.colour !== newAttrs['Farbe']) matches = false
        if (newAttrs['Größe'] && v.size !== newAttrs['Größe']) matches = false
        return matches
      })

      if (matchingVariation) {
        setSelectedVariation(matchingVariation.articlenr)
        console.log('Matched fallback variation:', matchingVariation.articlenr, newAttrs)

        // Update URL with variant query parameter (like Shopify)
        const url = new URL(window.location.href)
        url.searchParams.set('variant', matchingVariation.articlenr)
        window.history.replaceState({}, '', url.toString())

        // Load variant product data to get its specific images
        if (attributeType === 'Farbe') {
          try {
            const variantProduct = await productsApi.getById(matchingVariation.articlenr)
            if (variantProduct && variantProduct.images && variantProduct.images.length > 0) {
              // Update the product's images to show variant images
              setProduct(prevProduct => prevProduct ? {
                ...prevProduct,
                images: variantProduct.images,
                primary_image: variantProduct.primary_image
              } : null)
              setSelectedImageIndex(0) // Reset to first image
              console.log('Loaded fallback variant images:', variantProduct.images.length, 'images for', matchingVariation.articlenr)
            }
          } catch (err) {
            console.error('Could not load fallback variant product images:', err)
            // Fallback: just reset to first image of current images
            setSelectedImageIndex(0)
          }
        }
      }
    }
  }

  const getAvailableValuesForAttribute = (attributeType: string): string[] => {
    if (!variationData || !variationData.variation_options) return []

    // Return values directly from variation_options
    const values = variationData.variation_options[attributeType] || []
    console.log(`Available ${attributeType} values:`, values)
    return values
  }

  const getSelectedVariationPrice = () => {
    if (!product || !selectedVariation) return product?.price || 0

    // Check variation data first for more accurate pricing
    if (variationData && variationData.variations) {
      const variation = variationData.variations.find(v => v.articlenr === selectedVariation)
      if (variation) return variation.price
    }

    // Fallback to basic variations
    const variation = product.variations?.find(v => v.articlenr === selectedVariation)
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
          <Link href="/produkte" className="bg-rinos-primary text-white px-6 py-3 hover:opacity-90 transition-opacity">
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
                <div
                  className="aspect-square w-full bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden relative group cursor-zoom-in"
                  onClick={() => openImageZoom(selectedImageIndex)}
                >
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.articlename} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {/* Zoom indicator */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5" />
                  </div>
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

              {/* Variations - Dynamically render based on variation_options */}
              {variationData && variationData.variation_options && Object.keys(variationData.variation_options).length > 0 ? (
                <div className="mb-6 space-y-4">
                  {/* Dynamically render each variation type */}
                  {Object.entries(variationData.variation_options).map(([varType, values]) => (
                    <div key={varType}>
                      <label className="label">{varType}</label>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <button
                            key={value}
                            onClick={() => handleAttributeChange(varType, value)}
                            className={`px-4 py-2 border-2 transition-all ${
                              selectedAttributes[varType] === value
                                ? 'border-blue-600 bg-blue-50 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Selected Variation Info */}
                  {selectedVariation && (
                    <div className="text-sm text-gray-600 pt-2 border-t">
                      Art.-Nr.: {selectedVariation}
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback: Show variations with their attributes (Farbe, Größe) */
                product.variations && product.variations.length > 0 && (() => {
                  // Group variations by attribute type
                  const attributeTypes = new Set<string>();
                  const attributeValuesByType: Record<string, Set<string>> = {};

                  product.variations.forEach(v => {
                    if (v.colour) {
                      attributeTypes.add('Farbe');
                      if (!attributeValuesByType['Farbe']) attributeValuesByType['Farbe'] = new Set();
                      attributeValuesByType['Farbe'].add(v.colour);
                    }
                    if (v.size) {
                      attributeTypes.add('Größe');
                      if (!attributeValuesByType['Größe']) attributeValuesByType['Größe'] = new Set();
                      attributeValuesByType['Größe'].add(v.size);
                    }
                  });

                  return (
                    <div className="mb-6 space-y-4">
                      {/* Farbe selector */}
                      {attributeValuesByType['Farbe'] && (
                        <div>
                          <label className="label">Farbe</label>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(attributeValuesByType['Farbe']).map((color) => (
                              <button
                                key={color}
                                onClick={() => handleAttributeChange('Farbe', color)}
                                className={`px-4 py-2 border-2 transition-all ${
                                  selectedAttributes['Farbe'] === color
                                    ? 'border-blue-600 bg-blue-50 font-medium'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Größe selector */}
                      {attributeValuesByType['Größe'] && (
                        <div>
                          <label className="label">Größe</label>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(attributeValuesByType['Größe']).map((size) => (
                              <button
                                key={size}
                                onClick={() => handleAttributeChange('Größe', size)}
                                className={`px-4 py-2 border-2 transition-all ${
                                  selectedAttributes['Größe'] === size
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

                      {/* Selected Variation Info */}
                      {selectedVariation && (
                        <div className="text-sm text-gray-600 pt-2 border-t">
                          Art.-Nr.: {selectedVariation}
                        </div>
                      )}
                    </div>
                  );
                })()
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

        {/* Image Zoom Modal */}
        {isImageZoomed && product.images && product.images.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={closeImageZoom}
          >
            {/* Close Button */}
            <button
              onClick={closeImageZoom}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Close zoom"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg z-50">
              {zoomImageIndex + 1} / {product.images.length}
            </div>

            {/* Previous Button */}
            {zoomImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  previousZoomImage()
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
            )}

            {/* Next Button */}
            {zoomImageIndex < product.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextZoomImage()
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            )}

            {/* Zoomed Image */}
            <div
              className="max-w-[95vw] max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.images[zoomImageIndex]}
                alt={`${product.articlename} - Image ${zoomImageIndex + 1}`}
                className="max-w-full max-h-[95vh] object-contain"
              />
            </div>

            {/* Keyboard hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black bg-opacity-50 px-4 py-2 rounded-lg z-50">
              Drücke ESC zum Schließen {product.images.length > 1 && '• Nutze ← → zum Navigieren'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
