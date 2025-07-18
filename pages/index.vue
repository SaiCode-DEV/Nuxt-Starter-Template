<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          class="hero-section d-flex align-center justify-center"
          :height="$vuetify.display.mdAndUp ? '80vh' : '70vh'"
          flat
          :color="$vuetify.theme.current.dark ? 'grey-darken-4' : 'primary'"
        >
          <v-container>
            <v-row justify="center" align="center">
              <v-col cols="12" md="8" lg="6" class="text-center">
                <v-fade-transition appear>
                  <div>
                    <Icon
                      name="material-symbols:rocket-launch"
                      :size="$vuetify.display.mdAndUp ? 120 : 80"
                      class="mb-6 hero-icon text-white"
                    />
                    <h1 class="hero-title text-white mb-4">
                      {{ $t('index.hero.title') }}
                    </h1>
                    <p class="hero-subtitle text-white mb-8">
                      {{ $t('index.hero.subtitle') }}
                    </p>
                    <div
                      class="d-flex flex-column flex-sm-row ga-4 justify-center"
                    >
                      <v-btn
                        v-if="!status || status === 'unauthenticated'"
                        size="large"
                        variant="elevated"
                        color="white"
                        class="text-primary px-8"
                        @click="navigateTo(localePath('/auth/login'))"
                      >
                        <Icon name="mdi:login" class="mr-2" />
                        {{ $t('index.hero.getStarted') }}
                      </v-btn>
                      <v-btn
                        v-else
                        size="large"
                        variant="elevated"
                        color="white"
                        class="text-primary px-8"
                        @click="navigateTo(localePath('/dashboard'))"
                      >
                        <Icon name="mdi:view-dashboard" class="mr-2" />
                        {{ $t('index.hero.goToDashboard') }}
                      </v-btn>
                      <v-btn
                        size="large"
                        variant="outlined"
                        color="white"
                        class="px-8"
                        href="https://github.com/SaiCode-DEV/Nuxt-Starter-Template"
                        target="_blank"
                      >
                        <Icon name="mdi:github" class="mr-2" />
                        {{ $t('index.hero.viewOnGithub') }}
                      </v-btn>
                    </div>
                  </div>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h3 font-weight-bold mb-4">
            {{ $t('index.features.title') }}
          </h2>
          <p class="text-h6 text-medium-emphasis">
            {{ $t('index.features.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="feature in features"
          :key="feature.title"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card :height="280" class="feature-card" elevation="2" hover>
            <v-card-text
              class="text-center d-flex flex-column justify-center h-100"
            >
              <div
                class="mb-4 mx-auto d-flex align-center justify-center"
                style="width: 64px; height: 64px"
              >
                <Icon
                  :name="feature.icon"
                  size="48"
                  :style="{ color: feature.color }"
                />
              </div>
              <h3 class="text-h6 font-weight-bold mb-3">
                {{ $t(feature.title) }}
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ $t(feature.description) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Getting Started Section -->
    <v-container class="py-16 overflow-hidden">
      <v-card
        :title="$t('index.quickStart.title')"
        class="pa-6 pb-0"
        elevation="4"
        variant="tonal"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-timeline side="end" align="start" truncate-line="start">
              <v-timeline-item
                v-for="(step, index) in quickStartSteps"
                :key="index"
                :dot-color="step.color"
                size="small"
              >
                <template #icon>
                  <Icon :name="step.icon" size="16" color="white" />
                </template>
                <v-card elevation="2" class="mb-4">
                  <v-card-title class="text-h6">
                    {{ $t(step.title) }}
                  </v-card-title>
                  <v-card-text>
                    {{ $t(step.description) }}
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center justify-center">
            <v-card
              elevation="8"
              class="code-preview"
              max-width="400"
              :color="
                $vuetify.theme.current.dark ? 'grey-darken-3' : 'grey-lighten-4'
              "
            >
              <v-card-title class="d-flex align-center">
                <Icon name="mdi:console" class="mr-2" />
                Terminal
              </v-card-title>
              <v-card-text>
                <pre class="code-block">
<span class="text-green">$</span> npm install
<span class="text-green">$</span> npm run dev
<span class="text-yellow">→</span> Ready on http://localhost:3000
              </pre>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
  // Auth composable
  const { status } = useAuth()
  const { t } = useI18n()
  const localePath = useLocalePath()

  // Page meta
  definePageMeta({
    auth: false,
  })

  // Use Nuxt Head for SEO
  useHead({
    title: t('index.seo.title'),
    meta: [
      {
        name: 'description',
        content: t('index.seo.description'),
      },
    ],
  })

  // Features data
  const features = ref([
    {
      title: 'index.features.nuxt.title',
      description: 'index.features.nuxt.description',
      icon: 'logos:nuxt-icon',
      color: '#00DC82',
    },
    {
      title: 'index.features.vuetify.title',
      description: 'index.features.vuetify.description',
      icon: 'logos:vuetifyjs',
      color: '#1976D2',
    },
    {
      title: 'index.features.auth.title',
      description: 'index.features.auth.description',
      icon: 'mdi:shield-check',
      color: '#FF9800',
    },
    {
      title: 'index.features.typescript.title',
      description: 'index.features.typescript.description',
      icon: 'logos:typescript-icon',
      color: '#3178C6',
    },
    {
      title: 'index.features.prisma.title',
      description: 'index.features.prisma.description',
      icon: 'logos:prisma',
      color: '#2D3748',
    },
    {
      title: 'index.features.tooling.title',
      description: 'index.features.tooling.description',
      icon: 'mdi:tools',
      color: '#9C27B0',
    },
  ])

  // Quick start steps
  const quickStartSteps = ref([
    {
      title: 'index.quickStart.clone.title',
      description: 'index.quickStart.clone.description',
      icon: 'mdi-download',
      color: 'primary',
    },
    {
      title: 'index.quickStart.configure.title',
      description: 'index.quickStart.configure.description',
      icon: 'mdi-cog',
      color: 'secondary',
    },
    {
      title: 'index.quickStart.run.title',
      description: 'index.quickStart.run.description',
      icon: 'mdi-play',
      color: 'success',
    },
    {
      title: 'index.quickStart.deploy.title',
      description: 'index.quickStart.deploy.description',
      icon: 'mdi-cloud-upload',
      color: 'info',
    },
  ])
</script>

<style lang="scss" scoped>
  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 30% 20%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 50%
      );
  }

  .hero-icon {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  .feature-card {
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .code-preview {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .code-block {
    background: transparent;
    color: inherit;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }

  .text-green {
    color: #4caf50;
  }

  .text-yellow {
    color: #ff9800;
  }

  @media (max-width: 960px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }
  }
</style>
