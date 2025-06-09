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

        <v-list-item to="/dashboard">
          <template #prepend>
            <Icon name="mdi:view-dashboard" size="20" />
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item to="/settings">
          <template #prepend>
            <Icon name="mdi:cog" size="20" />
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="frosted-navbar" scroll-behavior="elevate">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <Icon name="mdi:rocket-launch" size="32" />
      <v-toolbar-title class="font-weight-bold">
        SaiCode's Template
      </v-toolbar-title>

      <v-spacer />

      <v-btn variant="text" icon class="mr-2" @click="themeStore.toggleTheme">
        <Icon :name="themeStore.getThemeIcon" size="20" />
      </v-btn>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="text-none">
            <v-avatar size="32" class="mr-2">
              <v-img
                v-if="profileImage"
                :src="profileImage"
                :alt="displayName || 'Profile'"
                cover
              />
              <Icon v-else name="mdi:account-circle" size="32" />
            </v-avatar>
            <span class="text-truncate" style="max-width: 120px">
              {{ displayName }}
            </span>
            <Icon name="mdi:chevron-down" class="ml-2" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/settings">
            <template #prepend>
              <Icon name="mdi:cog" />
            </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="signOut({ callbackUrl: '/auth/login' })">
            <template #prepend>
              <Icon name="mdi:logout" />
            </template>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useThemeStore } from '~/stores/theme'

  const drawer = ref(false)
  const { data, signOut } = useAuth()
  const themeStore = useThemeStore()

  // Computed properties for better data handling
  const displayName = computed(() => {
    return data.value?.user?.name || data.value?.user?.nombre || 'User'
  })

  const profileImage = computed(() => {
    return data.value?.user?.image || data.value?.user?.profilePicture || null
  })
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
