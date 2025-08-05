/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // adjust as needed
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#C94BB8',
        'accent1': '#CE3F63',
        'accent2-light': '#EAD9F2',
        'accent2-dark': '#F0BCD4',
        'bg-light': '#FEF7FB',
        'bg-dark': '#120015',
        'text-light': '#1A1A1A',
        'text-dark': '#F6F6FF',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      animation: {
        'scroll-x': 'scrollX 20s linear infinite',
      },
      keyframes: {
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
