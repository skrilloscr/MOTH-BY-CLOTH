/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        brand: {
          black:    'rgb(var(--brand-black)    / <alpha-value>)',
          surface:  'rgb(var(--brand-surface)  / <alpha-value>)',
          surface2: 'rgb(var(--brand-surface2) / <alpha-value>)',
          border:   'rgb(var(--brand-border)   / <alpha-value>)',
          cream:    'rgb(var(--brand-cream)     / <alpha-value>)',
          gold:     'rgb(var(--brand-gold)      / <alpha-value>)',
        },
      },
      letterSpacing: {
        brand:  '0.25em',
        brand2: '0.35em',
      },
    },
  },
  plugins: [],
}
