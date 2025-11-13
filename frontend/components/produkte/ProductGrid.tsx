/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 */

import { type Product } from '@/lib/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productid} product={product} />
      ))}
    </div>
  )
}
