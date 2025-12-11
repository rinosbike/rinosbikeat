'use client'

import Link from 'next/link'
import { type Product } from '@/lib/api'
import { ShoppingCart, Heart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

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
  const isRinos = product.manufacturer?.toLowerCase().includes('rinos')
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price

  return (
    <Link href={`/produkte/${product.articlenr}`} className="block">
      <article className="group h-full">
        {/* Card Container */}
        <div className="relative bg-white rounded-2xl overflow-hidden
                      border border-rinos-border-light
                      transition-all duration-500 ease-out-expo
                      hover:border-rinos-border hover:shadow-elevated
                      hover:-translate-y-1
                      h-full flex flex-col">

          {/* Image Section */}
          <div className="relative aspect-[4/3] bg-rinos-bg-secondary overflow-hidden">
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}

            {/* Product Image */}
            {product.primary_image ? (
              <img
                src={imageUrl}
                alt={product.articlename}
                className={`w-full h-full object-contain p-4
                          transition-all duration-700 ease-out-expo
                          group-hover:scale-105
                          ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-rinos-text-secondary/30 text-5xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="5" cy="18" r="3"/>
                    <circle cx="19" cy="18" r="3"/>
                    <path d="M12 2v5"/>
                    <path d="M7 7h10"/>
                    <path d="m12 22-3-8-4 3"/>
                    <path d="m19 18-3-8-4 3"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Brand Badge */}
            <div className="absolute top-4 left-4">
              <span className={`badge ${isRinos ? 'badge-dark' : 'badge-light'}`}>
                {isRinos ? 'RINOS' : product.manufacturer?.slice(0, 12)}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full
                        flex items-center justify-center
                        transition-all duration-300 ease-out-expo
                        opacity-0 group-hover:opacity-100
                        ${isWishlisted
                          ? 'bg-red-500 text-white scale-100'
                          : 'bg-white/90 backdrop-blur-xs text-rinos-dark hover:bg-red-500 hover:text-white'
                        }`}
              aria-label={isWishlisted ? 'Von Wunschliste entfernen' : 'Zur Wunschliste hinzufügen'}
            >
              <Heart
                className="w-4 h-4"
                fill={isWishlisted ? 'currentColor' : 'none'}
              />
            </button>

            {/* Quick Add to Cart - Bottom Overlay */}
            <div className="absolute inset-x-0 bottom-0
                          bg-gradient-to-t from-black/70 via-black/40 to-transparent
                          pt-16 pb-4 px-4
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-300
                          flex items-end justify-end">
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full
                          text-body-sm font-medium
                          transition-all duration-300 ease-out-expo
                          ${showFeedback
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-rinos-dark hover:bg-rinos-bg-tertiary'
                          }`}
              >
                {showFeedback ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Hinzugefügt
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    In den Warenkorb
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Product Name */}
            <h3 className="text-body font-semibold text-rinos-dark leading-snug
                         line-clamp-2 mb-3
                         group-hover:text-black transition-colors duration-300">
              {product.articlename}
            </h3>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Price & Action */}
            <div className="flex items-end justify-between pt-3 border-t border-rinos-border-light">
              <div>
                <p className="text-caption text-rinos-text-secondary mb-0.5">
                  Preis
                </p>
                <p className="text-title-lg font-semibold text-rinos-dark">
                  €{price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* View Details Arrow */}
              <div className="w-10 h-10 rounded-full bg-rinos-bg-secondary
                            flex items-center justify-center
                            transition-all duration-300 ease-out-expo
                            group-hover:bg-black group-hover:text-white">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
