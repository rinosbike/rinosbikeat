/**
 * Homepage - RINOS Bikes Austria
 * Matching rinosbike.eu design
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api'
import ProductCard from '@/components/produkte/ProductCard'
import TrustBanner from '@/components/home/TrustBanner'
import HeroSection from '@/components/home/HeroSection'
import SectionHeader from '@/components/common/SectionHeader'
import BlogGrid, { type BlogPost } from '@/components/home/BlogGrid'

// Placeholder blog posts data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Neue Saison, neue Trails',
    excerpt: 'Entdecken Sie unsere neuesten Routen und Tipps für die kommende Fahrradsaison.',
    date: '15. März 2024',
    slug: 'neue-saison-neue-trails'
  },
  {
    id: '2',
    title: 'Wartungstipps für Ihr Fahrrad',
    excerpt: 'So halten Sie Ihr RINOS Bike in Top-Zustand – einfache Wartungsschritte für Zuhause.',
    date: '8. März 2024',
    slug: 'wartungstipps-fahrrad'
  },
  {
    id: '3',
    title: 'Gravel vs. Mountainbike',
    excerpt: 'Welches Fahrrad passt zu Ihnen? Ein Vergleich der beiden beliebten Kategorien.',
    date: '1. März 2024',
    slug: 'gravel-vs-mountainbike'
  }
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll()
      setFeaturedProducts(response.products.slice(0, 8))
    } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Welcome Section - Rich Text */}
      <section className="py-10 md:py-[52px] bg-white">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Willkommen in der Welt von Rinos
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              Hier finden Sie alle unsere Fahrradmodelle sowie eine vielfältige Auswahl an Zubehör
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <TrustBanner />

      {/* Main Hero - Sandman 6 */}
      <HeroSection
        image="/images/hero/sandman6.jpg"
        imageAlt="Sandman 6 - Praktikabilität mit Leistung"
        subtitle="Sandman 6"
        title="Praktikabilität mit Leistung"
        buttonText="Entdecken"
        buttonLink="/products/3427"
        alignment="right"
        overlayOpacity={0}
      />

      {/* Featured Blog Section */}
      <section className="py-7 md:py-9 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <SectionHeader
            title="Rinos Bicycles. Was gibt's Neues?"
            size="large"
          />
          <BlogGrid posts={blogPosts} columns={3} />
        </div>
      </section>

      {/* Sandman 4 Hero Banner */}
      <HeroSection
        image="/images/hero/sandman4.jpg"
        imageAlt="Sandman 4 - Erobern Sie alle Gelände und Rennen"
        subtitle="Sandman 4"
        title="Erobern Sie alle Gelände und Rennen"
        buttonText="Entdecken"
        buttonLink="/products/3426"
        alignment="right"
        overlayOpacity={30}
      />

      {/* Gaia 2 MTB Banner */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
              <Image
                src="/images/hero/gaia2.jpg"
                alt="Gaia 2 MTB"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Gaia 2
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Holen Sie sich jetzt Ihr erstes MTB
              </p>
              <Link
                href="/products/2025"
                className="inline-block bg-blue-600 text-white px-8 py-3 text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <SectionHeader
            title="Ausgewählte Produkte"
            description="Entdecken Sie unsere Top-Auswahl an Fahrrädern und Zubehör"
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Lädt Produkte...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.productid} product={product} />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/products"
                  className="inline-block bg-gray-900 text-white px-8 py-3 text-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Alle Produkte ansehen
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Build Your Bike Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bauen Sie Ihr Fahrrad mit Shimano-Teilen
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Hochwertige Komponenten für Ihr individuelles Traumrad
              </p>
              <Link
                href="/categories/114"
                className="inline-block bg-blue-600 text-white px-8 py-3 text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Fahrradteile ansehen
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative h-[300px] md:h-[400px] overflow-hidden rounded-lg">
              <Image
                src="/images/hero/sandman4.jpg"
                alt="Shimano Fahrradteile"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RINOS */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-container mx-auto px-6 md:px-20">
          <SectionHeader title="Warum RINOS Bikes?" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2 Jahre Garantie</h3>
              <p className="text-gray-600">Auf alle Rahmen</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kundensupport</h3>
              <p className="text-gray-600">Lebenslang für Sie da</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direktverkauf</h3>
              <p className="text-gray-600">Keine Zwischenhändler</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">95% Vormontiert</h3>
              <p className="text-gray-600">Schnell fahrbereit</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
