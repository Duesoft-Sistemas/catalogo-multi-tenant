/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light-shadow': 'var(--color-primary-light-shadow)',
        'link-active': 'var(--color-link-active)',
        'font-color': 'var(--color-font-color)',
        'font-color-light': 'var(--color-font-color-light)'
      },
      backgroundColor: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
      },
      textColor: {
        primary: 'var(--color-primary)',
        'font-color': 'var(--color-font-color)',
        'font-color-light': 'var(--color-font-color-light)',
      },
      borderColor: {
        primary: 'var(--color-primary)',
      }
    },
  },
  plugins: []
}
