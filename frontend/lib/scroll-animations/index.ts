/**
 * Scroll Animations Module
 * =============================================================================
 * Central export for all scroll animation functionality
 *
 * Usage:
 * ```tsx
 * import {
 *   initScrollAnimations,
 *   scrollBlockTypes,
 *   ScrollRevealImage,
 *   useScrollAnimations,
 * } from '@/lib/scroll-animations'
 * ```
 */

// Block type definitions
export {
  scrollBlockTypes,
  getScrollBlockType,
  ScrollRevealImageBlock,
  ScrollParallaxSectionBlock,
  PinnedScrollSectionBlock,
  HorizontalGalleryScrollBlock,
  ScrollTimelineBlockType,
  type ScrollBlockType,
  type ScrollBlockField,
  type AnimationType,
  type EasingType,
  type TriggerPosition,
  type ScrollRevealImageData,
  type ScrollParallaxSectionData,
  type PinnedScrollSectionData,
  type HorizontalGalleryScrollData,
  type ScrollTimelineData,
} from '../scroll-blocks'

// Animation engine
export {
  initScrollAnimations,
  refreshScrollAnimations,
  destroyScrollAnimations,
  reinitScrollAnimations,
  default as scrollAnimationEngine,
} from '../scroll-animation-engine'

// Re-export components (for convenience)
export {
  ScrollRevealImage,
  ScrollParallaxSection,
  PinnedScrollSection,
  HorizontalGalleryScroll,
  ScrollTimelineBlock,
  ScrollRevealContainer,
  ScrollRevealText,
  ScrollRevealGrid,
} from '@/components/blocks/ScrollAnimationBlocks'

// Re-export hook
export {
  useScrollAnimations,
  useScrollReveal,
} from '@/hooks/useScrollAnimations'
