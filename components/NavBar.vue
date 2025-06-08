<template>
  <NavLoggedIn v-if="status === 'authenticated'" />
  <NavLoggedOut v-else />
</template>

<script setup lang="ts">
  const { status } = useAuth()
</script>
