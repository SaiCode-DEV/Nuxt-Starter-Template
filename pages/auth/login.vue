<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        :title="$t('login.title')"
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
            :label="$t('login.username')"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="password"
            type="password"
            :label="$t('login.password')"
            :rules="[rules.required]"
          />

          <v-btn
            :disabled="!form"
            type="submit"
            color="primary"
            block
            class="mt-2"
            >{{ $t('login.submit') }}</v-btn
          >
        </v-form>

        <div class="d-flex align-center my-3">
          <v-divider />
          <span class="mx-3 text-caption text-medium-emphasis">OR</span>
          <v-divider />
        </div>

        <v-btn
          color="secondary"
          block
          variant="outlined"
          prepend-icon="mdi:fingerprint"
          :loading="passkeyLoading"
          class="mb-2"
          @click="loginWithPasskey"
          >{{ $t('login.passkeySubmit') }}</v-btn
        >

        <v-btn
          color="primary"
          block
          class="mt-2"
          :to="localePath('/auth/register')"
          nuxt
          >{{ $t('login.register') }}</v-btn
        >

        <v-menu offset-y>
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              variant="text"
              class="text-none mt-4"
              block
            >
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
      </v-card>
    </v-hover>
  </div>
</template>

<script setup>
  import { useNotification } from '@kyvg/vue3-notification'
  import { startAuthentication } from '@simplewebauthn/browser'
  const { loggedIn } = useUserSession()
  const { notify } = useNotification()
  const { t, locales, setLocale } = useI18n()
  const localePath = useLocalePath()

  definePageMeta({
    layout: 'auth',
  })

  // Redirect already-authenticated users
  if (loggedIn.value) {
    await navigateTo(localePath('/'))
  }

  const username = ref('')
  const password = ref('')

  const form = ref(false)
  const rules = ref({
    required: value => !!value || t('login.fieldRequired'),
  })

  const login = async (username, password) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })

      notify({
        title: t('login.notification.loginSuccess.title'),
        text: t('login.notification.loginSuccess.message'),
        type: 'success',
      })
      await navigateTo(localePath(useRelativeCallbackUrl(useRoute()).value))
    } catch (error) {
      const statusMessage = error?.data?.statusMessage
      const isInvalidCreds = statusMessage === 'Invalid credentials'
      notify({
        title: t('login.notification.loginFailed.title'),
        text: isInvalidCreds
          ? t('login.notification.loginFailed.invalidCredentials')
          : t('login.notification.loginFailed.unexpectedError'),
        type: 'error',
        duration: 10000,
      })
    }
  }

  const passkeyLoading = ref(false)

  const loginWithPasskey = async () => {
    passkeyLoading.value = true
    try {
      // 1. Get authentication challenge (use username if filled, else discoverable)
      const challengeData = await $fetch('/api/passkey/auth-challenge', {
        method: 'POST',
        body: { username: username.value || undefined },
      })

      // 2. Start the browser authentication ceremony
      let authResponse
      try {
        authResponse = await startAuthentication({ optionsJSON: challengeData })
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Authentication cancelled'
        if (
          msg.includes('cancelled') ||
          msg.includes('abort') ||
          msg.toLowerCase().includes('not allowed')
        ) {
          notify({
            title: 'Cancelled',
            text: 'Passkey authentication was cancelled.',
            type: 'warn',
          })
        } else {
          notify({ title: 'Error', text: msg, type: 'error' })
        }
        return
      }

      // 3. Verify with server — setUserSession is called inside, session is now active
      await $fetch('/api/passkey/auth-verify', {
        method: 'POST',
        body: {
          response: authResponse,
          challengeKey: challengeData.challengeKey,
        },
      })

      notify({
        title: t('login.notification.loginSuccess.title'),
        text: t('login.notification.loginSuccess.message'),
        type: 'success',
      })
      await navigateTo(localePath(useRelativeCallbackUrl(useRoute()).value))
    } catch (error) {
      const message =
        error?.data?.statusMessage ||
        error?.message ||
        t('login.notification.loginFailed.unexpectedError')
      notify({
        title: t('login.notification.loginFailed.title'),
        text: message,
        type: 'error',
      })
    } finally {
      passkeyLoading.value = false
    }
  }
</script>
