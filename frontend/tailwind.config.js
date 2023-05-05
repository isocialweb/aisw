/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   "./src/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {},
    container:{
      center:true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      
    },
    minHeight:{
      's': '500px'
    },
    backgroundImage:{
      'bg_tool': './hero_3.png'
    }
    
  },
  plugins: [require("daisyui"),require('@tailwindcss/forms')],

  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
