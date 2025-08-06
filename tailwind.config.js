/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      colors: {
        // Default primary
        primary: '#00d986',
        'primary-light': '#08c04f',
        'primary-light-shadow': '#1a442b3a',
        'link-active': 'rgb(194, 81, 81)',
        'font-color': '#343a40',
        'font-color-light': '#fff',

        // Mendes
        mendes: {
          primary: '#d90000',
          'primary-light': '#c00812',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(194, 81, 81)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Canguru
        canguru: {
          primary: '#f6821f',
          'primary-light': '#ef9b55',
          'primary-light-shadow': 'rgb(239 155 85 / 25%)',
          'link-active': 'orange',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Prudenseg
        prudenseg: {
          primary: '#009f41',
          'primary-light': '#58cf8a',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'green',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Autocar
        autocar: {
          primary: '#e02724',
          'primary-light': '#ff3b38',
          'primary-light-shadow': '#1a442b3a',
          'link-active': '#ff3b38',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // MM
        mm: {
          primary: '#f60000',
          'primary-light': '#e00b15',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(217, 88, 88)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Diskagua
        diskagua: {
          primary: '#448aff',
          'primary-light': '#7aa7f4',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(98, 103, 255)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Microtec
        microtec: {
          primary: '#f99d26',
          'primary-light': '#ffd038',
          'primary-light-shadow': '#1a442b3a',
          'link-active': '#ffc400',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Prudentina
        prudentina: {
          primary: '#0000ff',
          'primary-light': '#3232ff',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(81, 85, 194)',
          'font-color': '#fff',
          'font-color-light': '#fff',
        },

        // Barone
        barone: {
          primary: '#d90000',
          'primary-light': '#c00812',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(194, 81, 81)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Atacado
        atacado: {
          primary: '#d90000',
          'primary-light': '#c00812',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(194, 81, 81)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Farmsrugs
        farmsrugs: {
          primary: '#afafaf',
          'primary-light': '#b1a9a9',
          'primary-light-shadow': '#e5e5e5',
          'font-color': '#3f3f3f',
          'font-color-light': '#000',
        },

        // HVS
        hvs: {
          primary: '#000000',
          'primary-light': '#484849',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(80, 80, 80)',
          'font-color': '#fff',
          'font-color-light': '#fff',
        },

        // Southair
        southair: {
          primary: '#765f47',
          'primary-light': '#ba9f84',
          'primary-light-shadow': '#1a442b3a',
          'font-color': '#000',
          'font-color-light': '#1a442b3a',
        },

        // CLX
        clx: {
          primary: '#000',
          'primary-light': '#000',
          'primary-light-shadow': '#000',
          'link-active': '#000',
          'font-color': '#000',
          'font-color-light': '#fff',
        },

        // Awsmetal
        awsmetal: {
          primary: '#000000',
          'primary-light': '#484849',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(80, 80, 80)',
          'font-color': '#fff',
          'font-color-light': '#fff',
        },

        // Teste
        teste: {
          primary: '#000',
          'primary-light': '#000',
          'primary-light-shadow': '#000',
          'link-active': '#000',
          'font-color': '#000',
          'font-color-light': '#fff',
        },

        // Frigorichter
        frigorichter: {
          primary: '#fa4949',
          'primary-light': '#e00b15',
          'primary-light-shadow': '#1a442b3a',
          'link-active': 'rgb(217, 88, 88)',
          'font-color': '#343a40',
          'font-color-light': '#fff',
        },

        // Fase
        fase: {
          primary: '#5c15eb',
          'primary-light': '#c5aaff',
          'primary-light-shadow': '#ffc71a',
          'link-active': '#191818',
          'font-color': '#343a40',
          'font-color-light': '#f1f1f1',
        },
      }
    },
  },
  plugins: []
}
