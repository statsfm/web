module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1ed760',
        primaryLighter: 'rgba(30, 215, 96, 0.1)',
        bodyPrimary: '#111112',
        bodySecundary: '#18181c',
        textGrey: '#727272'
      },
      fontFamily: {
        body: 'Open Sans',
        heading: 'Open Sans'
      },
      keyframes: {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        fadeIn: {
          from: {
            scale: 0.95,
            transform: 'translate3d(0, 5px, 0)',
            opacity: 0
          },
          to: {
            scale: 1,
            transform: 'translate3d(0, 0px, 0)',
            opacity: 1
          }
        },
        fadeOut: {
          from: {
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          },
          to: {
            transform: 'translate3d(0, 5px, 0)',
            opacity: 0
          }
        }
      },
      animation: {
        fade: 'fade 0.3s ease-in-out',
        fadeIn: 'fadeIn 0.2s ease-in-out',
        fadeOut: 'fadeOut 0.2s ease-in-out'
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')]
};
