/**
 * Featured Products Component
 * Displays products from Neon database
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

interface Product {
  productid: number
  articlenr: string
  articlename: string
  price: number
  sale_price?: number | null
  rating?: number
  reviews?: number
  primary_image?: string
  slug?: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/featured-products?limit=8')
        const data = await response.json()
        if (data.products) {
          setProducts(data.products.slice(0, 8))
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-white via-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-black">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-black">Featured Products</h2>
          <Link href="/produktsuche" className="flex items-center gap-2 text-sm font-bold text-black hover:text-gray-700 transition-colors">
            Alle ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.productid}
              href={`/products/${product.articlenr}`}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 p-4">
                <div className="relative bg-gray-50 aspect-square overflow-hidden rounded-xl mb-4 flex items-center justify-center border border-gray-100">
                  {product.primary_image ? (
                    <img
                      src={product.primary_image}
                      alt={product.articlename}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">Kein Bild</span>
                    </div>
                  )}
                  {product.sale_price && product.sale_price < product.price && (
                    <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 text-xs font-black rounded-lg">
                      SALE
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-black line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {product.articlename}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(product.rating || 0)
                                ? 'fill-black text-black'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {product.reviews && (
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    {product.sale_price && product.sale_price < product.price ? (
                      <>
                        <span className="text-xl font-black text-black">
                          €{product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          €{product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-black text-black">
                        €{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
