/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './container/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens powered by CSS variables defined in globals.css
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        secondary: 'var(--color-secondary)',
        neutral: 'var(--color-neutral)',
        neutralDark: 'var(--color-neutral-dark)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        bodyBg: 'var(--color-bg)',
        overlay: 'var(--color-overlay)',
        ring: 'var(--color-ring)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)',
        focus: '0 0 0 3px var(--color-ring)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}