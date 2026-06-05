/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E8660A',
          dark: '#C25508',
          light: '#FFF3EC',
        },
        background: '#FAFAF8',
        surface: '#FFFFFF',
        'text-primary': '#1C1917',
        'text-secondary': '#78716C',
        'text-muted': '#A8A29E',
        border: '#E7E5E4',
        success: '#16A34A',
        error: '#DC2626',
      },
      borderRadius: {
        card: '14px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
