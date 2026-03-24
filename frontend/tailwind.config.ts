import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f6f6f9',
        'surface-muted': '#eef1f4',
        'surface-soft': '#f0f3f5',
        'surface-card': '#ffffff',
        'surface-strong': '#dde2e7',
        ink: '#20262d',
        'ink-muted': '#5b6570',
        primary: '#006668',
        'primary-dark': '#005154',
        'primary-soft': '#d8f8f8',
        secondary: '#ab2d00',
        'secondary-soft': '#ffc4b4',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 24px 60px -32px rgba(15, 23, 42, 0.24)',
        soft: '0 24px 80px -28px rgba(0, 102, 104, 0.35)',
      },
      backgroundImage: {
        'primary-radial':
          'radial-gradient(circle at top, rgba(82, 242, 245, 0.35), rgba(0, 102, 104, 0) 55%)',
      },
    },
  },
  plugins: [],
} satisfies Config
