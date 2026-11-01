/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ferndesk warm canvas & obsidian
        cream: {
          DEFAULT: '#faf7ee',
          light: '#fdfbf7',
          dark: '#f3efe4',
          border: '#e6e1d4',
        },
        obsidian: {
          DEFAULT: '#111311',
          soft: '#191c19',
          card: '#161916',
          border: '#272b27',
        },
        forest: {
          DEFAULT: '#1e5e3a',
          hover: '#174b2e',
          light: '#28794b',
          dark: '#113a23',
          soft: '#ebf5ee',
        },
        lime: {
          DEFAULT: '#9ee86f',
          dark: '#7bc74d',
          light: '#b6f28d',
          soft: '#f0fbe8',
        },
        // Compatibility aliases for existing UI
        navy: {
          DEFAULT: '#121412',
          light: '#1e5e3a',
          soft: '#374239',
        },
        teal: {
          DEFAULT: '#1e5e3a',
          dark: '#16482c',
          light: '#9ee86f',
        },
        bg: '#faf7ee',
        border: '#e6e1d4',
        muted: '#5f665e',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(18,20,18,0.05)',
        cardHover: '0 8px 24px rgba(18,20,18,0.08)',
        lg2: '0 16px 40px rgba(18,20,18,0.09)',
        modal: '0 24px 60px rgba(18,20,18,0.22)',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
};
