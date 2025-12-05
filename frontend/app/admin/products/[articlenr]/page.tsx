/**
 * Admin Product Edit Page
 * Edit product details, pricing, images, descriptions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Package,
  ImageIcon,
  Trash2,
  Plus,
  Eye,
  Loader2
} from 'lucide-react'
import { adminApi, AdminProduct } from '@/lib/api'

export default function AdminProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const articlenr = params.articlenr as string

  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    articlename: '',
    shortdescription: '',
    longdescription: '',
    priceEUR: 0,
    costprice: 0,
    manufacturer: '',
    productgroup: '',
    type: '',
    colour: '',
    size: '',
    component: ''
  })

  // Image state
  const [images, setImages] = useState<(string | null)[]>(Array(28).fill(null))
  const [activeTab, setActiveTab] = useState<'details' | 'description' | 'images'>('details')

  useEffect(() => {
    loadProduct()
  }, [articlenr])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await adminApi.getProduct(articlenr)
      setProduct(data)

      // Populate form
      setFormData({
        articlename: data.articlename || '',
        shortdescription: data.shortdescription || '',
        longdescription: data.longdescription || '',
        priceEUR: data.priceEUR || 0,
        costprice: data.costprice || 0,
        manufacturer: data.manufacturer || '',
        productgroup: data.productgroup || '',
        type: data.type || '',
        colour: data.colour || '',
        size: data.size || '',
        component: data.component || ''
      })

      // Populate images
      const imgArray: (string | null)[] = []
      for (let i = 1; i <= 28; i++) {
        imgArray.push(data[`Image${i}URL` as keyof AdminProduct] as string || null)
      }
      setImages(imgArray)
    } catch (err) {
      console.error('Failed to load product:', err)
      setError('Produkt konnte nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Prepare image data
      const imageData: Record<string, string | null> = {}
      images.forEach((url, i) => {
        imageData[`Image${i + 1}URL`] = url
      })

      await adminApi.updateProduct(articlenr, {
        ...formData,
        ...imageData
      })

      setSuccess('Produkt erfolgreich gespeichert')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to save product:', err)
      setError('Produkt konnte nicht gespeichert werden')
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value || null
    setImages(newImages)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Lade Produkt...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Produkt nicht gefunden</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-2 text-black font-medium hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-black truncate">{product.articlename}</h1>
          <p className="text-gray-500 text-sm font-mono">{product.articlenr}</p>
        </div>
        <Link
          href={`/produkte/${product.articlenr}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black border border-gray-200 rounded-xl hover:border-black transition-colors"
        >
          <Eye className="h-4 w-4" />
          Vorschau
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <span className="sr-only">Schliessen</span>
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3" role="alert">
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm flex-1">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" role="tablist">
          {[
            { id: 'details', label: 'Details' },
            { id: 'description', label: 'Beschreibung' },
            { id: 'images', label: 'Bilder' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                pb-4 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="articlename" className="block text-sm font-semibold text-gray-700 mb-2">
                  Produktname *
                </label>
                <input
                  id="articlename"
                  type="text"
                  value={formData.articlename}
                  onChange={(e) => setFormData({ ...formData, articlename: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="manufacturer" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hersteller
                </label>
                <input
                  id="manufacturer"
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="priceEUR" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preis (EUR) *
                </label>
                <input
                  id="priceEUR"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceEUR}
                  onChange={(e) => setFormData({ ...formData, priceEUR: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="costprice" className="block text-sm font-semibold text-gray-700 mb-2">
                  Einkaufspreis (EUR)
                </label>
                <input
                  id="costprice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costprice}
                  onChange={(e) => setFormData({ ...formData, costprice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="productgroup" className="block text-sm font-semibold text-gray-700 mb-2">
                  Produktgruppe
                </label>
                <input
                  id="productgroup"
                  type="text"
                  value={formData.productgroup}
                  onChange={(e) => setFormData({ ...formData, productgroup: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Typ
                </label>
                <input
                  id="type"
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="colour" className="block text-sm font-semibold text-gray-700 mb-2">
                  Farbe
                </label>
                <input
                  id="colour"
                  type="text"
                  value={formData.colour}
                  onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                  Grösse
                </label>
                <input
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="component" className="block text-sm font-semibold text-gray-700 mb-2">
                  Komponenten
                </label>
                <input
                  id="component"
                  type="text"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div>
              <label htmlFor="shortdescription" className="block text-sm font-semibold text-gray-700 mb-2">
                Kurzbeschreibung
              </label>
              <textarea
                id="shortdescription"
                rows={4}
                value={formData.shortdescription}
                onChange={(e) => setFormData({ ...formData, shortdescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="HTML erlaubt"
              />
              <p className="mt-1 text-xs text-gray-500">HTML-Formatierung wird unterstützt</p>
            </div>

            <div>
              <label htmlFor="longdescription" className="block text-sm font-semibold text-gray-700 mb-2">
                Ausführliche Beschreibung
              </label>
              <textarea
                id="longdescription"
                rows={12}
                value={formData.longdescription}
                onChange={(e) => setFormData({ ...formData, longdescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono"
                placeholder="HTML erlaubt"
              />
              <p className="mt-1 text-xs text-gray-500">HTML-Formatierung wird unterstützt</p>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-6">
              Fügen Sie bis zu 28 Bilder hinzu. Verwenden Sie direkte URLs zu den Bildern.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors">
                    {url ? (
                      <>
                        <Image
                          src={url}
                          alt={`Bild ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() => handleRemoveImage(index)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          aria-label={`Bild ${index + 1} entfernen`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <span className="text-xs">Bild {index + 1}</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    value={url || ''}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Bild-URL eingeben"
                    className="mt-2 w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            href="/admin/products"
            className="px-6 py-3 text-gray-600 hover:text-black font-medium transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Speichern
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
