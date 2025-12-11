'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { pagesApi, Page } from '@/lib/api'
import { BlockRenderer } from '@/components/PageRenderer'

// Import scroll animation CSS
import '@/styles/scroll-animations.css'

export default function DynamicPage() {
  const params = useParams()
  const slug = params.slug as string

  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        setError(null)
        const data = await pagesApi.getPublicPage(slug)
        setPage(data)
      } catch (err: any) {
        console.error('Error loading page:', err)
        if (err.response?.status === 404) {
          setError('not_found')
        } else {
          setError(err.response?.data?.detail || 'Fehler beim Laden der Seite')
        }
      } finally {
        setLoading(false)
      }
    }
    loadPage()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error === 'not_found' || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-black text-black mb-4">404</h1>
        <p className="text-gray-600 mb-8">Diese Seite wurde nicht gefunden.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* SEO Title */}
      <title>{page.meta_title || page.title} | RINOS Bikes</title>

      {/* Render Blocks */}
      <div className="min-h-screen">
        {page.blocks?.map((block) => (
          <BlockRenderer key={block.block_id} block={block} />
        ))}
      </div>
    </>
  )
}
