/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Poppins-ExtraLightItalic': ['Poppins-ExtraLightItalic', 'sanf-serif'],
      },
      colors:
      {
        primary: '#40BFFF',
        secondray: '#FF4858',
        blue: {
          100: '#BCDDFE',
        },
        black: '#373737',
        white: "#FAFAFB",

      }
    },
    plugins: [],
  }
}

