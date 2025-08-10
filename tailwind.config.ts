import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'avalanche': {
          900: '#0B0B0C',
          800: '#121214',
          700: '#1A1A1D',
          600: '#2A2A2F',
          500: '#3A3A42',
          400: '#4A4A55',
          300: '#6A6A78',
          200: '#8A8A9B',
          100: '#AAAABE',
          50: '#CACAE1',
        },
        'lava': {
          600: '#C63636',
          500: '#E84142',
          400: '#EA5A5B',
          300: '#EC7374',
          200: '#EE8C8D',
          100: '#F0A5A6',
        }
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-avalanche': 'linear-gradient(135deg, #0B0B0C 0%, #121214 100%)',
        'gradient-lava': 'linear-gradient(135deg, #E84142 0%, #C63636 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
export default config