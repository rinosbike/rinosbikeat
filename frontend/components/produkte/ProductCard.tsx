'use client'

import Link from 'next/link'
import { type Product } from '@/lib/api'
import { ShoppingCart, Heart, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      addItem({
        articlenr: product.articlenr,
        articlename: product.articlename,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        primary_image: product.primary_image || '/placeholder-bike.jpg',
        manufacturer: product.manufacturer ?? undefined,
      })
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const imageUrl = product.primary_image || '/placeholder-bike.jpg'
  
  // Check if RINOS brand bike
  const isRinos = product.manufacturer?.toLowerCase().includes('rinos')
  
  // Extract model name from article name
  const modelMatch = product.articlename?.match(/(?:Sandman|ODIN|Gaia|Atlas)[\w.]*/i)
  const modelName = modelMatch?.[0] || ''
  
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  
  // Clean HTML from description
  const cleanDescription = product.shortdescription
    ? product.shortdescription.replace(/<[^>]*>/g, '').trim()
    : ''

  return (
    <Link href={`/produkte/${product.articlenr}`}>
      <div className="group h-full">
        {/* Card Container */}
        <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col border border-gray-100 hover:border-gray-300">
          {/* Image Section - Large Rectangle */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
            {product.primary_image ? (
              <img
                src={imageUrl}
                alt={product.articlename}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-20">🚴</div>
                </div>
              </div>
            )}

            {/* Top Left Badge - Brand */}
            <div className="absolute top-3 left-3">
              {isRinos ? (
                <div className="inline-block bg-black text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                  RINOS
                </div>
              ) : (
                <div className="inline-block bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider opacity-80">
                  {product.manufacturer?.slice(0, 10)}
                </div>
              )}
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Bottom Overlay with CTA */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div></div>
              <button
                onClick={handleAddToCart}
                className={`p-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 font-bold text-sm ${
                  showFeedback
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {showFeedback ? (
                  <><span>✓</span> Hinzugefügt</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> In den Warenkorb</>
                )}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Product Name */}
            <h3 className="text-sm font-black text-black line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
              {product.articlename}
            </h3>

            {/* Price */}
            <p className="text-xl font-black text-black">
              €{price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
