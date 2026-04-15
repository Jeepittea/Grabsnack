/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand:   '#e8434a',
        'brand-dark': '#d63940',
        dark:    '#0f0f0f',
        surface: '#1a1a1a',
        card:    '#222222',
        muted:   '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'float-slow':   'float 6s ease-in-out infinite',
        'float-slower': 'float 8s ease-in-out infinite',
        'float-alt':    'floatAlt 5s ease-in-out infinite',
        'fade-in':      'fadeIn 0.25s ease both',
        'slide-right':  'slideRight 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'toast-in':     'toastIn 0.35s ease both',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-18px) rotate(4deg)' },
        },
        floatAlt: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-22px) rotate(-5deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.5)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(232,67,74,0.4)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-4',
    'sm:grid-cols-2',
    'lg:grid-cols-4',
    'bg-[#0f0f0f]',
    'bg-[#1a1a1a]',
    'bg-[#222222]',
    'bg-[#1e1e2e]',
    'text-[#e8434a]',
    'bg-[#e8434a]',
    'bg-[#c73038]',
    'translate-x-0',
    'translate-x-full',
  ],
  plugins: [],
}
