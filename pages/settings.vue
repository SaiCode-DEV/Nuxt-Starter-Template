<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4" rounded="xl">
          <v-card-title class="d-flex align-center pa-6">
            <Icon name="mdi:cog" size="24" class="mr-3" />
            <span class="text-h5">Account Settings</span>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <!-- Profile Picture Section -->
            <div class="text-center mb-8">
              <v-avatar size="120" class="mb-4">
                <v-img
                  v-if="profilePictureUrl"
                  :src="profilePictureUrl"
                  :alt="session?.user?.name || 'Profile Picture'"
                />
                <Icon v-else name="mdi:account" size="60" />
              </v-avatar>

              <div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi:camera"
                  class="mb-2"
                  :loading="uploadingImage"
                  @click="triggerFileInput"
                >
                  Change Picture
                </v-btn>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleFileSelect"
                />

                <div v-if="profilePictureUrl" class="mt-2">
                  <v-btn
                    color="error"
                    variant="text"
                    size="small"
                    :loading="removingImage"
                    @click="removeProfilePicture"
                  >
                    Remove Picture
                  </v-btn>
                </div>
              </div>
            </div>

            <v-divider class="mb-6" />

            <!-- Email Update Form -->
            <v-form
              v-model="emailForm"
              class="mb-8"
              @submit.prevent="updateEmail"
            >
              <h3 class="text-h6 mb-4 d-flex align-center">
                <Icon name="mdi:email" size="20" class="mr-2" />
                Email Address
              </h3>

              <v-text-field
                v-model="newEmail"
                label="Email Address"
                type="email"
                :rules="emailRules"
                variant="outlined"
                prepend-inner-icon="mdi:email"
                :readonly="updatingEmail"
              />

              <v-btn
                type="submit"
                color="primary"
                :disabled="!emailForm || newEmail === session?.user?.email"
                :loading="updatingEmail"
                prepend-icon="mdi:content-save"
                block
              >
                Update Email
              </v-btn>
            </v-form>

            <v-divider class="mb-6" />

            <!-- Password Update Form -->
            <v-form v-model="passwordForm" @submit.prevent="updatePassword">
              <h3 class="text-h6 mb-4 d-flex align-center">
                <Icon name="mdi:lock" size="20" class="mr-2" />
                Change Password
              </h3>

              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi:lock"
                :readonly="updatingPassword"
                class="mb-4"
              />

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                :rules="passwordRules"
                variant="outlined"
                prepend-inner-icon="mdi:lock-plus"
                :readonly="updatingPassword"
                class="mb-4"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                :rules="confirmPasswordRules"
                variant="outlined"
                prepend-inner-icon="mdi:lock-check"
                :readonly="updatingPassword"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                :disabled="!passwordForm"
                :loading="updatingPassword"
                prepend-icon="mdi:content-save"
                block
              >
                Update Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useNotification } from '@kyvg/vue3-notification'

  // Meta and auth
  definePageMeta({
    middleware: 'sidebase-auth',
  })

  useHead({
    title: 'Settings - Account Management',
    meta: [
      {
        name: 'description',
        content:
          'Manage your account settings, update profile picture, email, and password.',
      },
    ],
  })

  // Composables
  const { data: session, refresh } = useAuth()
  const { notify } = useNotification()

  // Refs
  const fileInput = ref<HTMLInputElement>()
  const profilePictureUrl = ref(session.value?.user?.image || '')
  const newEmail = ref(session.value?.user?.email || '')

  // Form states
  const emailForm = ref(false)
  const passwordForm = ref(false)

  // Loading states
  const uploadingImage = ref(false)
  const removingImage = ref(false)
  const updatingEmail = ref(false)
  const updatingPassword = ref(false)

  // Password fields
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')

  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'This field is required',
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Please enter a valid email address'
    },
    minLength: (min: number) => (value: string) =>
      value.length >= min || `Password must be at least ${min} characters`,
  }

  const emailRules = [rules.required, rules.email]
  const passwordRules = [rules.required, rules.minLength(6)]
  const confirmPasswordRules = [
    rules.required,
    (value: string) => value === newPassword.value || 'Passwords do not match',
  ]

  // Methods
  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const handleFileSelect = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notify({
        title: 'Invalid File',
        text: 'Please select a valid image file.',
        type: 'error',
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      notify({
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB.',
        type: 'error',
      })
      return
    }

    uploadingImage.value = true

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = (await $fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
      })) as { data?: { profilePicture?: string }; message?: string }
      profilePictureUrl.value = response.data?.profilePicture || ''
      notify({
        title: 'Success',
        text: 'Profile picture updated successfully!',
        type: 'success',
      })

      // Trigger session refresh to update user data
      await refresh()

      // Force page refresh to ensure session data is updated
      await navigateTo('/settings', { replace: true })
    } catch (error: unknown) {
      console.error('Upload error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update profile picture. Please try again.'
      notify({
        title: 'Upload Failed',
        text: errorMessage,
        type: 'error',
      })
    } finally {
      uploadingImage.value = false
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }

  const removeProfilePicture = async () => {
    removingImage.value = true

    try {
      await $fetch('/api/user/profile-picture', {
        method: 'DELETE',
      })
      profilePictureUrl.value = ''
      notify({
        title: 'Success',
        text: 'Profile picture removed successfully!',
        type: 'success',
      })

      // Trigger session refresh to update user data
      await refresh()

      // Force page refresh to ensure session data is updated
      await navigateTo('/settings', { replace: true })
    } catch (error: unknown) {
      console.error('Remove error:', error)
      const errorObj = error as { data?: { message?: string } }
      notify({
        title: 'Remove Failed',
        text:
          errorObj.data?.message ||
          'Failed to remove profile picture. Please try again.',
        type: 'error',
      })
    } finally {
      removingImage.value = false
    }
  }

  const updateEmail = async () => {
    updatingEmail.value = true

    try {
      await $fetch('/api/user/email', {
        method: 'PUT',
        body: { email: newEmail.value },
      })
      notify({
        title: 'Success',
        text: 'Email updated successfully!',
        type: 'success',
      })

      // Trigger session refresh to update user data
      await refresh()

      // Force page refresh to ensure session data is updated
      await navigateTo('/settings', { replace: true })
    } catch (error: unknown) {
      console.error('Email update error:', error)
      const errorObj = error as { data?: { message?: string } }
      notify({
        title: 'Update Failed',
        text:
          errorObj.data?.message || 'Failed to update email. Please try again.',
        type: 'error',
      })
    } finally {
      updatingEmail.value = false
    }
  }

  const updatePassword = async () => {
    updatingPassword.value = true

    try {
      await $fetch('/api/user/password', {
        method: 'PUT',
        body: {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
        },
      })

      // Clear password fields
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      notify({
        title: 'Success',
        text: 'Password updated successfully!',
        type: 'success',
      })
    } catch (error: unknown) {
      console.error('Password update error:', error)
      const errorObj = error as { data?: { message?: string } }
      notify({
        title: 'Update Failed',
        text:
          errorObj.data?.message ||
          'Failed to update password. Please try again.',
        type: 'error',
      })
    } finally {
      updatingPassword.value = false
    }
  }

  // Initialize profile picture from session
  watch(
    () => session.value?.user?.image,
    newImage => {
      if (newImage) {
        profilePictureUrl.value = newImage
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  .v-avatar {
    border: 3px solid rgb(var(--v-theme-primary));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .v-card {
    border: 1px solid rgba(var(--v-theme-primary), 0.12);
  }
</style>
