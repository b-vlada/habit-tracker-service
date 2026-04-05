/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: 'rgba(239, 231, 218, 0.3)',
          card: 'rgba(245, 245, 235, 0.6)',
          light: '#F5F5EB',
        },
        brand: {
          green: '#8E9B6D',
          brown: '#B3907A',
          red: '#940501',
        },
        neutral: {
          dark: '#2C2C2C',
          gray: '#6B7280',
        }
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      }
    },
  },
  plugins: [],
}