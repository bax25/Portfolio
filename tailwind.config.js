/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./Assets/**/*.{html,js}"],
  darkMode: 'class',
  safelist: [
    'will-change-transform', // For parallax effect optimization
  ],
  theme: {
    extend: {
      colors: {
        lightBg: 'var(--color-light-bg)',
        darkBg: 'var(--color-dark-bg)',
        surfaceLight: 'var(--color-surface-light)',
        surfaceDark: 'var(--color-surface-dark)',
        txtPrimaryLight: 'var(--color-txt-primary-light)',
        txtPrimaryDark: 'var(--color-txt-primary-dark)',
        txtSecondaryLight: 'var(--color-txt-secondary-light)',
        txtSecondaryDark: 'var(--color-txt-secondary-dark)',
        dividerLight: 'var(--color-divider-light)',
        dividerDark: 'var(--color-divider-dark)',
        primaryLight: 'var(--color-primary-light)',
        primaryDark: 'var(--color-primary-dark)',
        successLight: 'var(--color-success-light)',
        successDark: 'var(--color-success-dark)',
        warningLight: 'var(--color-warning-light)',
        warningDark: 'var(--color-warning-dark)',
        errorLight: 'var(--color-error-light)',
        errorDark: 'var(--color-error-dark)',
        accentLight: 'var(--color-accent-light)',
        accentDark: 'var(--color-accent-dark)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
