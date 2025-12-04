/**
 * Product Detail Page - /produkte/[slug]
 * Individual product page with add to cart functionality
 * slug = article number (e.g., RINOS24GRX400)
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { productsApi, cartApi, variationsApi, type Product, type ProductVariation, type ProductVariationsResponse } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Check, AlertCircle, ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn, Truck, Shield, Award } from 'lucide-react'
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
  const searchParams = useSearchParams()
  const { addItem } = useCartStore()

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
  }, [params.slug, searchParams])

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

          // Check if variant is specified in URL query parameter
          const variantParam = searchParams?.get('variant')
          let selectedCombo = null

          if (variantParam && varData.variation_combinations) {
            // Find the combo matching the variant parameter
            selectedCombo = varData.variation_combinations.find(
              combo => combo.articlenr === variantParam
            )
            if (selectedCombo) {
              console.log('URL variant parameter found, loading:', variantParam)
            } else {
              console.warn('URL variant parameter not found in combinations:', variantParam)
            }
          }

          // If no valid variant in URL, use first combination as default
          if (!selectedCombo && varData.variation_combinations && varData.variation_combinations.length > 0) {
            selectedCombo = varData.variation_combinations[0]
            console.log('No URL variant, using first combination:', selectedCombo.articlenr)
          }

          // Pre-select the chosen variation
          if (selectedCombo) {
            setSelectedVariation(selectedCombo.articlenr)

            // Initialize selected attributes from combination
            const attrs: Record<string, string> = {}
            selectedCombo.variations.forEach(v => {
              if (v.type && v.value) {
                attrs[v.type] = v.value
              }
            })
            setSelectedAttributes(attrs)
            console.log('Pre-selected variation:', selectedCombo.articlenr, attrs)

            // Load variant images if this is different from father product
            if (selectedCombo.articlenr !== fatherArticleNr) {
              try {
                console.log('Loading images for variant:', selectedCombo.articlenr)
                const variantProduct = await productsApi.getById(selectedCombo.articlenr)

                if (variantProduct && variantProduct.images && variantProduct.images.length > 0) {
                  // Update product to show variant images
                  setProduct(prevProduct => prevProduct ? {
                    ...prevProduct,
                    images: variantProduct.images,
                    primary_image: variantProduct.primary_image
                  } : null)
                  console.log('✅ Loaded', variantProduct.images.length, 'images for variant', selectedCombo.articlenr)
                } else {
                  console.warn('⚠️ No images found for variant:', selectedCombo.articlenr)
                }
              } catch (imgErr) {
                console.error('❌ Failed to load variant images:', imgErr)
              }
            }
          }
        } catch (varErr) {
          console.error('Could not load variation data:', varErr)
          console.log('Error details:', varErr)
        }
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

      // Get the product to add (variant or main product)
      let productToAdd = product
      const articlenrToAdd = selectedVariation || product.articlenr

      // If variant selected, fetch its details to get current price and images
      if (selectedVariation && selectedVariation !== product.articlenr) {
        try {
          const variantProduct = await productsApi.getById(selectedVariation)
          if (variantProduct) {
            productToAdd = variantProduct
          }
        } catch (err) {
          console.error('Could not load variant details, using main product:', err)
        }
      }

      // Add to client-side cart (localStorage only, no database)
      addItem({
        articlenr: articlenrToAdd,
        articlename: productToAdd.articlename,
        price: productToAdd.price,
        primary_image: productToAdd.primary_image || undefined,
        manufacturer: productToAdd.manufacturer || undefined,
        colour: productToAdd.colour || undefined,
        size: productToAdd.size || undefined,
      }, quantity)

      console.log('Added to cart (client-side):', {
        articlenr: articlenrToAdd,
        quantity,
        name: productToAdd.articlename,
      })

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

    console.log('Attribute changed:', { attributeType, value, newAttrs })

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
        // Always load images for any variation change (not just color)
        console.log('Variation changed, loading variant images for:', matchingCombo.articlenr)
        try {
          const variantProduct = await productsApi.getById(matchingCombo.articlenr)
          console.log('Variant product loaded:', variantProduct)

          if (variantProduct) {
            if (variantProduct.images && variantProduct.images.length > 0) {
              // Update the product's images to show variant images
              setProduct(prevProduct => prevProduct ? {
                ...prevProduct,
                images: variantProduct.images,
                primary_image: variantProduct.primary_image
              } : null)
              setSelectedImageIndex(0) // Reset to first image
              console.log('✅ Successfully loaded variant images:', variantProduct.images.length, 'images for', matchingCombo.articlenr)
            } else {
              console.error('❌ Variant product has NO images in database:', matchingCombo.articlenr)
              // This should never happen according to user - all products have images
              setSelectedImageIndex(0)
            }
          } else {
            console.error('❌ Variant product not found:', matchingCombo.articlenr)
          }
        } catch (err) {
          console.error('❌ Failed to load variant product:', matchingCombo.articlenr, err)
          setSelectedImageIndex(0)
        }
      } else {
        console.warn('No matching variation combo found for:', newAttrs)
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
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/produkte"
          className="inline-flex items-center text-black hover:text-gray-700 mb-8 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Image Column - Full width image with horizontal thumbnails */}
          <div className="lg:col-span-2">
            {product.images && product.images.length > 0 ? (
              <div>
                {/* Main Image - Compact, no extra space */}
                <div
                  className="w-full bg-gray-50 flex items-center justify-center overflow-hidden relative group cursor-zoom-in -mx-4 sm:mx-0 rounded-2xl border border-gray-100"
                  style={{ aspectRatio: '1 / 1' }}
                  onClick={() => openImageZoom(selectedImageIndex)}
                >
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.articlename} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                  {/* Zoom indicator */}
                  <div className="absolute bottom-6 right-6 bg-black text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                {/* Horizontal Thumbnails Below */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-3 mt-4">
                    {product.images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square overflow-hidden transition-all ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-black'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {product.images.length > 6 && (
                      <button
                        onClick={() => openImageZoom(6)}
                        className="aspect-square bg-gray-900 text-white flex items-center justify-center text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        +{product.images.length - 6}
                      </button>
                    )}
                  </div>
                )}

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="text-center text-xs text-gray-500 font-medium mt-4">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
            ) : product.primary_image ? (
              <div className="w-full bg-gray-50 flex items-center justify-center -mx-4 sm:mx-0 rounded-2xl border border-gray-100" style={{ aspectRatio: '1 / 1' }}>
                <img
                  src={product.primary_image}
                  alt={product.articlename}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full bg-black flex items-center justify-center -mx-4 sm:mx-0 rounded-2xl" style={{ aspectRatio: '1 / 1' }}>
                <div className="text-9xl font-black text-white">
                  {product.articlename.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info (3:1 grid = narrow column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
              {/* Category Badge */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <span className="inline-block px-4 py-2 text-xs font-black uppercase tracking-wider bg-black text-white rounded-lg">
                    {product.categories[0].category}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-black">
                  {product.articlename}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-2">
                  Art.-Nr.: {product.articlenr}
                </p>
              </div>

              {/* Price - Bold */}
              <div className="py-6 border-b border-gray-200">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black text-black">
                    €{finalPrice.toFixed(2)}
                  </span>
                  {selectedVariation && finalPrice !== product.price && (
                    <span className="text-lg text-gray-400 line-through font-medium">
                      €{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  inkl. MwSt. zzgl. Versandkosten
                </p>
              </div>

              {/* Variations */}
              {variationData && variationData.variation_options && Object.keys(variationData.variation_options).length > 0 && (
                <div className="space-y-4">
                  {Object.entries(variationData.variation_options).map(([varType, values]) => (
                    <div key={varType}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-700">{varType}</label>
                      <div className="flex flex-wrap gap-2">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAttributeChange(varType, value)}
                          className={`px-4 py-2 text-sm font-semibold transition-all ${
                            selectedAttributes[varType] === value
                              ? 'bg-black text-white'
                              : 'bg-white text-black border border-gray-300 hover:border-black'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Selected Variation */}
                {selectedVariation && (
                  <div className="text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
                    Variante: {selectedVariation}
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-700">Anzahl</label>
              <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-bold"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-base font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

              {/* CTA Buttons - Sticky on Desktop */}
              <div className="lg:sticky lg:top-24 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-black text-white px-6 py-4 text-base font-bold rounded-xl hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Wird hinzugefügt...</span>
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In den Warenkorb gelegt!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>In den Warenkorb</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="w-full border-2 border-black text-black px-6 py-4 text-base font-bold rounded-xl hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  Jetzt kaufen
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-black">Kostenloser Versand</p>
                    <p className="text-xs text-gray-500">ab 100€</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-black">Sichere Zahlung</p>
                    <p className="text-xs text-gray-500">via Stripe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-black">5 Jahre Garantie</p>
                    <p className="text-xs text-gray-500">auf Rahmen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Descriptions - Premium Style */}
        <div className="mt-20 space-y-16">
          {/* Short Description */}
          {product.shortdescription && (
            <div className="max-w-4xl bg-white rounded-2xl border border-gray-100 p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-black mb-8 text-black">Produktinformationen</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.shortdescription }}
              />
            </div>
          )}

          {/* Long Description */}
          {product.longdescription && (
            <div className="max-w-4xl bg-white rounded-2xl border border-gray-100 p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-black mb-8 text-black">Produktbeschreibung</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
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
