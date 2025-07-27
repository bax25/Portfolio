/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-bg': '#F6F9FC', 
        'dark-bg': '#1A202C',
        'surface-light': '#FFFFFF', 
        'surface-dark': '#2D3748',
        'text-primary-light': '#1F2937', 
        'text-primary-dark': '#E2E8F0',
        'text-secondary-light': '#4A5568', 
        'text-secondary-dark': '#A0AEC0',
        'divider-light': '#E2E8F0', 
        'divider-dark': '#4A5568',
        'primary-light': '#0EA5E9',
        'primary-dark': '#38BDF8',
        'success-light': '#10B981',
        'success-dark': '#34D399',
        'warning-light': '#F59E0B',
        'warning-dark': '#FBBF24',
        'error-light': '#EF4444',
        'error-dark': '#F87171'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
