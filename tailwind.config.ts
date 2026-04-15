import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}'
  ],
  darkMode: 'media',
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config
