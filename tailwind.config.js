module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  darkmode: 'media',
  theme: {
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      '80':'20rem',
      '96':'24rem',
     },
    extend: {
      colors: {
        logowhite: '#ffffffe5',
        backgroundwhite: "#E9F2FF",
        backgroundBlack: "#111111"
      },
      fontFamily: {
        bodyfont: ['Roboto'],
        logofont: ['Oswald', 'sans-serif']
      }
    },
  },

  plugins: [
    require('tw-elements/dist/plugin')
  ]
}