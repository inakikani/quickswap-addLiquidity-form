module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': '#000',
      'white': '#ffffff',
      'grey': '#70686f',
      'lightgrey': '#c4c4c4',
      'lightpink': '#d6c2d1',
      'pink': '#ad85a3',
      'lightblue': '#56cdee',
      'darkpurple': '#2a1d29',
      'medpurple': '#40303b',
      'purple': '#544550',
      'darkblue': '#00495f',
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}
