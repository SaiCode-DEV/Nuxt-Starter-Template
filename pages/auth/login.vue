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
  const { signIn } = useAuth()
  const { notify } = useNotification()
  const { t, locales, setLocale } = useI18n()
  const localePath = useLocalePath()

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
    required: value => !!value || t('login.fieldRequired'),
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
          title: t('login.notification.loginFailed.title'),
          text: t('login.notification.loginFailed.invalidCredentials'),
          type: 'error',
          duration: 10000,
        })
        return
      }

      if (response?.ok) {
        notify({
          title: t('login.notification.loginSuccess.title'),
          text: t('login.notification.loginSuccess.message'),
          type: 'success',
        })
        await navigateTo(localePath(useRelativeCallbackUrl(useRoute()).value))
      }
    } catch {
      notify({
        title: t('login.notification.loginFailed.title'),
        text: t('login.notification.loginFailed.unexpectedError'),
        type: 'error',
      })
    }
  }
</script>
