/**
 * Homepage - RINOS Bikes
 * Matching rinosbike.eu design - German language
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api'
import ProductCard from '@/components/produkte/ProductCard'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll()
      setFeaturedProducts(response.products.slice(0, 4))
    } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      // Get first 4 categories for homepage display
      setCategories(response.categories.slice(0, 4))
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error)
    }
  }

  // Convert category name to URL slug
  const categoryToSlug = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  return (
    <div>
      {/* Hero Banner - Sandman 6 */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/hero/sandman6.jpg"
          alt="Sandman 6"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Sandman 6 - Praktikabilität mit Leistung
            </h2>
            <Link
              href="/products/sandman-6"
              className="inline-block bg-white text-rinos-text px-8 py-3 hover:opacity-90 transition-opacity mt-4"
            >
              Entdecken
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Banner - Sandman 4 */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/hero/sandman4.jpg"
          alt="Sandman 4"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Sandman 4 - Erobern Sie alle Terrains und Rennen
            </h2>
            <Link
              href="/products/sandman-4"
              className="inline-block bg-white text-rinos-text px-8 py-3 hover:opacity-90 transition-opacity mt-4"
            >
              Entdecken
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Banner - Gaia 2 */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/hero/gaia2.jpg"
          alt="Gaia 2"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Gaia 2 - Holen Sie sich jetzt Ihr erstes MTB
            </h2>
            <Link
              href="/products/gaia-2"
              className="inline-block bg-white text-rinos-text px-8 py-3 hover:opacity-90 transition-opacity mt-4"
            >
              Entdecken
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - From Backend API */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-normal text-rinos-text mb-2">
              Ausgewählte Produkte
            </h2>
            <p className="text-sm text-gray-600">
              Entdecken Sie unsere Top-Auswahl
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rinos-primary"></div>
              <p className="mt-4 text-gray-600 text-sm">Lädt Produkte...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.productid} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/products"
                  className="inline-block bg-rinos-primary text-white px-8 py-3 hover:opacity-90 transition-opacity text-sm"
                >
                  Alle Produkte ansehen
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

