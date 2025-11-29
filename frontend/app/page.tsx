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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Fahrräder aus Deutschland
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Hochwertige Gravel, Road, Mountain und Falträder. 
              Made with passion in Frankfurt (Oder).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="btn btn-primary bg-white text-blue-600 hover:bg-gray-100 text-center text-lg px-8 py-4"
              >
                Alle Fahrräder ansehen
              </Link>
              <Link 
                href="/ueber-uns" 
                className="btn bg-blue-700 text-white hover:bg-blue-800 text-center text-lg px-8 py-4"
              >
                Über uns erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Award className="w-12 h-12 text-blue-600" />}
              title="Premium Qualität"
              description="Nur hochwertigste Komponenten und Materialien"
            />
            <FeatureCard
              icon={<Truck className="w-12 h-12 text-blue-600" />}
              title="Kostenloser Versand"
              description="Versandkostenfrei in ganz Europa"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-blue-600" />}
              title="5 Jahre Garantie"
              description="Umfassende Garantie auf alle Rahmen"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-12 h-12 text-blue-600" />}
              title="Sichere Zahlung"
              description="Stripe-gesicherte Zahlungsabwicklung"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unsere Fahrräder
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entdecken Sie unsere Auswahl an hochwertigen Fahrrädern für jedes Abenteuer
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Lädt...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.productid} product={product} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/products"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Alle Produkte ansehen
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Kategorien
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-20 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für dein nächstes Abenteuer?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entdecke jetzt unsere Premium-Fahrräder und finde das perfekte Bike für deine Bedürfnisse.
          </p>
          <Link
            href="/products"
            className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
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
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
    <Link href={link} className="group">
      <div className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0">
        <div className="aspect-square bg-gray-200 relative overflow-hidden">
          {/* Placeholder for category image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
            <span className="text-white text-6xl font-bold opacity-20">
              {title[0]}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}
