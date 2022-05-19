const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: [
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      green: colors.green,
      red: colors.rose,
      yellow: colors.amber,
      cream: '#fff0ad',
    },
    gridTemplateColumns: {
      'fill-40': 'repeat(auto-fill, 15rem)',
    },
    extend: {},
  },
  variants: {
    extend: {
      width: ['hover, group-hover'],
      display: ['group-hover']
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ]
}
