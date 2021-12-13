module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#1ed760",
      primaryLighter: "rgba(30, 215, 96, 0.1)",
      bodyPrimary: "#111112",
      bodySecundary: "#18181c",
      textGrey: "#727272",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
