import type { Config } from 'tailwindcss'
const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      green: colors.green,
      red: colors.red,
      violet: colors.violet,
      'primary': '#bb86fc',
      'primary-varient': '#3700b3',
      'secondary': '#03dac6',
      'background': '#000000',
      'surface': '#121212',
      'error': '#CF6679',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-background': '#FFFFFF',
      'on-surface': '#FFFFFF',
      'on-error': '#000000',
    },
  },
  plugins: [],
}
export default config
