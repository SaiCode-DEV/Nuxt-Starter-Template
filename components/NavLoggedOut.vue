<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense nav>
        <v-list-item :to="localePath('/')" nuxt>
          <template #prepend>
            <Icon name="mdi:home" size="20" />
          </template>
          <v-list-item-title>{{ $t('navigation.home') }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="localePath('/auth/login')">
          <template #prepend>
            <Icon name="mdi:login" size="20" />
          </template>
          <v-list-item-title>{{ $t('navigation.signIn') }}</v-list-item-title>
        </v-list-item>

        <v-list-item :to="localePath('/auth/register')">
          <template #prepend>
            <Icon name="mdi:account-plus" size="20" />
          </template>
          <v-list-item-title>{{ $t('navigation.signUp') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="frosted-navbar" scroll-behavior="elevate">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <Icon name="mdi:rocket-launch" size="32" class="mr-3" />
      <v-toolbar-title class="font-weight-bold">
        {{ $t('navigation.title') }}
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

      <v-btn
        :to="localePath('/auth/login')"
        variant="outlined"
        color="white"
        class="mr-2"
      >
        <Icon name="mdi:login" class="mr-2" />
        {{ $t('navigation.signIn') }}
      </v-btn>
      <v-btn
        :to="localePath('/auth/register')"
        variant="elevated"
        color="primary"
      >
        <Icon name="mdi:account-plus" class="mr-2" />
        {{ $t('navigation.signUp') }}
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useThemeStore } from '~/stores/theme'

  const drawer = ref(false)
  const { locales, setLocale, t } = useI18n()
  const themeStore = useThemeStore()
  const localePath = useLocalePath()
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
