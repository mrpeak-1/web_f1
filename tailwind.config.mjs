/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        volt: '#E0FF00',
        'volt-dark': '#B8D400',
        carbon: {
          DEFAULT: '#0A0A0A',
          950: '#070707',
          900: '#0F0F0F',
          850: '#151515',
          800: '#1C1C1C',
          700: '#282828',
          600: '#3D3D3D'
        },
        f1red: '#FF1801',
        offwhite: '#EDEDED',
        muted: '#8A8A8A'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel Decorative"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Cabinet Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shiftLights: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(224, 255, 0, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 4px rgba(224, 255, 0, 0.3))' },
        }
      },
      animation: {
        'shift-blink': 'shiftLights 0.15s ease-in-out infinite',
        'glow-pulse': 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

