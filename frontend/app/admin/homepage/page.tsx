/**
 * Admin Homepage Content Management
 * Edit hero, categories, featured products, etc.
 * Mobile-first responsive design
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Save,
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Type,
  Link as LinkIcon,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Home,
  LayoutGrid,
  Award
} from 'lucide-react'
import { adminApi, HomepageContent } from '@/lib/api'

interface HeroContent {
  image_url: string
  title: string
  subtitle: string
  button_text: string
  button_link: string
}

interface CategoryCard {
  id: string
  title: string
  description: string
  href: string
}

interface ValueProp {
  id: string
  title: string
  description: string
  icon: string
}

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'hero' | 'categories' | 'values'>('hero')

  // Content state
  const [hero, setHero] = useState<HeroContent>({
    image_url: '',
    title: '',
    subtitle: '',
    button_text: '',
    button_link: ''
  })

  const [categories, setCategories] = useState<CategoryCard[]>([])
  const [values, setValues] = useState<ValueProp[]>([])

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await adminApi.getHomepageContent()

      if (data.hero) {
        setHero(data.hero)
      }
      if (data.categories) {
        setCategories(data.categories)
      }
      if (data.values) {
        setValues(data.values)
      }
    } catch (err) {
      console.error('Failed to load content:', err)
      // Set defaults if API fails
      setHero({
        image_url: 'https://cdn.shopify.com/s/files/1/0720/5794/6377/files/dominika.pairofwheels_453056389_850498639917776_8492373170969487287_n.jpg?v=1759994817',
        title: 'Entdecke den Geist des Bikepackings mit dem Sandman',
        subtitle: 'Ausgestattet mit GRX 400, GRX 600, GRX 820 und mehr – finde deine perfekte Konfiguration.',
        button_text: 'Jetzt kaufen',
        button_link: '/categories/gravel-bikes?id=103'
      })
      setCategories([
        { id: '1', title: 'Gravel', description: 'Abenteuer wartet', href: '/categories/gravel-bikes?id=103' },
        { id: '2', title: 'Mountain', description: 'Abseits der Pfade', href: '/categories/mountainbike?id=59' },
        { id: '3', title: 'Rennrad', description: 'Geschwindigkeit neu definiert', href: '/categories/rennraeder?id=2' }
      ])
      setValues([
        { id: '1', title: 'Premium Qualität', description: 'Handverlesene Komponenten. Rigorose Tests.', icon: 'Award' },
        { id: '2', title: 'Schneller Versand', description: 'Heute bestellen. Morgen fahren.', icon: 'Zap' },
        { id: '3', title: 'Experten Support', description: 'Echte Menschen. Echte Antworten. Schnell.', icon: 'MessageCircle' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      await adminApi.updateHomepageContent({
        hero,
        categories,
        values
      })

      setSuccess('Startseite erfolgreich aktualisiert')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to save content:', err)
      setError('Änderungen konnten nicht gespeichert werden')
    } finally {
      setSaving(false)
    }
  }

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: `new-${Date.now()}`,
        title: 'Neue Kategorie',
        description: 'Beschreibung',
        href: '/'
      }
    ])
  }

  const updateCategory = (id: string, field: keyof CategoryCard, value: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, [field]: value } : cat
    ))
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const addValueProp = () => {
    setValues([
      ...values,
      {
        id: `new-${Date.now()}`,
        title: 'Neuer Vorteil',
        description: 'Beschreibung',
        icon: 'Award'
      }
    ])
  }

  const updateValue = (id: string, field: keyof ValueProp, value: string) => {
    setValues(values.map(val =>
      val.id === id ? { ...val, [field]: value } : val
    ))
  }

  const removeValue = (id: string) => {
    setValues(values.filter(val => val.id !== id))
  }

  const sections = [
    { id: 'hero', label: 'Hero Banner', icon: Home },
    { id: 'categories', label: 'Kategorien', icon: LayoutGrid },
    { id: 'values', label: 'Vorteile', icon: Award }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Lade Inhalte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">Startseite bearbeiten</h1>
          <p className="text-gray-600 mt-1 text-sm">Hero, Kategorien und Wertversprechen</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-black border border-gray-200 rounded-xl hover:border-black transition-colors text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Vorschau</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Speichern...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Speichern</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-lg font-bold">
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

      {/* Section Tabs - Mobile Scroll */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max pb-2 sm:pb-0">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors
                  ${activeSection === section.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Hero Section Editor */}
      {activeSection === 'hero' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-6">
          <h2 className="text-lg font-black text-black">Hero Banner</h2>

          {/* Hero Preview */}
          <div className="relative aspect-video sm:aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden">
            {hero.image_url ? (
              <>
                <Image
                  src={hero.image_url}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center p-6 sm:p-12">
                  <div className="text-white max-w-xl">
                    <h3 className="text-xl sm:text-3xl font-black leading-tight">{hero.title || 'Titel hier'}</h3>
                    <p className="text-sm sm:text-base text-white/80 mt-2">{hero.subtitle || 'Untertitel hier'}</p>
                    <div className="mt-4 inline-block px-4 py-2 bg-white text-black text-sm font-bold rounded-xl">
                      {hero.button_text || 'Button'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="hero-image" className="block text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="h-4 w-4 inline mr-2" />
                Bild-URL
              </label>
              <input
                id="hero-image"
                type="url"
                value={hero.image_url}
                onChange={(e) => setHero({ ...hero, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="hero-title" className="block text-sm font-semibold text-gray-700 mb-2">
                <Type className="h-4 w-4 inline mr-2" />
                Titel
              </label>
              <textarea
                id="hero-title"
                rows={2}
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="Hauptüberschrift..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            <div>
              <label htmlFor="hero-subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Untertitel
              </label>
              <input
                id="hero-subtitle"
                type="text"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                placeholder="Kurze Beschreibung..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hero-button-text" className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  id="hero-button-text"
                  type="text"
                  value={hero.button_text}
                  onChange={(e) => setHero({ ...hero, button_text: e.target.value })}
                  placeholder="Jetzt kaufen"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="hero-button-link" className="block text-sm font-semibold text-gray-700 mb-2">
                  <LinkIcon className="h-4 w-4 inline mr-2" />
                  Button Link
                </label>
                <input
                  id="hero-button-link"
                  type="text"
                  value={hero.button_link}
                  onChange={(e) => setHero({ ...hero, button_link: e.target.value })}
                  placeholder="/produkte"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section Editor */}
      {activeSection === 'categories' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Kategorie-Karten</h2>
            <button
              onClick={addCategory}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Hinzufügen</span>
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="bg-gray-50 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-500">Karte {index + 1}</span>
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="ml-auto p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Kategorie entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Titel</label>
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Beschreibung</label>
                    <input
                      type="text"
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Link</label>
                    <input
                      type="text"
                      value={category.href}
                      onChange={(e) => updateCategory(category.id, 'href', e.target.value)}
                      placeholder="/categories/..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <LayoutGrid className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Keine Kategorien vorhanden</p>
                <button
                  onClick={addCategory}
                  className="mt-2 text-sm font-semibold text-black hover:underline"
                >
                  Erste Kategorie hinzufügen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Values Section Editor */}
      {activeSection === 'values' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Wertversprechen</h2>
            <button
              onClick={addValueProp}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Hinzufügen</span>
            </button>
          </div>

          <div className="space-y-4">
            {values.map((value, index) => (
              <div
                key={value.id}
                className="bg-gray-50 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-500">Vorteil {index + 1}</span>
                  <button
                    onClick={() => removeValue(value.id)}
                    className="ml-auto p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Vorteil entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(value.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="Award">Award</option>
                      <option value="Zap">Zap (Blitz)</option>
                      <option value="MessageCircle">MessageCircle</option>
                      <option value="Shield">Shield</option>
                      <option value="Heart">Heart</option>
                      <option value="Star">Star</option>
                      <option value="Truck">Truck</option>
                      <option value="Clock">Clock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Titel</label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Beschreibung</label>
                    <input
                      type="text"
                      value={value.description}
                      onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            ))}

            {values.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Keine Vorteile vorhanden</p>
                <button
                  onClick={addValueProp}
                  className="mt-2 text-sm font-semibold text-black hover:underline"
                >
                  Ersten Vorteil hinzufügen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
