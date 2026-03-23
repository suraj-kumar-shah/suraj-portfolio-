/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans':    ['DM Sans', 'system-ui', 'sans-serif'],
        'display': ['Syne', 'sans-serif'],
        'mono':    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        /* Lava palette — replaces the old blue "primary" */
        primary: {
          50:  '#fff4ee',
          100: '#ffe4cc',
          200: '#ffbf88',
          300: '#ff9944',
          400: '#ff6b00',   /* hot orange  — main accent */
          500: '#ff4500',   /* lava core   — primary     */
          600: '#cc2200',   /* deep magma  — hover/dark  */
          700: '#991500',
          800: '#660d00',
          900: '#330600',
        },
        /* Ember / gold accent */
        ember: {
          300: '#ffd700',
          400: '#ffaa00',
          500: '#ff8800',
        },
        /* App dark surfaces */
        dark: {
          bg:      '#080100',
          surface: '#140500',
          card:    '#1a0600',
          border:  '#2d0e00',
        },
      },
      backgroundImage: {
        'lava-gradient':   'linear-gradient(135deg, #ff4500, #ff6b00, #ffaa00)',
        'magma-gradient':  'linear-gradient(135deg, #cc2200, #ff4500, #ff6b00)',
        'ember-gradient':  'linear-gradient(135deg, #ff6b00, #ffaa00, #ffd700)',
        'lava-radial':     'radial-gradient(ellipse at 30% 0%, #1a0500, #080100 60%, #030000 100%)',
      },
      boxShadow: {
        'lava-sm':  '0 0 12px rgba(255,69,0,0.35)',
        'lava':     '0 0 25px rgba(255,69,0,0.40), 0 0 60px rgba(255,107,0,0.15)',
        'lava-lg':  '0 0 50px rgba(255,69,0,0.50), 0 0 100px rgba(255,69,0,0.20)',
        'ember':    '0 0 20px rgba(255,170,0,0.45)',
        'gold':     '0 0 30px rgba(255,215,0,0.40)',
      },
      animation: {
        'lava-pulse':  'lavaPulse 2.5s ease-in-out infinite',
        'ember-rise':  'emberRise 2s ease-out forwards',
        'lava-flow':   'lavaFlow 6s ease infinite',
        'gradient':    'lavaShift 5s linear infinite',
        'float':       'floatUp 8s ease-in-out infinite',
        'spin-slow':   'spinSlow 14s linear infinite',
      },
      keyframes: {
        lavaPulse: {
          '0%,100%': { boxShadow: '0 0 10px rgba(255,69,0,0.4)' },
          '50%':     { boxShadow: '0 0 35px rgba(255,107,0,0.75)' },
        },
        emberRise: {
          '0%':   { transform:'translateY(0) scale(1)', opacity:'0.9' },
          '100%': { transform:'translateY(-100px) scale(0)', opacity:'0' },
        },
        lavaFlow: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        lavaShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        floatUp: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-22px)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}