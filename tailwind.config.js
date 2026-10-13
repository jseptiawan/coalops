/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7f6",
          100: "#e6ebe9",
          200: "#cad5d1",
          300: "#a3b6af",
          400: "#78968b",
          500: "#5a7d72",
          600: "#47655c",
          700: "#3b524b",
          800: "#32433e",
          900: "#1f2a27",
        },
        coal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#2a2a2a",
          950: "#171717",
        },
        status: {
          green: "#16a34a",
          yellow: "#eab308",
          red: "#dc2626",
          grey: "#9ca3af",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
