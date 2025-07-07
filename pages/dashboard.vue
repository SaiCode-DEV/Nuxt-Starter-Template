<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="12" md="6" class="text-center">
        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 150px"
        >
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </div>
        <div v-else>
          <h1 class="text-h4 mb-4">{{ $t('dashboard.title') }}</h1>
          <p class="text-h1 font-weight-bold mb-8">{{ count }}</p>
          <v-btn
            color="primary"
            class="mr-4"
            :disabled="count === null"
            @click="updateCountRequest(count! + 1)"
          >
            <v-icon left>mdi-plus</v-icon>
            {{ $t('dashboard.increment') }}
          </v-btn>
          <v-btn
            color="secondary"
            :disabled="count === null"
            @click="updateCountRequest(count! - 1)"
          >
            <v-icon left>mdi-minus</v-icon>
            {{ $t('dashboard.decrement') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useCountStore } from '~/stores/count'

  const { t } = useI18n()
  const countStore = useCountStore()
  const { count, loading } = storeToRefs(countStore)
  const { updateCountRequest } = countStore

  // Page meta
  definePageMeta({
    // middleware: 'auth' // Example: If you want to protect this page
  })

  // Use Nuxt Head for SEO
  useHead({
    title: t('dashboard.seo.title'),
    meta: [
      {
        name: 'description',
        content: t('dashboard.seo.description'),
      },
    ],
  })
</script>

<style scoped>
  /* Add any specific styles for your dashboard here */
</style>
