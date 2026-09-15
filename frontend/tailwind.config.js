/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luxury: {
          950: '#070707',
          900: '#0C0C0C',
          850: '#121212',
          800: '#181818',
          700: '#262626',
          600: '#404040',
          500: '#737373',
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#F5F5F5',
          50: '#FAFAFA',
        },
        gold: {
          300: '#F3E5AB',
          400: '#E5C07B',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#997A2E',
        },
        champagne: {
          light: '#FAF7F2',
          DEFAULT: '#F4ECE1',
          dark: '#E8DCB8',
        },
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.25em',
        widest: '0.15em',
      },
      boxShadow: {
        luxury: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        glow: '0 0 25px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
};
