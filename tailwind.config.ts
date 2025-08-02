import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'infinite-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 20px))' },
        },
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
