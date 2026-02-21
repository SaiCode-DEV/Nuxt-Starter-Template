<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense nav>
        <v-list-item to="/" nuxt>
          <template #prepend>
            <Icon name="mdi:home" size="20" />
          </template>
          <v-list-item-title>{{ $t('navigation.home') }}</v-list-item-title>
        </v-list-item>

        <v-list-item to="/dashboard">
          <template #prepend>
            <Icon name="mdi:view-dashboard" size="20" />
          </template>
          <v-list-item-title>{{
            $t('navigation.dashboard')
          }}</v-list-item-title>
        </v-list-item>

        <v-list-item to="/settings">
          <template #prepend>
            <Icon name="mdi:cog" size="20" />
          </template>
          <v-list-item-title>{{ $t('navigation.settings') }}</v-list-item-title>
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

      <!-- Language Selector -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="text-none">
            <Icon name="mdi:translate" size="20" />
            <span class="ml-2">{{
              locales.find(l => l.code === $i18n.locale)?.name
            }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="locale in locales"
            :key="locale.code"
            @click="setLocale(locale.code)"
          >
            <v-list-item-title>{{ locale.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

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
            <v-list-item-title>{{
              $t('navigation.settings')
            }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item
            @click="
              () =>
                clear().then(() => {
                  navigateTo('/auth/login')
                })
            "
          >
            <template #prepend>
              <Icon name="mdi:logout" />
            </template>
            <v-list-item-title>{{
              $t('navigation.signOut')
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { SessionUser } from '~/lib/types'
  import { useThemeStore } from '~/stores/theme'

  const drawer = ref(false)
  const { user: _user, clear } = useUserSession()
  const user = computed(() => _user.value as SessionUser | undefined)
  const { locales, setLocale } = useI18n()
  const themeStore = useThemeStore()

  // Computed properties for better data handling
  const displayName = computed(() => {
    return user.value?.username || 'User'
  })

  const profileImage = computed(() => {
    return user.value?.image || null
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
