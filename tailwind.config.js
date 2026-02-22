/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KaamZone Brand Colors [cite: 337-339]
        emerald: {
          500: '#10B981', // Primary brand color
          600: '#059669', // Hover state
        },
        slate: {
          500: '#64748B', // Secondary text
          800: '#1E293B', // Dark headings
        },
        gold: {
          500: '#EAB308', // Verified/Premium accents
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // English [cite: 341]
        urdu: ['var(--font-noto-urdu)', 'serif'],  // Urdu [cite: 342]
      }
    },
  },
  plugins: [],
};