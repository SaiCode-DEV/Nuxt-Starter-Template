<template>
  <v-footer
    :color="$vuetify.theme.current.dark ? 'grey-darken-4' : 'grey-lighten-2'"
    class="mt-16"
  >
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <p class="mb-0">
            © {{ new Date().getFullYear() }} SaiCode's Starter Template. Built
            with ❤️ using Nuxt & Vuetify
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-md-end">
          <v-btn
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            :icon="social.icon"
            variant="text"
            size="small"
            target="_blank"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
  // Social links
  const socialLinks = ref([
    {
      name: 'GitHub',
      icon: 'mdi-github',
      url: 'https://github.com',
    },
    {
      name: 'Twitter',
      icon: 'mdi-twitter',
      url: 'https://twitter.com',
    },
    {
      name: 'Discord',
      icon: 'mdi-discord',
      url: 'https://discord.com',
    },
  ])
</script>
