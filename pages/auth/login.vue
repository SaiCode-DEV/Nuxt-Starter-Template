<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        title="Sign in"
        theme="customDark"
        v-bind="props"
        :elevation="isHovering ? 24 : 6"
        rounded="xl"
        width="400"
        class="mx-auto pa-10"
      >
        <v-form v-model="form" @submit.prevent="login(username, password)">
          <v-text-field
            v-model="username"
            label="Username"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :rules="[rules.required]"
          />

          <v-btn
            :disabled="!form"
            type="submit"
            color="primary"
            block
            class="mt-2"
            >Sign In</v-btn
          >
        </v-form>
        <v-btn color="primary" block class="mt-2" to="/auth/register" nuxt
          >Create new account</v-btn
        >
      </v-card>
    </v-hover>
  </div>
</template>

<script setup>
  import { useNotification } from '@kyvg/vue3-notification'
  const { signIn } = useAuth()
  const { notify } = useNotification()

  definePageMeta({
    layout: 'auth',
    auth: {
      unauthenticatedOnly: true,
      navigateAuthenticatedTo: '/',
    },
  })

  const username = ref('')
  const password = ref('')

  const form = ref(false)
  const rules = ref({
    required: value => !!value || 'Field is required',
  })

  const login = async (username, password) => {
    try {
      const response = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (response?.error) {
        notify({
          title: 'Login failed',
          text: 'Invalid username or password. Please try again.',
          type: 'error',
          duration: 10000,
        })
        return
      }

      if (response?.ok) {
        notify({
          title: 'Success',
          text: 'Login successful! Welcome back.',
          type: 'success',
        })
        await navigateTo(useRelativeCallbackUrl(useRoute()).value)
      }
    } catch (error) {
      console.error('Login error:', error)
      notify({
        title: 'Login failed',
        text: 'An unexpected error occurred. Please try again.',
        type: 'error',
      })
    }
  }
</script>
