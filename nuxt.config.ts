// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  experimental: {
    componentIslands: true,
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
    '@nuxtjs/i18n',
  ],
  image: {
    presets: {
      avatar: {
        modifiers: {
          width: 32,
          height: 32,
        },
      },
    },
    ipx: {
      maxAge: 3600, // Cache images for 1 hour
    },
  },
  auth: {
    originEnvKey: 'AUTH_ORIGIN',
    provider: {
      type: 'authjs',
      trustHost: true,
    },
    sessionRefresh: {
      enablePeriodically: 30_000,
      enableOnWindowFocus: true,
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
    resolve: {
      alias: {
        '.prisma/client/index-browser':
          './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  routeRules: {},
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
  },
  runtimeConfig: {
    public: {
      // Variables in public are exposed client-side
    },
    // Variables here are only available server-side
    useDummyData: true,
  },
})
