<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Notification />
  </v-app>
</template>

<script setup lang="ts">
  import { useThemeStore } from '~/stores/theme'

  // Initialize theme system
  const themeStore = useThemeStore()

  onMounted(() => {
    themeStore.initTheme()
  })
</script>

<style>
  /* You can add global styles here if needed */
</style>
