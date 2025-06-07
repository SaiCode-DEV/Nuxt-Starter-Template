import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export type ThemeMode = 'system' | 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('system')
  const vuetifyTheme = useTheme()

  // Load saved theme mode from localStorage
  const loadThemeMode = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme-mode') as ThemeMode
      if (saved && ['system', 'light', 'dark'].includes(saved)) {
        mode.value = saved
      }
    }
  }

  // Save theme mode to localStorage
  const saveThemeMode = (newMode: ThemeMode) => {
    if (import.meta.client) {
      localStorage.setItem('theme-mode', newMode)
    }
  }

  // Apply theme based on mode
  const applyTheme = () => {
    if (!import.meta.client) return

    let targetTheme = 'dark'

    if (mode.value === 'system') {
      targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      targetTheme = mode.value
    }

    vuetifyTheme.global.name.value = targetTheme
  }

  // Set theme mode
  const setThemeMode = (newMode: ThemeMode) => {
    mode.value = newMode
    saveThemeMode(newMode)
    applyTheme()
  }

  // Toggle through theme modes: system -> light -> dark -> system
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['system', 'light', 'dark']
    const currentIndex = modes.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  // Initialize theme
  const initTheme = () => {
    loadThemeMode()
    applyTheme()

    // Listen for system theme changes when in system mode
    if (import.meta.client) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (mode.value === 'system') {
          applyTheme()
        }
      })
    }
  }

  // Get current effective theme (what's actually being used)
  const getCurrentTheme = computed(() => {
    if (mode.value === 'system') {
      if (import.meta.client) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'dark' // fallback for SSR
    }
    return mode.value
  })

  // Get icon for current theme mode
  const getThemeIcon = computed(() => {
    switch (mode.value) {
      case 'system':
        return 'mdi:theme-light-dark'
      case 'light':
        return 'mdi:white-balance-sunny'
      case 'dark':
        return 'mdi:moon-waning-crescent'
      default:
        return 'mdi:theme-light-dark'
    }
  })

  return {
    mode: readonly(mode),
    setThemeMode,
    toggleTheme,
    initTheme,
    getCurrentTheme,
    getThemeIcon
  }
})
