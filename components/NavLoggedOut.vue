<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense nav>
        <v-list-item to="/" nuxt>
          <template #prepend>
            <Icon name="mdi:home" size="20" />
          </template>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item to="/auth/login">
          <template #prepend>
            <Icon name="mdi:login" size="20" />
          </template>
          <v-list-item-title>Sign In</v-list-item-title>
        </v-list-item>

        <v-list-item to="/auth/register">
          <template #prepend>
            <Icon name="mdi:account-plus" size="20" />
          </template>
          <v-list-item-title>Sign Up</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="frosted-navbar" scroll-behavior="elevate">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <Icon name="mdi:rocket-launch" size="32" class="mr-3" />
      <v-toolbar-title class="font-weight-bold">
        MinecraftME Tracker
      </v-toolbar-title>

      <v-spacer />

      <v-btn variant="text" icon class="mr-2" @click="themeStore.toggleTheme">
        <Icon :name="themeStore.getThemeIcon" size="20" />
      </v-btn>

      <v-btn to="/auth/login" variant="outlined" color="white" class="mr-2">
        <Icon name="mdi:login" class="mr-2" />
        Sign In
      </v-btn>
      <v-btn to="/auth/register" variant="elevated" color="primary">
        <Icon name="mdi:account-plus" class="mr-2" />
        Sign Up
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useThemeStore } from '~/stores/theme'

  const drawer = ref(false)
  const themeStore = useThemeStore()
</script>

<style lang="scss">
  .frosted-navbar {
    transition: all 0.3s ease;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);

    // Dark theme background
    .v-theme--dark & {
      background: rgba(18, 18, 18, 0.9) !important;
    }

    // Light theme background
    .v-theme--light & {
      background: rgba(255, 255, 255, 0.9) !important;
    }

    .v-app-bar--is-scrolled {
      .v-toolbar-title,
      .v-btn,
      .v-app-bar-nav-icon {
        color: rgb(var(--v-theme-primary)) !important;
      }
    }
  }
</style>
