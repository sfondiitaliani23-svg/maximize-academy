/** @type {import('tailwindcss').Config} */
// Stile allineato a Maurizio Barber Shop: nero #111, oro #bfa16a, carattere Oswald, angoli piccoli.
const gold = {
  50: '#f7f2e8',
  100: '#efe4cf',
  200: '#e3cfa3',
  300: '#d2b67f', // oro chiaro (hover)
  400: '#bfa16a', // oro principale
  500: '#a88a55',
  600: '#8f7444',
  700: '#80632f', // oro scuro, su fondo chiaro
  800: '#5c4822',
  900: '#3d3017',
  950: '#241c0d',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tutte le classi "amber-*" del sito usano la scala oro di Maurizio Barber Shop.
        amber: gold,
        luxury: {
          bg: '#111111',
          surface: '#181818',
          card: '#222222',
          border: 'rgba(191, 161, 106, 0.35)',
          hover: 'rgba(191, 161, 106, 0.12)',
        },
        gold: {
          light: '#e3cfa3',
          DEFAULT: '#bfa16a',
          glow: '#d2b67f',
          metallic: '#bfa16a',
          dark: '#80632f',
          gradientStart: '#d2b67f',
          gradientEnd: '#a88a55'
        }
      },
      fontFamily: {
        serif: ['Oswald', '"Arial Narrow"', 'Impact', 'sans-serif'],
        display: ['Oswald', '"Arial Narrow"', 'Impact', 'sans-serif'],
        sans: ['Oswald', '"Arial Narrow"', 'Impact', 'sans-serif']
      },
      borderRadius: {
        // Angoli piccoli come Maurizio Barber Shop (i cerchi "rounded-full" restano).
        xl: '6px',
        '2xl': '8px',
        '3xl': '8px',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px'
      },
      boxShadow: {
        'glass': '0 2px 10px rgba(0, 0, 0, 0.18)',
        'gold-glow': 'none',
        'gold-glow-lg': '0 8px 30px rgba(0, 0, 0, 0.28)',
      }
    },
  },
  plugins: [],
}
