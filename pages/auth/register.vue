<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        :title="$t('register.title')"
        theme="customDark"
        v-bind="props"
        :elevation="isHovering ? 24 : 6"
        rounded="xl"
        width="400"
        class="mx-auto pa-10"
      >
        <v-form v-model="form" @submit.prevent="register">
          <v-text-field
            v-model="username"
            :label="$t('register.username')"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="email"
            type="email"
            :label="$t('register.email')"
            :rules="[rules.required, rules.email]"
          />

          <v-text-field
            v-model="password"
            type="password"
            :label="$t('register.password')"
            :rules="[rules.required]"
          />

          <v-btn
            :disabled="!form"
            type="submit"
            color="primary"
            block
            class="mt-2"
            >{{ $t('register.submit') }}</v-btn
          >
        </v-form>
        <v-btn
          color="primary"
          block
          class="mt-2"
          :to="localePath('/auth/login')"
          nuxt
          >{{ $t('register.login') }}</v-btn
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
  const email = ref('')
  const password = ref('')

  const form = ref(false)
  const rules = ref({
    required: v => !!v || t('register.fieldRequired'),
    email: v =>
      !v ||
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      t('register.emailInvalid'),
  })

  const register = async () => {
    try {
      const { data, error } = await useFetch(`/api/auth/register`, {
        method: 'POST',
        body: {
          username: username.value,
          email: email.value,
          password: password.value,
        },
      })

      if (error.value) {
        notify({
          title: t('register.notification.registrationFailed.title'),
          text:
            error.value.data?.message ||
            t('register.notification.registrationFailed.defaultError'),
          type: 'error',
        })
        return
      }

      if (data.value) {
        notify({
          title: t('register.notification.registrationSuccess.title'),
          text: t('register.notification.registrationSuccess.message'),
          type: 'success',
        })
        await navigateTo('/auth/login')
      }
    } catch {
      notify({
        title: t('register.notification.registrationFailed.title'),
        text: t('register.notification.registrationFailed.unexpectedError'),
        type: 'error',
      })
    }
  }
</script>
