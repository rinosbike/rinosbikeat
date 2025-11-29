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
        // Shopify Dawn Theme Colors
        'rinos': {
          'primary': '#121212',      // Dark text/buttons
          'bg': '#ffffff',           // White background
          'bg-secondary': '#f3f3f3', // Light gray background
          'dark': '#242833',         // Dark background
          'accent': '#334fb4',       // Blue accent
          'text': '#121212',         // Text color
          'text-light': '#ffffff',   // White text
        },
      },
      fontFamily: {
        sans: ['Assistant', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',  // Shopify page width
      },
      borderRadius: {
        'none': '0',  // Sharp corners like Shopify
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
