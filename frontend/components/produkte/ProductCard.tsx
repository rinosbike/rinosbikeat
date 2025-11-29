/**
 * Product Card Component - Shopify Dawn Style
 * Clean, minimal design matching rinosbike.hr
 */

import Link from 'next/link'
import { type Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.articlenr}`} className="group block">
      <div className="bg-white h-full flex flex-col">
        {/* Product Image - Sharp corners, no border */}
        <div className="relative aspect-square bg-rinos-bg-secondary mb-3 overflow-hidden max-w-full">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.articlename}
              className="w-full h-full object-contain group-hover:opacity-90 transition-opacity duration-200"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-300">
                {product.articlename.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Product Info - Minimal Shopify Style */}
        <div className="flex flex-col flex-grow">
          {/* Manufacturer / Brand */}
          {product.manufacturer && (
            <p className="text-sm text-gray-600 mb-1">
              {product.manufacturer}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-rinos-text font-normal mb-2 group-hover:underline line-clamp-2">
            {product.articlename}
          </h3>

          {/* Price */}
          <div className="mt-auto">
            <span className="text-rinos-text font-normal">
              €{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
