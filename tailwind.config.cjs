const chroma = require('chroma.ts');

const primary = '#BE1E3E';
const accent = chroma.color(primary).brighter(1.5).hex();

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary,
        accent,
      },
    },
  },
  plugins: [],
};
