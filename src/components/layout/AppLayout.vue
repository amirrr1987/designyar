<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Layout } from 'ant-design-vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const { Content } = Layout
const route = useRoute()

const isOnboarding = computed(() => route.meta.layout === 'onboarding')
</script>

<template>
  <Layout class="font-sans h-svh">
    <div
      v-if="isOnboarding"
      class="flex min-h-svh w-full flex-col items-center justify-center p-4 md:p-8"
    >
      <div class="flex w-full max-w-3xl flex-col">
        <RouterView />
      </div>
    </div>
    <div v-else class="ms-auto me-auto flex h-svh w-full max-w-7xl flex-col">
      <AppHeader />
      <Content class="overflow-y-auto p-4">
        <div class="flex w-full flex-col gap-6">
          <RouterView />
        </div>
      </Content>
    </div>
  </Layout>
</template>
