/**
 * Promotional Top Bar Component
 * Black bar with promotional messages - matches rinosbike.eu
 */

'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export default function PromoBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-black text-white py-3 px-4 relative">
      <div className="max-w-container mx-auto flex items-center justify-between gap-4">
        {/* Promotional Message */}
        <div className="flex-1 text-center">
          <p className="text-sm font-medium tracking-wide">
            2025 NEUE MODELLE | Sparen Sie bis zu 300€
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
