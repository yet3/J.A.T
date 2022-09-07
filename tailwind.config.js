/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,css}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--text-color-primary)',
        secondary: 'var(--text-color-secondary)',
        disabled: 'var(--text-color-disabled)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        'text-primary': 'var(--text-color-primary)',
        'text-secondary': 'var(--text-color-secondary)',
        page: 'var(--bg-page)',
      },
    },
  },
  plugins: [],
}

