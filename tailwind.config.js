/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#05060f',
          900: '#070a17',
          850: '#0a1026',
        },
        neon: {
          cyan: '#22d3ee',
          pink: '#fb7185',
          violet: '#a78bfa',
          lime: '#a3e635',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"VT323"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        pixel: '0 0 0 2px rgba(255,255,255,0.12), 0 0 0 6px rgba(34,211,238,0.12)',
        glow: '0 0 24px rgba(34,211,238,0.25)',
      },
      backgroundImage: {
        nebula:
          'radial-gradient(1200px 600px at 20% 20%, rgba(167,139,250,0.18), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(800px 520px at 60% 90%, rgba(251,113,133,0.12), transparent 60%)',
        grid:
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '40%': { opacity: '0.85' },
          '55%': { opacity: '0.95' },
          '70%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-20%)' },
          '100%': { transform: 'translateY(120%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        flicker: 'flicker 2.8s ease-in-out infinite',
        scan: 'scan 4.5s linear infinite',
      },
    },
  },
  plugins: [],
}

