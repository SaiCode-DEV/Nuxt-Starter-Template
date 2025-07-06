<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Notification />
  </v-app>
</template>

<script setup lang="ts">
  import { useCountStore } from '~/stores/count'
  import { useThemeStore } from '~/stores/theme'

  // Initialize theme system
  const themeStore = useThemeStore()
  const countStore = useCountStore()

  onMounted(() => {
    themeStore.initTheme()
    countStore.init()
  })
</script>

<style>
  /* You can add global styles here if needed */
</style>
