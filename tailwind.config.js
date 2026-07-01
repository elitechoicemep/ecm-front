/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0B1D33', 2: '#112540', 3: '#0d2244' },
        gold:  { DEFAULT: '#C8922A', 2: '#E5A93A' },
      },
      fontFamily: {
        barlow:    ['"Barlow"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        mono:      ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
