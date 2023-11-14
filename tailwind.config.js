/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace']
      }, colors: {
        'main': '#101010',
        'secondary': '#181818',
        'main-white': '#e6e6e6',
        'secondary-white': '#e3e3e3',
      },
      fontSize: {
        'base': '1rem',
      }
    }
  },
  plugins: []
};