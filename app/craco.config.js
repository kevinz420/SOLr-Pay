module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            type: 'javascript/auto',
            test: /\.mjs$/,
            use: [],
          },
        ],
      },
    },
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        ],
      },
    },
  }