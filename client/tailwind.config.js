/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // adjust as needed
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1f0322',
        'primary-light': '#c94bb8', 
        'primary': '#c94bb8',
        'secondary': '#ce3f63',
        'primary-op': '#1f032286',
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
