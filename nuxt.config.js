import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
  },
  head: {
    title: 'x5',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ]
  },

  css: ['~/assets/style/app.scss'],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  plugins: [
    '@/plugins/axios'
  ],

  modules: [
    '@nuxtjs/axios',
    ['nuxt-express-module']
  ],

  loading: {
    color: '#7E57C2',
    height: '5px'
  },

  vuetify: {
    customVariables: ['~/assets/style/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green
        }
      }
    }
  },

  build: {}
}
