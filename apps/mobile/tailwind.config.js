/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0f1114',
          800: '#1a1d23',
          700: '#252830',
          600: '#32363f',
        },
        olive: {
          400: '#8fa36b',
          500: '#6b8a3e',
          600: '#566e32',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
