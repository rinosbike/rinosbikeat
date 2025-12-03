/**
 * Cart Store - Zustand State Management
 * Client-side cart with localStorage persistence
 * No database required until checkout
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartProduct {
  articlenr: string
  articlename: string
  price: number
  primary_image?: string
  manufacturer?: string
  colour?: string
  size?: string
}

export interface CartItem {
  articlenr: string
  product: CartProduct
  quantity: number
  price_at_addition: number
  added_at: string
}

interface CartStore {
  sessionId: string
  items: CartItem[]

  // Actions
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (articlenr: string) => void
  updateQuantity: (articlenr: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTotal: () => number
  generateSessionId: () => string
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      sessionId: '',
      items: [],

      // Actions
      addItem: (product: CartProduct, quantity: number = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.articlenr === product.articlenr)

        if (existingItem) {
          // Update quantity of existing item
          set({
            items: items.map(item =>
              item.articlenr === product.articlenr
                ? { ...item, quantity: Math.min(item.quantity + quantity, 100) }
                : item
            )
          })
        } else {
          // Add new item
          const newItem: CartItem = {
            articlenr: product.articlenr,
            product: product,
            quantity: Math.min(quantity, 100),
            price_at_addition: product.price,
            added_at: new Date().toISOString()
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (articlenr: string) => {
        set({ items: get().items.filter(item => item.articlenr !== articlenr) })
      },

      updateQuantity: (articlenr: string, quantity: number) => {
        if (quantity === 0) {
          get().removeItem(articlenr)
        } else {
          set({
            items: get().items.map(item =>
              item.articlenr === articlenr
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), 100) }
                : item
            )
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) =>
          total + (item.price_at_addition * item.quantity), 0
        )
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const taxRate = 0.19 // 19% VAT
        const tax = subtotal * taxRate
        const shipping = subtotal >= 100 ? 0 : 9.99
        return subtotal + tax + shipping
      },

      generateSessionId: () => {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 15)
        const sessionId = `session_${timestamp}_${random}`

        set({ sessionId })
        return sessionId
      },
    }),
    {
      name: 'rinos-cart-storage', // LocalStorage key
      partialize: (state) => ({
        sessionId: state.sessionId,
        items: state.items,
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
