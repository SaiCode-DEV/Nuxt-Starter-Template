<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="12" md="6" class="text-center">
        <div
          v-if="loading && true"
          class="d-flex justify-center align-center"
          style="height: 150px"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <h1 class="text-h4 mb-4">Test Count</h1>
          <p class="text-h1 font-weight-bold mb-8">{{ count }}</p>
          <v-btn
            color="primary"
            class="mr-4"
            @click="updateCountRequest(count! + 1)"
          >
            <v-icon left>mdi-plus</v-icon>
            Increment
          </v-btn>
          <v-btn color="secondary" @click="updateCountRequest(count! - 1)">
            <v-icon left>mdi-minus</v-icon>
            Decrement
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import type { Socket } from 'socket.io-client'
  import { io } from 'socket.io-client'
  import { onMounted, onUnmounted, ref } from 'vue'

  const count = ref<number | null>(null)
  const loading = ref(true)
  let socket: Socket | null = null

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/test/count')
      if (!response.ok) {
        throw new Error('Failed to fetch count')
      }
      const data = await response.json()
      count.value = data.count
    } catch (error) {
      console.error('Error fetching count:', error)
    } finally {
      loading.value = false
    }
  }

  const updateCountRequest = async (newCount: number) => {
    try {
      await fetch('/api/test/count', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: newCount }),
      })
    } catch (error) {
      console.error('Error updating count:', error)
    }
  }

  onMounted(() => {
    // Initial fetch of the count
    fetchCount()

    // Connect to the socket.io server
    socket = io()

    // Listen for count updates from the server
    socket.on('count_update', (data: { count: number }) => {
      count.value = data.count
    })

    socket.on('connect', () => {
      console.log('Socket.io connection established')
    })

    socket.on('disconnect', () => {
      console.log('Socket.io connection disconnected')
    })

    socket.on('connect_error', err => {
      console.error('Socket.io connection error:', err)
    })
  })

  onUnmounted(() => {
    if (socket) {
      socket.disconnect()
    }
  })

  // Page meta
  definePageMeta({
    // middleware: 'auth' // Example: If you want to protect this page
  })

  // Use Nuxt Head for SEO
  useHead({
    title: 'Dashboard - Test Count',
    meta: [
      {
        name: 'description',
        content: 'Dashboard to manage the test count.',
      },
    ],
  })
</script>

<style scoped>
  /* Add any specific styles for your dashboard here */
</style>
