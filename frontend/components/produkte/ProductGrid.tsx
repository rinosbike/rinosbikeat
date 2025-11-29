/**
 * Product Grid Component - Shopify Dawn Style
 * Clean grid layout matching rinosbike.hr
 */

import { type Product } from '@/lib/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {products.map((product) => (
        <ProductCard key={product.productid} product={product} />
      ))}
    </div>
  )
}
