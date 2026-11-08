/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        obsidian: {
          950: '#070b14',
          900: '#0b1222',
          850: '#10192d',
          800: '#162238',
          700: '#1e2e4a',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        cyanbrand: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        safegreen: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          950: '#022c22',
        },
        dangerred: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          950: '#4c0519',
        }
      }
    },
  },
  plugins: [],
}
