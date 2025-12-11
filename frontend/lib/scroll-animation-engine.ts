/**
 * Scroll Animation Engine
 * =============================================================================
 * A lightweight, modular scroll animation system using GSAP + ScrollTrigger
 *
 * Features:
 * - Auto-detects animation blocks via CSS classes
 * - Reads configuration from data attributes
 * - Works with unlimited CMS block combinations
 * - Graceful degradation without JS
 * - TypeScript support
 *
 * CSS Classes:
 * - .scroll-reveal     = fade/slide/zoom on scroll
 * - .scroll-pin        = pin section for % of scroll
 * - .scroll-parallax   = background moves slower on scroll
 * - .scroll-horizontal = vertical scroll moves content horizontally
 * - .scroll-timeline   = animated timeline with progress line
 *
 * Usage:
 * Import and call initScrollAnimations() after DOM is ready
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ScrollRevealOptions {
  animation: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'rotate' | 'blur' | 'flip-x' | 'flip-y' | 'bounce' | 'elastic' | 'wave' | 'typewriter' | 'counter' | 'gradient-shift'
  duration: number
  delay: number
  easing: string
  trigger: string
  once: boolean
  stagger?: number
  splitText?: 'chars' | 'words' | 'lines' | 'none'
  counterFrom?: number
  counterTo?: number
  counterDuration?: number
}

interface ScrollPinOptions {
  duration: number
  transition: 'fade' | 'slide' | 'scale' | 'flip'
  showProgress: boolean
}

interface ScrollParallaxOptions {
  speed: number
  direction: 'vertical' | 'horizontal'
}

interface ScrollHorizontalOptions {
  speed: number
  direction: 'left' | 'right'
  snap: boolean
  snapEase: string
  momentum: boolean
}

interface ScrollTimelineOptions {
  animation: string
  stagger: number
  progressLine: boolean
  lineColor: string
}

// =============================================================================
// GSAP + ScrollTrigger INITIALIZATION
// =============================================================================

let gsap: any
let ScrollTrigger: any
let isInitialized = false

/**
 * Dynamically load GSAP and ScrollTrigger
 * Falls back gracefully if libraries aren't available
 */
async function loadGSAP(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    // Check if GSAP is already loaded globally
    if ((window as any).gsap && (window as any).ScrollTrigger) {
      gsap = (window as any).gsap
      ScrollTrigger = (window as any).ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      return true
    }

    // Dynamic import for Next.js
    const gsapModule = await import('gsap')
    const scrollTriggerModule = await import('gsap/ScrollTrigger')

    gsap = gsapModule.gsap || gsapModule.default
    ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default

    gsap.registerPlugin(ScrollTrigger)
    return true
  } catch (error) {
    console.warn('ScrollAnimationEngine: GSAP not available, animations disabled', error)
    return false
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse data attributes from element with fallback defaults
 */
function getDataAttributes<T extends Record<string, any>>(
  element: HTMLElement,
  defaults: T
): T {
  const result = { ...defaults }

  for (const key of Object.keys(defaults)) {
    const dataKey = `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    const value = element.getAttribute(dataKey)

    if (value !== null) {
      // Parse based on default type
      const defaultValue = defaults[key]
      if (typeof defaultValue === 'number') {
        result[key as keyof T] = parseFloat(value) as any
      } else if (typeof defaultValue === 'boolean') {
        result[key as keyof T] = (value === 'true' || value === '1') as any
      } else {
        result[key as keyof T] = value as any
      }
    }
  }

  return result
}

/**
 * Convert easing name to GSAP easing string
 */
function getGSAPEasing(easing: string): string {
  const easingMap: Record<string, string> = {
    'power1': 'power1.out',
    'power2': 'power2.out',
    'power3': 'power3.out',
    'power4': 'power4.out',
    'back': 'back.out(1.7)',
    'elastic': 'elastic.out(1, 0.5)',
    'bounce': 'bounce.out',
    'expo': 'expo.out',
    'linear': 'none',
  }
  return easingMap[easing] || 'power3.out'
}

/**
 * Convert trigger position to ScrollTrigger format
 */
function getTriggerStart(trigger: string): string {
  const triggerMap: Record<string, string> = {
    'top': 'top bottom',
    '25%': 'top 75%',
    'center': 'top center',
    '75%': 'top 25%',
    'bottom': 'top top',
  }
  return triggerMap[trigger] || 'top 75%'
}

/**
 * Get initial animation state based on animation type
 */
function getInitialState(animation: string): gsap.TweenVars {
  const states: Record<string, gsap.TweenVars> = {
    'fade': { opacity: 0 },
    'slide-up': { opacity: 0, y: 60 },
    'slide-down': { opacity: 0, y: -60 },
    'slide-left': { opacity: 0, x: 60 },
    'slide-right': { opacity: 0, x: -60 },
    'zoom': { opacity: 0, scale: 0.8 },
    'rotate': { opacity: 0, rotation: -15, scale: 0.9 },
    'blur': { opacity: 0, filter: 'blur(10px)' },
    'flip-x': { opacity: 0, rotationX: -90, transformPerspective: 1000 },
    'flip-y': { opacity: 0, rotationY: -90, transformPerspective: 1000 },
    'bounce': { opacity: 0, y: 80, scale: 0.8 },
    'elastic': { opacity: 0, scale: 0, rotation: -45 },
    'wave': { opacity: 0, y: 40, skewX: 10 },
    'typewriter': { opacity: 1, width: 0, overflow: 'hidden' },
    'counter': { opacity: 1 },
    'gradient-shift': { opacity: 0, backgroundPosition: '0% 50%' },
  }
  return states[animation] || states['fade']
}

/**
 * Get final animation state (what we animate to)
 */
function getFinalState(animation: string): gsap.TweenVars {
  const states: Record<string, gsap.TweenVars> = {
    'fade': { opacity: 1 },
    'slide-up': { opacity: 1, y: 0 },
    'slide-down': { opacity: 1, y: 0 },
    'slide-left': { opacity: 1, x: 0 },
    'slide-right': { opacity: 1, x: 0 },
    'zoom': { opacity: 1, scale: 1 },
    'rotate': { opacity: 1, rotation: 0, scale: 1 },
    'blur': { opacity: 1, filter: 'blur(0px)' },
    'flip-x': { opacity: 1, rotationX: 0 },
    'flip-y': { opacity: 1, rotationY: 0 },
    'bounce': { opacity: 1, y: 0, scale: 1 },
    'elastic': { opacity: 1, scale: 1, rotation: 0 },
    'wave': { opacity: 1, y: 0, skewX: 0 },
    'typewriter': { width: '100%' },
    'counter': { opacity: 1 },
    'gradient-shift': { opacity: 1, backgroundPosition: '100% 50%' },
  }
  return states[animation] || states['fade']
}

/**
 * Get special easing for certain animation types
 */
function getAnimationEasing(animation: string, defaultEasing: string): string {
  const specialEasings: Record<string, string> = {
    'bounce': 'bounce.out',
    'elastic': 'elastic.out(1, 0.3)',
    'flip-x': 'power4.out',
    'flip-y': 'power4.out',
  }
  return specialEasings[animation] || getGSAPEasing(defaultEasing)
}

// =============================================================================
// ANIMATION HANDLERS
// =============================================================================

/**
 * Initialize scroll reveal animations
 * Elements with .scroll-reveal class
 */
function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-reveal')

  elements.forEach((element) => {
    const options = getDataAttributes<ScrollRevealOptions>(element, {
      animation: 'fade',
      duration: 0.8,
      delay: 0,
      easing: 'power3',
      trigger: '75%',
      once: true,
      stagger: 0,
      splitText: 'none',
      counterFrom: 0,
      counterTo: 100,
      counterDuration: 2,
    })

    // Handle special animation types
    if (options.animation === 'counter') {
      initCounterAnimation(element, options)
      return
    }

    if (options.animation === 'typewriter') {
      initTypewriterAnimation(element, options)
      return
    }

    // Handle text splitting for character/word animations
    if (options.splitText && options.splitText !== 'none') {
      initSplitTextAnimation(element, options)
      return
    }

    // Set initial state
    gsap.set(element, getInitialState(options.animation))

    // Check for staggered children
    const staggerChildren = element.querySelectorAll('[data-stagger-child]')

    if (staggerChildren.length > 0) {
      // Staggered animation for children
      gsap.set(staggerChildren, getInitialState(options.animation))

      ScrollTrigger.create({
        trigger: element,
        start: getTriggerStart(options.trigger),
        once: options.once,
        onEnter: () => {
          // First reveal parent
          gsap.to(element, {
            ...getFinalState(options.animation),
            duration: options.duration,
            delay: options.delay,
            ease: getAnimationEasing(options.animation, options.easing),
          })

          // Then stagger children
          gsap.to(staggerChildren, {
            ...getFinalState(options.animation),
            duration: options.duration,
            delay: options.delay + 0.1,
            stagger: options.stagger || 0.1,
            ease: getAnimationEasing(options.animation, options.easing),
          })
        },
        onLeaveBack: options.once ? undefined : () => {
          gsap.to(element, getInitialState(options.animation))
          gsap.to(staggerChildren, getInitialState(options.animation))
        },
      })
    } else {
      // Single element animation
      ScrollTrigger.create({
        trigger: element,
        start: getTriggerStart(options.trigger),
        once: options.once,
        onEnter: () => {
          gsap.to(element, {
            ...getFinalState(options.animation),
            duration: options.duration,
            delay: options.delay,
            ease: getAnimationEasing(options.animation, options.easing),
          })
        },
        onLeaveBack: options.once ? undefined : () => {
          gsap.to(element, getInitialState(options.animation))
        },
      })
    }

    // Mark as initialized
    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize counter animation (animates numbers from X to Y)
 */
function initCounterAnimation(element: HTMLElement, options: ScrollRevealOptions): void {
  const from = options.counterFrom || 0
  const to = options.counterTo || parseInt(element.textContent || '100', 10)
  const duration = options.counterDuration || 2
  const suffix = element.dataset.counterSuffix || ''
  const prefix = element.dataset.counterPrefix || ''
  const decimals = parseInt(element.dataset.counterDecimals || '0', 10)

  // Store original content
  element.textContent = prefix + from.toFixed(decimals) + suffix

  ScrollTrigger.create({
    trigger: element,
    start: getTriggerStart(options.trigger),
    once: options.once,
    onEnter: () => {
      gsap.to({ value: from }, {
        value: to,
        duration: duration,
        delay: options.delay,
        ease: 'power2.out',
        onUpdate: function() {
          element.textContent = prefix + (this.targets()[0] as any).value.toFixed(decimals) + suffix
        },
      })
    },
    onLeaveBack: options.once ? undefined : () => {
      element.textContent = prefix + from.toFixed(decimals) + suffix
    },
  })

  element.setAttribute('data-scroll-initialized', 'true')
}

/**
 * Initialize typewriter animation
 */
function initTypewriterAnimation(element: HTMLElement, options: ScrollRevealOptions): void {
  const text = element.textContent || ''
  element.textContent = ''
  element.style.visibility = 'visible'

  ScrollTrigger.create({
    trigger: element,
    start: getTriggerStart(options.trigger),
    once: options.once,
    onEnter: () => {
      let index = 0
      const interval = setInterval(() => {
        if (index <= text.length) {
          element.textContent = text.slice(0, index)
          index++
        } else {
          clearInterval(interval)
        }
      }, (options.duration * 1000) / text.length)
    },
    onLeaveBack: options.once ? undefined : () => {
      element.textContent = ''
    },
  })

  element.setAttribute('data-scroll-initialized', 'true')
}

/**
 * Initialize split text animation (chars, words, or lines)
 */
function initSplitTextAnimation(element: HTMLElement, options: ScrollRevealOptions): void {
  const text = element.textContent || ''
  const splitBy = options.splitText || 'words'

  let parts: string[]
  let joinChar = ''

  switch (splitBy) {
    case 'chars':
      parts = text.split('')
      break
    case 'words':
      parts = text.split(' ')
      joinChar = ' '
      break
    case 'lines':
      parts = text.split('\n')
      joinChar = '\n'
      break
    default:
      parts = [text]
  }

  // Clear and rebuild with spans
  element.innerHTML = parts
    .map((part, i) => `<span class="scroll-split-item" style="display: inline-block; opacity: 0;">${part}${i < parts.length - 1 ? joinChar : ''}</span>`)
    .join('')

  const spans = element.querySelectorAll<HTMLElement>('.scroll-split-item')

  gsap.set(spans, {
    opacity: 0,
    y: splitBy === 'chars' ? 20 : 40,
    rotationX: splitBy === 'chars' ? -90 : 0,
    transformPerspective: 500,
  })

  ScrollTrigger.create({
    trigger: element,
    start: getTriggerStart(options.trigger),
    once: options.once,
    onEnter: () => {
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: options.duration,
        delay: options.delay,
        stagger: options.stagger || (splitBy === 'chars' ? 0.03 : 0.08),
        ease: 'power3.out',
      })
    },
    onLeaveBack: options.once ? undefined : () => {
      gsap.to(spans, {
        opacity: 0,
        y: splitBy === 'chars' ? 20 : 40,
        rotationX: splitBy === 'chars' ? -90 : 0,
      })
    },
  })

  element.setAttribute('data-scroll-initialized', 'true')
}

/**
 * Initialize pinned scroll sections
 * Elements with .scroll-pin class
 */
function initScrollPin(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-pin')

  elements.forEach((element) => {
    const options = getDataAttributes<ScrollPinOptions>(element, {
      duration: 2,
      transition: 'fade',
      showProgress: true,
    })

    const panels = element.querySelectorAll<HTMLElement>('.scroll-pin-panel')
    const progressBar = element.querySelector<HTMLElement>('.scroll-pin-progress')

    if (panels.length === 0) return

    // Calculate scroll distance based on panel count and duration
    const scrollDistance = window.innerHeight * options.duration

    // Create pin trigger
    const pinTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self: any) => {
        const progress = self.progress
        const panelCount = panels.length
        const panelIndex = Math.min(
          Math.floor(progress * panelCount),
          panelCount - 1
        )

        // Update progress bar
        if (progressBar && options.showProgress) {
          progressBar.style.transform = `scaleX(${progress})`
        }

        // Update panel visibility based on transition type
        panels.forEach((panel, index) => {
          const panelProgress = (progress * panelCount) - index

          switch (options.transition) {
            case 'fade':
              if (index === panelIndex) {
                panel.style.opacity = '1'
                panel.style.visibility = 'visible'
              } else if (index < panelIndex) {
                panel.style.opacity = '0'
                panel.style.visibility = 'hidden'
              } else {
                panel.style.opacity = '0'
                panel.style.visibility = 'hidden'
              }
              break

            case 'slide':
              if (index === panelIndex) {
                panel.style.transform = 'translateY(0)'
                panel.style.opacity = '1'
              } else if (index < panelIndex) {
                panel.style.transform = 'translateY(-100%)'
                panel.style.opacity = '0'
              } else {
                panel.style.transform = 'translateY(100%)'
                panel.style.opacity = '0'
              }
              break

            case 'scale':
              if (index === panelIndex) {
                panel.style.transform = 'scale(1)'
                panel.style.opacity = '1'
              } else {
                panel.style.transform = 'scale(0.8)'
                panel.style.opacity = '0'
              }
              break

            case 'flip':
              if (index === panelIndex) {
                panel.style.transform = 'rotateY(0deg)'
                panel.style.opacity = '1'
              } else if (index < panelIndex) {
                panel.style.transform = 'rotateY(-90deg)'
                panel.style.opacity = '0'
              } else {
                panel.style.transform = 'rotateY(90deg)'
                panel.style.opacity = '0'
              }
              break
          }
        })
      },
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize parallax sections
 * Elements with .scroll-parallax class
 */
function initScrollParallax(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-parallax')

  elements.forEach((element) => {
    const options = getDataAttributes<ScrollParallaxOptions>(element, {
      speed: 0.5,
      direction: 'vertical',
    })

    const parallaxElement = element.querySelector<HTMLElement>('.scroll-parallax-bg') || element

    // Calculate movement amount
    const movement = 100 * options.speed

    gsap.to(parallaxElement, {
      y: options.direction === 'vertical' ? movement : 0,
      x: options.direction === 'horizontal' ? movement : 0,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize horizontal scroll galleries
 * Elements with .scroll-horizontal class
 */
function initScrollHorizontal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-horizontal')

  elements.forEach((element) => {
    const options = getDataAttributes<ScrollHorizontalOptions>(element, {
      speed: 1,
      direction: 'left',
      snap: false,
      snapEase: 'power2.inOut',
      momentum: true,
    })

    const track = element.querySelector<HTMLElement>('.scroll-horizontal-track')
    if (!track) return

    const items = track.querySelectorAll<HTMLElement>('.scroll-horizontal-item')

    // Calculate total scroll width
    const trackWidth = track.scrollWidth
    const containerWidth = element.offsetWidth
    const scrollDistance = trackWidth - containerWidth

    // Set container height to allow for scroll
    const scrollHeight = scrollDistance * options.speed
    element.style.height = `${scrollHeight + window.innerHeight}px`

    // Build snap points if enabled
    let snapConfig: any = false
    if (options.snap && items.length > 0) {
      const itemWidth = items[0].offsetWidth
      const gap = parseInt(getComputedStyle(track).gap || '24', 10)
      const snapPoints: number[] = []

      items.forEach((_, index) => {
        const position = (index * (itemWidth + gap)) / scrollDistance
        snapPoints.push(Math.min(position, 1))
      })

      snapConfig = {
        snapTo: snapPoints,
        duration: { min: 0.2, max: 0.6 },
        delay: 0,
        ease: options.snapEase,
      }
    }

    // Create horizontal scroll animation
    gsap.to(track, {
      x: options.direction === 'left' ? -scrollDistance : scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end: `+=${scrollHeight}`,
        pin: '.scroll-horizontal-wrapper',
        scrub: options.momentum ? 1 : 0.5,
        anticipatePin: 1,
        snap: snapConfig,
        onUpdate: (self: any) => {
          // Add active class to current item
          if (items.length > 0) {
            const currentIndex = Math.round(self.progress * (items.length - 1))
            items.forEach((item, i) => {
              item.classList.toggle('is-active', i === currentIndex)
            })
          }
        },
      },
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize scroll timeline
 * Elements with .scroll-timeline class
 */
function initScrollTimeline(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-timeline')

  elements.forEach((element) => {
    const options = getDataAttributes<ScrollTimelineOptions>(element, {
      animation: 'slide-up',
      stagger: 0.1,
      progressLine: true,
      lineColor: '#000000',
    })

    const items = element.querySelectorAll<HTMLElement>('.scroll-timeline-item')
    const progressLine = element.querySelector<HTMLElement>('.scroll-timeline-progress')

    // Set initial state for items
    items.forEach((item) => {
      gsap.set(item, getInitialState(options.animation))
    })

    // Animate progress line
    if (progressLine && options.progressLine) {
      gsap.to(progressLine, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      })
    }

    // Animate each item as it enters viewport
    items.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(item, {
            ...getFinalState(options.animation),
            duration: 0.8,
            delay: index * options.stagger,
            ease: getGSAPEasing('power3'),
          })

          // Animate the dot
          const dot = item.querySelector('.scroll-timeline-dot')
          if (dot) {
            gsap.to(dot, {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              delay: index * options.stagger,
              ease: 'back.out(2)',
            })
          }
        },
      })
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize scroll-linked color transitions
 * Elements with .scroll-color-change class
 */
function initScrollColorChange(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-color-change')

  elements.forEach((element) => {
    const colorFrom = element.dataset.colorFrom || '#ffffff'
    const colorTo = element.dataset.colorTo || '#000000'
    const bgFrom = element.dataset.bgFrom
    const bgTo = element.dataset.bgTo
    const property = element.dataset.colorProperty || 'color' // 'color', 'background', 'both'

    const tweenVars: gsap.TweenVars = {}

    if (property === 'color' || property === 'both') {
      tweenVars.color = colorTo
      gsap.set(element, { color: colorFrom })
    }

    if (property === 'background' || property === 'both') {
      tweenVars.backgroundColor = bgTo || colorTo
      gsap.set(element, { backgroundColor: bgFrom || colorFrom })
    }

    gsap.to(element, {
      ...tweenVars,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize magnetic cursor effect
 * Elements with .scroll-magnetic class
 */
function initMagneticEffect(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-magnetic')

  elements.forEach((element) => {
    const strength = parseFloat(element.dataset.magneticStrength || '0.3')
    const ease = element.dataset.magneticEase || 'power3.out'

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.6,
        ease: ease,
      })
    })

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      })
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

/**
 * Initialize scroll progress indicator
 * Elements with .scroll-progress class
 */
function initScrollProgress(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scroll-progress')

  elements.forEach((element) => {
    const target = element.dataset.progressTarget // selector for target element, or 'page' for full page
    const direction = element.dataset.progressDirection || 'horizontal' // 'horizontal' or 'vertical'
    const color = element.dataset.progressColor || '#000'

    element.style.backgroundColor = color
    element.style.transformOrigin = direction === 'horizontal' ? 'left center' : 'center top'
    gsap.set(element, {
      scaleX: direction === 'horizontal' ? 0 : 1,
      scaleY: direction === 'vertical' ? 0 : 1,
    })

    const triggerElement = target && target !== 'page'
      ? document.querySelector(target) || document.documentElement
      : document.documentElement

    gsap.to(element, {
      scaleX: direction === 'horizontal' ? 1 : 1,
      scaleY: direction === 'vertical' ? 1 : 1,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    element.setAttribute('data-scroll-initialized', 'true')
  })
}

// =============================================================================
// MAIN INITIALIZATION
// =============================================================================

/**
 * Initialize all scroll animations
 * Call this after DOM is ready
 */
export async function initScrollAnimations(): Promise<void> {
  // Don't run on server
  if (typeof window === 'undefined') return

  // Don't double-initialize
  if (isInitialized) {
    console.warn('ScrollAnimationEngine: Already initialized')
    return
  }

  // Load GSAP
  const gsapLoaded = await loadGSAP()
  if (!gsapLoaded) {
    // Remove hidden states for graceful degradation
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      (el as HTMLElement).style.opacity = '1'
      ;(el as HTMLElement).style.transform = 'none'
    })
    return
  }

  // Initialize all animation types
  initScrollReveal()
  initScrollPin()
  initScrollParallax()
  initScrollHorizontal()
  initScrollTimeline()
  initScrollColorChange()
  initMagneticEffect()
  initScrollProgress()

  isInitialized = true
  console.log('ScrollAnimationEngine: Initialized successfully')
}

/**
 * Refresh ScrollTrigger (call after dynamic content changes)
 */
export function refreshScrollAnimations(): void {
  if (ScrollTrigger) {
    ScrollTrigger.refresh()
  }
}

/**
 * Kill all scroll animations and reset
 */
export function destroyScrollAnimations(): void {
  if (ScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
  }
  isInitialized = false
}

/**
 * Re-initialize animations (useful for SPA navigation)
 */
export async function reinitScrollAnimations(): Promise<void> {
  destroyScrollAnimations()
  await initScrollAnimations()
}

// =============================================================================
// AUTO-INIT ON DOM READY (can be disabled)
// =============================================================================

// Auto-detect if we should initialize
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-blocking init, fallback to setTimeout
  const scheduleInit = (window as any).requestIdleCallback || setTimeout

  if (document.readyState === 'complete') {
    scheduleInit(() => initScrollAnimations())
  } else {
    window.addEventListener('load', () => {
      scheduleInit(() => initScrollAnimations())
    })
  }
}

export default {
  init: initScrollAnimations,
  refresh: refreshScrollAnimations,
  destroy: destroyScrollAnimations,
  reinit: reinitScrollAnimations,
}
