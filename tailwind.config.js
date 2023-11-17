/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace']
      }, colors: {
        'main': '#09090b',
        'secondary': '#111112',
        'main-white': '#e6e6e6',
        'secondary-white': '#e3e3e3',
      },screens: {
        '2560': '2560px',
        '1920': '1920px'
      }
    }
  },
  plugins: []
};