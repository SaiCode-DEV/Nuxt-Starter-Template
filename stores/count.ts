import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { readonly, ref } from 'vue'

export const useCountStore = defineStore('count', () => {
  const count = ref<number | null>(null)
  const loading = ref(true)
  let socket: Socket | null = null

  const fetchCount = async () => {
    try {
      const data = await $fetch<{ count: number }>('/api/test/count')
      count.value = data.count
    } catch (error) {
      console.error('Error fetching count:', error)
    } finally {
      loading.value = false
    }
  }

  const updateCountRequest = async (newCount: number) => {
    try {
      await $fetch('/api/test/count', {
        method: 'PUT',
        body: { count: newCount },
      })
    } catch (error) {
      console.error('Error updating count:', error)
    }
  }

  const connect = () => {
    if (socket?.connected) return

    socket = io()

    socket.on('connect', () => {
      console.log('Socket.io connection established')
    })

    socket.on('count_update', (data: { count: number }) => {
      count.value = data.count
    })

    socket.on('disconnect', () => {
      console.log('Socket.io connection disconnected')
    })

    socket.on('connect_error', err => {
      console.error('Socket.io connection error:', err)
    })
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  const init = () => {
    if (import.meta.client) {
      loading.value = true
      fetchCount()
      connect()
    }
  }

  return {
    count: readonly(count),
    loading: readonly(loading),
    init,
    updateCountRequest,
    disconnect,
  }
})
