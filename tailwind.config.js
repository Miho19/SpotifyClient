const {
  colors: { teal, orange, pink, ...colors },
} = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.js",
    "./components/**/*.js",
    "./public/**/*.html",
    "./hooks/**/*.js",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    screens: {
      xs: "580px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      lgg: "1080px",

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      xll: "1350px",
      xlll: "1440px",
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    textColor: (theme) => theme("colors"),
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
