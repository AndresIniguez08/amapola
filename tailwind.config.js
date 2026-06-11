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
          DEFAULT: '#7C5CBF',
          dark:    '#5E3FA3',
          light:   '#F3EEFF',
        },
        background: '#FAF8F5',
        surface:    '#FFFFFF',
        border:     '#E8E0F0',
        accent:     '#C4A882',
        text: {
          primary:   '#2D2040',
          secondary: '#6B5E7A',
          muted:     '#9E8FAD',
        },
        success: '#4CAF82',
        error:   '#E05252',
      },
      borderRadius: {
        btn:  '10px',
        card: '16px',
      },
      boxShadow: {
        card:       '0 1px 4px 0 rgba(44,32,64,0.07)',
        'card-hover': '0 4px 16px 0 rgba(44,32,64,0.12)',
      },
    },
  },
  plugins: [],
}
