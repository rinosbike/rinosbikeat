/**
 * Cart Store - Zustand State Management
 * Manages shopping cart state and session
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  sessionId: string
  itemCount: number
  setItemCount: (count: number) => void
  generateSessionId: () => string
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      sessionId: '',
      itemCount: 0,
      
      // Actions
      setItemCount: (count: number) => {
        set({ itemCount: count })
      },
      
      generateSessionId: () => {
        // Generate unique session ID
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 15)
        const sessionId = `session_${timestamp}_${random}`
        
        set({ sessionId })
        return sessionId
      },
      
      clearCart: () => {
        set({ itemCount: 0 })
      },
    }),
    {
      name: 'rinos-cart-storage', // LocalStorage key
      partialize: (state) => ({
        sessionId: state.sessionId,
        itemCount: state.itemCount,
      }),
    }
  )
)

// Initialize session ID if not exists
if (typeof window !== 'undefined') {
  const store = useCartStore.getState()
  if (!store.sessionId) {
    store.generateSessionId()
  }
}
