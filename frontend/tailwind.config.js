/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor: {
        dark: {
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          accent: "#3b82f6",
        }
      },
      textColor: {
        dark: {
          primary: "#ffffff",
          secondary: "#e0e0e0",
          accent: "#3b82f6",
        }
      }
    },
  },
  plugins: [],
}
