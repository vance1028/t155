/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a5c3a',
          light: '#2d7a52',
          dark: '#124329',
        },
        accent: {
          DEFAULT: '#e07a5f',
          light: '#e99a82',
        },
        success: '#81b29a',
        warning: '#f2cc8f',
        cream: '#f4f1de',
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
