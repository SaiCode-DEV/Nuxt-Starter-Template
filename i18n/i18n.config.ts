import { de, en } from 'vuetify/locale'

export default defineI18nConfig(() => {
  return {
    messages: {
      en: {
        $vuetify: {
          ...en,
        },
      },
      de: {
        $vuetify: {
          ...de,
        },
      },
    },
    datetimeFormats: {
      en: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        },
        shortTime: {
          hour: 'numeric',
          minute: 'numeric',
        },
      },
      de: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        },
        shortTime: {
          hour: 'numeric',
          minute: 'numeric',
        },
      },
    },
  }
})
