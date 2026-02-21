<template>
  <NavLoggedIn v-if="loggedIn" />
  <NavLoggedOut v-else />
</template>

<script setup lang="ts">
  const { loggedIn } = useUserSession()
</script>
