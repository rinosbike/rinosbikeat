/**
 * Homepage - RINOS Bikes Austria
 * Uses block system from admin panel
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { pagesApi, Page } from '@/lib/api'
import { BlockRenderer } from '@/components/PageRenderer'

export default function HomePage() {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadHomepage() {
      try {
        setLoading(true)
        setError(null)
        // Try to load homepage from pages system with slug 'home' or 'homepage'
        try {
          const data = await pagesApi.getPublicPage('home')
          setPage(data)
        } catch (e: any) {
          // If 'home' doesn't exist, try 'homepage'
          if (e.response?.status === 404) {
            try {
              const data = await pagesApi.getPublicPage('homepage')
              setPage(data)
            } catch (e2: any) {
              // If neither exists, show error
              if (e2.response?.status === 404) {
                setError('not_found')
              } else {
                throw e2
              }
            }
          } else {
            throw e
          }
        }
      } catch (err: any) {
        console.error('Error loading homepage:', err)
        setError(err.response?.data?.detail || 'Failed to load homepage')
      } finally {
        setLoading(false)
      }
    }
    loadHomepage()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error === 'not_found' || !page) {
    // Fallback to simple homepage if no page found
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-black text-black mb-4">Willkommen bei RINOS Bikes</h1>
          <p className="text-gray-600 mb-8">
            Erstellen Sie eine Homepage über das Admin-Panel mit dem Slug "home" oder "homepage".
          </p>
          <Link
            href="/admin/pages"
            className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Zum Admin-Panel
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          href="/admin/pages"
          className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Zum Admin-Panel
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
