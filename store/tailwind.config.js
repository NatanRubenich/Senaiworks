/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Design system: Gamer-Editorial Standard
        primary: '#002068',
        'primary-container': '#003399',
        secondary: '#9b4600',
        'secondary-container': '#FE7600',
        'on-secondary-container': '#5a2600',
        'on-primary-container': '#8aa4ff',
        background: '#f8f9fb',
        surface: '#f8f9fb',
        'surface-bright': '#f8f9fb',
        'surface-dim': '#d9dadc',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f4f6',
        'surface-container': '#edeef0',
        'surface-container-high': '#e7e8ea',
        'surface-container-highest': '#e1e2e4',
        'surface-variant': '#e1e2e4',
        'on-surface': '#191c1e',
        'on-surface-variant': '#444653',
        outline: '#747684',
        'outline-variant': '#c4c5d5',
        error: '#ba1a1a',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '0.5rem',
        xl: '1.5rem',
      },
      boxShadow: {
        ambient: '0 32px 64px -12px rgba(25, 28, 30, 0.06)',
        'card-hover': '0 24px 48px -12px rgba(25, 28, 30, 0.12)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #002068 0%, #003399 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
      },
    },
  },
  plugins: [],
};
