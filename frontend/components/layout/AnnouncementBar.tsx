/**
 * Announcement Bar Component
 * Top banner for announcements and promotions
 */

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white">
      {/* First Announcement */}
      <div className="border-b border-gray-800">
        <Link
          href="/reviews"
          className="block text-center py-2 px-4 text-sm hover:opacity-80 transition-opacity"
        >
          <span>Sehen Sie unsere <strong>196</strong> Bewertungen auf Trustpilot</span>
          <ChevronRight className="inline-block w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Second Announcement */}
      <div>
        <Link
          href="/products"
          className="block text-center py-2 px-4 text-sm hover:opacity-80 transition-opacity"
        >
          <span>2025 NEUE MODELLE | Sparen Sie bis zu 300€</span>
          <ChevronRight className="inline-block w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}
