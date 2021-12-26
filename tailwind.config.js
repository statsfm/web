module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1ed760",
        primaryLighter: "rgba(30, 215, 96, 0.1)",
        bodyPrimary: "#111112",
        bodySecundary: "#18181c",
        textGrey: "#727272",
      },
      keyframes: {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fade: "fade 0.3s ease-in-out",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
