module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx}",
    "./frontend/public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'nebula': {
          primary: '#a020f0',
          secondary: '#6a0dad',
          dark: '#240046',
          darker: '#020264',
        }
      }
    },
  },
  plugins: [],
}