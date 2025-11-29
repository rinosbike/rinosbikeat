/**
 * Homepage - RINOS Bikes
 * German language
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api'
import ProductCard from '@/components/produkte/ProductCard'
import { ShoppingBag, Truck, Shield, Award } from 'lucide-react'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
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

  return (
    <div>
      {/* Hero Section - Shopify Style */}
      <section className="bg-rinos-bg-secondary">
        <div className="max-w-container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-normal text-rinos-text mb-6">
              Premium Fahrräder aus Deutschland
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Hochwertige Gravel, Road, Mountain und Falträder.
              Made with passion in Frankfurt (Oder).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-rinos-primary text-white px-8 py-3 hover:opacity-90 transition-opacity text-center"
              >
                Alle Fahrräder ansehen
              </Link>
              <Link
                href="/categories"
                className="bg-white border border-rinos-primary text-rinos-primary px-8 py-3 hover:bg-gray-50 transition-colors text-center"
              >
                Kategorien durchsuchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-rinos-bg-secondary">
        <div className="max-w-container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Award className="w-10 h-10 text-rinos-text" />}
              title="Premium Qualität"
              description="Nur hochwertigste Komponenten und Materialien"
            />
            <FeatureCard
              icon={<Truck className="w-10 h-10 text-rinos-text" />}
              title="Kostenloser Versand"
              description="Versandkostenfrei in ganz Europa"
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-rinos-text" />}
              title="5 Jahre Garantie"
              description="Umfassende Garantie auf alle Rahmen"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-10 h-10 text-rinos-text" />}
              title="Sichere Zahlung"
              description="Stripe-gesicherte Zahlungsabwicklung"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal text-rinos-text mb-4">
              Unsere Fahrräder
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entdecken Sie unsere Auswahl an hochwertigen Fahrrädern für jedes Abenteuer
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rinos-primary"></div>
              <p className="mt-4 text-gray-600">Lädt...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.productid} product={product} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/products"
                  className="bg-rinos-primary text-white px-8 py-3 hover:opacity-90 transition-opacity"
                >
                  Alle Produkte ansehen
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-rinos-bg-secondary">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-normal text-rinos-text text-center mb-12">
            Kategorien
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <CategoryCard
              title="Gravel Bikes"
              description="Für Abenteuer abseits der Straße"
              image="/images/categories/gravel.jpg"
              link="/products?category=gravel"
            />
            <CategoryCard
              title="Rennräder"
              description="Schnell und leicht auf der Straße"
              image="/images/categories/road.jpg"
              link="/products?category=road"
            />
            <CategoryCard
              title="Mountainbikes"
              description="Robust für jeden Trail"
              image="/images/categories/mountain.jpg"
              link="/products?category=mountain"
            />
            <CategoryCard
              title="Falträder"
              description="Kompakt und praktisch"
              image="/images/categories/foldable.jpg"
              link="/products?category=foldable"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rinos-dark text-white">
        <div className="max-w-container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6">
            Bereit für dein nächstes Abenteuer?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entdecke jetzt unsere Premium-Fahrräder und finde das perfekte Bike für deine Bedürfnisse.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-rinos-text px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Jetzt shoppen
          </Link>
        </div>
      </section>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-normal text-rinos-text mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

// Category Card Component
function CategoryCard({ title, description, image, link }: {
  title: string
  description: string
  image: string
  link: string
}) {
  return (
    <Link href={link} className="group block">
      <div className="bg-white overflow-hidden">
        <div className="aspect-square bg-rinos-bg-secondary relative overflow-hidden mb-3">
          {/* Placeholder for category image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-white text-6xl font-bold opacity-30">
              {title[0]}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-base font-normal text-rinos-text mb-1 group-hover:underline">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}
