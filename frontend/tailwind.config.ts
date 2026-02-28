import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          'rendah':    '#22c55e',
          'waspada':   '#eab308',
          'tinggi':    '#f97316',
          'kritis':    '#dc2626',
          'no-data':   '#d1d5db',
        },
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea6c0a',
          700: '#c2570b',
          800: '#9a4209',
          900: '#7c3305',
        },
      },
    },
  },
  plugins: [],
}

export default config
