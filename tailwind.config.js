/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#08080a',
          surface: '#101015',
          card: 'rgba(18, 18, 24, 0.72)',
          border: 'rgba(218, 165, 32, 0.22)',
          hover: 'rgba(218, 165, 32, 0.12)',
        },
        gold: {
          light: '#F5DEB3',
          DEFAULT: '#D4AF37',
          glow: '#F3E5AB',
          metallic: '#C5A059',
          dark: '#997A15',
          gradientStart: '#E8C878',
          gradientEnd: '#B38B38'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        display: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
