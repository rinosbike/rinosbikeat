'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Award,
  Zap,
  MessageCircle,
  Shield,
  Heart,
  Star,
  Truck,
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Sparkles,
  Trophy,
  Leaf,
  Globe2,
  Palette
} from 'lucide-react'
import { PageBlock } from '@/lib/api'

// Import new self-contained animated block components
import {
  ScrollRevealBlock,
  ParallaxBlock,
  PinnedScrollBlock,
  HorizontalScrollBlock,
  TimelineBlock,
} from './blocks/AnimatedBlocks'

// Icon mapping for feature blocks
const iconMap: Record<string, any> = {
  Award,
  Zap,
  MessageCircle,
  Shield,
  Heart,
  Star,
  Truck,
  Clock,
  Target,
  Users,
  Sparkles,
  Trophy,
  Leaf,
  Globe2,
  Palette
}

// Re-export all block components from the dynamic page
// This makes them reusable across homepage and dynamic pages

export function BlockRenderer({ block }: { block: PageBlock }) {
  const config = block.configuration

  // Skip hidden blocks
  if (!block.is_visible) return null

  switch (block.block_type) {
    case 'hero':
      return <HeroBlock config={config} />
    case 'text':
      return <TextBlock config={config} />
    case 'feature_grid':
      return <FeatureGridBlock config={config} />
    case 'cta':
      return <CTABlock config={config} />
    case 'faq':
      return <FAQBlock config={config} />
    case 'video':
      return <VideoBlock config={config} />
    case 'product_showcase':
      return <ProductShowcaseBlock config={config} />
    case 'image_gallery':
      return <ImageGalleryBlock config={config} />
    case 'spacer':
      return <SpacerBlock config={config} />
    case 'divider':
      return <DividerBlock config={config} />
    case 'custom_html':
      return <CustomHTMLBlock config={config} />
    // Scroll Animation Blocks
    case 'scroll_reveal_image':
      return <ScrollRevealImageBlock config={config} />
    case 'scroll_parallax_section':
      return <ScrollParallaxSectionBlock config={config} />
    case 'pinned_scroll_section':
      return <PinnedScrollSectionBlock config={config} />
    case 'horizontal_gallery_scroll':
      return <HorizontalGalleryScrollBlock config={config} />
    case 'scroll_timeline':
      return <ScrollTimelineBlockRenderer config={config} />
    default:
      return null
  }
}

// Hero Block
function HeroBlock({ config }: { config: Record<string, any> }) {
  const heightClasses: Record<string, string> = {
    small: 'min-h-[300px]',
    medium: 'min-h-[400px]',
    large: 'min-h-[500px]',
    full: 'min-h-screen'
  }

  const alignmentClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  return (
    <div
      className={`relative ${heightClasses[config.height] || heightClasses.large} flex items-center justify-center bg-gray-900`}
    >
      {config.image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.image_url})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: config.overlay_color || '#000000',
              opacity: (config.overlay_opacity || 40) / 100
            }}
          />
        </div>
      )}
      <div className={`relative z-10 max-w-4xl mx-auto px-4 flex flex-col ${alignmentClasses[config.text_alignment] || alignmentClasses.center}`}>
        {config.title && (
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4"
            style={{ color: config.text_color || '#ffffff' }}
          >
            {config.title}
          </h1>
        )}
        {config.subtitle && (
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl opacity-90"
            style={{ color: config.text_color || '#ffffff' }}
          >
            {config.subtitle}
          </p>
        )}
        {config.button_text && config.button_link && (
          <Link
            href={config.button_link}
            className={`inline-block px-8 py-4 font-semibold rounded-xl transition-colors ${
              config.button_style === 'outline'
                ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                : config.button_style === 'dark'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {config.button_text}
          </Link>
        )}
      </div>
    </div>
  )
}

// Text Block
function TextBlock({ config }: { config: Record<string, any> }) {
  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  }

  const textSizeClasses: Record<string, string> = {
    small: 'prose-sm',
    normal: 'prose-base',
    large: 'prose-lg',
    xl: 'prose-xl'
  }

  const paddingClasses: Record<string, string> = {
    none: 'py-0',
    small: 'py-4',
    medium: 'py-8',
    large: 'py-16'
  }

  return (
    <section
      className={`px-4 ${paddingClasses[config.padding] || paddingClasses.medium}`}
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div
        className={`prose ${textSizeClasses[config.text_size] || textSizeClasses.normal} max-w-4xl ${alignmentClasses[config.alignment] || alignmentClasses.left}`}
        style={{ color: config.text_color || 'inherit' }}
        dangerouslySetInnerHTML={{ __html: config.content || '' }}
      />
    </section>
  )
}

// Feature Grid Block
function FeatureGridBlock({ config }: { config: Record<string, any> }) {
  const columns = config.columns || 3
  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }

  const features = config.features || []

  if (features.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 md:py-16 px-4"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {config.title && (
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            {config.title}
          </h2>
        )}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {features.map((feature: any, index: number) => {
            const IconComponent = iconMap[feature.icon] || Award
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// CTA Block
function CTABlock({ config }: { config: Record<string, any> }) {
  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <section
      className="py-12 md:py-16 px-4"
      style={{ backgroundColor: config.background_color || '#f9fafb' }}
    >
      <div className={`max-w-4xl mx-auto ${alignmentClasses[config.alignment] || alignmentClasses.center}`}>
        {config.title && (
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {config.title}
          </h2>
        )}
        {config.description && (
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {config.description}
          </p>
        )}
        {config.button_text && config.button_link && (
          <Link
            href={config.button_link}
            className={`inline-block px-8 py-4 font-semibold rounded-xl transition-colors ${
              config.button_style === 'outline'
                ? 'border-2 border-black text-black hover:bg-black hover:text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {config.button_text}
          </Link>
        )}
      </div>
    </section>
  )
}

// FAQ Block
function FAQBlock({ config }: { config: Record<string, any> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = config.faqs || []

  if (faqs.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 md:py-16 px-4"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-3xl mx-auto">
        {config.title && (
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            {config.title}
          </h2>
        )}
        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Video Block
function VideoBlock({ config }: { config: Record<string, any> }) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()
        : new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const aspectRatioClasses: Record<string, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]'
  }

  const layout = config.layout || 'horizontal'

  if (layout === 'horizontal') {
    return (
      <section
        className="py-6 md:py-8 px-4"
        style={{ backgroundColor: config.background_color || 'transparent' }}
      >
        <div className="mx-auto" style={{ maxWidth: config.max_width || '700px' }}>
          {config.title && (
            <h2
              className="text-xl md:text-2xl font-black text-center mb-4"
              style={{ color: config.text_color || '#000000' }}
            >
              {config.title}
            </h2>
          )}
          {config.video_url && (
            <div className={`relative ${aspectRatioClasses[config.aspect_ratio] || 'aspect-video'} rounded-xl overflow-hidden bg-black`}>
              <iframe
                src={getEmbedUrl(config.video_url)}
                className="absolute inset-0 w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-6 md:py-10 px-4"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col ${layout === 'vertical_right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 lg:gap-10`}>
          <div className="w-full lg:w-2/5 flex justify-center">
            <div style={{ maxWidth: config.max_width || '320px', width: '100%' }}>
              {config.video_url && (
                <div className={`relative ${aspectRatioClasses[config.aspect_ratio] || 'aspect-video'} rounded-xl overflow-hidden bg-black`}>
                  <iframe
                    src={getEmbedUrl(config.video_url)}
                    className="absolute inset-0 w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-3/5 space-y-4">
            {config.title && (
              <h2
                className="text-2xl md:text-3xl font-black"
                style={{ color: config.text_color || '#000000' }}
              >
                {config.title}
              </h2>
            )}
            {config.description && (
              <p className="text-base text-gray-600">
                {config.description}
              </p>
            )}
            {config.features && config.features.length > 0 && (
              <ul className="space-y-2">
                {config.features.map((feature: string, index: number) => (
                  feature && (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  )
                ))}
              </ul>
            )}
            {config.button_text && config.button_link && (
              <Link
                href={config.button_link}
                className="inline-block px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                {config.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Product Showcase Block
function ProductShowcaseBlock({ config }: { config: Record<string, any> }) {
  const columns = config.columns || 4
  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  }

  const cardStyleClasses: Record<string, string> = {
    default: '',
    minimal: 'shadow-none',
    bordered: 'border border-gray-200'
  }

  const products = config.products || []

  if (products.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 md:py-16 px-4"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {config.title && (
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
            {config.title}
          </h2>
        )}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {products.map((product: any) => (
            <Link
              key={product.articlenr}
              href={`/produkte/${product.articlenr}`}
              className={`group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all ${cardStyleClasses[config.card_style] || ''}`}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {(product.image || product.primary_image) ? (
                  <img
                    src={product.image || product.primary_image}
                    alt={product.name || product.articlename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Kein Bild
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                  {product.name || product.articlename}
                </h3>
                {config.show_price !== false && product.price && (
                  <p className="mt-2 text-lg font-bold text-black">
                    {product.price.toFixed(2)} EUR
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Image Gallery Block
function ImageGalleryBlock({ config }: { config: Record<string, any> }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const columns = config.columns || 3
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  }
  const gapClasses: Record<string, string> = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  }
  const aspectRatioClasses: Record<string, string> = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-video'
  }
  const roundedClasses: Record<string, string> = {
    none: 'rounded-none',
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  }

  const images = config.images || []
  const enableLightbox = config.enable_lightbox !== false

  if (images.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 md:py-16 px-4"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {config.title && (
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
            {config.title}
          </h2>
        )}
        <div className={`grid ${gridCols[columns]} ${gapClasses[config.gap] || gapClasses.medium}`}>
          {images.map((image: any, index: number) => (
            <div
              key={index}
              className={`${aspectRatioClasses[config.aspect_ratio] || aspectRatioClasses.square} ${roundedClasses[config.rounded] || roundedClasses.medium} overflow-hidden ${enableLightbox ? 'cursor-pointer' : ''}`}
              onClick={() => enableLightbox && setLightboxIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt || ''}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {image.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {enableLightbox && lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold"
            >
              &times;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1)
              }}
              className="absolute left-4 text-white hover:text-gray-300 text-4xl font-bold"
            >
              &#8249;
            </button>
            <img
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0)
              }}
              className="absolute right-4 text-white hover:text-gray-300 text-4xl font-bold"
            >
              &#8250;
            </button>
            {images[lightboxIndex]?.caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {images[lightboxIndex].caption}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// Spacer Block
function SpacerBlock({ config }: { config: Record<string, any> }) {
  const heights: Record<string, number> = {
    small: 24,
    medium: 48,
    large: 96,
    xl: 144
  }
  const height = config.height === 'custom'
    ? config.custom_height || 48
    : heights[config.height] || heights.medium

  return (
    <div style={{ height: `${height}px` }}>
      {config.show_line && (
        <div className="h-full flex items-center px-4">
          <hr className="w-full border-gray-200" />
        </div>
      )}
    </div>
  )
}

// Divider Block
function DividerBlock({ config }: { config: Record<string, any> }) {
  const widthClasses: Record<string, string> = {
    full: 'w-full',
    medium: 'w-2/3 mx-auto',
    small: 'w-1/3 mx-auto'
  }

  return (
    <div className="py-4 px-4">
      <hr
        className={`${widthClasses[config.width] || widthClasses.full}`}
        style={{
          borderStyle: config.style || 'solid',
          borderColor: config.color || '#e5e7eb',
          borderWidth: `${config.thickness || 1}px`
        }}
      />
    </div>
  )
}

// Custom HTML Block
function CustomHTMLBlock({ config }: { config: Record<string, any> }) {
  return (
    <div
      className="custom-html-block"
      style={{ backgroundColor: config.background_color || 'transparent' }}
      dangerouslySetInnerHTML={{ __html: config.html || '' }}
    />
  )
}

// =============================================================================
// SCROLL ANIMATION BLOCKS (using self-contained animated components)
// =============================================================================

// Scroll Reveal Image Block
function ScrollRevealImageBlock({ config }: { config: Record<string, any> }) {
  return <ScrollRevealBlock config={config} />
}

// Scroll Parallax Section Block
function ScrollParallaxSectionBlock({ config }: { config: Record<string, any> }) {
  return <ParallaxBlock config={config} />
}

// Pinned Scroll Section Block
function PinnedScrollSectionBlock({ config }: { config: Record<string, any> }) {
  return <PinnedScrollBlock config={config} />
}

// Horizontal Gallery Scroll Block
function HorizontalGalleryScrollBlock({ config }: { config: Record<string, any> }) {
  return <HorizontalScrollBlock config={config} />
}

// Scroll Timeline Block
function ScrollTimelineBlockRenderer({ config }: { config: Record<string, any> }) {
  return <TimelineBlock config={config} />
}
