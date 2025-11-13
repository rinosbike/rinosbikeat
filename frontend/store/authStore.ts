/**
 * Auth Store - Zustand State Management
 * Manages user authentication state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type User } from '@/lib/api'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  logout: () => void
  setUser: (user: User, token: string) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password)
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
          })
          
          // Store token in localStorage for API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.access_token)
          }
        } catch (error) {
          console.error('Login error:', error)
          throw error
        }
      },
      
      register: async (email: string, password: string, firstName?: string, lastName?: string) => {
        try {
          const response = await authApi.register({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          })
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
          })
          
          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.access_token)
          }
        } catch (error) {
          console.error('Register error:', error)
          throw error
        }
      },
      
      logout: () => {
        // Remove token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
        }
        
        // Clear auth store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        
        // Call backend logout (optional, for logging)
        authApi.logout().catch(console.error)
      },
      
      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token)
        }
      },
      
      checkAuth: async () => {
        const token = get().token
        
        if (!token) {
          return
        }
        
        try {
          // Verify token is still valid
          const user = await authApi.getCurrentUser()
          set({ user, isAuthenticated: true })
        } catch (error) {
          // Token invalid, clear auth
          get().logout()
        }
      },
    }),
    {
      name: 'rinos-auth-storage', // LocalStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Check auth on app load
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth()
}
