/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#f0d060',
          400: '#D4AF37',
          500: '#b8960c',
          600: '#9a7d0a',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
