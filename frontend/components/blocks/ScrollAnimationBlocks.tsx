/**
 * Scroll Animation Block Components
 * =============================================================================
 * React components that render scroll animation blocks with data attributes
 * Works with scroll-animation-engine.ts
 *
 * These components output semantic HTML with data attributes that the
 * animation engine reads to apply scroll-driven animations.
 */

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type {
  ScrollRevealImageData,
  ScrollParallaxSectionData,
  PinnedScrollSectionData,
  HorizontalGalleryScrollData,
  ScrollTimelineData,
  AnimationType,
} from '@/lib/scroll-blocks'

// =============================================================================
// SCROLL REVEAL IMAGE
// =============================================================================

interface ScrollRevealImageProps {
  data: ScrollRevealImageData
  className?: string
}

export function ScrollRevealImage({ data, className = '' }: ScrollRevealImageProps) {
  const {
    image,
    alt,
    animation = 'fade',
    duration = 0.8,
    delay = 0,
    easing = 'power3',
    trigger = '75%',
    once = true,
    aspectRatio = 'auto',
  } = data

  const aspectRatioClass = aspectRatio !== 'auto'
    ? `aspect-[${aspectRatio}]`
    : ''

  return (
    <div
      className={`scroll-reveal ${aspectRatioClass} ${className}`}
      data-animation={animation}
      data-duration={duration}
      data-delay={delay}
      data-easing={easing}
      data-trigger={trigger}
      data-once={once}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={alt || 'Scroll reveal image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}

// =============================================================================
// SCROLL PARALLAX SECTION
// =============================================================================

interface ScrollParallaxSectionProps {
  data: ScrollParallaxSectionData
  className?: string
  children?: React.ReactNode
}

export function ScrollParallaxSection({
  data,
  className = '',
  children,
}: ScrollParallaxSectionProps) {
  const {
    backgroundImage,
    overlayColor = 'rgba(0,0,0,0.4)',
    parallaxSpeed = 0.5,
    height = '75vh',
    heading,
    subheading,
    contentAnimation = 'slide-up',
    textAlign = 'center',
  } = data

  return (
    <section
      className={`scroll-parallax ${className}`}
      style={{ minHeight: height }}
      data-speed={parallaxSpeed}
    >
      {/* Parallax Background */}
      <div
        className="scroll-parallax-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div
        className="scroll-parallax-overlay"
        style={{ backgroundColor: overlayColor }}
      />

      {/* Content */}
      <div
        className="scroll-parallax-content scroll-reveal"
        data-animation={contentAnimation}
        style={{ textAlign }}
      >
        {heading && <h2>{heading}</h2>}
        {subheading && <p>{subheading}</p>}
        {children}
      </div>
    </section>
  )
}

// =============================================================================
// PINNED SCROLL SECTION
// =============================================================================

interface PinnedScrollSectionProps {
  data: PinnedScrollSectionData
  className?: string
}

interface Panel {
  heading: string
  text: string
  image?: string
}

export function PinnedScrollSection({ data, className = '' }: PinnedScrollSectionProps) {
  const {
    backgroundColor = '#000000',
    pinDuration = 2,
    panels: panelsJson,
    transitionType = 'fade',
    progressIndicator = true,
  } = data

  // Parse panels from JSON string
  let panels: Panel[] = []
  try {
    panels = typeof panelsJson === 'string' ? JSON.parse(panelsJson) : panelsJson
  } catch {
    panels = []
  }

  if (panels.length === 0) return null

  return (
    <section
      className={`scroll-pin ${className}`}
      style={{ backgroundColor }}
      data-duration={pinDuration}
      data-transition={transitionType}
      data-show-progress={progressIndicator}
    >
      <div className="scroll-pin-wrapper">
        {/* Panels */}
        {panels.map((panel, index) => (
          <div key={index} className="scroll-pin-panel">
            <div className="scroll-pin-panel-content">
              <h3>{panel.heading}</h3>
              <p>{panel.text}</p>
              {panel.image && (
                <Image
                  src={panel.image}
                  alt={panel.heading}
                  width={800}
                  height={500}
                  className="rounded-xl"
                />
              )}
            </div>
          </div>
        ))}

        {/* Progress Bar */}
        {progressIndicator && (
          <div className="scroll-pin-progress-wrapper">
            <div className="scroll-pin-progress" />
          </div>
        )}

        {/* Panel Indicators */}
        <div className="scroll-pin-indicators">
          {panels.map((_, index) => (
            <div
              key={index}
              className={`scroll-pin-indicator ${index === 0 ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// HORIZONTAL GALLERY SCROLL
// =============================================================================

interface HorizontalGalleryScrollProps {
  data: HorizontalGalleryScrollData
  className?: string
}

interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

export function HorizontalGalleryScroll({
  data,
  className = '',
}: HorizontalGalleryScrollProps) {
  const {
    images = [],
    backgroundColor = '#fafafa',
    imageSize = 'medium',
    gap = 24,
    scrollSpeed = 1,
    showCaptions = false,
    direction = 'left',
  } = data

  // Handle both string array and object array
  const normalizedImages: GalleryImage[] = images.map((img: string | GalleryImage) =>
    typeof img === 'string' ? { src: img, alt: '', caption: '' } : img
  )

  if (normalizedImages.length === 0) return null

  return (
    <section
      className={`scroll-horizontal ${className}`}
      style={
        {
          backgroundColor,
          '--gallery-gap': `${gap}px`,
        } as React.CSSProperties
      }
      data-image-size={imageSize}
      data-speed={scrollSpeed}
      data-direction={direction}
    >
      <div className="scroll-horizontal-wrapper">
        <div className="scroll-horizontal-track">
          {normalizedImages.map((image, index) => (
            <div key={index} className="scroll-horizontal-item relative">
              <Image
                src={image.src}
                alt={image.alt || `Gallery image ${index + 1}`}
                width={700}
                height={700}
                className="h-full w-auto object-cover"
              />
              {showCaptions && image.caption && (
                <div className="scroll-horizontal-caption">
                  {image.caption}
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
// SCROLL TIMELINE
// =============================================================================

interface ScrollTimelineBlockProps {
  data: ScrollTimelineData
  className?: string
}

interface TimelineItem {
  date: string
  title: string
  description: string
  image?: string
}

export function ScrollTimelineBlock({
  data,
  className = '',
}: ScrollTimelineBlockProps) {
  const {
    items: itemsJson,
    layout = 'alternating',
    lineColor = '#000000',
    dotColor = '#000000',
    itemAnimation = 'slide-up',
    stagger = 0.1,
    progressLine = true,
  } = data

  // Parse items from JSON string
  let items: TimelineItem[] = []
  try {
    items = typeof itemsJson === 'string' ? JSON.parse(itemsJson) : itemsJson
  } catch {
    items = []
  }

  if (items.length === 0) return null

  return (
    <section
      className={`scroll-timeline ${className}`}
      data-layout={layout}
      data-animation={itemAnimation}
      data-stagger={stagger}
      data-progress-line={progressLine}
      style={
        {
          '--timeline-line-color': lineColor,
          '--timeline-dot-color': dotColor,
        } as React.CSSProperties
      }
    >
      {/* Timeline Line */}
      <div className="scroll-timeline-line">
        {progressLine && <div className="scroll-timeline-progress" />}
      </div>

      {/* Timeline Items */}
      {items.map((item, index) => (
        <div key={index} className="scroll-timeline-item">
          {/* Dot */}
          <div className="scroll-timeline-dot" />

          {/* Content */}
          <div className="scroll-timeline-content">
            <span className="scroll-timeline-date">{item.date}</span>
            <h4 className="scroll-timeline-title">{item.title}</h4>
            <p className="scroll-timeline-description">{item.description}</p>
            {item.image && (
              <div className="scroll-timeline-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

// =============================================================================
// SCROLL REVEAL CONTAINER (for wrapping any content)
// =============================================================================

interface ScrollRevealContainerProps {
  children: React.ReactNode
  animation?: AnimationType
  duration?: number
  delay?: number
  easing?: string
  trigger?: string
  once?: boolean
  stagger?: number
  className?: string
}

export function ScrollRevealContainer({
  children,
  animation = 'fade',
  duration = 0.8,
  delay = 0,
  easing = 'power3',
  trigger = '75%',
  once = true,
  stagger = 0,
  className = '',
}: ScrollRevealContainerProps) {
  return (
    <div
      className={`scroll-reveal ${className}`}
      data-animation={animation}
      data-duration={duration}
      data-delay={delay}
      data-easing={easing}
      data-trigger={trigger}
      data-once={once}
      data-stagger={stagger}
    >
      {children}
    </div>
  )
}

// =============================================================================
// SCROLL REVEAL TEXT (with line-by-line stagger)
// =============================================================================

interface ScrollRevealTextProps {
  children: React.ReactNode
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  animation?: AnimationType
  splitBy?: 'word' | 'line' | 'none'
  stagger?: number
  className?: string
}

export function ScrollRevealText({
  children,
  tag: Tag = 'div',
  animation = 'slide-up',
  splitBy = 'none',
  stagger = 0.05,
  className = '',
}: ScrollRevealTextProps) {
  const textRef = useRef<HTMLElement>(null)

  // If splitting text, we need to wrap each word/line
  const renderContent = () => {
    if (splitBy === 'none' || typeof children !== 'string') {
      return children
    }

    if (splitBy === 'word') {
      return children.split(' ').map((word, index) => (
        <span
          key={index}
          data-stagger-child
          className="inline-block"
          style={{ marginRight: '0.25em' }}
        >
          {word}
        </span>
      ))
    }

    return children
  }

  return (
    <Tag
      ref={textRef as any}
      className={`scroll-reveal ${className}`}
      data-animation={animation}
      data-stagger={stagger}
    >
      {renderContent()}
    </Tag>
  )
}

// =============================================================================
// SCROLL REVEAL GRID (staggered children)
// =============================================================================

interface ScrollRevealGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 6
  gap?: number
  animation?: AnimationType
  stagger?: number
  className?: string
}

export function ScrollRevealGrid({
  children,
  columns = 3,
  gap = 24,
  animation = 'slide-up',
  stagger = 0.1,
  className = '',
}: ScrollRevealGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <div
      className={`scroll-reveal grid ${gridCols[columns]} ${className}`}
      style={{ gap: `${gap}px` }}
      data-animation={animation}
      data-stagger={stagger}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div key={index} data-stagger-child>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  ScrollRevealImage,
  ScrollParallaxSection,
  PinnedScrollSection,
  HorizontalGalleryScroll,
  ScrollTimelineBlock,
  ScrollRevealContainer,
  ScrollRevealText,
  ScrollRevealGrid,
}
