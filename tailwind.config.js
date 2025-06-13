/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E63946', // Crimson Red
          hover: '#D62A37',
        },
        secondary: {
          DEFAULT: '#4361EE', // Indigo Blue
          hover: '#3A56D4',
        },
        background: '#F8F9FA', // Snow White
        card: '#F1F3F5', // Ghost Gray
        border: '#DDE2E5', // Cool Gray
        text: {
          primary: '#2D2D2D', // Charcoal
          muted: '#6C757D', // Slate Gray
        },
        status: {
          success: '#38A169', // Emerald
          warning: '#F59E0B', // Amber
          error: '#EF4444', // Rose Red
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 