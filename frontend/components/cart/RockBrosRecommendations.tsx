/**
 * Complete Your Bike Component
 * Displays frame bags and accessories from cart page
 */

'use client'

import { useEffect, useState } from 'react'
import { categoriesApi, type Product } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function RockBrosRecommendations() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchFrameBags() {
      try {
        // Fetch products from Rahmentaschen category (ID 13)
        const response = await categoriesApi.getProducts(13)
        
        // Shuffle and get random products
        const shuffled = response.products
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
        
        setProducts(shuffled.length > 0 ? shuffled : response.products.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch frame bags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFrameBags()
  }, [])

  const handleAddToCart = (product: Product) => {
    const cartProduct: any = {
      articlenr: product.articlenr,
      articlename: product.articlename,
      price: product.price,
      primary_image: product.primary_image || undefined,
      manufacturer: product.manufacturer || undefined,
      colour: product.colour || undefined,
      size: product.size || undefined
    }
    addItem(cartProduct, 1)
    setAddedItems(prev => new Set(prev).add(product.articlenr))
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.articlenr)
        return newSet
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.productid}
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
              {product.primary_image ? (
                <Image
                  src={product.primary_image}
                  alt={product.articlename}
                  width={150}
                  height={150}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h4 className="text-xs font-bold text-black line-clamp-2 mb-1">
                {product.articlename}
              </h4>

              <p className="text-sm font-black text-black mb-3">
                €{product.price.toFixed(2)}
              </p>

              {/* Add Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full py-2 px-2 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${
                  addedItems.has(product.articlenr)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-black text-white hover:bg-gray-900 border border-black'
                }`}
              >
                <Plus className="w-3 h-3" />
                {addedItems.has(product.articlenr) ? 'Hinzugefügt' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/categories/rahmentaschen?id=13"
        className="inline-block text-sm font-semibold text-gray-600 hover:text-black transition-colors"
      >
        Alle Taschen ansehen →
      </Link>
    </div>
  )
}
