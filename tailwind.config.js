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
        bodySecundary: '#18181c',
        foreground: '#18181c',
        icon: '#727272',
        plus: '#ffd700',
        'text-grey': '#727272',
      },
      fontFamily: {
        body: 'Open Sans',
        heading: 'Open Sans',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
