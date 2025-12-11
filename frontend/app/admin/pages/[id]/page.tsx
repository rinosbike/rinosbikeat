'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { pagesApi, Page, PageBlock, BlockTemplate, productsApi } from '@/lib/api'
import { BlockPreview } from '@/components/blocks/BlockPreview'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ChevronDown as ChevronDownIcon,
  Settings,
  AlertCircle,
  Check,
  X,
  Image,
  FileText,
  Grid,
  LayoutGrid,
  MousePointer,
  HelpCircle,
  Video,
  ShoppingBag,
  Minus,
  Code,
  Search,
  Award,
  Zap,
  MessageCircle,
  Shield,
  Heart,
  Star,
  Truck,
  Clock,
  Target,
  Users,
  Sparkles,
  Trophy,
  Leaf,
  Globe2,
  Palette,
  Move,
  PanelLeftClose,
  PanelLeft,
  Monitor,
  Smartphone,
  Tablet,
  // Scroll animation block icons
  Layers,
  Pin,
  GalleryHorizontal,
  Timer,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react'

// Block type icons mapping
const blockIcons: Record<string, any> = {
  hero: Image,
  text: FileText,
  image_gallery: Grid,
  feature_grid: LayoutGrid,
  cta: MousePointer,
  faq: HelpCircle,
  video: Video,
  product_showcase: ShoppingBag,
  spacer: Minus,
  divider: Minus,
  custom_html: Code,
  // Scroll Animation Blocks
  scroll_reveal_image: Layers,
  scroll_parallax_section: Layers,
  pinned_scroll_section: Pin,
  horizontal_gallery_scroll: GalleryHorizontal,
  scroll_timeline: Timer
}

// Block type labels
const blockLabels: Record<string, string> = {
  hero: 'Hero Banner',
  text: 'Text Block',
  image_gallery: 'Bildergalerie',
  feature_grid: 'Feature Grid',
  cta: 'Call to Action',
  faq: 'FAQ',
  video: 'Video',
  product_showcase: 'Produkt Showcase',
  spacer: 'Abstand',
  divider: 'Trennlinie',
  custom_html: 'Custom HTML',
  // Scroll Animation Blocks
  scroll_reveal_image: 'Scroll Reveal Bild',
  scroll_parallax_section: 'Parallax Sektion',
  pinned_scroll_section: 'Pinned Scroll',
  horizontal_gallery_scroll: 'Horizontal Galerie',
  scroll_timeline: 'Scroll Timeline'
}

// Available icons for feature grid
const availableIcons = [
  { name: 'Award', icon: Award, label: 'Auszeichnung' },
  { name: 'Zap', icon: Zap, label: 'Blitz' },
  { name: 'MessageCircle', icon: MessageCircle, label: 'Chat' },
  { name: 'Shield', icon: Shield, label: 'Schutz' },
  { name: 'Heart', icon: Heart, label: 'Herz' },
  { name: 'Star', icon: Star, label: 'Stern' },
  { name: 'Truck', icon: Truck, label: 'Lieferung' },
  { name: 'Clock', icon: Clock, label: 'Zeit' },
  { name: 'Target', icon: Target, label: 'Ziel' },
  { name: 'Users', icon: Users, label: 'Team' },
  { name: 'Sparkles', icon: Sparkles, label: 'Magie' },
  { name: 'Trophy', icon: Trophy, label: 'Pokal' },
  { name: 'Leaf', icon: Leaf, label: 'Natur' },
  { name: 'Globe2', icon: Globe2, label: 'Welt' },
  { name: 'Palette', icon: Palette, label: 'Design' },
]

export default function PageEditorPage() {
  const router = useRouter()
  const params = useParams()
  const pageId = parseInt(params.id as string)

  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [blockTemplates, setBlockTemplates] = useState<BlockTemplate[]>([])

  // Edit states
  const [editingBlock, setEditingBlock] = useState<number | null>(null)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Preview panel states
  const [showPreview, setShowPreview] = useState(true)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Live editing state for preview - stores unsaved block configs
  const [liveConfigs, setLiveConfigs] = useState<Record<number, Record<string, any>>>({})

  // Page settings form
  const [pageSettings, setPageSettings] = useState({
    title: '',
    slug: '',
    show_in_header: false,
    menu_position: 0,
    menu_label: '',
    meta_title: '',
    meta_description: ''
  })

  useEffect(() => {
    loadPage()
    loadBlockTemplates()
  }, [pageId])

  const loadPage = async () => {
    try {
      setLoading(true)
      const data = await pagesApi.getPage(pageId)
      setPage(data)
      setPageSettings({
        title: data.title,
        slug: data.slug,
        show_in_header: data.show_in_header,
        menu_position: data.menu_position,
        menu_label: data.menu_label || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || ''
      })
    } catch (err: any) {
      console.error('Error loading page:', err)
      setError(err.response?.data?.detail || 'Fehler beim Laden der Seite')
    } finally {
      setLoading(false)
    }
  }

  const loadBlockTemplates = async () => {
    try {
      const response = await pagesApi.getBlockTemplates()
      setBlockTemplates(response.templates)
    } catch (err) {
      console.error('Error loading block templates:', err)
    }
  }

  const handleSaveSettings = async () => {
    if (!page) return
    try {
      setSaving(true)
      await pagesApi.updatePage(page.page_id, {
        title: pageSettings.title,
        show_in_header: pageSettings.show_in_header,
        menu_position: pageSettings.menu_position,
        menu_label: pageSettings.menu_label || undefined,
        meta_title: pageSettings.meta_title || undefined,
        meta_description: pageSettings.meta_description || undefined
      })
      setPage({ ...page, ...pageSettings })
      setSuccess('Einstellungen gespeichert')
      setShowSettings(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!page) return
    try {
      setSaving(true)
      if (page.is_published) {
        await pagesApi.unpublishPage(page.page_id)
      } else {
        await pagesApi.publishPage(page.page_id)
      }
      setPage({ ...page, is_published: !page.is_published })
      setSuccess(page.is_published ? 'Seite als Entwurf gespeichert' : 'Seite veroeffentlicht')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Aendern des Status')
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = async (template: BlockTemplate) => {
    if (!page) return
    try {
      setSaving(true)
      const response = await pagesApi.addBlock(page.page_id, {
        block_type: template.block_type,
        configuration: template.default_config
      })
      setPage({
        ...page,
        blocks: [...(page.blocks || []), response.block]
      })
      setShowAddBlock(false)
      setEditingBlock(response.block.block_id)
      setSuccess('Block hinzugefuegt')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Hinzufuegen')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateBlock = async (blockId: number, configuration: Record<string, any>) => {
    if (!page) return
    try {
      setSaving(true)
      await pagesApi.updateBlock(page.page_id, blockId, { configuration })
      setPage({
        ...page,
        blocks: page.blocks?.map(b =>
          b.block_id === blockId ? { ...b, configuration } : b
        )
      })
      setSuccess('Block gespeichert')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBlock = async (blockId: number) => {
    if (!page) return
    try {
      setSaving(true)
      await pagesApi.deleteBlock(page.page_id, blockId)
      setPage({
        ...page,
        blocks: page.blocks?.filter(b => b.block_id !== blockId)
      })
      setEditingBlock(null)
      setSuccess('Block geloescht')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Loeschen')
    } finally {
      setSaving(false)
    }
  }

  const handleMoveBlock = async (blockId: number, direction: 'up' | 'down') => {
    if (!page || !page.blocks) return

    const blocks = [...page.blocks]
    const index = blocks.findIndex(b => b.block_id === blockId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    // Swap blocks
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]]

    // Update orders
    const blockOrders = blocks.map((b, i) => ({
      block_id: b.block_id,
      block_order: i
    }))

    try {
      setSaving(true)
      await pagesApi.reorderBlocks(page.page_id, blockOrders)
      setPage({
        ...page,
        blocks: blocks.map((b, i) => ({ ...b, block_order: i }))
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Verschieben')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleBlockVisibility = async (block: PageBlock) => {
    if (!page) return
    try {
      setSaving(true)
      await pagesApi.updateBlock(page.page_id, block.block_id, {
        is_visible: !block.is_visible
      })
      setPage({
        ...page,
        blocks: page.blocks?.map(b =>
          b.block_id === block.block_id ? { ...b, is_visible: !b.is_visible } : b
        )
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Aendern')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Seite nicht gefunden</h2>
        <Link href="/admin/pages" className="text-black underline">
          Zurueck zur Uebersicht
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-black">{page.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">/{page.slug}</span>
              {page.show_in_header && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  page.is_published
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Globe className="h-3 w-3" />
                  Im Menu
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Preview Toggle */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2.5 transition-colors ${showPreview ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              title={showPreview ? 'Vorschau ausblenden' : 'Vorschau einblenden'}
            >
              {showPreview ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
            {showPreview && (
              <>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2.5 transition-colors ${previewMode === 'desktop' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  title="Desktop-Ansicht"
                >
                  <Monitor className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2.5 transition-colors ${previewMode === 'mobile' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  title="Mobile-Ansicht"
                >
                  <Smartphone className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            title="Einstellungen"
          >
            <Settings className="h-5 w-5" />
          </button>
          {page.is_published && (
            <Link
              href={`/p/${page.slug}`}
              target="_blank"
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="Seite ansehen"
            >
              <Eye className="h-5 w-5" />
            </Link>
          )}
          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl transition-colors ${
              page.is_published
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page.is_published ? (
              <>
                <Globe className="h-4 w-4" />
                Veroeffentlicht
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Veroeffentlichen
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Two Column Layout - Block List + Full Width Preview/Editor */}
      <div className="flex gap-6">
        {/* Left Sidebar - Block List (Minimal Design) */}
        <div className="w-64 flex-shrink-0 space-y-1">
          {/* Section Header */}
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blocks</span>
            <span className="text-xs text-gray-400">{page.blocks?.length || 0}</span>
          </div>

          {/* Page Blocks List - Ultra Minimal */}
          {page.blocks && page.blocks.length > 0 ? (
            <div className="space-y-0.5">
              {page.blocks.map((block, index) => {
                const Icon = blockIcons[block.block_type] || FileText
                const isActive = editingBlock === block.block_id
                return (
                  <div
                    key={block.block_id}
                    className={`group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    } ${!block.is_visible ? 'opacity-50' : ''}`}
                    onClick={() => setEditingBlock(block.block_id)}
                  >
                    {/* Drag Handle - appears on hover */}
                    <GripVertical className={`h-3.5 w-3.5 flex-shrink-0 cursor-grab ${
                      isActive ? 'text-gray-400' : 'text-gray-300 opacity-0 group-hover:opacity-100'
                    } transition-opacity`} />

                    {/* Block Icon */}
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>

                    {/* Block Label */}
                    <span className={`text-sm font-medium truncate flex-1 ${
                      isActive ? 'text-white' : 'text-gray-700'
                    }`}>
                      {blockLabels[block.block_type] || block.block_type}
                    </span>

                    {/* Quick Actions - appear on hover */}
                    <div className={`flex items-center gap-0.5 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.block_id, 'up') }}
                        disabled={index === 0 || saving}
                        className={`p-1 rounded disabled:opacity-20 ${
                          isActive ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                        }`}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.block_id, 'down') }}
                        disabled={index === (page.blocks?.length || 0) - 1 || saving}
                        className={`p-1 rounded disabled:opacity-20 ${
                          isActive ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleBlockVisibility(block) }}
                        disabled={saving}
                        className={`p-1 rounded ${
                          isActive ? 'hover:bg-white/20' : 'hover:bg-gray-200'
                        }`}
                      >
                        {block.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No blocks yet</p>
            </div>
          )}

          {/* Add Block Button - Minimal */}
          <button
            onClick={() => setShowAddBlock(true)}
            className="w-full mt-3 py-2.5 px-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </button>
        </div>

        {/* Right Panel - Preview Canvas */}
        <div className="flex-1 min-w-0">
          {showPreview ? (
            <div className="bg-gray-100 rounded-xl overflow-hidden h-[calc(100vh-180px)]">
              {/* Preview Toolbar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Preview</span>
                  {liveConfigs && Object.keys(liveConfigs).length > 0 && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Live editing
                    </span>
                  )}
                </div>
                {/* Device Switcher - Pill Style */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      previewMode === 'desktop'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      previewMode === 'tablet'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    Tablet
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Mobile
                  </button>
                </div>
              </div>

              {/* Preview Canvas - Simulated Browser */}
              <div className="p-6 h-[calc(100%-52px)] overflow-auto flex justify-center">
                <div
                  className={`bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${
                    previewMode === 'mobile'
                      ? 'w-[375px]'
                      : previewMode === 'tablet'
                        ? 'w-[768px]'
                        : 'w-full max-w-[1200px]'
                  }`}
                  style={{ minHeight: '500px' }}
                >
                  {/* Browser Chrome (mini) */}
                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 truncate">
                        /{page.slug}
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                    {page.blocks && page.blocks.length > 0 ? (
                      page.blocks.map((block) => {
                        const displayConfig = liveConfigs[block.block_id] || block.configuration
                        const isSelected = editingBlock === block.block_id
                        return (
                          <div
                            key={block.block_id}
                            onClick={() => setEditingBlock(block.block_id)}
                            className={`relative cursor-pointer transition-all group ${
                              !block.is_visible ? 'opacity-40' : ''
                            }`}
                          >
                            {/* Selection indicator */}
                            <div className={`absolute inset-0 pointer-events-none transition-all ${
                              isSelected
                                ? 'ring-2 ring-blue-500 ring-inset z-10'
                                : 'ring-0 group-hover:ring-1 group-hover:ring-blue-300 group-hover:ring-inset'
                            }`}>
                              {isSelected && (
                                <div className="absolute -top-px left-4 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-b-md font-medium">
                                  {blockLabels[block.block_type] || block.block_type}
                                </div>
                              )}
                            </div>
                            <BlockPreview
                              blockType={block.block_type}
                              config={displayConfig}
                              isVisible={block.is_visible}
                            />
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-gray-400">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Empty page</p>
                          <p className="text-xs text-gray-400 mt-1">Add blocks from the sidebar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-180px)] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">Preview hidden</p>
                <p className="text-xs text-gray-400 mt-1">Click the preview button to show</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Editor Modal - Improved with better layout */}
      {editingBlock && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (editingBlock) {
                setLiveConfigs(prev => {
                  const { [editingBlock]: _, ...rest } = prev
                  return rest
                })
              }
              setEditingBlock(null)
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8 overflow-hidden">
            {(() => {
              const block = page.blocks?.find(b => b.block_id === editingBlock)
              if (!block) return null
              const Icon = blockIcons[block.block_type] || FileText
              const config = liveConfigs[block.block_id] || block.configuration
              const hasChanges = !!liveConfigs[block.block_id]

              return (
                <>
                  {/* Compact Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {blockLabels[block.block_type] || block.block_type}
                        </h3>
                        {hasChanges && (
                          <span className="text-xs text-amber-600">Unsaved changes</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteBlock(block.block_id)}
                        disabled={saving}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {/* Close button */}
                      <button
                        onClick={() => {
                          if (editingBlock) {
                            setLiveConfigs(prev => {
                              const { [editingBlock]: _, ...rest } = prev
                              return rest
                            })
                          }
                          setEditingBlock(null)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="p-5 max-h-[65vh] overflow-y-auto">
                    <BlockEditor
                      blockType={block.block_type}
                      config={config}
                      onChange={(newConfig) => {
                        setLiveConfigs(prev => ({
                          ...prev,
                          [block.block_id]: newConfig
                        }))
                      }}
                    />
                  </div>

                  {/* Sticky Footer */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/80">
                    <button
                      onClick={() => handleToggleBlockVisibility(block)}
                      disabled={saving}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        block.is_visible
                          ? 'text-gray-600 hover:bg-gray-200'
                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      {block.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {block.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (editingBlock) {
                            setLiveConfigs(prev => {
                              const { [editingBlock]: _, ...rest } = prev
                              return rest
                            })
                          }
                          setEditingBlock(null)
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (editingBlock) {
                            const cfg = liveConfigs[editingBlock]
                            if (cfg) {
                              handleUpdateBlock(editingBlock, cfg)
                              setLiveConfigs(prev => {
                                const { [editingBlock]: _, ...rest } = prev
                                return rest
                              })
                            }
                          }
                        }}
                        disabled={saving || !hasChanges}
                        className="px-5 py-2 text-sm bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Add Block Modal - Visual Grid */}
      {showAddBlock && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAddBlock(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add Block</h2>
                <p className="text-sm text-gray-500">Choose a block type to add to your page</p>
              </div>
              <button
                onClick={() => setShowAddBlock(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Block Grid - Categorized */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Content Blocks */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Content</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {blockTemplates
                    .filter(t => ['hero', 'text', 'video', 'image_gallery'].includes(t.block_type))
                    .map((template) => {
                      const Icon = blockIcons[template.block_type] || FileText
                      return (
                        <button
                          key={template.block_type}
                          onClick={() => handleAddBlock(template)}
                          disabled={saving}
                          className="group p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all hover:shadow-md text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-gray-900 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                            <Icon className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900">{template.label}</h4>
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Components */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Components</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {blockTemplates
                    .filter(t => ['feature_grid', 'cta', 'faq', 'product_showcase'].includes(t.block_type))
                    .map((template) => {
                      const Icon = blockIcons[template.block_type] || FileText
                      return (
                        <button
                          key={template.block_type}
                          onClick={() => handleAddBlock(template)}
                          disabled={saving}
                          className="group p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all hover:shadow-md text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-gray-900 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                            <Icon className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900">{template.label}</h4>
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Layout & Utility */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Layout</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {blockTemplates
                    .filter(t => ['spacer', 'divider', 'custom_html'].includes(t.block_type))
                    .map((template) => {
                      const Icon = blockIcons[template.block_type] || FileText
                      return (
                        <button
                          key={template.block_type}
                          onClick={() => handleAddBlock(template)}
                          disabled={saving}
                          className="group p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all hover:shadow-md text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-gray-900 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                            <Icon className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900">{template.label}</h4>
                        </button>
                      )
                    })}
                  {/* Show any remaining blocks not in categories */}
                  {blockTemplates
                    .filter(t => !['hero', 'text', 'video', 'image_gallery', 'feature_grid', 'cta', 'faq', 'product_showcase', 'spacer', 'divider', 'custom_html'].includes(t.block_type))
                    .map((template) => {
                      const Icon = blockIcons[template.block_type] || FileText
                      return (
                        <button
                          key={template.block_type}
                          onClick={() => handleAddBlock(template)}
                          disabled={saving}
                          className="group p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all hover:shadow-md text-center"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-gray-900 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                            <Icon className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900">{template.label}</h4>
                        </button>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Seiteneinstellungen</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seitentitel *
                </label>
                <input
                  type="text"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL-Slug
                </label>
                <div className="flex items-center px-4 py-3 bg-gray-100 rounded-xl">
                  <span className="text-gray-500">/p/{page.slug}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Der URL-Slug kann nach der Erstellung nicht geaendert werden
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="settings_show_in_header"
                  checked={pageSettings.show_in_header}
                  onChange={(e) => setPageSettings({ ...pageSettings, show_in_header: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="settings_show_in_header" className="text-sm text-gray-700">
                  Im Header-Menu anzeigen
                </label>
              </div>

              {pageSettings.show_in_header && !page.is_published && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Die Seite muss <strong>veroeffentlicht</strong> sein, damit sie im Menu erscheint. Schliessen Sie diesen Dialog und klicken Sie auf &quot;Veroeffentlichen&quot;.
                  </p>
                </div>
              )}

              {pageSettings.show_in_header && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu-Label (optional)
                    </label>
                    <input
                      type="text"
                      value={pageSettings.menu_label}
                      onChange={(e) => setPageSettings({ ...pageSettings, menu_label: e.target.value })}
                      placeholder={pageSettings.title}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu-Position
                    </label>
                    <input
                      type="number"
                      value={pageSettings.menu_position}
                      onChange={(e) => setPageSettings({ ...pageSettings, menu_position: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <hr className="my-4" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Titel (optional)
                </label>
                <input
                  type="text"
                  value={pageSettings.meta_title}
                  onChange={(e) => setPageSettings({ ...pageSettings, meta_title: e.target.value })}
                  placeholder={pageSettings.title}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Beschreibung (optional)
                </label>
                <textarea
                  value={pageSettings.meta_description}
                  onChange={(e) => setPageSettings({ ...pageSettings, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving || !pageSettings.title.trim()}
                className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Speichere...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Block Item Component
interface BlockItemProps {
  block: PageBlock
  index: number
  totalBlocks: number
  isEditing: boolean
  onEdit: () => void
  onSave: (config: Record<string, any>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onToggleVisibility: () => void
  onConfigChange?: (config: Record<string, any>) => void
  saving: boolean
}

function BlockItem({
  block,
  index,
  totalBlocks,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onConfigChange,
  saving
}: BlockItemProps) {
  const [config, setConfig] = useState(block.configuration)
  const Icon = blockIcons[block.block_type] || FileText

  useEffect(() => {
    setConfig(block.configuration)
  }, [block.configuration])

  // Notify parent of config changes for live preview
  const handleConfigChange = (newConfig: Record<string, any>) => {
    setConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  const handleSave = () => {
    onSave(config)
  }

  return (
    <div className={`bg-white rounded-2xl border ${isEditing ? 'border-black' : 'border-gray-200'} overflow-hidden transition-all`}>
      {/* Block Header */}
      <div
        className={`flex items-center gap-3 p-4 cursor-pointer ${isEditing ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
        onClick={onEdit}
      >
        <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <Icon className={`h-5 w-5 ${block.is_visible ? 'text-gray-600' : 'text-gray-300'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${block.is_visible ? 'text-gray-900' : 'text-gray-400'}`}>
              {blockLabels[block.block_type] || block.block_type}
            </span>
            {!block.is_visible && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                Versteckt
              </span>
            )}
          </div>
          {block.block_type === 'hero' && config.title && (
            <p className="text-sm text-gray-500 truncate">{config.title}</p>
          )}
          {block.block_type === 'text' && config.content && (
            <p className="text-sm text-gray-500 truncate">
              {config.content.replace(/<[^>]*>/g, '').slice(0, 50)}...
            </p>
          )}
          {block.block_type === 'product_showcase' && config.products?.length > 0 && (
            <p className="text-sm text-gray-500 truncate">
              {config.products.length} Produkt(e) ausgewaehlt
            </p>
          )}
          {block.block_type === 'image_gallery' && config.images?.length > 0 && (
            <p className="text-sm text-gray-500 truncate">
              {config.images.length} Bild(er)
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp() }}
            disabled={index === 0 || saving}
            className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown() }}
            disabled={index === totalBlocks - 1 || saving}
            className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility() }}
            disabled={saving}
            className="p-1.5 hover:bg-gray-200 rounded-lg"
            title={block.is_visible ? 'Verstecken' : 'Anzeigen'}
          >
            {block.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            disabled={saving}
            className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Block Editor */}
      {isEditing && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          <BlockEditor
            blockType={block.block_type}
            config={config}
            onChange={handleConfigChange}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Speichere...' : 'Speichern'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT - Clean, minimal accordion for editor
// ============================================================================

interface CollapsibleSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
  variant?: 'default' | 'subtle'
}

function CollapsibleSection({ title, icon, children, defaultOpen = true, badge, variant = 'default' }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (variant === 'subtle') {
    // Subtle variant - no border, just a divider style
    return (
      <div className="py-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
            {badge && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                {badge}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
          />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 pb-1">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // Default variant - card style with border
  return (
    <div className={`rounded-xl overflow-hidden transition-all ${isOpen ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-transparent hover:border-gray-200'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isOpen ? 'border-b border-gray-100' : ''
        }`}
      >
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className={`${isOpen ? 'text-gray-700' : 'text-gray-400'} transition-colors`}>
              {icon}
            </span>
          )}
          <span className={`font-medium text-sm ${isOpen ? 'text-gray-900' : 'text-gray-600'}`}>{title}</span>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isOpen ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// REUSABLE UI COMPONENTS FOR BLOCK EDITORS
// ============================================================================

// Field wrapper with label
function FormField({ label, hint, children, required }: {
  label: string
  hint?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// Enhanced color picker with presets
function ColorPicker({
  value,
  onChange,
  label,
  presets = ['#ffffff', '#000000', '#1d1d1f', '#f5f5f7', '#0071e3', '#34c759', '#ff3b30', '#ff9500']
}: {
  value: string
  onChange: (value: string) => void
  label?: string
  presets?: string[]
}) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div className="flex gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`w-6 h-6 rounded-md border-2 transition-all ${
              value === preset ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: preset }}
            title={preset}
          />
        ))}
      </div>
    </div>
  )
}

// Segmented control for selecting from options
function SegmentedControl({
  value,
  onChange,
  options,
  size = 'default'
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; icon?: React.ReactNode }[]
  size?: 'small' | 'default'
}) {
  return (
    <div className={`inline-flex p-1 bg-gray-100 rounded-lg ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

// Enhanced range slider with value display
function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  showValue = true
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  showValue?: boolean
}) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

// Image input with preview and drag-drop hint
function ImageInput({
  value,
  onChange,
  label,
  aspectRatio = 'auto'
}: {
  value: string
  onChange: (value: string) => void
  label?: string
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '3:4'
}) {
  const aspectClasses = {
    'auto': '',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]'
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex gap-3">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} max-h-40 bg-gray-100 rounded-lg overflow-hidden group`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className={`${aspectClasses[aspectRatio] || 'h-24'} border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center`}>
          <div className="text-center text-gray-400">
            <Image className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs">Paste image URL above</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Button style selector with preview
function ButtonStyleSelector({
  value,
  onChange,
  buttonText = 'Button'
}: {
  value: string
  onChange: (value: string) => void
  buttonText?: string
}) {
  const styles = [
    { value: 'primary', label: 'Primary', className: 'bg-white text-black' },
    { value: 'secondary', label: 'Secondary', className: 'bg-black text-white' },
    { value: 'outline', label: 'Outline', className: 'bg-transparent border-2 border-white text-white' },
    { value: 'ghost', label: 'Ghost', className: 'bg-white/20 text-white' },
  ]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Button Style</label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              value === style.value ? 'border-black' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="bg-gray-800 rounded-md p-3 flex items-center justify-center">
              <span className={`px-3 py-1 rounded text-xs font-medium ${style.className}`}>
                {buttonText}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">{style.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// Animation selector
function AnimationSelector({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  const animations = [
    { value: 'none', label: 'None', icon: '—' },
    { value: 'fade', label: 'Fade In', icon: '◐' },
    { value: 'slide-up', label: 'Slide Up', icon: '↑' },
    { value: 'slide-down', label: 'Slide Down', icon: '↓' },
    { value: 'slide-left', label: 'Slide Left', icon: '←' },
    { value: 'slide-right', label: 'Slide Right', icon: '→' },
    { value: 'zoom', label: 'Zoom In', icon: '⊕' },
    { value: 'blur', label: 'Blur In', icon: '◉' },
  ]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Entrance Animation</label>
      <div className="grid grid-cols-4 gap-1.5">
        {animations.map((anim) => (
          <button
            key={anim.value}
            type="button"
            onClick={() => onChange(anim.value)}
            className={`p-2 rounded-lg border text-center transition-all ${
              value === anim.value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="text-lg block">{anim.icon}</span>
            <span className="text-xs">{anim.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// BLOCK EDITOR COMPONENT - Enhanced with full options
// ============================================================================

interface BlockEditorProps {
  blockType: string
  config: Record<string, any>
  onChange: (config: Record<string, any>) => void
}

function BlockEditor({ blockType, config, onChange }: BlockEditorProps) {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value })
  }

  // Common advanced options component
  const AdvancedOptions = () => (
    <div className="space-y-4">
      {/* Spacing */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spacing</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Padding Top</label>
            <select
              value={config.padding_top || 'default'}
              onChange={(e) => updateConfig('padding_top', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="default">Default</option>
              <option value="none">None (0)</option>
              <option value="xs">XS (8px)</option>
              <option value="sm">SM (16px)</option>
              <option value="md">MD (32px)</option>
              <option value="lg">LG (48px)</option>
              <option value="xl">XL (64px)</option>
              <option value="2xl">2XL (96px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Padding Bottom</label>
            <select
              value={config.padding_bottom || 'default'}
              onChange={(e) => updateConfig('padding_bottom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="default">Default</option>
              <option value="none">None (0)</option>
              <option value="xs">XS (8px)</option>
              <option value="sm">SM (16px)</option>
              <option value="md">MD (32px)</option>
              <option value="lg">LG (48px)</option>
              <option value="xl">XL (64px)</option>
              <option value="2xl">2XL (96px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Container</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Width</label>
            <select
              value={config.max_width || 'default'}
              onChange={(e) => updateConfig('max_width', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="default">Default</option>
              <option value="sm">Small (640px)</option>
              <option value="md">Medium (768px)</option>
              <option value="lg">Large (1024px)</option>
              <option value="xl">XL (1280px)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Background</label>
            <div className="flex gap-1.5">
              <input
                type="color"
                value={config.background_color || '#ffffff'}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={config.background_color || ''}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                placeholder="transparent"
                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Animation</h4>
        <AnimationSelector
          value={config.animation || 'none'}
          onChange={(v) => updateConfig('animation', v)}
        />
        {config.animation && config.animation !== 'none' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Duration</label>
              <select
                value={config.animation_duration || '0.6'}
                onChange={(e) => updateConfig('animation_duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="0.3">Fast (0.3s)</option>
                <option value="0.6">Normal (0.6s)</option>
                <option value="1">Slow (1s)</option>
                <option value="1.5">Very Slow (1.5s)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Delay</label>
              <select
                value={config.animation_delay || '0'}
                onChange={(e) => updateConfig('animation_delay', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="0">None</option>
                <option value="0.1">0.1s</option>
                <option value="0.2">0.2s</option>
                <option value="0.3">0.3s</option>
                <option value="0.5">0.5s</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* CSS ID/Class */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Attributes</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">CSS ID</label>
            <input
              type="text"
              value={config.css_id || ''}
              onChange={(e) => updateConfig('css_id', e.target.value)}
              placeholder="my-section"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">CSS Classes</label>
            <input
              type="text"
              value={config.css_classes || ''}
              onChange={(e) => updateConfig('css_classes', e.target.value)}
              placeholder="custom-class"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  switch (blockType) {
    case 'hero':
      return (
        <div className="space-y-5">
          {/* Quick Layout Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Layout</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'center', label: 'Centered', icon: '▣' },
                { value: 'left', label: 'Left', icon: '◧' },
                { value: 'right', label: 'Right', icon: '◨' },
                { value: 'split', label: 'Split', icon: '◫' },
              ].map((layout) => (
                <button
                  key={layout.value}
                  type="button"
                  onClick={() => updateConfig('layout', layout.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    (config.layout || 'center') === layout.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{layout.icon}</span>
                  <span className="text-xs">{layout.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Image */}
          <ImageInput
            label="Background Image"
            value={config.image_url || ''}
            onChange={(v) => updateConfig('image_url', v)}
            aspectRatio="16:9"
          />

          {/* Content */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</label>

            {/* Badge/Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge (optional)</label>
              <input
                type="text"
                value={config.badge || ''}
                onChange={(e) => updateConfig('badge', e.target.value)}
                placeholder="NEW • SALE • etc."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Your headline here..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-semibold"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                rows={2}
                placeholder="Supporting text that describes your hero..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Buttons</label>

            {/* Primary Button */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Primary Button</span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={config.show_button !== false}
                    onChange={(e) => updateConfig('show_button', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Show
                </label>
              </div>
              {config.show_button !== false && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.button_text || ''}
                    onChange={(e) => updateConfig('button_text', e.target.value)}
                    placeholder="Button text"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={config.button_link || ''}
                    onChange={(e) => updateConfig('button_link', e.target.value)}
                    placeholder="/link"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Secondary Button */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Secondary Button</span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={config.show_secondary_button || false}
                    onChange={(e) => updateConfig('show_secondary_button', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Show
                </label>
              </div>
              {config.show_secondary_button && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.secondary_button_text || ''}
                    onChange={(e) => updateConfig('secondary_button_text', e.target.value)}
                    placeholder="Button text"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={config.secondary_button_link || ''}
                    onChange={(e) => updateConfig('secondary_button_link', e.target.value)}
                    placeholder="/link"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Size & Height */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { value: 'small', label: 'S', hint: '300px' },
                { value: 'medium', label: 'M', hint: '400px' },
                { value: 'large', label: 'L', hint: '500px' },
                { value: 'xl', label: 'XL', hint: '600px' },
                { value: 'full', label: '100%', hint: 'Full' },
              ].map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => updateConfig('height', size.value)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all ${
                    (config.height || 'large') === size.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium block">{size.label}</span>
                  <span className="text-xs opacity-60">{size.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Options */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Style</label>

            {/* Text Color */}
            <ColorPicker
              label="Text Color"
              value={config.text_color || '#ffffff'}
              onChange={(v) => updateConfig('text_color', v)}
              presets={['#ffffff', '#000000', '#f5f5f7', '#1d1d1f']}
            />

            {/* Button Styles */}
            <ButtonStyleSelector
              value={config.button_style || 'primary'}
              onChange={(v) => updateConfig('button_style', v)}
              buttonText={config.button_text || 'Button'}
            />
          </div>

          {/* Overlay */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Overlay</label>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Color"
                value={config.overlay_color || '#000000'}
                onChange={(v) => updateConfig('overlay_color', v)}
                presets={['#000000', '#1d1d1f', '#0a0a0a', '#111827']}
              />
              <RangeSlider
                label="Opacity"
                value={config.overlay_opacity || 40}
                onChange={(v) => updateConfig('overlay_opacity', v)}
                min={0}
                max={100}
                unit="%"
              />
            </div>
          </div>

          {/* Text Effects */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Text Effects</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title Size</label>
                <select
                  value={config.title_size || 'default'}
                  onChange={(e) => updateConfig('title_size', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="small">Small (2xl)</option>
                  <option value="default">Default (4xl)</option>
                  <option value="large">Large (5xl)</option>
                  <option value="xl">Extra Large (6xl)</option>
                  <option value="huge">Huge (7xl)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Text Shadow</label>
                <select
                  value={config.text_shadow || 'none'}
                  onChange={(e) => updateConfig('text_shadow', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="none">None</option>
                  <option value="soft">Soft</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <CollapsibleSection title="Advanced Options" icon={<Settings className="h-4 w-4" />} defaultOpen={false}>
            <AdvancedOptions />
          </CollapsibleSection>
        </div>
      )

    case 'text':
      return (
        <div className="space-y-5">
          {/* Quick Templates */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Templates</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'paragraph', label: 'Paragraph', icon: '¶' },
                { value: 'heading', label: 'Heading', icon: 'H' },
                { value: 'list', label: 'List', icon: '•' },
                { value: 'quote', label: 'Quote', icon: '"' },
              ].map((template) => (
                <button
                  key={template.value}
                  type="button"
                  onClick={() => {
                    const templates: Record<string, string> = {
                      paragraph: '<p>Your text content goes here. Add multiple paragraphs as needed.</p>',
                      heading: '<h2>Section Heading</h2>\n<p>Supporting paragraph text below the heading.</p>',
                      list: '<h3>Key Points</h3>\n<ul>\n  <li>First point</li>\n  <li>Second point</li>\n  <li>Third point</li>\n</ul>',
                      quote: '<blockquote>\n  <p>"Your inspiring quote goes here."</p>\n  <cite>— Author Name</cite>\n</blockquote>',
                    }
                    if (!config.content) {
                      updateConfig('content', templates[template.value])
                    }
                  }}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 text-center transition-all hover:bg-gray-50"
                >
                  <span className="text-xl block mb-1 text-gray-600">{template.icon}</span>
                  <span className="text-xs text-gray-600">{template.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</label>

            {/* Mini Toolbar */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { tag: 'h2', label: 'H2' },
                { tag: 'h3', label: 'H3' },
                { tag: 'p', label: 'P' },
                { tag: 'strong', label: 'B', style: 'font-bold' },
                { tag: 'em', label: 'I', style: 'italic' },
                { tag: 'a', label: 'Link' },
                { tag: 'ul', label: '• List' },
              ].map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => {
                    const wrap = item.tag === 'a'
                      ? `<a href="#">selected</a>`
                      : item.tag === 'ul'
                        ? `<ul>\n  <li>Item</li>\n</ul>`
                        : `<${item.tag}>text</${item.tag}>`
                    updateConfig('content', (config.content || '') + '\n' + wrap)
                  }}
                  className={`px-2 py-1 text-xs rounded hover:bg-white transition-colors ${item.style || ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={config.content || ''}
              onChange={(e) => updateConfig('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm leading-relaxed"
              placeholder="<h2>Your Heading</h2>
<p>Your content goes here...</p>"
            />
            <p className="text-xs text-gray-400">
              Supports HTML: h2, h3, p, strong, em, a, ul, li, blockquote
            </p>
          </div>

          {/* Layout */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Text Align</label>
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  {[
                    { value: 'left', label: '←' },
                    { value: 'center', label: '↔' },
                    { value: 'right', label: '→' },
                  ].map((align) => (
                    <button
                      key={align.value}
                      type="button"
                      onClick={() => updateConfig('alignment', align.value)}
                      className={`flex-1 py-1.5 text-sm rounded transition-all ${
                        (config.alignment || 'left') === align.value
                          ? 'bg-white shadow-sm font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Width</label>
                <select
                  value={config.max_width || '800px'}
                  onChange={(e) => updateConfig('max_width', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="480px">Narrow (480px)</option>
                  <option value="640px">Small (640px)</option>
                  <option value="800px">Medium (800px)</option>
                  <option value="1000px">Large (1000px)</option>
                  <option value="100%">Full Width</option>
                </select>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Typography</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Font Size</label>
                <select
                  value={config.text_size || 'normal'}
                  onChange={(e) => updateConfig('text_size', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Line Height</label>
                <select
                  value={config.line_height || 'normal'}
                  onChange={(e) => updateConfig('line_height', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="tight">Tight</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="loose">Loose</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Font Weight</label>
                <select
                  value={config.font_weight || 'normal'}
                  onChange={(e) => updateConfig('font_weight', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="light">Light</option>
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Text Color"
                value={config.text_color || '#1d1d1f'}
                onChange={(v) => updateConfig('text_color', v)}
                presets={['#1d1d1f', '#374151', '#6b7280', '#000000']}
              />
              <ColorPicker
                label="Link Color"
                value={config.link_color || '#0071e3'}
                onChange={(v) => updateConfig('link_color', v)}
                presets={['#0071e3', '#2563eb', '#7c3aed', '#059669']}
              />
            </div>
          </div>

          {/* Advanced */}
          <CollapsibleSection title="Advanced Options" icon={<Settings className="h-4 w-4" />} defaultOpen={false}>
            <AdvancedOptions />
          </CollapsibleSection>
        </div>
      )

    case 'feature_grid':
      return (
        <div className="space-y-5">
          {/* Header Content */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Header</label>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Why Choose Us"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={config.subtitle || ''}
                  onChange={(e) => updateConfig('subtitle', e.target.value)}
                  placeholder="Everything you need to succeed"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Columns</label>
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  {[2, 3, 4].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => updateConfig('columns', col)}
                      className={`flex-1 py-1.5 text-sm rounded transition-all ${
                        (config.columns || 3) === col
                          ? 'bg-white shadow-sm font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon Style</label>
                <select
                  value={config.icon_style || 'box'}
                  onChange={(e) => updateConfig('icon_style', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="box">Box</option>
                  <option value="circle">Circle</option>
                  <option value="plain">Plain</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alignment</label>
                <select
                  value={config.alignment || 'center'}
                  onChange={(e) => updateConfig('alignment', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Style</label>
                <select
                  value={config.card_style || 'flat'}
                  onChange={(e) => updateConfig('card_style', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="flat">Flat</option>
                  <option value="bordered">Bordered</option>
                  <option value="elevated">Elevated</option>
                  <option value="glass">Glass</option>
                </select>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Features ({(config.features || []).length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const features = [...(config.features || []), { icon: 'Star', title: '', description: '' }]
                  updateConfig('features', features)
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {(config.features || []).map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Feature Header - Collapsed View */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    {/* Move buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (index === 0) return
                          const features = [...(config.features || [])]
                          ;[features[index], features[index - 1]] = [features[index - 1], features[index]]
                          updateConfig('features', features)
                        }}
                        disabled={index === 0}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (index === (config.features || []).length - 1) return
                          const features = [...(config.features || [])]
                          ;[features[index], features[index + 1]] = [features[index + 1], features[index]]
                          updateConfig('features', features)
                        }}
                        disabled={index === (config.features || []).length - 1}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Icon preview */}
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      {(() => {
                        const IconComp = availableIcons.find(i => i.name === feature.icon)?.icon || Star
                        return <IconComp className="h-4 w-4 text-gray-600" />
                      })()}
                    </div>

                    {/* Title preview */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {feature.title || `Feature ${index + 1}`}
                      </p>
                      {feature.description && (
                        <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        const features = config.features.filter((_: any, i: number) => i !== index)
                        updateConfig('features', features)
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Feature Edit Fields */}
                  <div className="p-3 space-y-3 border-t border-gray-100">
                    {/* Icon Picker - Compact */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Icon</label>
                      <div className="flex flex-wrap gap-1">
                        {availableIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon
                          return (
                            <button
                              key={iconOption.name}
                              type="button"
                              onClick={() => {
                                const features = [...(config.features || [])]
                                features[index] = { ...features[index], icon: iconOption.name }
                                updateConfig('features', features)
                              }}
                              className={`p-1.5 rounded-md border transition-all ${
                                feature.icon === iconOption.name
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              title={iconOption.label}
                            >
                              <IconComponent className="h-4 w-4" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        value={feature.title || ''}
                        onChange={(e) => {
                          const features = [...(config.features || [])]
                          features[index] = { ...features[index], title: e.target.value }
                          updateConfig('features', features)
                        }}
                        placeholder="Feature title"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      />
                      <textarea
                        value={feature.description || ''}
                        onChange={(e) => {
                          const features = [...(config.features || [])]
                          features[index] = { ...features[index], description: e.target.value }
                          updateConfig('features', features)
                        }}
                        rows={2}
                        placeholder="Short description"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Feature Button */}
              {(config.features || []).length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    updateConfig('features', [{ icon: 'Star', title: '', description: '' }])
                  }}
                  className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">Add your first feature</span>
                </button>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Icon Color"
                value={config.icon_color || '#000000'}
                onChange={(v) => updateConfig('icon_color', v)}
                presets={['#000000', '#0071e3', '#34c759', '#ff9500', '#ff3b30', '#af52de']}
              />
              <ColorPicker
                label="Icon Background"
                value={config.icon_bg_color || '#f5f5f7'}
                onChange={(v) => updateConfig('icon_bg_color', v)}
                presets={['#f5f5f7', '#e8f4fd', '#e8f9ed', '#fff4e6', '#fee', '#f3e8ff']}
              />
            </div>
          </div>

          {/* Advanced */}
          <CollapsibleSection title="Advanced Options" icon={<Settings className="h-4 w-4" />} defaultOpen={false}>
            <AdvancedOptions />
          </CollapsibleSection>
        </div>
      )

    case 'cta':
      return (
        <div className="space-y-5">
          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Dark', bg: '#000000', text: '#ffffff', btn: '#ffffff', btnText: '#000000' },
                { name: 'Blue', bg: '#0071e3', text: '#ffffff', btn: '#ffffff', btnText: '#0071e3' },
                { name: 'Green', bg: '#34c759', text: '#ffffff', btn: '#ffffff', btnText: '#166534' },
                { name: 'Purple', bg: '#7c3aed', text: '#ffffff', btn: '#ffffff', btnText: '#7c3aed' },
                { name: 'Light', bg: '#f5f5f7', text: '#1d1d1f', btn: '#000000', btnText: '#ffffff' },
                { name: 'Gradient', bg: 'gradient', text: '#ffffff', btn: '#ffffff', btnText: '#000000' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    updateConfig('background_color', preset.bg)
                    updateConfig('text_color', preset.text)
                    updateConfig('button_color', preset.btn)
                    updateConfig('button_text_color', preset.btnText)
                  }}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                  style={{
                    background: preset.bg === 'gradient'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : preset.bg
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: preset.text }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Ready to get started?"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => updateConfig('description', e.target.value)}
                rows={2}
                placeholder="Join thousands of satisfied customers..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Button */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Button</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Text</label>
                <input
                  type="text"
                  value={config.button_text || ''}
                  onChange={(e) => updateConfig('button_text', e.target.value)}
                  placeholder="Get Started"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link</label>
                <input
                  type="text"
                  value={config.button_link || ''}
                  onChange={(e) => updateConfig('button_link', e.target.value)}
                  placeholder="/contact"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Style</label>
                <select
                  value={config.button_style || 'solid'}
                  onChange={(e) => updateConfig('button_style', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Size</label>
                <select
                  value={config.button_size || 'default'}
                  onChange={(e) => updateConfig('button_size', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="small">Small</option>
                  <option value="default">Default</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Background"
                value={config.background_color || '#000000'}
                onChange={(v) => updateConfig('background_color', v)}
                presets={['#000000', '#1d1d1f', '#0071e3', '#34c759', '#7c3aed', '#f5f5f7']}
              />
              <ColorPicker
                label="Text"
                value={config.text_color || '#ffffff'}
                onChange={(v) => updateConfig('text_color', v)}
                presets={['#ffffff', '#1d1d1f', '#f5f5f7']}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Button Background"
                value={config.button_color || '#ffffff'}
                onChange={(v) => updateConfig('button_color', v)}
                presets={['#ffffff', '#000000', '#0071e3']}
              />
              <ColorPicker
                label="Button Text"
                value={config.button_text_color || '#000000'}
                onChange={(v) => updateConfig('button_text_color', v)}
                presets={['#000000', '#ffffff', '#0071e3']}
              />
            </div>
          </div>

          {/* Layout */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alignment</label>
                <select
                  value={config.alignment || 'center'}
                  onChange={(e) => updateConfig('alignment', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                <select
                  value={config.size || 'default'}
                  onChange={(e) => updateConfig('size', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="compact">Compact</option>
                  <option value="default">Default</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.rounded || false}
                  onChange={(e) => updateConfig('rounded', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Rounded corners</span>
              </label>
            </div>
          </div>

          {/* Advanced */}
          <CollapsibleSection title="Advanced Options" icon={<Settings className="h-4 w-4" />} defaultOpen={false}>
            <AdvancedOptions />
          </CollapsibleSection>
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift (optional)</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => updateConfig('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
            <select
              value={config.style || 'accordion'}
              onChange={(e) => updateConfig('style', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="accordion">Akkordeon (klickbar)</option>
              <option value="list">Liste (alle offen)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fragen & Antworten</label>
            <div className="space-y-3">
              {(config.items || []).map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">FAQ {index + 1}</span>
                    <button
                      onClick={() => {
                        const items = config.items.filter((_: any, i: number) => i !== index)
                        updateConfig('items', items)
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question || ''}
                    onChange={(e) => {
                      const items = [...(config.items || [])]
                      items[index] = { ...items[index], question: e.target.value }
                      updateConfig('items', items)
                    }}
                    placeholder="Frage"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                  />
                  <textarea
                    value={item.answer || ''}
                    onChange={(e) => {
                      const items = [...(config.items || [])]
                      items[index] = { ...items[index], answer: e.target.value }
                      updateConfig('items', items)
                    }}
                    placeholder="Antwort"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const items = [...(config.items || []), { question: '', answer: '' }]
                  updateConfig('items', items)
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-black hover:text-black transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Frage hinzufuegen
              </button>
            </div>
          </div>
          <AdvancedOptions />
        </div>
      )

    case 'video':
      return (
        <div className="space-y-4">
          {/* Layout Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateConfig('layout', 'horizontal')}
                className={`p-3 border rounded-lg text-center ${
                  (config.layout || 'horizontal') === 'horizontal'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">▭</div>
                <span className="text-xs">Horizontal</span>
              </button>
              <button
                onClick={() => updateConfig('layout', 'vertical_left')}
                className={`p-3 border rounded-lg text-center ${
                  config.layout === 'vertical_left'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">◧</div>
                <span className="text-xs">Video Links</span>
              </button>
              <button
                onClick={() => updateConfig('layout', 'vertical_right')}
                className={`p-3 border rounded-lg text-center ${
                  config.layout === 'vertical_right'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">◨</div>
                <span className="text-xs">Video Rechts</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <input
              type="text"
              value={config.video_url || ''}
              onChange={(e) => updateConfig('video_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... oder https://vimeo.com/..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Unterstuetzt: YouTube, Vimeo, TikTok, Instagram Reels</p>
          </div>

          {/* Text Content - shown for vertical layouts */}
          {(config.layout === 'vertical_left' || config.layout === 'vertical_right') && (
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Text-Bereich</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift</label>
                <input
                  type="text"
                  value={config.title || ''}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="z.B. Erleben Sie unser Fahrrad in Aktion"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Untertitel</label>
                <input
                  type="text"
                  value={config.subtitle || ''}
                  onChange={(e) => updateConfig('subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="z.B. Sehen Sie selbst, warum unsere Kunden begeistert sind"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  value={config.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Detaillierte Beschreibung oder Features..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={config.button_text || ''}
                    onChange={(e) => updateConfig('button_text', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="z.B. Jetzt entdecken"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={config.button_link || ''}
                    onChange={(e) => updateConfig('button_link', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="/produkte/..."
                  />
                </div>
              </div>
              {/* Features List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (optional)</label>
                <div className="space-y-2">
                  {(config.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const features = [...(config.features || [])]
                          features[index] = e.target.value
                          updateConfig('features', features)
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="z.B. Carbon Rahmen"
                      />
                      <button
                        onClick={() => {
                          const features = (config.features || []).filter((_: string, i: number) => i !== index)
                          updateConfig('features', features)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateConfig('features', [...(config.features || []), ''])}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-black hover:text-black text-sm"
                  >
                    + Feature hinzufuegen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Horizontal layout title */}
          {(config.layout || 'horizontal') === 'horizontal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift (optional)</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          )}

          {/* Video Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video-Format</label>
              <select
                value={config.aspect_ratio || ((config.layout === 'vertical_left' || config.layout === 'vertical_right') ? '9:16' : '16:9')}
                onChange={(e) => updateConfig('aspect_ratio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="16:9">16:9 (Breitbild/YouTube)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="1:1">1:1 (Quadrat/Instagram)</option>
                <option value="9:16">9:16 (Vertikal/TikTok/Reels)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {(config.layout === 'vertical_left' || config.layout === 'vertical_right') ? 'Video-Breite' : 'Max. Breite'}
              </label>
              <select
                value={config.max_width || '800px'}
                onChange={(e) => updateConfig('max_width', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="400px">Schmal (400px)</option>
                <option value="500px">Klein (500px)</option>
                <option value="600px">Mittel (600px)</option>
                <option value="800px">Gross (800px)</option>
                <option value="1000px">Extra Gross (1000px)</option>
                <option value="100%">Volle Breite</option>
              </select>
            </div>
          </div>

          {/* Video Playback Options */}
          <div className="p-4 bg-blue-50 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Wiedergabe-Einstellungen</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="video_autoplay"
                  checked={config.autoplay || false}
                  onChange={(e) => updateConfig('autoplay', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="video_autoplay" className="text-sm text-gray-700">
                  Automatisch abspielen
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="video_muted"
                  checked={config.muted !== false}
                  onChange={(e) => updateConfig('muted', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="video_muted" className="text-sm text-gray-700">
                  Stummgeschaltet
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="video_loop"
                  checked={config.loop || false}
                  onChange={(e) => updateConfig('loop', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="video_loop" className="text-sm text-gray-700">
                  Endlosschleife
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="video_controls"
                  checked={config.show_controls || false}
                  onChange={(e) => updateConfig('show_controls', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="video_controls" className="text-sm text-gray-700">
                  Steuerelemente anzeigen
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tipp: Fuer Hintergrund-Videos aktivieren Sie Autoplay, Stummgeschaltet und Endlosschleife.
            </p>
          </div>

          {/* Style Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hintergrundfarbe</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.background_color || '#ffffff'}
                  onChange={(e) => updateConfig('background_color', e.target.value)}
                  className="w-12 h-10 border border-gray-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={config.background_color || ''}
                  onChange={(e) => updateConfig('background_color', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Textfarbe</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.text_color || '#000000'}
                  onChange={(e) => updateConfig('text_color', e.target.value)}
                  className="w-12 h-10 border border-gray-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={config.text_color || ''}
                  onChange={(e) => updateConfig('text_color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <AdvancedOptions />
        </div>
      )

    case 'product_showcase':
      return <ProductShowcaseEditor config={config} updateConfig={updateConfig} />

    case 'image_gallery':
      return <ImageGalleryEditor config={config} updateConfig={updateConfig} />

    case 'spacer':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hoehe</label>
            <select
              value={config.height || 'medium'}
              onChange={(e) => updateConfig('height', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="small">Klein (24px)</option>
              <option value="medium">Mittel (48px)</option>
              <option value="large">Gross (96px)</option>
              <option value="xl">Extra Gross (144px)</option>
              <option value="custom">Benutzerdefiniert</option>
            </select>
          </div>
          {config.height === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benutzerdefinierte Hoehe (px)</label>
              <input
                type="number"
                value={config.custom_height || 48}
                onChange={(e) => updateConfig('custom_height', parseInt(e.target.value))}
                min="0"
                max="500"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="spacer_show_line"
              checked={config.show_line || false}
              onChange={(e) => updateConfig('show_line', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="spacer_show_line" className="text-sm text-gray-700">
              Linie in der Mitte anzeigen
            </label>
          </div>
        </div>
      )

    case 'divider':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breite</label>
              <select
                value={config.width || 'full'}
                onChange={(e) => updateConfig('width', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="full">Volle Breite</option>
                <option value="medium">Medium (66%)</option>
                <option value="small">Klein (33%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
              <select
                value={config.style || 'solid'}
                onChange={(e) => updateConfig('style', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="solid">Durchgezogen</option>
                <option value="dashed">Gestrichelt</option>
                <option value="dotted">Gepunktet</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farbe</label>
              <input
                type="color"
                value={config.color || '#e5e7eb'}
                onChange={(e) => updateConfig('color', e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dicke</label>
              <select
                value={config.thickness || '1'}
                onChange={(e) => updateConfig('thickness', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="1">Duenn (1px)</option>
                <option value="2">Normal (2px)</option>
                <option value="4">Dick (4px)</option>
              </select>
            </div>
          </div>
          <AdvancedOptions />
        </div>
      )

    case 'custom_html':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HTML Code</label>
            <textarea
              value={config.html || ''}
              onChange={(e) => updateConfig('html', e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
              placeholder="<div class='my-custom-block'>
  <!-- Ihr Custom HTML hier -->
</div>"
            />
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Warnung:</strong> Custom HTML kann die Seite beeintraechtigen. Verwenden Sie nur vertrauenswuerdigen Code.
              JavaScript wird aus Sicherheitsgruenden nicht ausgefuehrt.
            </p>
          </div>
          <AdvancedOptions />
        </div>
      )

    // =========================================================================
    // SCROLL ANIMATION BLOCKS
    // =========================================================================

    case 'scroll_reveal_image':
      return (
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-violet-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-violet-900">Scroll Reveal Animation</p>
                <p className="text-xs text-violet-700 mt-1">Das Bild erscheint animiert beim Scrollen in den sichtbaren Bereich.</p>
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bild URL</label>
            <input
              type="text"
              value={config.image || ''}
              onChange={(e) => updateConfig('image', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alt-Text</label>
            <input
              type="text"
              value={config.alt || ''}
              onChange={(e) => updateConfig('alt', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              placeholder="Bildbeschreibung fuer Barrierefreiheit"
            />
          </div>

          {/* Animation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'fade', label: 'Fade', icon: '◉' },
                { value: 'slide-up', label: 'Slide Up', icon: '↑' },
                { value: 'slide-down', label: 'Slide Down', icon: '↓' },
                { value: 'slide-left', label: 'Slide Left', icon: '←' },
                { value: 'slide-right', label: 'Slide Right', icon: '→' },
                { value: 'zoom', label: 'Zoom', icon: '⊕' },
                { value: 'rotate', label: 'Rotate', icon: '↻' },
                { value: 'blur', label: 'Blur', icon: '◌' },
              ].map((anim) => (
                <button
                  key={anim.value}
                  type="button"
                  onClick={() => updateConfig('animation', anim.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    config.animation === anim.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-lg mb-1">{anim.icon}</span>
                  <span className="block text-xs">{anim.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Delay */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dauer (Sekunden)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={config.duration || 0.8}
                onChange={(e) => updateConfig('duration', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verzoegerung (Sekunden)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={config.delay || 0}
                onChange={(e) => updateConfig('delay', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Easing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Easing</label>
            <select
              value={config.easing || 'power3'}
              onChange={(e) => updateConfig('easing', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
            >
              <option value="power1">Sanft</option>
              <option value="power2">Smooth</option>
              <option value="power3">Standard</option>
              <option value="power4">Stark</option>
              <option value="back">Overshoot</option>
              <option value="elastic">Elastisch</option>
              <option value="bounce">Bounce</option>
              <option value="expo">Exponential</option>
            </select>
          </div>

          {/* Trigger Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Position</label>
            <select
              value={config.trigger || '75%'}
              onChange={(e) => updateConfig('trigger', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
            >
              <option value="top">Oben im Viewport</option>
              <option value="25%">25% vom oberen Rand</option>
              <option value="center">Mitte des Viewports</option>
              <option value="75%">75% vom oberen Rand</option>
              <option value="bottom">Unten im Viewport</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seitenverhaeltnis</label>
            <select
              value={config.aspectRatio || 'auto'}
              onChange={(e) => updateConfig('aspectRatio', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
            >
              <option value="auto">Automatisch</option>
              <option value="1/1">Quadrat (1:1)</option>
              <option value="4/3">Standard (4:3)</option>
              <option value="16/9">Widescreen (16:9)</option>
              <option value="21/9">Cinematic (21:9)</option>
            </select>
          </div>

          {/* Once Toggle */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={config.once !== false}
              onChange={(e) => updateConfig('once', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Nur einmal animieren</span>
              <p className="text-xs text-gray-500 mt-0.5">Animation wird nicht wiederholt beim erneuten Scrollen</p>
            </div>
          </label>

          <AdvancedOptions />
        </div>
      )

    case 'scroll_parallax_section':
      return (
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Parallax Effekt</p>
                <p className="text-xs text-blue-700 mt-1">Das Hintergrundbild bewegt sich langsamer als der Inhalt und erzeugt Tiefe.</p>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hintergrundbild URL</label>
            <input
              type="text"
              value={config.backgroundImage || ''}
              onChange={(e) => updateConfig('backgroundImage', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              placeholder="https://example.com/background.jpg"
            />
          </div>

          {/* Heading & Subheading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift</label>
            <input
              type="text"
              value={config.heading || ''}
              onChange={(e) => updateConfig('heading', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              placeholder="Parallax Titel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unterueberschrift</label>
            <textarea
              value={config.subheading || ''}
              onChange={(e) => updateConfig('subheading', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              placeholder="Beschreibungstext"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hoehe</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '50vh', label: '50%' },
                { value: '75vh', label: '75%' },
                { value: '100vh', label: 'Vollbild' },
                { value: 'auto', label: 'Auto' },
              ].map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => updateConfig('height', h.value)}
                  className={`py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    config.height === h.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parallax Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parallax Geschwindigkeit: {config.parallaxSpeed || 0.5}
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={config.parallaxSpeed || 0.5}
              onChange={(e) => updateConfig('parallaxSpeed', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Entgegengesetzt</span>
              <span>Kein Effekt</span>
              <span>Stark</span>
            </div>
          </div>

          {/* Overlay Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Farbe</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.overlayColor?.replace(/rgba?\([^)]+\)/, '#000000') || '#000000'}
                onChange={(e) => {
                  const hex = e.target.value
                  const r = parseInt(hex.slice(1, 3), 16)
                  const g = parseInt(hex.slice(3, 5), 16)
                  const b = parseInt(hex.slice(5, 7), 16)
                  updateConfig('overlayColor', `rgba(${r},${g},${b},0.4)`)
                }}
                className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
              />
              <select
                value={config.overlayOpacity || '0.4'}
                onChange={(e) => {
                  const current = config.overlayColor || 'rgba(0,0,0,0.4)'
                  const newColor = current.replace(/[\d.]+\)$/, e.target.value + ')')
                  updateConfig('overlayColor', newColor)
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl"
              >
                <option value="0.2">20% Opacity</option>
                <option value="0.4">40% Opacity</option>
                <option value="0.6">60% Opacity</option>
                <option value="0.8">80% Opacity</option>
              </select>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Textausrichtung</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'left', label: 'Links', icon: '◧' },
                { value: 'center', label: 'Mitte', icon: '▣' },
                { value: 'right', label: 'Rechts', icon: '◨' },
              ].map((align) => (
                <button
                  key={align.value}
                  type="button"
                  onClick={() => updateConfig('textAlign', align.value)}
                  className={`py-3 px-4 rounded-xl border-2 text-center transition-all ${
                    config.textAlign === align.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-lg mb-1">{align.icon}</span>
                  <span className="block text-xs">{align.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Animation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Animation</label>
            <select
              value={config.contentAnimation || 'slide-up'}
              onChange={(e) => updateConfig('contentAnimation', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
            >
              <option value="fade">Fade In</option>
              <option value="slide-up">Slide Up</option>
              <option value="slide-down">Slide Down</option>
              <option value="zoom">Zoom In</option>
            </select>
          </div>

          <AdvancedOptions />
        </div>
      )

    case 'pinned_scroll_section':
      return (
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Pin className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Pinned Scroll Section</p>
                <p className="text-xs text-amber-700 mt-1">Die Sektion bleibt fixiert waehrend der Benutzer scrollt und der Inhalt wechselt.</p>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hintergrundfarbe</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor || '#000000'}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={config.backgroundColor || '#000000'}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Pin Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Dauer (Scroll-Multiplikator): {config.pinDuration || 2}x
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={config.pinDuration || 2}
              onChange={(e) => updateConfig('pinDuration', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bei 2x muss der Benutzer 200vh scrollen, um alle Panels zu sehen.
            </p>
          </div>

          {/* Transition Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Panel Uebergang</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'fade', label: 'Fade' },
                { value: 'slide', label: 'Slide' },
                { value: 'scale', label: 'Scale' },
                { value: 'flip', label: 'Flip' },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateConfig('transitionType', t.value)}
                  className={`py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    config.transitionType === t.value
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={config.progressIndicator !== false}
              onChange={(e) => updateConfig('progressIndicator', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Fortschrittsanzeige</span>
              <p className="text-xs text-gray-500 mt-0.5">Zeigt den Scroll-Fortschritt an</p>
            </div>
          </label>

          {/* Panels Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Panels</label>
              <button
                type="button"
                onClick={() => {
                  const panels = config.panels ? (typeof config.panels === 'string' ? JSON.parse(config.panels) : config.panels) : []
                  panels.push({ heading: 'Neues Panel', text: 'Beschreibung hier...', image: '' })
                  updateConfig('panels', JSON.stringify(panels))
                }}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Panel hinzufuegen
              </button>
            </div>
            <PinnedPanelsEditor config={config} updateConfig={updateConfig} />
          </div>

          <AdvancedOptions />
        </div>
      )

    case 'horizontal_gallery_scroll':
      return (
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <GalleryHorizontal className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900">Horizontal Scroll Galerie</p>
                <p className="text-xs text-emerald-700 mt-1">Vertikales Scrollen bewegt die Bilder horizontal - perfekt fuer Showcases.</p>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hintergrundfarbe</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor || '#fafafa'}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={config.backgroundColor || '#fafafa'}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Image Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bildgroesse</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'small', label: 'Klein' },
                { value: 'medium', label: 'Mittel' },
                { value: 'large', label: 'Gross' },
                { value: 'full', label: 'Voll' },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => updateConfig('imageSize', s.value)}
                  className={`py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    config.imageSize === s.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gap & Speed */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstand (px)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="4"
                value={config.gap || 24}
                onChange={(e) => updateConfig('gap', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scroll Speed</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={config.scrollSpeed || 1}
                onChange={(e) => updateConfig('scrollSpeed', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scroll Richtung</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'left', label: 'Nach Links →' },
                { value: 'right', label: '← Nach Rechts' },
              ].map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => updateConfig('direction', d.value)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    config.direction === d.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Show Captions */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={config.showCaptions || false}
              onChange={(e) => updateConfig('showCaptions', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Bildunterschriften anzeigen</span>
              <p className="text-xs text-gray-500 mt-0.5">Zeigt Captions beim Hover</p>
            </div>
          </label>

          {/* Images Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Bilder</label>
              <button
                type="button"
                onClick={() => {
                  const images = config.images || []
                  images.push({ src: '', alt: '', caption: '' })
                  updateConfig('images', [...images])
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Bild hinzufuegen
              </button>
            </div>
            <HorizontalGalleryImagesEditor config={config} updateConfig={updateConfig} />
          </div>

          <AdvancedOptions />
        </div>
      )

    case 'scroll_timeline':
      return (
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-rose-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-rose-900">Scroll Timeline</p>
                <p className="text-xs text-rose-700 mt-1">Eine animierte Timeline, die sich beim Scrollen aufbaut.</p>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'alternating', label: 'Wechselnd' },
                { value: 'left', label: 'Links' },
                { value: 'right', label: 'Rechts' },
                { value: 'center', label: 'Zentriert' },
              ].map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => updateConfig('layout', l.value)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    config.layout === l.value
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Linienfarbe</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.lineColor || '#000000'}
                  onChange={(e) => updateConfig('lineColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.lineColor || '#000000'}
                  onChange={(e) => updateConfig('lineColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Punktfarbe</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.dotColor || '#000000'}
                  onChange={(e) => updateConfig('dotColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.dotColor || '#000000'}
                  onChange={(e) => updateConfig('dotColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Animation & Stagger */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Animation</label>
              <select
                value={config.itemAnimation || 'slide-up'}
                onChange={(e) => updateConfig('itemAnimation', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              >
                <option value="fade">Fade</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stagger (Sek.)</label>
              <input
                type="number"
                min="0"
                max="0.5"
                step="0.05"
                value={config.stagger || 0.1}
                onChange={(e) => updateConfig('stagger', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Progress Line */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={config.progressLine !== false}
              onChange={(e) => updateConfig('progressLine', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Animierte Fortschrittslinie</span>
              <p className="text-xs text-gray-500 mt-0.5">Die Linie waechst beim Scrollen</p>
            </div>
          </label>

          {/* Timeline Items Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Timeline Eintraege</label>
              <button
                type="button"
                onClick={() => {
                  const items = config.items ? (typeof config.items === 'string' ? JSON.parse(config.items) : config.items) : []
                  items.push({ date: new Date().getFullYear().toString(), title: 'Neuer Eintrag', description: 'Beschreibung...', image: '' })
                  updateConfig('items', JSON.stringify(items))
                }}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Eintrag hinzufuegen
              </button>
            </div>
            <TimelineItemsEditor config={config} updateConfig={updateConfig} />
          </div>

          <AdvancedOptions />
        </div>
      )

    default:
      return (
        <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
          Kein Editor fuer diesen Block-Typ verfuegbar.
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )
  }
}

// ============================================================================
// PRODUCT SHOWCASE EDITOR - with product search
// ============================================================================

interface ProductShowcaseEditorProps {
  config: Record<string, any>
  updateConfig: (key: string, value: any) => void
}

function ProductShowcaseEditor({ config, updateConfig }: ProductShowcaseEditorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const response = await productsApi.search(searchQuery, 1, 20)
      setSearchResults(response.products || [])
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const addProduct = (product: any) => {
    const products = config.products || []
    if (!products.find((p: any) => p.articlenr === product.articlenr)) {
      updateConfig('products', [...products, {
        articlenr: product.articlenr,
        name: product.articlename,
        price: product.price || product.priceeur || 0,
        image: product.primary_image || product.images?.[0]?.url || product.image_url || ''
      }])
    }
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const removeProduct = (articlenr: string) => {
    const products = (config.products || []).filter((p: any) => p.articlenr !== articlenr)
    updateConfig('products', products)
  }

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const products = [...(config.products || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= products.length) return
    [products[index], products[newIndex]] = [products[newIndex], products[index]]
    updateConfig('products', products)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift (optional)</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => updateConfig('title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spalten</label>
          <select
            value={config.columns || 4}
            onChange={(e) => updateConfig('columns', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value={2}>2 Produkte</option>
            <option value={3}>3 Produkte</option>
            <option value={4}>4 Produkte</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Karten-Stil</label>
          <select
            value={config.card_style || 'default'}
            onChange={(e) => updateConfig('card_style', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="default">Standard</option>
            <option value="minimal">Minimal</option>
            <option value="bordered">Mit Rahmen</option>
          </select>
        </div>
      </div>

      {/* Selected Products */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ausgewaehlte Produkte ({(config.products || []).length})
        </label>
        <div className="space-y-2">
          {(config.products || []).map((product: any, index: number) => (
            <div key={product.articlenr} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveProduct(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => moveProduct(index, 'down')}
                  disabled={index === (config.products || []).length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.articlenr}</p>
              </div>
              <span className="text-sm font-semibold">{product.price?.toFixed(2)} EUR</span>
              <button
                onClick={() => removeProduct(product.articlenr)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setShowSearch(true)}
          className="w-full mt-3 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-black hover:text-black transition-colors"
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Produkt hinzufuegen
        </button>
      </div>

      {/* Product Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Produkt suchen</h3>
                <button
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Produktname oder Artikelnummer..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                >
                  {searching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <button
                      key={product.articlenr}
                      onClick={() => addProduct(product)}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {(product.primary_image || product.images?.[0]?.url || product.image_url) ? (
                          <img
                            src={product.primary_image || product.images?.[0]?.url || product.image_url}
                            alt={product.articlename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Kein Bild
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.articlename}</p>
                        <p className="text-sm text-gray-500">{product.articlenr}</p>
                      </div>
                      <span className="font-semibold">{(product.price || product.priceeur)?.toFixed(2)} EUR</span>
                    </button>
                  ))}
                </div>
              ) : searchQuery && !searching ? (
                <p className="text-center text-gray-500 py-8">
                  Keine Produkte gefunden
                </p>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Geben Sie einen Suchbegriff ein
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacing Options */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Move className="h-4 w-4" /> Abstände & Layout
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hintergrundfarbe</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.background_color || '#ffffff'}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                className="w-12 h-9 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.background_color || ''}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Preis anzeigen</label>
            <select
              value={config.show_price ? 'true' : 'false'}
              onChange={(e) => updateConfig('show_price', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// IMAGE GALLERY EDITOR - with image management
// ============================================================================

interface ImageGalleryEditorProps {
  config: Record<string, any>
  updateConfig: (key: string, value: any) => void
}

function ImageGalleryEditor({ config, updateConfig }: ImageGalleryEditorProps) {
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageAlt, setNewImageAlt] = useState('')
  const [newImageCaption, setNewImageCaption] = useState('')

  const addImage = () => {
    if (!newImageUrl.trim()) return
    const images = config.images || []
    updateConfig('images', [...images, {
      url: newImageUrl,
      alt: newImageAlt || '',
      caption: newImageCaption || ''
    }])
    setNewImageUrl('')
    setNewImageAlt('')
    setNewImageCaption('')
  }

  const removeImage = (index: number) => {
    const images = (config.images || []).filter((_: any, i: number) => i !== index)
    updateConfig('images', images)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(config.images || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    [images[index], images[newIndex]] = [images[newIndex], images[index]]
    updateConfig('images', images)
  }

  const updateImage = (index: number, field: string, value: string) => {
    const images = [...(config.images || [])]
    images[index] = { ...images[index], [field]: value }
    updateConfig('images', images)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ueberschrift (optional)</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => updateConfig('title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spalten</label>
          <select
            value={config.columns || 3}
            onChange={(e) => updateConfig('columns', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value={1}>1 Spalte</option>
            <option value={2}>2 Spalten</option>
            <option value={3}>3 Spalten</option>
            <option value={4}>4 Spalten</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Abstand</label>
          <select
            value={config.gap || 'medium'}
            onChange={(e) => updateConfig('gap', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="small">Klein</option>
            <option value="medium">Mittel</option>
            <option value="large">Gross</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seitenverhaeltnis</label>
          <select
            value={config.aspect_ratio || 'square'}
            onChange={(e) => updateConfig('aspect_ratio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="square">Quadrat (1:1)</option>
            <option value="landscape">Querformat (4:3)</option>
            <option value="portrait">Hochformat (3:4)</option>
            <option value="wide">Breit (16:9)</option>
          </select>
        </div>
      </div>

      {/* Current Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bilder ({(config.images || []).length})
        </label>
        <div className="space-y-3">
          {(config.images || []).map((image: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === (config.images || []).length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                {image.url && (
                  <img
                    src={image.url}
                    alt={image.alt || ''}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={image.url || ''}
                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                    placeholder="Bild URL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                      placeholder="Alt-Text (SEO)"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => updateImage(index, 'caption', e.target.value)}
                      placeholder="Bildunterschrift"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Image */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Neues Bild hinzufuegen</h4>
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Bild URL (https://...)"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Alt-Text (optional)"
            className="px-4 py-2 border border-gray-200 rounded-lg"
          />
          <input
            type="text"
            value={newImageCaption}
            onChange={(e) => setNewImageCaption(e.target.value)}
            placeholder="Bildunterschrift (optional)"
            className="px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        {newImageUrl && (
          <div className="flex items-center gap-4">
            <img
              src={newImageUrl}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <button
              onClick={addImage}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Bild hinzufuegen
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Option */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="gallery_lightbox"
          checked={config.enable_lightbox !== false}
          onChange={(e) => updateConfig('enable_lightbox', e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="gallery_lightbox" className="text-sm text-gray-700">
          Lightbox aktivieren (Bilder koennen vergroessert werden)
        </label>
      </div>

      {/* Spacing */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Move className="h-4 w-4" /> Abstände & Layout
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hintergrundfarbe</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.background_color || '#ffffff'}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                className="w-12 h-9 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.background_color || ''}
                onChange={(e) => updateConfig('background_color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ecken abrunden</label>
            <select
              value={config.rounded || 'medium'}
              onChange={(e) => updateConfig('rounded', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="none">Keine</option>
              <option value="small">Klein</option>
              <option value="medium">Mittel</option>
              <option value="large">Gross</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Editor: Pinned Scroll Section Panels
function PinnedPanelsEditor({
  config,
  updateConfig
}: {
  config: Record<string, any>
  updateConfig: (key: string, value: any) => void
}) {
  // Parse panels from config
  const panels: Array<{ heading: string; text: string; image?: string }> = (() => {
    try {
      if (!config.panels) return []
      return typeof config.panels === 'string' ? JSON.parse(config.panels) : config.panels
    } catch {
      return []
    }
  })()

  const savePanels = (newPanels: typeof panels) => {
    updateConfig('panels', JSON.stringify(newPanels))
  }

  const updatePanel = (index: number, field: string, value: string) => {
    const updated = [...panels]
    updated[index] = { ...updated[index], [field]: value }
    savePanels(updated)
  }

  const removePanel = (index: number) => {
    savePanels(panels.filter((_, i) => i !== index))
  }

  const movePanel = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= panels.length) return
    const updated = [...panels]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    savePanels(updated)
  }

  if (panels.length === 0) {
    return (
      <div className="p-6 bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-xl text-center">
        <Pin className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm text-amber-700">Noch keine Panels erstellt.</p>
        <p className="text-xs text-amber-600 mt-1">Klicken Sie oben auf "Panel hinzufuegen"</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {panels.map((panel, index) => (
        <div key={index} className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-amber-900">Panel {index + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => movePanel(index, 'up')}
                disabled={index === 0}
                className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => movePanel(index, 'down')}
                disabled={index === panels.length - 1}
                className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removePanel(index)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image Preview */}
          {panel.image && (
            <div className="aspect-video bg-black/5 rounded-lg overflow-hidden">
              <img src={panel.image} alt={panel.heading} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1">Ueberschrift</label>
            <input
              type="text"
              value={panel.heading || ''}
              onChange={(e) => updatePanel(index, 'heading', e.target.value)}
              placeholder="Slide Titel eingeben..."
              className="w-full px-3 py-2.5 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1">Beschreibung</label>
            <textarea
              value={panel.text || ''}
              onChange={(e) => updatePanel(index, 'text', e.target.value)}
              placeholder="Was soll in diesem Panel angezeigt werden..."
              rows={3}
              className="w-full px-3 py-2.5 border border-amber-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1">Bild URL (optional)</label>
            <input
              type="text"
              value={panel.image || ''}
              onChange={(e) => updatePanel(index, 'image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white font-mono text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper Editor: Horizontal Gallery Images
function HorizontalGalleryImagesEditor({
  config,
  updateConfig
}: {
  config: Record<string, any>
  updateConfig: (key: string, value: any) => void
}) {
  // Get images array from config
  const images: Array<{ src: string; alt: string; caption?: string }> = config.images || []

  const saveImages = (newImages: typeof images) => {
    updateConfig('images', newImages)
  }

  const updateImage = (index: number, field: string, value: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    saveImages(updated)
  }

  const removeImage = (index: number) => {
    saveImages(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    const updated = [...images]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    saveImages(updated)
  }

  if (images.length === 0) {
    return (
      <div className="p-6 bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-xl text-center">
        <GalleryHorizontal className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm text-emerald-700">Noch keine Bilder hinzugefuegt.</p>
        <p className="text-xs text-emerald-600 mt-1">Klicken Sie oben auf "Bild hinzufuegen"</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div key={index} className="p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 text-white rounded-md flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-xs font-medium text-emerald-800">Bild {index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, 'left')}
                  disabled={index === 0}
                  className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'right')}
                  disabled={index === images.length - 1}
                  className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Image Preview */}
            {image.src ? (
              <div className="aspect-video bg-black/5 rounded-lg overflow-hidden">
                <img src={image.src} alt={image.alt || ''} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video bg-emerald-100/50 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-emerald-300" />
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={image.src || ''}
                onChange={(e) => updateImage(index, 'src', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-2.5 py-2 border border-emerald-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              />
              <input
                type="text"
                value={image.alt || ''}
                onChange={(e) => updateImage(index, 'alt', e.target.value)}
                placeholder="Alt Text fuer Barrierefreiheit..."
                className="w-full px-2.5 py-2 border border-emerald-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              />
              <input
                type="text"
                value={image.caption || ''}
                onChange={(e) => updateImage(index, 'caption', e.target.value)}
                placeholder="Bildunterschrift (optional)..."
                className="w-full px-2.5 py-2 border border-emerald-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper Editor: Timeline Items
function TimelineItemsEditor({
  config,
  updateConfig
}: {
  config: Record<string, any>
  updateConfig: (key: string, value: any) => void
}) {
  // Parse items from config
  const items: Array<{ date: string; title: string; description: string; image?: string }> = (() => {
    try {
      if (!config.items) return []
      return typeof config.items === 'string' ? JSON.parse(config.items) : config.items
    } catch {
      return []
    }
  })()

  const saveItems = (newItems: typeof items) => {
    updateConfig('items', JSON.stringify(newItems))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    saveItems(updated)
  }

  const removeItem = (index: number) => {
    saveItems(items.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return
    const updated = [...items]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    saveItems(updated)
  }

  if (items.length === 0) {
    return (
      <div className="p-6 bg-rose-50/50 border-2 border-dashed border-rose-200 rounded-xl text-center">
        <Timer className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm text-rose-700">Noch keine Eintraege erstellt.</p>
        <p className="text-xs text-rose-600 mt-1">Klicken Sie oben auf "Eintrag hinzufuegen"</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="p-4 bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Timeline Visual */}
              <div className="relative">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </div>
                {index < items.length - 1 && (
                  <div className="absolute top-10 left-1/2 w-0.5 h-4 bg-rose-200 -translate-x-1/2" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-rose-900">Eintrag {index + 1}</span>
                {item.date && <span className="text-xs text-rose-600 ml-2">({item.date})</span>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image Preview */}
          {item.image && (
            <div className="aspect-video bg-black/5 rounded-lg overflow-hidden max-w-xs">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-rose-800 mb-1">Jahr / Datum</label>
              <input
                type="text"
                value={item.date || ''}
                onChange={(e) => updateItem(index, 'date', e.target.value)}
                placeholder="z.B. 2024 oder Jan 2024"
                className="w-full px-3 py-2.5 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-800 mb-1">Titel</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                placeholder="Meilenstein Titel..."
                className="w-full px-3 py-2.5 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-800 mb-1">Beschreibung</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Beschreibe diesen Meilenstein oder Event..."
              rows={3}
              className="w-full px-3 py-2.5 border border-rose-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-800 mb-1">Bild URL (optional)</label>
            <input
              type="text"
              value={item.image || ''}
              onChange={(e) => updateItem(index, 'image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 border border-rose-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white font-mono text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
