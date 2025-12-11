'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pagesApi, Page } from '@/lib/api'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Menu as MenuIcon,
  MoreVertical,
  Globe,
  FileText,
  AlertCircle
} from 'lucide-react'

export default function AdminPagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // New page form state
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    show_in_header: false,
    menu_position: 0
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadPages()
    
    // Check if we should auto-open create modal with homepage
    const params = new URLSearchParams(window.location.search)
    if (params.get('create') === 'home') {
      setNewPage({
        title: 'Homepage',
        slug: 'home',
        show_in_header: false,
        menu_position: 0
      })
      setShowCreateModal(true)
    }
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await pagesApi.getPages({ page_size: 100 })
      setPages(response.pages)
    } catch (err: any) {
      console.error('Error loading pages:', err)
      setError(err.response?.data?.detail || 'Fehler beim Laden der Seiten')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPage.title.trim() || !newPage.slug.trim()) return

    try {
      setCreating(true)
      const response = await pagesApi.createPage({
        ...newPage,
        is_published: false
      })
      setShowCreateModal(false)
      setNewPage({ title: '', slug: '', show_in_header: false, menu_position: 0 })
      // Navigate to the new page editor
      router.push(`/admin/pages/${response.page.page_id}`)
    } catch (err: any) {
      console.error('Error creating page:', err)
      setError(err.response?.data?.detail || 'Fehler beim Erstellen der Seite')
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePage = async (pageId: number) => {
    try {
      await pagesApi.deletePage(pageId)
      setPages(pages.filter(p => p.page_id !== pageId))
      setDeleteConfirm(null)
    } catch (err: any) {
      console.error('Error deleting page:', err)
      setError(err.response?.data?.detail || 'Fehler beim Loeschen der Seite')
    }
  }

  const handleTogglePublish = async (page: Page) => {
    try {
      if (page.is_published) {
        await pagesApi.unpublishPage(page.page_id)
      } else {
        await pagesApi.publishPage(page.page_id)
      }
      setPages(pages.map(p =>
        p.page_id === page.page_id
          ? { ...p, is_published: !p.is_published }
          : p
      ))
    } catch (err: any) {
      console.error('Error toggling publish:', err)
      setError(err.response?.data?.detail || 'Fehler beim Aendern des Status')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/[ß]/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(search.toLowerCase()) ||
    page.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black">Seiten</h1>
          <p className="text-gray-600 mt-1">
            Erstellen und verwalten Sie benutzerdefinierte Seiten fuer Ihre Website
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Neue Seite
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 text-sm underline mt-1"
            >
              Schliessen
            </button>
          </div>
        </div>
      )}

      {/* Search removed per request */}

      {/* Pages List */}
      {filteredPages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? 'Keine Seiten gefunden' : 'Noch keine Seiten'}
          </h3>
          <p className="text-gray-500 mb-6">
            {search
              ? 'Versuchen Sie einen anderen Suchbegriff'
              : 'Erstellen Sie Ihre erste benutzerdefinierte Seite'}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Erste Seite erstellen
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.page_id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-subtle hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-gray-50 via-transparent to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 rounded-full">
                        <FileText className="h-3.5 w-3.5" />
                        Seite
                      </span>
                      {page.show_in_header && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-100 rounded-full">
                          <MenuIcon className="h-3.5 w-3.5" />
                          Menu {page.menu_position}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{page.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <code className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[13px]">/{page.slug}</code>
                      {page.menu_label && page.menu_label !== page.title && (
                        <span className="text-xs text-gray-500">Menu: {page.menu_label}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePublish(page)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                      page.is_published
                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {page.is_published ? (
                      <>
                        <Globe className="h-3.5 w-3.5" />
                        Live
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Entwurf
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{page.is_published ? 'Live' : 'Draft'}</p>
                      <p className="text-xs text-gray-500">{page.show_in_header ? 'Im Menu sichtbar' : 'Nicht im Menu'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.is_published && (
                      <Link
                        href={`/p/${page.slug}`}
                        target="_blank"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                        title="Seite ansehen"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/pages/${page.page_id}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Bearbeiten"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(page.page_id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Loeschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-black mb-6">Neue Seite erstellen</h2>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seitentitel *
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => {
                    setNewPage({
                      ...newPage,
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    })
                  }}
                  placeholder="z.B. Ueber uns"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL-Slug *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">/p/</span>
                  <input
                    type="text"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    placeholder="ueber-uns"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="show_in_header"
                  checked={newPage.show_in_header}
                  onChange={(e) => setNewPage({ ...newPage, show_in_header: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="show_in_header" className="text-sm text-gray-700">
                  Im Header-Menu anzeigen
                </label>
              </div>
              {newPage.show_in_header && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu-Position
                  </label>
                  <input
                    type="number"
                    value={newPage.menu_position}
                    onChange={(e) => setNewPage({ ...newPage, menu_position: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Niedrigere Zahlen erscheinen weiter links
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewPage({ title: '', slug: '', show_in_header: false, menu_position: 0 })
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={creating || !newPage.title.trim() || !newPage.slug.trim()}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Erstelle...' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-black mb-4">Seite loeschen?</h2>
            <p className="text-gray-600 mb-6">
              Diese Aktion kann nicht rueckgaengig gemacht werden. Die Seite und alle ihre Bloecke werden dauerhaft geloescht.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDeletePage(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Loeschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
