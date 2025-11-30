/**
 * Design System Constants
 * Central source of truth for spacing, sizing, and layout values
 * Based on rinosbike.eu design
 */

export const DESIGN_SYSTEM = {
  // Container widths (EXACT rinosbike.eu values)
  container: {
    maxWidth: '1200px',
    padding: {
      mobile: '1.5rem',    // 24px (matches rinosbike.eu)
      desktop: '5rem',     // 80px (matches rinosbike.eu)
    }
  },

  // Hero section heights
  hero: {
    mobile: '400px',
    desktop: '450px',
    secondary: {
      mobile: '350px',
      desktop: '400px',
    }
  },

  // Section spacing (EXACT rinosbike.eu values)
  section: {
    paddingY: {
      mobile: '3rem',      // 48px (matches rinosbike.eu)
      desktop: '4rem',     // 64px (matches rinosbike.eu)
    },
    gap: {
      small: '1rem',       // 16px
      medium: '1.5rem',    // 24px
      large: '2rem',       // 32px
    }
  },

  // Typography
  typography: {
    h1: {
      mobile: '2rem',      // 32px
      tablet: '2.5rem',    // 40px
      desktop: '3rem',     // 48px
    },
    h2: {
      mobile: '1.75rem',   // 28px
      tablet: '2rem',      // 32px
      desktop: '2.5rem',   // 40px
    },
    h3: {
      mobile: '1.5rem',    // 24px
      desktop: '1.75rem',  // 28px
    }
  },

  // Grid layouts
  grid: {
    products: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
    gap: {
      mobile: '0.25rem',   // 4px (matches rinosbike.eu)
      desktop: '0.5rem',   // 8px (matches rinosbike.eu)
    }
  },

  // Colors (reference to Tailwind config)
  colors: {
    primary: '#121212',
    accent: '#334fb4',
    background: '#ffffff',
    backgroundSecondary: '#f3f3f3',
  }
} as const

// Tailwind class helpers (EXACT rinosbike.eu values)
export const LAYOUT_CLASSES = {
  container: 'max-w-container mx-auto px-6 md:px-20',  // 24px / 80px
  section: 'py-12 md:py-16',  // 48px / 64px (for product/category pages)
  sectionAlt: 'py-8 md:py-12',
  staticPage: 'py-5 md:py-7',  // 20px / 28px (for impressum, kontakt, etc - matches rinosbike.eu)
  hero: 'relative h-[400px] md:h-[450px] overflow-hidden',
  heroSecondary: 'relative h-[350px] md:h-[400px] overflow-hidden',
  productGrid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2',
  twoColGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
} as const
