module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Exo']
      },
      screens: {
        'exsm': '380px',
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}