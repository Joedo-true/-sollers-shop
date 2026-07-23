/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd1ff',
          300: '#8eb4ff',
          400: '#598bff',
          500: '#3563ff',
          600: '#1e40f5',
          700: '#172ee1',
          800: '#1928b6',
          900: '#1a298f',
          950: '#141a57',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 8px 24px -8px rgba(16, 24, 40, 0.10)',
        'card-hover': '0 16px 40px -12px rgba(30, 64, 245, 0.22)',
        glow: '0 10px 34px -10px rgba(53, 99, 255, 0.4)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
