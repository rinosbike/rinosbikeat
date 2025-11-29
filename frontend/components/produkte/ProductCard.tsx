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
    <Link href={`/products/${product.articlenr}`}>
      <div className="card group cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {product.primary_image ? (
            <img 
              src={product.primary_image}
              alt={product.articlename}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl font-bold text-gray-300">
              {product.articlename.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        {product.productgroup && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded">
              {product.productgroup}
            </span>
          </div>
        )}

        {/* Parent Product Badge */}
        {product.is_father_article && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
              Mehrere Größen
            </span>
          </div>
        )}


        
        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.articlename}
        </h3>
        
        {/* Product Description */}
        {product.shortdescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.shortdescription}
          </p>
        )}
        
        {/* Manufacturer */}
        {product.manufacturer && (
          <p className="text-xs text-gray-500 mb-2">
            {product.manufacturer}
          </p>
        )}
        
        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">
              €{product.price.toFixed(2)}
            </span>
            {product.colour && (
              <span className="text-xs text-gray-500">
                {product.colour}
              </span>
            )}
          </div>
        </div>
        
        {/* GTIN Badge */}
        {product.gtin && (
          <div className="mt-2 pt-2 border-t">
            <span className="inline-block text-xs text-gray-500">
              SKU: {product.gtin}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
