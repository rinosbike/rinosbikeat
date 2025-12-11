/**
 * Admin Homepage Redirect
 * Redirects to the pages system for editing the homepage
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pagesApi } from '@/lib/api'
import { Loader2, Home, Plus } from 'lucide-react'

export default function AdminHomepageRedirect() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'found' | 'not_found' | 'error'>('loading')
  const [pageId, setPageId] = useState<number | null>(null)

  useEffect(() => {
    async function checkHomepage() {
      try {
        setStatus('loading')
        
        // Try to find a page with slug 'home' or 'homepage'
        const response = await pagesApi.getPages({ page_size: 100 })
        const homePage = response.pages.find(p => p.slug === 'home' || p.slug === 'homepage')
        
        if (homePage) {
          setPageId(homePage.page_id)
          setStatus('found')
          // Redirect to edit the home page
          setTimeout(() => {
            router.push(`/admin/pages/${homePage.page_id}`)
          }, 500)
        } else {
          setStatus('not_found')
        }
      } catch (err) {
        console.error('Error checking homepage:', err)
        setStatus('error')
      }
    }
    
    checkHomepage()
  }, [router])

  if (status === 'loading' || status === 'found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-black mb-4" />
        <p className="text-gray-600">
          {status === 'loading' ? 'Suche nach Homepage...' : 'Homepage gefunden, weiterleiten...'}
        </p>
      </div>
    )
  }

  if (status === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-black text-black mb-4">Homepage nicht gefunden</h1>
          <p className="text-gray-600 mb-6">
            Es wurde keine Seite mit dem Slug "home" oder "homepage" gefunden. 
            Erstellen Sie eine neue Homepage mit dem Blocks-System.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/admin/pages?create=home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Homepage erstellen
            </Link>
            
            <div className="text-sm text-gray-500 mt-4">
              <p className="mb-2">Oder:</p>
              <Link
                href="/admin/pages"
                className="text-black font-semibold hover:underline"
              >
                Zu allen Seiten gehen
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-left">
            <p className="text-sm text-blue-900 font-semibold mb-2">💡 Tipp:</p>
            <p className="text-sm text-blue-800">
              Die Homepage verwendet jetzt das gleiche Block-System wie andere Seiten (z.B. Gravel, Über uns).
              Erstellen Sie eine Seite mit dem Slug "home" und fügen Sie Blocks wie Hero, Featured Products, usw. hinzu.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler</h1>
        <p className="text-gray-600 mb-6">
          Ein Fehler ist beim Laden der Homepage aufgetreten.
        </p>
        <Link
          href="/admin/pages"
          className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Zu allen Seiten
        </Link>
      </div>
    </div>
  )
}
