/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#faf7f2',
          deep: '#f1ece3',
        },
        ink: {
          DEFAULT: '#14171f',
          soft: '#2a2f3a',
          muted: '#5c6270',
          faint: '#8a8f9a',
        },
        line: '#e6e1d8',
        ember: {
          DEFAULT: '#e4572e',
          deep: '#c4471f',
          soft: '#fdebe4',
        },
        moss: {
          DEFAULT: '#1f8a5b',
          soft: '#e3f3ea',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,31,0.04), 0 8px 24px -12px rgba(20,23,31,0.12)',
        lift: '0 2px 4px rgba(20,23,31,0.05), 0 24px 48px -16px rgba(20,23,31,0.22)',
        phone: '0 40px 80px -24px rgba(20,23,31,0.45), 0 0 0 1px rgba(20,23,31,0.08)',
      },
      keyframes: {
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-14deg)' },
          '20%': { transform: 'rotate(12deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '40%': { transform: 'rotate(8deg)' },
          '50%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        ring: 'ring 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
