/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bfsuma-green': '#006837',
        'bfsuma-gold': '#FDB813',
        'bfsuma-sage': '#D4E9D2',
        'bfsuma-warm': '#FAFAF9',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
