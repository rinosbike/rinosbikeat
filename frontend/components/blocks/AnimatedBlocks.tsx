/**
 * Animated Block Components
 * =============================================================================
 * Self-contained animated block components using GSAP + ScrollTrigger
 * Each component initializes its own animations - no external engine needed
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Dynamically import GSAP to avoid SSR issues
let gsap: any = null
let ScrollTrigger: any = null

async function loadGSAP() {
  if (typeof window === 'undefined') return false

  if (!gsap) {
    const gsapModule = await import('gsap')
    gsap = gsapModule.gsap || gsapModule.default

    const scrollTriggerModule = await import('gsap/ScrollTrigger')
    ScrollTrigger = scrollTriggerModule.ScrollTrigger

    gsap.registerPlugin(ScrollTrigger)
  }
  return true
}

// =============================================================================
// SCROLL REVEAL BLOCK
// =============================================================================

interface ScrollRevealBlockProps {
  config: {
    image?: string
    alt?: string
    animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'rotate' | 'blur'
    duration?: number
    delay?: number
    easing?: string
    trigger?: string
    once?: boolean
    aspectRatio?: string
  }
}

export function ScrollRevealBlock({ config }: ScrollRevealBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const {
    image,
    alt = '',
    animation = 'fade',
    duration = 0.8,
    delay = 0,
    easing = 'power3.out',
    trigger = 'top 80%',
    once = true,
    aspectRatio = '16/9',
  } = config

  useEffect(() => {
    let ctx: any

    async function initAnimation() {
      const loaded = await loadGSAP()
      if (!loaded || !containerRef.current) return

      setIsLoaded(true)

      // Get initial animation state based on animation type
      const getFromState = () => {
        switch (animation) {
          case 'fade':
            return { opacity: 0 }
          case 'slide-up':
            return { opacity: 0, y: 60 }
          case 'slide-down':
            return { opacity: 0, y: -60 }
          case 'slide-left':
            return { opacity: 0, x: 60 }
          case 'slide-right':
            return { opacity: 0, x: -60 }
          case 'zoom':
            return { opacity: 0, scale: 0.8 }
          case 'rotate':
            return { opacity: 0, rotation: 15, scale: 0.9 }
          case 'blur':
            return { opacity: 0, filter: 'blur(10px)' }
          default:
            return { opacity: 0 }
        }
      }

      const getToState = () => {
        const base: any = { opacity: 1 }
        switch (animation) {
          case 'slide-up':
          case 'slide-down':
            return { ...base, y: 0 }
          case 'slide-left':
          case 'slide-right':
            return { ...base, x: 0 }
          case 'zoom':
            return { ...base, scale: 1 }
          case 'rotate':
            return { ...base, rotation: 0, scale: 1 }
          case 'blur':
            return { ...base, filter: 'blur(0px)' }
          default:
            return base
        }
      }

      ctx = gsap.context(() => {
        // Set initial state
        gsap.set(containerRef.current, getFromState())

        // Create scroll-triggered animation
        gsap.to(containerRef.current, {
          ...getToState(),
          duration,
          delay,
          ease: easing,
          scrollTrigger: {
            trigger: containerRef.current,
            start: trigger,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        })
      }, containerRef)
    }

    initAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [animation, duration, delay, easing, trigger, once])

  if (!image) return null

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            aspectRatio,
            opacity: isLoaded ? undefined : 0,
          }}
        >
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// PARALLAX SECTION BLOCK
// =============================================================================

interface ParallaxBlockProps {
  config: {
    backgroundImage?: string
    overlayColor?: string
    parallaxSpeed?: number
    height?: string
    heading?: string
    subheading?: string
    contentAnimation?: string
    textAlign?: 'left' | 'center' | 'right'
    textColor?: string
  }
}

export function ParallaxBlock({ config }: ParallaxBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const {
    backgroundImage,
    overlayColor = 'rgba(0,0,0,0.4)',
    parallaxSpeed = 0.5,
    height = '75vh',
    heading,
    subheading,
    contentAnimation = 'slide-up',
    textAlign = 'center',
    textColor = '#ffffff',
  } = config

  useEffect(() => {
    let ctx: any

    async function initAnimation() {
      const loaded = await loadGSAP()
      if (!loaded || !sectionRef.current) return

      setIsLoaded(true)

      ctx = gsap.context(() => {
        // Parallax effect on background
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            yPercent: parallaxSpeed * 30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Content reveal animation
        if (contentRef.current) {
          const fromState: any = { opacity: 0 }
          const toState: any = { opacity: 1, duration: 1, ease: 'power3.out' }

          switch (contentAnimation) {
            case 'slide-up':
              fromState.y = 50
              toState.y = 0
              break
            case 'slide-down':
              fromState.y = -50
              toState.y = 0
              break
            case 'zoom':
              fromState.scale = 0.9
              toState.scale = 1
              break
          }

          gsap.set(contentRef.current, fromState)
          gsap.to(contentRef.current, {
            ...toState,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          })
        }
      }, sectionRef)
    }

    initAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [parallaxSpeed, contentAnimation])

  if (!backgroundImage) return null

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: height }}
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto px-4 py-16"
        style={{
          textAlign,
          opacity: isLoaded ? undefined : 0,
        }}
      >
        {heading && (
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            style={{ color: textColor }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            className="text-xl md:text-2xl opacity-90"
            style={{ color: textColor }}
          >
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}

// =============================================================================
// PINNED SCROLL BLOCK
// =============================================================================

interface Panel {
  heading: string
  text: string
  image?: string
}

interface PinnedScrollBlockProps {
  config: {
    backgroundColor?: string
    textColor?: string
    pinDuration?: number
    panels?: string | Panel[]
    transitionType?: 'fade' | 'slide' | 'scale' | 'flip'
    progressIndicator?: boolean
  }
}

export function PinnedScrollBlock({ config }: PinnedScrollBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const {
    backgroundColor = '#000000',
    textColor = '#ffffff',
    pinDuration = 2,
    panels: panelsJson,
    transitionType = 'fade',
    progressIndicator = true,
  } = config

  // Parse panels
  let panels: Panel[] = []
  try {
    panels = typeof panelsJson === 'string' ? JSON.parse(panelsJson) : (panelsJson || [])
  } catch {
    panels = []
  }

  useEffect(() => {
    let ctx: any

    async function initAnimation() {
      const loaded = await loadGSAP()
      if (!loaded || !sectionRef.current || panels.length === 0) return

      ctx = gsap.context(() => {
        const totalPanels = panels.length
        const scrollDistance = (pinDuration * 100) + '%'

        // Create pin
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self: any) => {
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * totalPanels),
              totalPanels - 1
            )
            setActiveIndex(newIndex)

            // Update progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${progress * 100}%`
            }

            // Animate panels based on progress
            panelRefs.current.forEach((panel, i) => {
              if (!panel) return

              const panelProgress = (progress * totalPanels) - i
              let opacity = 0
              let transform = ''

              if (panelProgress >= 0 && panelProgress < 1) {
                opacity = 1

                switch (transitionType) {
                  case 'slide':
                    transform = `translateY(${(1 - panelProgress) * 30}px)`
                    break
                  case 'scale':
                    const scale = 0.9 + (panelProgress * 0.1)
                    transform = `scale(${scale})`
                    break
                  case 'flip':
                    const rotation = (1 - panelProgress) * 10
                    transform = `rotateX(${rotation}deg)`
                    break
                  default:
                    opacity = Math.min(panelProgress * 2, 1)
                }
              } else if (panelProgress >= 1 && i === totalPanels - 1) {
                opacity = 1
              }

              panel.style.opacity = String(opacity)
              panel.style.transform = transform
            })
          },
        })
      }, sectionRef)
    }

    initAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [panels.length, pinDuration, transitionType])

  if (panels.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div ref={wrapperRef} className="relative w-full max-w-4xl mx-auto px-4">
        {/* Panels */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          {panels.map((panel, index) => (
            <div
              key={index}
              ref={(el) => { panelRefs.current[index] = el }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity: index === 0 ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {panel.image && (
                <div className="relative w-full max-w-md aspect-video mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={panel.image}
                    alt={panel.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3
                className="text-3xl md:text-4xl lg:text-5xl font-black mb-4"
                style={{ color: textColor }}
              >
                {panel.heading}
              </h3>
              <p
                className="text-lg md:text-xl opacity-80 max-w-lg"
                style={{ color: textColor }}
              >
                {panel.text}
              </p>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        {progressIndicator && (
          <div className="absolute bottom-8 left-0 right-0">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-white rounded-full"
                style={{ width: '0%', transition: 'none' }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {panels.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= activeIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// =============================================================================
// HORIZONTAL SCROLL GALLERY BLOCK
// =============================================================================

interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

interface HorizontalScrollBlockProps {
  config: {
    images?: (string | GalleryImage)[]
    backgroundColor?: string
    imageSize?: 'small' | 'medium' | 'large' | 'full'
    gap?: number
    scrollSpeed?: number
    showCaptions?: boolean
    direction?: 'left' | 'right'
  }
}

export function HorizontalScrollBlock({ config }: HorizontalScrollBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const {
    images = [],
    backgroundColor = '#fafafa',
    imageSize = 'medium',
    gap = 24,
    scrollSpeed = 1,
    showCaptions = false,
    direction = 'left',
  } = config

  // Normalize images
  const normalizedImages: GalleryImage[] = images.map((img) =>
    typeof img === 'string' ? { src: img, alt: '', caption: '' } : img
  )

  const imageSizeMap = {
    small: 300,
    medium: 500,
    large: 700,
    full: '100vh',
  }

  useEffect(() => {
    let ctx: any

    async function initAnimation() {
      const loaded = await loadGSAP()
      if (!loaded || !sectionRef.current || !trackRef.current) return

      const track = trackRef.current
      const trackWidth = track.scrollWidth
      const viewportWidth = window.innerWidth

      ctx = gsap.context(() => {
        // Pin section and scroll track horizontally
        const scrollAmount = trackWidth - viewportWidth
        const xValue = direction === 'left' ? -scrollAmount : scrollAmount

        gsap.to(track, {
          x: xValue,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollAmount * scrollSpeed}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }, sectionRef)
    }

    initAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [normalizedImages.length, direction, scrollSpeed])

  if (normalizedImages.length === 0) return null

  const imageHeight = typeof imageSizeMap[imageSize] === 'number'
    ? `${imageSizeMap[imageSize]}px`
    : imageSizeMap[imageSize]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="h-screen flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center"
          style={{
            gap: `${gap}px`,
            paddingLeft: '5vw',
            paddingRight: '5vw',
          }}
        >
          {normalizedImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden"
              style={{
                height: imageHeight,
                aspectRatio: '4/3',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 50vw"
              />
              {showCaptions && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// TIMELINE BLOCK
// =============================================================================

interface TimelineItem {
  date: string
  title: string
  description: string
  image?: string
}

interface TimelineBlockProps {
  config: {
    title?: string
    items?: string | TimelineItem[]
    layout?: 'alternating' | 'left' | 'right' | 'center'
    lineColor?: string
    dotColor?: string
    itemAnimation?: string
    stagger?: number
    progressLine?: boolean
    backgroundColor?: string
  }
}

export function TimelineBlock({ config }: TimelineBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressLineRef = useRef<HTMLDivElement>(null)

  const {
    title,
    items: itemsJson,
    layout = 'alternating',
    lineColor = '#000000',
    dotColor = '#000000',
    itemAnimation = 'slide-up',
    stagger = 0.1,
    progressLine = true,
    backgroundColor = 'transparent',
  } = config

  // Parse items
  let items: TimelineItem[] = []
  try {
    items = typeof itemsJson === 'string' ? JSON.parse(itemsJson) : (itemsJson || [])
  } catch {
    items = []
  }

  useEffect(() => {
    let ctx: any

    async function initAnimation() {
      const loaded = await loadGSAP()
      if (!loaded || !sectionRef.current || items.length === 0) return

      ctx = gsap.context(() => {
        // Animate progress line
        if (progressLine && progressLineRef.current) {
          gsap.fromTo(
            progressLineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 0.5,
              },
            }
          )
        }

        // Animate each item
        itemRefs.current.forEach((item, index) => {
          if (!item) return

          const fromState: any = { opacity: 0 }
          const toState: any = { opacity: 1, duration: 0.8, ease: 'power3.out' }

          switch (itemAnimation) {
            case 'slide-up':
              fromState.y = 40
              toState.y = 0
              break
            case 'slide-left':
              fromState.x = layout === 'right' ? -40 : 40
              toState.x = 0
              break
            case 'slide-right':
              fromState.x = layout === 'left' ? 40 : -40
              toState.x = 0
              break
            case 'zoom':
              fromState.scale = 0.9
              toState.scale = 1
              break
          }

          gsap.set(item, fromState)
          gsap.to(item, {
            ...toState,
            delay: index * stagger,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        })
      }, sectionRef)
    }

    initAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [items.length, itemAnimation, stagger, progressLine, layout])

  if (items.length === 0) return null

  const getItemAlignment = (index: number) => {
    switch (layout) {
      case 'left':
        return 'pl-12 md:pl-16'
      case 'right':
        return 'pr-12 md:pr-16 text-right'
      case 'center':
        return 'px-4 text-center'
      case 'alternating':
      default:
        return index % 2 === 0
          ? 'md:pr-1/2 md:text-right md:pr-12'
          : 'md:pl-1/2 md:text-left md:pl-12'
    }
  }

  const getDotPosition = (index: number) => {
    switch (layout) {
      case 'left':
        return 'left-0'
      case 'right':
        return 'right-0'
      case 'center':
        return 'left-1/2 -translate-x-1/2'
      case 'alternating':
      default:
        return 'left-1/2 -translate-x-1/2'
    }
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Timeline Line */}
          <div
            className={`absolute h-full w-0.5 ${
              layout === 'left' ? 'left-0' :
              layout === 'right' ? 'right-0' :
              'left-1/2 -translate-x-1/2'
            }`}
            style={{ backgroundColor: `${lineColor}20` }}
          >
            {progressLine && (
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 w-full origin-top"
                style={{
                  backgroundColor: lineColor,
                  height: '100%',
                  transformOrigin: 'top',
                }}
              />
            )}
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => { itemRefs.current[index] = el }}
                className={`relative ${getItemAlignment(index)}`}
              >
                {/* Dot */}
                <div
                  className={`absolute top-0 ${getDotPosition(index)} w-4 h-4 rounded-full border-4 border-white`}
                  style={{ backgroundColor: dotColor }}
                />

                {/* Content */}
                <div className="pb-8">
                  <span
                    className="inline-block text-sm font-bold mb-2 px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${dotColor}15`,
                      color: dotColor,
                    }}
                  >
                    {item.date}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                  {item.image && (
                    <div className="relative mt-4 rounded-xl overflow-hidden aspect-video max-w-sm">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  ScrollRevealBlock,
  ParallaxBlock,
  PinnedScrollBlock,
  HorizontalScrollBlock,
  TimelineBlock,
}
