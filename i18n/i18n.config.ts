export default defineI18nConfig(() => {
  return {
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
