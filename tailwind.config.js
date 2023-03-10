/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        primary: '#1ed760',
        primaryLighter: 'rgba(30, 215, 96, 0.1)',
        background: '#111112',
        foreground: '#18181c',
        icon: '#727272',
        plus: '#ffd700',
        swipefy: '#DBFF00',
        'text-grey': '#727272',
      },
      fontFamily: {
        body: ['var(--font-statsfm-sans)', 'Statsfm Sans'],
        heading: ['var(--font-statsfm-sans)', 'Statsfm Sans'],
      },
      keyframes: {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        floating: {
          '0%': {
            transform: 'translate(3px, 0px)',
          },
          '50%': {
            transform: 'translate(0, 2px)',
          },
          '100%': {
            transform: 'translate(1px, 0px)',
          },
        },
      },
      animation: {
        fade: 'fade 0.3s ease-in-out',
        floating: 'floating 6s ease-in-out infinite alternate;',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
