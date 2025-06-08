// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@prisma/nuxt',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@sidebase/nuxt-auth',
    '@nuxt/icon',
  ],
  image: {
    // IPX is the default provider. You can add options here if needed.
    // Example:
    // ipx: {
    //   maxAge: 3600 // Cache images for 1 hour
    // }
  },
  auth: {
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
    },
  },
  build: {
    transpile: ['vue-chartjs', 'chart.js', 'chartjs-plugin-zoom'],
  },
  vite: {
    optimizeDeps: {
      include: ['hammerjs'],
    },
  },
  routeRules: {},

  runtimeConfig: {
    public: {
      // Variables in public are exposed client-side
    },
    // Variables here are only available server-side
    useDummyData: true,
  },
})
