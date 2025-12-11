/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Black & White Palette
        'rinos': {
          'primary': '#000000',        // Pure black
          'bg': '#ffffff',             // Pure white
          'bg-secondary': '#fafafa',   // Subtle off-white (Apple-style)
          'bg-tertiary': '#f5f5f7',    // Light gray (Apple-style)
          'dark': '#1d1d1f',           // Rich dark (Apple-style)
          'accent': '#000000',         // Black accent
          'text': '#1d1d1f',           // Primary text
          'text-secondary': '#86868b', // Secondary text (Apple-style)
          'text-light': '#ffffff',     // White text
          'border': '#d2d2d7',         // Subtle border (Apple-style)
          'border-light': '#e8e8ed',   // Lighter border
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'IBM Plex Sans', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Premium typography scale
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-lg': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      maxWidth: {
        'container': '1280px',   // Slightly wider for premium feel
        'content': '720px',      // For text content
        'narrow': '560px',       // For forms, modals
      },
      padding: {
        'page': '1.5rem',        // 24px mobile
        'page-md': '3rem',       // 48px tablet
        'page-lg': '5rem',       // 80px desktop
      },
      spacing: {
        '18': '4.5rem',          // 72px
        '22': '5.5rem',          // 88px
        '26': '6.5rem',          // 104px
        '30': '7.5rem',          // 120px
        'section-sm': '4rem',    // 64px
        'section': '6rem',       // 96px
        'section-lg': '8rem',    // 128px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',        // 6px
        'DEFAULT': '0.5rem',     // 8px
        'md': '0.75rem',         // 12px
        'lg': '1rem',            // 16px
        'xl': '1.25rem',         // 20px
        '2xl': '1.5rem',         // 24px
        '3xl': '2rem',           // 32px
      },
      boxShadow: {
        // Premium shadows (Apple-inspired)
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 16px 48px -8px rgba(0, 0, 0, 0.15)',
        'floating': '0 16px 48px -8px rgba(0, 0, 0, 0.15), 0 32px 80px -16px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
        'premium': '20px',
        'heavy': '40px',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'blur-in': 'blurIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        // Premium gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
        'gradient-premium': 'linear-gradient(135deg, #1d1d1f 0%, #000000 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
    },
  },
  plugins: [],
}
