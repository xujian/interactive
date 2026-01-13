import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: 'width margin',
        height: 'height',
        bg: 'background-color',
        display: 'display opacity',
        visibility: 'visibility',
        padding: 'padding-top padding-right padding-bottom padding-left'
      },
      keyframes: {
      },
      animation: {
      },
    }
  },
  plugins: [
    require('tailwindcss-radix')(),
    require('tailwindcss-animate')
  ]
}

export default config
