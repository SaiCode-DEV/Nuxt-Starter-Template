<template>
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list dense nav>
      <v-list-item to="/" nuxt>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>SaiCode's Nuxt Template</v-toolbar-title>
    <v-spacer />
    <v-list-item prepend-icon="mdi-account-circle" :title="data?.user?.name || 'Unknown'" />
    <v-list-item prepend-icon="mdi-logout-variant" title="Sign out" @click="signOut({ callbackUrl: '/auth/login' })" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);

const { data, signOut } = useAuth()
</script>
