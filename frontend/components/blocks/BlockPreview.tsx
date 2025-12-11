'use client'

import { useState } from 'react'
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
  Palette,
  ArrowRight,
  Play,
  Layers,
  Pin,
  GalleryHorizontal,
  Timer
} from 'lucide-react'

// Import scroll animation components
import {
  ScrollRevealImage,
  ScrollParallaxSection,
  PinnedScrollSection,
  HorizontalGalleryScroll,
  ScrollTimelineBlock,
} from './ScrollAnimationBlocks'

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

interface BlockPreviewProps {
  blockType: string
  config: Record<string, any>
  isVisible?: boolean
  scale?: number
}

export function BlockPreview({ blockType, config, isVisible = true, scale = 1 }: BlockPreviewProps) {
  if (!isVisible) return null

  switch (blockType) {
    case 'hero':
      return <HeroPreview config={config} />
    case 'text':
      return <TextPreview config={config} />
    case 'feature_grid':
      return <FeatureGridPreview config={config} />
    case 'cta':
      return <CTAPreview config={config} />
    case 'faq':
      return <FAQPreview config={config} />
    case 'video':
      return <VideoPreview config={config} />
    case 'product_showcase':
      return <ProductShowcasePreview config={config} />
    case 'image_gallery':
      return <ImageGalleryPreview config={config} />
    case 'spacer':
      return <SpacerPreview config={config} />
    case 'divider':
      return <DividerPreview config={config} />
    case 'custom_html':
      return <CustomHTMLPreview config={config} />
    // Scroll Animation Blocks
    case 'scroll_reveal_image':
      return <ScrollRevealImagePreview config={config} />
    case 'scroll_parallax_section':
      return <ScrollParallaxSectionPreview config={config} />
    case 'pinned_scroll_section':
      return <PinnedScrollSectionPreview config={config} />
    case 'horizontal_gallery_scroll':
      return <HorizontalGalleryScrollPreview config={config} />
    case 'scroll_timeline':
      return <ScrollTimelinePreview config={config} />
    default:
      return (
        <div className="p-8 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-xl">
          Unbekannter Block: {blockType}
        </div>
      )
  }
}

// Hero Block Preview - Premium Design
function HeroPreview({ config }: { config: Record<string, any> }) {
  const heightClasses: Record<string, string> = {
    small: 'min-h-[220px]',
    medium: 'min-h-[320px]',
    large: 'min-h-[420px]',
    full: 'min-h-[520px]'
  }

  const alignmentClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  return (
    <div
      className={`relative ${heightClasses[config.height] || heightClasses.large} flex items-center justify-center overflow-hidden rounded-2xl`}
    >
      {config.image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.image_url})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,${(config.overlay_opacity || 40) / 100 * 0.5}), rgba(0,0,0,0.2))`
            }}
          />
        </div>
      )}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 flex flex-col ${alignmentClasses[config.text_alignment] || alignmentClasses.center}`}>
        {config.title && (
          <h1
            className="text-display-sm md:text-display font-bold tracking-tight mb-3"
            style={{ color: config.text_color || '#ffffff' }}
          >
            {config.title}
          </h1>
        )}
        {config.subtitle && (
          <p
            className="text-body-lg mb-6 max-w-xl opacity-90"
            style={{ color: config.text_color || '#ffffff' }}
          >
            {config.subtitle}
          </p>
        )}
        {config.button_text && config.button_link && (
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium rounded-full transition-all duration-300 ${
              config.button_style === 'outline'
                ? 'border-2 border-white text-white hover:bg-white/10'
                : config.button_style === 'dark'
                ? 'bg-rinos-dark text-white hover:bg-black'
                : 'bg-white text-rinos-dark hover:bg-rinos-bg-tertiary'
            }`}
          >
            {config.button_text}
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  )
}

// Text Block Preview - Premium Design
function TextPreview({ config }: { config: Record<string, any> }) {
  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  }

  const paddingClasses: Record<string, string> = {
    none: 'py-0',
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12',
    xl: 'py-16',
    default: 'py-8'
  }

  return (
    <div
      className={`${paddingClasses[config.padding_top] || paddingClasses.default} px-6 rounded-2xl`}
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div
        className={`prose prose-lg max-w-none ${alignmentClasses[config.alignment] || ''}`}
        style={{ maxWidth: config.max_width || '720px' }}
        dangerouslySetInnerHTML={{ __html: config.content || '<p class="text-rinos-text-secondary">Text eingeben...</p>' }}
      />
    </div>
  )
}

// Feature Grid Preview - Premium Design
function FeatureGridPreview({ config }: { config: Record<string, any> }) {
  const columns = config.columns || 3
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <section
      className="py-12 px-6 rounded-2xl"
      style={{ backgroundColor: config.background_color || '#fafafa' }}
    >
      <div className="max-w-full">
        {config.title && (
          <h2 className="text-headline font-semibold text-center mb-3 text-rinos-dark">
            {config.title}
          </h2>
        )}
        {config.subtitle && (
          <p className="text-body text-rinos-text-secondary text-center mb-10 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        )}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {(config.features || []).map((feature: any, index: number) => {
            const Icon = iconMap[feature.icon] || Star
            return (
              <div key={index} className="text-center group">
                <div className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                  config.icon_style === 'circle' ? 'rounded-full' :
                  config.icon_style === 'plain' ? 'bg-transparent' : 'rounded-2xl'
                } ${config.icon_style === 'plain' ? '' : 'bg-rinos-dark'}`}>
                  <Icon className={`h-6 w-6 ${config.icon_style === 'plain' ? 'text-rinos-dark' : 'text-white'}`} />
                </div>
                <h3 className="text-title font-semibold mb-2 text-rinos-dark">{feature.title}</h3>
                <p className="text-body-sm text-rinos-text-secondary">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// CTA Preview - Premium Design
function CTAPreview({ config }: { config: Record<string, any> }) {
  return (
    <section
      className="py-16 px-6 rounded-2xl"
      style={{
        backgroundColor: config.background_color || '#1d1d1f',
        color: config.text_color || '#ffffff'
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {config.title && (
          <h2 className="text-headline font-semibold mb-4">
            {config.title}
          </h2>
        )}
        {config.description && (
          <p className="text-body-lg mb-8 opacity-80">
            {config.description}
          </p>
        )}
        {config.button_text && config.button_link && (
          <span
            className="inline-flex items-center gap-2 px-8 py-4 text-body font-medium rounded-full transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: config.button_color || '#ffffff',
              color: config.background_color || '#1d1d1f'
            }}
          >
            {config.button_text}
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </section>
  )
}

// FAQ Preview - Premium Design
function FAQPreview({ config }: { config: Record<string, any> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isList = config.style === 'list'

  return (
    <section
      className="py-12 px-6 rounded-2xl"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-3xl mx-auto">
        {config.title && (
          <h2 className="text-headline font-semibold text-center mb-10 text-rinos-dark">
            {config.title}
          </h2>
        )}
        <div className="space-y-3">
          {(config.items || []).map((item: any, index: number) => (
            <div key={index} className="bg-white border border-rinos-border-light rounded-xl overflow-hidden transition-all duration-300 hover:border-rinos-border">
              {isList ? (
                <div className="p-5">
                  <h3 className="font-semibold text-body mb-2 text-rinos-dark">{item.question}</h3>
                  <p className="text-body-sm text-rinos-text-secondary">{item.answer}</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-rinos-bg-secondary transition-colors"
                  >
                    <span className="font-semibold text-body text-rinos-dark">{item.question}</span>
                    <div className={`w-8 h-8 rounded-full bg-rinos-bg-secondary flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="h-4 w-4 text-rinos-text-secondary" />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-5">
                      <p className="text-body-sm text-rinos-text-secondary">{item.answer}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Video Preview - Premium Design
function VideoPreview({ config }: { config: Record<string, any> }) {
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
        className="py-8 px-6"
        style={{ backgroundColor: config.background_color || 'transparent' }}
      >
        <div className="mx-auto max-w-4xl">
          {config.title && (
            <h2 className="text-headline font-semibold text-center mb-6" style={{ color: config.text_color || '#1d1d1f' }}>
              {config.title}
            </h2>
          )}
          <div className={`relative ${aspectRatioClasses[config.aspect_ratio] || 'aspect-video'} rounded-2xl overflow-hidden bg-rinos-dark group cursor-pointer`}>
            {config.video_url ? (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Play className="w-8 h-8 ml-1" fill="white" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-rinos-text-secondary bg-rinos-bg-secondary">
                Video URL eingeben
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Vertical layouts
  return (
    <section
      className="py-8 px-6"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className={`flex ${layout === 'vertical_right' ? 'flex-row-reverse' : 'flex-row'} items-center gap-8`}>
        <div className="w-1/3 flex-shrink-0">
          <div className={`relative ${aspectRatioClasses[config.aspect_ratio] || 'aspect-[9/16]'} rounded-2xl overflow-hidden bg-rinos-dark group cursor-pointer`}>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-6 h-6 ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0" style={{ color: config.text_color || '#1d1d1f' }}>
          {config.subtitle && (
            <p className="text-overline uppercase tracking-widest opacity-60 mb-2">
              {config.subtitle}
            </p>
          )}
          {config.title && (
            <h2 className="text-headline font-semibold mb-3">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="text-body text-rinos-text-secondary mb-6">
              {config.description}
            </p>
          )}
          {config.button_text && (
            <span className="btn btn-primary inline-flex items-center gap-2">
              {config.button_text}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

// Product Showcase Preview - Premium Design
function ProductShowcasePreview({ config }: { config: Record<string, any> }) {
  const columns = config.columns || 4
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  const products = config.products || []

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <p className="text-body">Keine Produkte ausgewählt</p>
        <p className="text-body-sm mt-1 opacity-60">Fügen Sie Produkte über den Editor hinzu</p>
      </div>
    )
  }

  return (
    <section
      className="py-12 px-6 rounded-2xl"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-full">
        {config.title && (
          <h2 className="text-headline font-semibold text-center mb-8 text-rinos-dark">
            {config.title}
          </h2>
        )}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {products.slice(0, 4).map((product: any) => (
            <div
              key={product.articlenr}
              className="bg-white rounded-2xl overflow-hidden border border-rinos-border-light transition-all duration-300 hover:shadow-soft hover:-translate-y-1"
            >
              <div className="aspect-square bg-rinos-bg-secondary overflow-hidden">
                {(product.image || product.primary_image) ? (
                  <img
                    src={product.image || product.primary_image}
                    alt={product.name || product.articlename}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rinos-text-secondary/30">
                    Kein Bild
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-body text-rinos-dark line-clamp-2 mb-2">
                  {product.name || product.articlename}
                </h3>
                {config.show_price !== false && product.price && (
                  <p className="text-title font-semibold text-rinos-dark">
                    €{product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Image Gallery Preview - Premium Design
function ImageGalleryPreview({ config }: { config: Record<string, any> }) {
  const columns = config.columns || 3
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }
  const gapClasses: Record<string, string> = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6'
  }
  const aspectRatioClasses: Record<string, string> = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-video'
  }
  const roundedClasses: Record<string, string> = {
    none: 'rounded-none',
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-2xl'
  }

  const images = config.images || []

  if (images.length === 0) {
    return (
      <div className="py-12 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <p className="text-body">Keine Bilder</p>
        <p className="text-body-sm mt-1 opacity-60">Fügen Sie Bilder über den Editor hinzu</p>
      </div>
    )
  }

  return (
    <section
      className="py-12 px-6 rounded-2xl"
      style={{ backgroundColor: config.background_color || 'transparent' }}
    >
      <div className="max-w-full">
        {config.title && (
          <h2 className="text-headline font-semibold text-center mb-8 text-rinos-dark">
            {config.title}
          </h2>
        )}
        <div className={`grid ${gridCols[columns]} ${gapClasses[config.gap] || gapClasses.medium}`}>
          {images.slice(0, 6).map((image: any, index: number) => (
            <div
              key={index}
              className={`relative ${aspectRatioClasses[config.aspect_ratio] || 'aspect-square'} ${roundedClasses[config.rounded] || 'rounded-xl'} overflow-hidden bg-rinos-bg-secondary group`}
            >
              <img
                src={image.url}
                alt={image.alt || ''}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-body-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Spacer Preview
function SpacerPreview({ config }: { config: Record<string, any> }) {
  const heights: Record<string, number> = {
    small: 32,
    medium: 64,
    large: 96,
    xl: 128
  }
  const height = config.height === 'custom'
    ? Math.min(config.custom_height || 64, 200)
    : Math.min(heights[config.height] || heights.medium, 200)

  return (
    <div style={{ height: `${height}px` }} className="bg-rinos-bg-secondary/50 border-y border-dashed border-rinos-border rounded-lg">
      <div className="h-full flex items-center justify-center text-rinos-text-secondary text-caption">
        Abstand: {height}px
      </div>
    </div>
  )
}

// Divider Preview
function DividerPreview({ config }: { config: Record<string, any> }) {
  const widthClasses: Record<string, string> = {
    quarter: 'max-w-[25%]',
    half: 'max-w-[50%]',
    three_quarters: 'max-w-[75%]',
    full: 'max-w-full'
  }

  const styleClasses: Record<string, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }

  return (
    <div className="py-8 px-6">
      <hr
        className={`${widthClasses[config.width] || 'max-w-full'} mx-auto border-t-2 ${styleClasses[config.style] || 'border-solid'}`}
        style={{ borderColor: config.color || '#e8e8ed' }}
      />
    </div>
  )
}

// Custom HTML Preview
function CustomHTMLPreview({ config }: { config: Record<string, any> }) {
  if (!config.html) {
    return (
      <div className="py-12 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <p className="text-body">Custom HTML</p>
        <p className="text-body-sm mt-1 opacity-60">HTML Code eingeben</p>
      </div>
    )
  }

  return (
    <div
      className="custom-html-block rounded-2xl overflow-hidden"
      dangerouslySetInnerHTML={{ __html: config.html }}
    />
  )
}

// =============================================================================
// SCROLL ANIMATION BLOCK PREVIEWS
// =============================================================================

// Scroll Reveal Image Preview
function ScrollRevealImagePreview({ config }: { config: Record<string, any> }) {
  if (!config.image) {
    return (
      <div className="py-12 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-body">Scroll Reveal Image</p>
        <p className="text-body-sm mt-1 opacity-60">Bild hinzufügen</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <ScrollRevealImage
        data={{
          image: config.image,
          alt: config.alt || '',
          animation: config.animation || 'fade',
          duration: config.duration || 0.8,
          delay: config.delay || 0,
          easing: config.easing || 'power3',
          trigger: config.trigger || '75%',
          once: config.once !== false,
          aspectRatio: config.aspectRatio || 'auto',
        }}
      />
    </div>
  )
}

// Scroll Parallax Section Preview
function ScrollParallaxSectionPreview({ config }: { config: Record<string, any> }) {
  if (!config.backgroundImage) {
    return (
      <div className="py-16 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-body">Parallax Section</p>
        <p className="text-body-sm mt-1 opacity-60">Hintergrundbild hinzufügen</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <ScrollParallaxSection
        data={{
          backgroundImage: config.backgroundImage,
          overlayColor: config.overlayColor || 'rgba(0,0,0,0.4)',
          parallaxSpeed: config.parallaxSpeed || 0.5,
          height: config.height || '75vh',
          heading: config.heading || '',
          subheading: config.subheading || '',
          contentAnimation: config.contentAnimation || 'slide-up',
          textAlign: config.textAlign || 'center',
        }}
      />
    </div>
  )
}

// Pinned Scroll Section Preview
function PinnedScrollSectionPreview({ config }: { config: Record<string, any> }) {
  const panels = config.panels ? (typeof config.panels === 'string' ? JSON.parse(config.panels) : config.panels) : []

  if (panels.length === 0) {
    return (
      <div className="py-16 text-center text-rinos-text-secondary bg-rinos-dark rounded-2xl">
        <Pin className="w-12 h-12 mx-auto mb-4 text-white/30" />
        <p className="text-body text-white/60">Pinned Scroll Section</p>
        <p className="text-body-sm mt-1 text-white/40">Panels hinzufügen</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <PinnedScrollSection
        data={{
          backgroundColor: config.backgroundColor || '#000000',
          pinDuration: config.pinDuration || 2,
          panels: config.panels,
          transitionType: config.transitionType || 'fade',
          progressIndicator: config.progressIndicator !== false,
        }}
      />
    </div>
  )
}

// Horizontal Gallery Scroll Preview
function HorizontalGalleryScrollPreview({ config }: { config: Record<string, any> }) {
  const images = config.images || []

  if (images.length === 0) {
    return (
      <div className="py-16 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <GalleryHorizontal className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-body">Horizontal Gallery</p>
        <p className="text-body-sm mt-1 opacity-60">Bilder hinzufügen</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <HorizontalGalleryScroll
        data={{
          images: images,
          backgroundColor: config.backgroundColor || '#fafafa',
          imageSize: config.imageSize || 'medium',
          gap: config.gap || 24,
          scrollSpeed: config.scrollSpeed || 1,
          showCaptions: config.showCaptions || false,
          direction: config.direction || 'left',
        }}
      />
    </div>
  )
}

// Scroll Timeline Preview
function ScrollTimelinePreview({ config }: { config: Record<string, any> }) {
  const items = config.items ? (typeof config.items === 'string' ? JSON.parse(config.items) : config.items) : []

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-rinos-text-secondary bg-rinos-bg-secondary rounded-2xl">
        <Timer className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-body">Scroll Timeline</p>
        <p className="text-body-sm mt-1 opacity-60">Timeline-Einträge hinzufügen</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <ScrollTimelineBlock
        data={{
          items: config.items,
          layout: config.layout || 'alternating',
          lineColor: config.lineColor || '#000000',
          dotColor: config.dotColor || '#000000',
          itemAnimation: config.itemAnimation || 'slide-up',
          stagger: config.stagger || 0.1,
          progressLine: config.progressLine !== false,
        }}
      />
    </div>
  )
}

export default BlockPreview
