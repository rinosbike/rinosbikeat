/**
 * Scroll Animation Block Types
 * CMS block definitions for scroll-driven animations
 *
 * Each block type defines:
 * - id: unique identifier
 * - name: display name in CMS
 * - description: what the block does
 * - fields: configurable options
 * - defaultData: default values
 * - render: function that outputs HTML with data attributes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'rotate' | 'blur'
export type EasingType = 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'expo'
export type TriggerPosition = 'top' | 'center' | 'bottom' | '25%' | '75%'

export interface ScrollBlockField {
  name: string
  type: 'text' | 'number' | 'select' | 'image' | 'textarea' | 'color' | 'boolean' | 'images'
  label: string
  description?: string
  options?: { value: string; label: string }[]
  default?: any
  min?: number
  max?: number
  step?: number
}

export interface ScrollBlockType {
  id: string
  name: string
  description: string
  icon: string
  category: 'animation'
  fields: ScrollBlockField[]
  defaultData: Record<string, any>
}

// =============================================================================
// ANIMATION OPTIONS (shared across blocks)
// =============================================================================

const animationOptions: { value: AnimationType; label: string }[] = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'rotate', label: 'Rotate In' },
  { value: 'blur', label: 'Blur In' },
]

const easingOptions: { value: EasingType; label: string }[] = [
  { value: 'power1', label: 'Gentle' },
  { value: 'power2', label: 'Smooth' },
  { value: 'power3', label: 'Strong' },
  { value: 'power4', label: 'Extra Strong' },
  { value: 'back', label: 'Overshoot' },
  { value: 'elastic', label: 'Elastic' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'expo', label: 'Exponential' },
]

const triggerOptions: { value: TriggerPosition; label: string }[] = [
  { value: 'top', label: 'Top of viewport' },
  { value: '25%', label: '25% from top' },
  { value: 'center', label: 'Center of viewport' },
  { value: '75%', label: '75% from top' },
  { value: 'bottom', label: 'Bottom of viewport' },
]

// =============================================================================
// BLOCK TYPE 1: ScrollRevealImage
// =============================================================================

export const ScrollRevealImageBlock: ScrollBlockType = {
  id: 'scroll_reveal_image',
  name: 'Scroll Reveal Image',
  description: 'Image that animates into view on scroll with customizable effects',
  icon: 'image',
  category: 'animation',
  fields: [
    {
      name: 'image',
      type: 'image',
      label: 'Image',
      description: 'The image to reveal on scroll',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      description: 'Accessibility description',
      default: '',
    },
    {
      name: 'animation',
      type: 'select',
      label: 'Animation Type',
      options: animationOptions,
      default: 'fade',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (seconds)',
      min: 0.1,
      max: 3,
      step: 0.1,
      default: 0.8,
    },
    {
      name: 'delay',
      type: 'number',
      label: 'Delay (seconds)',
      min: 0,
      max: 2,
      step: 0.1,
      default: 0,
    },
    {
      name: 'easing',
      type: 'select',
      label: 'Easing',
      options: easingOptions,
      default: 'power3',
    },
    {
      name: 'trigger',
      type: 'select',
      label: 'Trigger Position',
      options: triggerOptions,
      default: '75%',
    },
    {
      name: 'once',
      type: 'boolean',
      label: 'Animate Once',
      description: 'Only animate the first time element enters view',
      default: true,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      options: [
        { value: 'auto', label: 'Auto' },
        { value: '1/1', label: 'Square (1:1)' },
        { value: '4/3', label: 'Standard (4:3)' },
        { value: '16/9', label: 'Widescreen (16:9)' },
        { value: '21/9', label: 'Cinematic (21:9)' },
      ],
      default: 'auto',
    },
  ],
  defaultData: {
    image: '/placeholder.jpg',
    alt: 'Scroll reveal image',
    animation: 'fade',
    duration: 0.8,
    delay: 0,
    easing: 'power3',
    trigger: '75%',
    once: true,
    aspectRatio: 'auto',
  },
}

// =============================================================================
// BLOCK TYPE 2: ScrollParallaxSection
// =============================================================================

export const ScrollParallaxSectionBlock: ScrollBlockType = {
  id: 'scroll_parallax_section',
  name: 'Parallax Section',
  description: 'Full-width section with parallax background effect',
  icon: 'layers',
  category: 'animation',
  fields: [
    {
      name: 'backgroundImage',
      type: 'image',
      label: 'Background Image',
    },
    {
      name: 'overlayColor',
      type: 'color',
      label: 'Overlay Color',
      default: 'rgba(0,0,0,0.4)',
    },
    {
      name: 'parallaxSpeed',
      type: 'number',
      label: 'Parallax Speed',
      description: '0 = no movement, 1 = full scroll speed, negative = opposite direction',
      min: -1,
      max: 1,
      step: 0.1,
      default: 0.5,
    },
    {
      name: 'height',
      type: 'select',
      label: 'Section Height',
      options: [
        { value: '50vh', label: 'Half Screen' },
        { value: '75vh', label: 'Three Quarter' },
        { value: '100vh', label: 'Full Screen' },
        { value: 'auto', label: 'Auto (content height)' },
      ],
      default: '75vh',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      default: '',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
      default: '',
    },
    {
      name: 'contentAnimation',
      type: 'select',
      label: 'Content Animation',
      options: animationOptions,
      default: 'slide-up',
    },
    {
      name: 'textAlign',
      type: 'select',
      label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'center',
    },
  ],
  defaultData: {
    backgroundImage: '/placeholder-bg.jpg',
    overlayColor: 'rgba(0,0,0,0.4)',
    parallaxSpeed: 0.5,
    height: '75vh',
    heading: 'Parallax Section',
    subheading: 'Scroll to see the effect',
    contentAnimation: 'slide-up',
    textAlign: 'center',
  },
}

// =============================================================================
// BLOCK TYPE 3: PinnedScrollSection
// =============================================================================

export const PinnedScrollSectionBlock: ScrollBlockType = {
  id: 'pinned_scroll_section',
  name: 'Pinned Scroll Section',
  description: 'Section that pins while content animates through scroll progress',
  icon: 'pin',
  category: 'animation',
  fields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background Color',
      default: '#000000',
    },
    {
      name: 'pinDuration',
      type: 'number',
      label: 'Pin Duration (scroll distance multiplier)',
      description: '1 = 100vh of scroll, 2 = 200vh, etc.',
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    {
      name: 'panels',
      type: 'textarea',
      label: 'Panels (JSON array)',
      description: 'Array of panel objects with heading, text, and optional image',
      default: JSON.stringify([
        { heading: 'Panel 1', text: 'First panel content', image: '' },
        { heading: 'Panel 2', text: 'Second panel content', image: '' },
        { heading: 'Panel 3', text: 'Third panel content', image: '' },
      ], null, 2),
    },
    {
      name: 'transitionType',
      type: 'select',
      label: 'Panel Transition',
      options: [
        { value: 'fade', label: 'Fade' },
        { value: 'slide', label: 'Slide' },
        { value: 'scale', label: 'Scale' },
        { value: 'flip', label: 'Flip' },
      ],
      default: 'fade',
    },
    {
      name: 'progressIndicator',
      type: 'boolean',
      label: 'Show Progress Indicator',
      default: true,
    },
  ],
  defaultData: {
    backgroundColor: '#000000',
    pinDuration: 2,
    panels: JSON.stringify([
      { heading: 'Innovation', text: 'Pushing boundaries with cutting-edge technology', image: '' },
      { heading: 'Design', text: 'Crafted with precision and attention to detail', image: '' },
      { heading: 'Performance', text: 'Engineered for maximum efficiency', image: '' },
    ], null, 2),
    transitionType: 'fade',
    progressIndicator: true,
  },
}

// =============================================================================
// BLOCK TYPE 4: HorizontalGalleryScroll
// =============================================================================

export const HorizontalGalleryScrollBlock: ScrollBlockType = {
  id: 'horizontal_gallery_scroll',
  name: 'Horizontal Gallery Scroll',
  description: 'Gallery that scrolls horizontally as user scrolls vertically',
  icon: 'gallery',
  category: 'animation',
  fields: [
    {
      name: 'images',
      type: 'images',
      label: 'Gallery Images',
    },
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background Color',
      default: '#fafafa',
    },
    {
      name: 'imageSize',
      type: 'select',
      label: 'Image Size',
      options: [
        { value: 'small', label: 'Small (300px)' },
        { value: 'medium', label: 'Medium (500px)' },
        { value: 'large', label: 'Large (700px)' },
        { value: 'full', label: 'Full Height' },
      ],
      default: 'medium',
    },
    {
      name: 'gap',
      type: 'number',
      label: 'Gap Between Images (px)',
      min: 0,
      max: 100,
      step: 4,
      default: 24,
    },
    {
      name: 'scrollSpeed',
      type: 'number',
      label: 'Scroll Speed',
      description: 'How fast the gallery moves relative to scroll',
      min: 0.5,
      max: 2,
      step: 0.1,
      default: 1,
    },
    {
      name: 'showCaptions',
      type: 'boolean',
      label: 'Show Image Captions',
      default: false,
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Scroll Direction',
      options: [
        { value: 'left', label: 'Left to Right' },
        { value: 'right', label: 'Right to Left' },
      ],
      default: 'left',
    },
  ],
  defaultData: {
    images: [],
    backgroundColor: '#fafafa',
    imageSize: 'medium',
    gap: 24,
    scrollSpeed: 1,
    showCaptions: false,
    direction: 'left',
  },
}

// =============================================================================
// BLOCK TYPE 5: ScrollTimelineBlock
// =============================================================================

export const ScrollTimelineBlockType: ScrollBlockType = {
  id: 'scroll_timeline',
  name: 'Scroll Timeline',
  description: 'Animated timeline that reveals items as user scrolls',
  icon: 'timeline',
  category: 'animation',
  fields: [
    {
      name: 'items',
      type: 'textarea',
      label: 'Timeline Items (JSON)',
      description: 'Array of items with date, title, description, and optional image',
      default: JSON.stringify([
        { date: '2024', title: 'Launch', description: 'Initial product launch', image: '' },
        { date: '2025', title: 'Growth', description: 'Expanding our reach', image: '' },
        { date: '2026', title: 'Innovation', description: 'Next generation features', image: '' },
      ], null, 2),
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'alternating', label: 'Alternating (left/right)' },
        { value: 'left', label: 'All Left' },
        { value: 'right', label: 'All Right' },
        { value: 'center', label: 'Centered' },
      ],
      default: 'alternating',
    },
    {
      name: 'lineColor',
      type: 'color',
      label: 'Timeline Line Color',
      default: '#000000',
    },
    {
      name: 'dotColor',
      type: 'color',
      label: 'Timeline Dot Color',
      default: '#000000',
    },
    {
      name: 'itemAnimation',
      type: 'select',
      label: 'Item Animation',
      options: animationOptions,
      default: 'slide-up',
    },
    {
      name: 'stagger',
      type: 'number',
      label: 'Stagger Delay (seconds)',
      description: 'Delay between each item animation',
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.1,
    },
    {
      name: 'progressLine',
      type: 'boolean',
      label: 'Animate Progress Line',
      description: 'Line grows as user scrolls',
      default: true,
    },
  ],
  defaultData: {
    items: JSON.stringify([
      { date: '2024', title: 'Launch', description: 'Initial product launch', image: '' },
      { date: '2025', title: 'Growth', description: 'Expanding our reach', image: '' },
      { date: '2026', title: 'Innovation', description: 'Next generation features', image: '' },
    ], null, 2),
    layout: 'alternating',
    lineColor: '#000000',
    dotColor: '#000000',
    itemAnimation: 'slide-up',
    stagger: 0.1,
    progressLine: true,
  },
}

// =============================================================================
// EXPORT ALL BLOCK TYPES
// =============================================================================

export const scrollBlockTypes: ScrollBlockType[] = [
  ScrollRevealImageBlock,
  ScrollParallaxSectionBlock,
  PinnedScrollSectionBlock,
  HorizontalGalleryScrollBlock,
  ScrollTimelineBlockType,
]

// Helper to get block type by ID
export function getScrollBlockType(id: string): ScrollBlockType | undefined {
  return scrollBlockTypes.find(block => block.id === id)
}

// =============================================================================
// RENDER FUNCTIONS - Output HTML with data attributes
// =============================================================================

export interface ScrollRevealImageData {
  image: string
  alt: string
  animation: AnimationType
  duration: number
  delay: number
  easing: EasingType
  trigger: TriggerPosition
  once: boolean
  aspectRatio: string
}

export interface ScrollParallaxSectionData {
  backgroundImage: string
  overlayColor: string
  parallaxSpeed: number
  height: string
  heading: string
  subheading: string
  contentAnimation: AnimationType
  textAlign: 'left' | 'center' | 'right'
}

export interface PinnedScrollSectionData {
  backgroundColor: string
  pinDuration: number
  panels: string // JSON string
  transitionType: 'fade' | 'slide' | 'scale' | 'flip'
  progressIndicator: boolean
}

export interface HorizontalGalleryScrollData {
  images: { src: string; alt?: string; caption?: string }[]
  backgroundColor: string
  imageSize: 'small' | 'medium' | 'large' | 'full'
  gap: number
  scrollSpeed: number
  showCaptions: boolean
  direction: 'left' | 'right'
}

export interface ScrollTimelineData {
  items: string // JSON string
  layout: 'alternating' | 'left' | 'right' | 'center'
  lineColor: string
  dotColor: string
  itemAnimation: AnimationType
  stagger: number
  progressLine: boolean
}
