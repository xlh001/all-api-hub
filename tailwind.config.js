/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["!./node_modules", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": {
          primary: "#0f172a", // Main background
          secondary: "#1e293b", // Cards, elevated surfaces
          tertiary: "#334155" // Hover states, borders
        },
        "dark-text": {
          primary: "#f1f5f9", // Primary text
          secondary: "#cbd5e1", // Secondary text
          tertiary: "#94a3b8" // Muted text
        },
        brand: {
          blue: "#3b82f6",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#f59e0b",
          purple: "#a855f7"
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none"
          }
        }
      }
      addUtilities(newUtilities)
    }
  ]
}
