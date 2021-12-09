module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.js", "./components/**/*.js", "./public/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
