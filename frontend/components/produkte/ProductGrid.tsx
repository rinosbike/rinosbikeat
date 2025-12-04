/**
 * Product Grid Component - Premium Bike Showcase
 * Optimized responsive grid with consistent card heights
 */

import { type Product } from '@/lib/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div>
      {/* Grid Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-black mb-1">
            {products.length} Fahrräder
          </h3>
          <p className="text-sm text-gray-600">
            Hochwertige Bikes von RINOS und führenden Marken
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {products.map((product) => (
          <ProductCard key={product.productid || product.articlenr} product={product} />
        ))}
      </div>
    </div>
  )
}
