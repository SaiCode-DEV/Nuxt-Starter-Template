<template>
    <div class="d-flex align-center justify-center" style="height: 100vh">
        <v-hover v-slot="{ isHovering, props }">
            <v-card title="Create new account" theme="customDark" v-bind="props" :elevation="isHovering ? 24 : 6"
                rounded="xl" width="400" class="mx-auto pa-10">
                <v-form v-model="form" @submit.prevent="register">
                    <v-text-field v-model="username" label="Username" :rules="[rules.required]"></v-text-field>

                    <v-text-field v-model="email" type="email" label="Email"
                        :rules="[rules.required, rules.email]"></v-text-field>

                    <v-text-field type="password" v-model="password" label="Password"
                        :rules="[rules.required]"></v-text-field>

                    <v-btn :disabled="!form" type="submit" color="primary" block class="mt-2">Register</v-btn>
                </v-form>
                <v-btn color="primary" block class="mt-2" to="/auth/login" nuxt>Sign in</v-btn>
            </v-card>
        </v-hover>
    </div>
</template>

<script setup>
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification()


definePageMeta({
    layout: "auth",
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    }
})

const username = ref('')
const email = ref('')
const password = ref('')

const form = ref(false)
const rules = ref({
    required: v => !!v || 'Field is required',
    email: v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
})

const register = async () => {
    try {
        const { data, error } = await useFetch(`/api/auth/register`, {
            method: "POST",
            body: {
                username: username.value,
                email: email.value,
                password: password.value
            }
        })

        if (error.value) {
            notify({
                title: 'Registration failed',
                text: error.value.data?.message || 'An error occurred while registering your account.',
                type: 'error'
            })
            return
        }
        
        if (data.value) {
            notify({
                title: 'Registration successful',
                text: 'Your account has been created successfully. You can now log in.',
                type: 'success'
            })
            await navigateTo('/auth/login')
        }
    } catch (error) {
        console.error('Registration error:', error)
        notify({
            title: 'Registration failed',
            text: 'An unexpected error occurred. Please try again.',
            type: 'error'
        })
    }
}
</script>