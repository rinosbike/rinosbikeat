/**
 * Premium Design System Constants
 * Apple/Framer-inspired design tokens
 * Central source of truth for spacing, sizing, and layout values
 */

export const DESIGN_SYSTEM = {
  // Container configuration
  container: {
    maxWidth: '1280px',
    padding: {
      mobile: '1.5rem',     // 24px
      tablet: '3rem',       // 48px
      desktop: '5rem',      // 80px
    }
  },

  // Hero section configurations
  hero: {
    height: {
      mobile: '500px',
      tablet: '600px',
      desktop: '700px',
    },
    secondary: {
      mobile: '400px',
      tablet: '450px',
      desktop: '500px',
    }
  },

  // Premium section spacing
  section: {
    padding: {
      mobile: '4rem',       // 64px
      tablet: '6rem',       // 96px
      desktop: '8rem',      // 128px
    },
    paddingSmall: {
      mobile: '3rem',       // 48px
      tablet: '4rem',       // 64px
      desktop: '5rem',      // 80px
    },
    gap: {
      xs: '0.5rem',         // 8px
      sm: '1rem',           // 16px
      md: '1.5rem',         // 24px
      lg: '2rem',           // 32px
      xl: '3rem',           // 48px
      '2xl': '4rem',        // 64px
    }
  },

  // Premium typography scale
  typography: {
    displayXl: {
      size: '4.5rem',       // 72px
      lineHeight: '1',
      letterSpacing: '-0.04em',
      weight: '700',
    },
    displayLg: {
      size: '3.75rem',      // 60px
      lineHeight: '1.05',
      letterSpacing: '-0.03em',
      weight: '700',
    },
    display: {
      mobile: '2.25rem',    // 36px
      tablet: '3rem',       // 48px
      desktop: '3.75rem',   // 60px
      lineHeight: '1.1',
      letterSpacing: '-0.025em',
      weight: '700',
    },
    headline: {
      mobile: '1.5rem',     // 24px
      tablet: '1.75rem',    // 28px
      desktop: '2rem',      // 32px
      lineHeight: '1.25',
      letterSpacing: '-0.015em',
      weight: '600',
    },
    title: {
      size: '1.125rem',     // 18px
      lineHeight: '1.4',
      letterSpacing: '-0.01em',
      weight: '600',
    },
    body: {
      size: '1rem',         // 16px
      lineHeight: '1.6',
      letterSpacing: '0',
      weight: '400',
    },
    caption: {
      size: '0.8125rem',    // 13px
      lineHeight: '1.4',
      letterSpacing: '0.01em',
      weight: '400',
    },
    overline: {
      size: '0.75rem',      // 12px
      lineHeight: '1.4',
      letterSpacing: '0.08em',
      weight: '500',
    },
  },

  // Premium grid configurations
  grid: {
    products: {
      mobile: 1,
      sm: 2,
      lg: 3,
      xl: 4,
    },
    gap: {
      mobile: '1rem',       // 16px
      tablet: '1.5rem',     // 24px
      desktop: '2rem',      // 32px
    }
  },

  // Premium color palette (Apple-inspired)
  colors: {
    // Primary
    primary: '#000000',
    primaryDark: '#1d1d1f',

    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    backgroundTertiary: '#f5f5f7',

    // Text
    text: '#1d1d1f',
    textSecondary: '#86868b',
    textLight: '#ffffff',

    // Borders
    border: '#d2d2d7',
    borderLight: '#e8e8ed',

    // Semantic
    success: '#34c759',
    error: '#ff3b30',
    warning: '#ff9500',
    info: '#007aff',
  },

  // Premium border radius
  borderRadius: {
    none: '0',
    sm: '0.375rem',         // 6px
    DEFAULT: '0.5rem',      // 8px
    md: '0.75rem',          // 12px
    lg: '1rem',             // 16px
    xl: '1.25rem',          // 20px
    '2xl': '1.5rem',        // 24px
    '3xl': '2rem',          // 32px
    full: '9999px',
  },

  // Premium shadows
  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    soft: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.12)',
    elevated: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 16px 48px -8px rgba(0, 0, 0, 0.15)',
    floating: '0 16px 48px -8px rgba(0, 0, 0, 0.15), 0 32px 80px -16px rgba(0, 0, 0, 0.2)',
  },

  // Premium easing functions
  easing: {
    premium: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounceSoft: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },

  // Transition durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    medium: '300ms',
    slow: '400ms',
    slower: '500ms',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const

// Premium Tailwind class helpers
export const LAYOUT_CLASSES = {
  // Container
  container: 'max-w-container mx-auto px-6 md:px-12 lg:px-20',
  containerNarrow: 'max-w-content mx-auto px-6 md:px-12',
  containerWide: 'max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20',

  // Sections with premium spacing
  section: 'py-16 md:py-24 lg:py-32',
  sectionSm: 'py-12 md:py-16 lg:py-20',
  sectionHero: 'py-20 md:py-28 lg:py-36',

  // Hero configurations
  hero: 'relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden',
  heroSecondary: 'relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden',

  // Premium grids
  productGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
  featureGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
  twoColGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',

  // Typography
  displayText: 'text-display-sm md:text-display lg:text-display-lg font-bold tracking-tight',
  headlineText: 'text-headline font-semibold tracking-tight',
  bodyText: 'text-body text-rinos-text-secondary leading-relaxed',

  // Cards
  cardBase: 'bg-white rounded-2xl border border-rinos-border-light transition-all duration-300',
  cardInteractive: 'bg-white rounded-2xl border border-rinos-border-light hover:border-rinos-border hover:shadow-soft hover:-translate-y-1 transition-all duration-300 cursor-pointer',
  cardElevated: 'bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300',

  // Buttons
  btnPrimary: 'btn btn-primary',
  btnSecondary: 'btn btn-secondary',
  btnOutline: 'btn btn-outline',
  btnGhost: 'btn btn-ghost',

  // Inputs
  inputBase: 'input',
  inputOutlined: 'input-outlined',
} as const

// Animation class helpers
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  slideInRight: 'animate-slide-in-right',
  slideInLeft: 'animate-slide-in-left',
  scaleIn: 'animate-scale-in',
  blurIn: 'animate-blur-in',
  float: 'animate-float',
  pulseSoft: 'animate-pulse-soft',
} as const

// Delay utilities for staggered animations
export const STAGGER_DELAYS = {
  100: 'delay-100',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-400',
  500: 'delay-500',
  600: 'delay-600',
  700: 'delay-700',
  800: 'delay-800',
} as const

// Type exports for TypeScript support
export type DesignSystem = typeof DESIGN_SYSTEM
export type LayoutClasses = typeof LAYOUT_CLASSES
export type AnimationClasses = typeof ANIMATION_CLASSES
