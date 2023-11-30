/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors'

function mapToPrimaryColor(colorScale) {
  return Object.keys(colorScale).reduce((acc, cur) => {
    acc[`primary-${cur}`] = colorScale[cur]
    return acc
  }, {})
}

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        ...mapToPrimaryColor(colors.sky),
        primary: colors.sky['500'],
        positive: colors.green['500'],
        neutral: colors.yellow['500'],
        negative: colors.red['500'],
      }
    },
  },
  plugins: [],
}

