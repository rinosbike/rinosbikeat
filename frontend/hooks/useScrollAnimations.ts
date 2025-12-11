/**
 * useScrollAnimations Hook
 * =============================================================================
 * React hook for managing scroll animations
 *
 * Features:
 * - Automatically initializes scroll animations on mount
 * - Refreshes animations when dependencies change
 * - Cleans up on unmount
 * - Works with Next.js app router
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Animation engine functions (lazy loaded)
let animationEngine: {
  init: () => Promise<void>
  refresh: () => void
  destroy: () => void
  reinit: () => Promise<void>
} | null = null

/**
 * Load the animation engine module
 */
async function loadAnimationEngine() {
  if (!animationEngine) {
    const module = await import('@/lib/scroll-animation-engine')
    animationEngine = module.default || module
  }
  return animationEngine
}

interface UseScrollAnimationsOptions {
  /**
   * Whether to automatically initialize on mount
   * @default true
   */
  autoInit?: boolean

  /**
   * Whether to refresh when pathname changes
   * @default true
   */
  refreshOnNavigation?: boolean

  /**
   * Dependencies that should trigger a refresh when changed
   */
  refreshDeps?: any[]

  /**
   * Callback fired when animations are initialized
   */
  onInit?: () => void

  /**
   * Callback fired when animations are refreshed
   */
  onRefresh?: () => void
}

/**
 * Hook to manage scroll animations in React components
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const { refresh, isReady } = useScrollAnimations()
 *
 *   // Animations auto-initialize on mount
 *   // and refresh on route changes
 *
 *   return (
 *     <div className="scroll-reveal" data-animation="fade">
 *       Content that animates on scroll
 *     </div>
 *   )
 * }
 * ```
 */
export function useScrollAnimations(options: UseScrollAnimationsOptions = {}) {
  const {
    autoInit = true,
    refreshOnNavigation = true,
    refreshDeps = [],
    onInit,
    onRefresh,
  } = options

  const pathname = usePathname()
  const isInitialized = useRef(false)
  const isReady = useRef(false)

  /**
   * Initialize animations
   */
  const init = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const engine = await loadAnimationEngine()
      await engine.init()
      isInitialized.current = true
      isReady.current = true
      onInit?.()
    } catch (error) {
      console.error('Failed to initialize scroll animations:', error)
    }
  }, [onInit])

  /**
   * Refresh animations (useful after DOM changes)
   */
  const refresh = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const engine = await loadAnimationEngine()
      engine.refresh()
      onRefresh?.()
    } catch (error) {
      console.error('Failed to refresh scroll animations:', error)
    }
  }, [onRefresh])

  /**
   * Reinitialize animations (destroy + init)
   */
  const reinit = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const engine = await loadAnimationEngine()
      await engine.reinit()
      onInit?.()
    } catch (error) {
      console.error('Failed to reinitialize scroll animations:', error)
    }
  }, [onInit])

  /**
   * Destroy animations
   */
  const destroy = useCallback(async () => {
    if (typeof window === 'undefined') return

    try {
      const engine = await loadAnimationEngine()
      engine.destroy()
      isInitialized.current = false
      isReady.current = false
    } catch (error) {
      console.error('Failed to destroy scroll animations:', error)
    }
  }, [])

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInit && !isInitialized.current) {
      init()
    }

    return () => {
      // Don't destroy on unmount in Next.js - causes issues with page transitions
      // Just mark as needing reinit
      isInitialized.current = false
    }
  }, [autoInit, init])

  // Refresh on pathname change
  useEffect(() => {
    if (refreshOnNavigation && isInitialized.current) {
      // Small delay to let DOM update
      const timeout = setTimeout(() => {
        reinit()
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [pathname, refreshOnNavigation, reinit])

  // Refresh on dependency changes
  useEffect(() => {
    if (isInitialized.current && refreshDeps.length > 0) {
      const timeout = setTimeout(() => {
        refresh()
      }, 50)

      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refreshDeps)

  return {
    /**
     * Manually initialize animations
     */
    init,

    /**
     * Refresh animations (useful after DOM changes)
     */
    refresh,

    /**
     * Reinitialize animations (destroy + init)
     */
    reinit,

    /**
     * Destroy all animations
     */
    destroy,

    /**
     * Whether animations are ready
     */
    get isReady() {
      return isReady.current
    },
  }
}

/**
 * Hook for individual scroll reveal elements
 * Returns a ref to attach to the element
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const ref = useScrollReveal({
 *     animation: 'slide-up',
 *     duration: 0.8,
 *   })
 *
 *   return (
 *     <div ref={ref}>
 *       This will animate when scrolled into view
 *     </div>
 *   )
 * }
 * ```
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: {
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'rotate' | 'blur'
  duration?: number
  delay?: number
  easing?: string
  trigger?: string
  once?: boolean
} = {}) {
  const ref = useRef<T>(null)

  const {
    animation = 'fade',
    duration = 0.8,
    delay = 0,
    easing = 'power3',
    trigger = '75%',
    once = true,
  } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Add class and data attributes
    element.classList.add('scroll-reveal')
    element.setAttribute('data-animation', animation)
    element.setAttribute('data-duration', String(duration))
    element.setAttribute('data-delay', String(delay))
    element.setAttribute('data-easing', easing)
    element.setAttribute('data-trigger', trigger)
    element.setAttribute('data-once', String(once))

    // Refresh animations to pick up the new element
    loadAnimationEngine().then((engine) => {
      engine.refresh()
    })

    return () => {
      element.classList.remove('scroll-reveal')
    }
  }, [animation, duration, delay, easing, trigger, once])

  return ref
}

export default useScrollAnimations
