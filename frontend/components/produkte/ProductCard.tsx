/**
 * Product Card Component
 * Displays product information in a card format
 */

import Link from 'next/link'
import { type Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produkte/${product.product_id}`}>
      <div className="card group cursor-pointer h-full flex flex-col">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <div className="text-6xl font-bold text-gray-300">
            {product.articlename.charAt(0)}
          </div>
        </div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.articlename}
        </h3>
        
        {/* Product Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
        )}
        
        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {product.price.toFixed(2)} {product.currency}
            </span>
            {product.variations && product.variations.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.variations.length} Varianten
              </span>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        {!product.is_active && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
              Nicht verfügbar
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
