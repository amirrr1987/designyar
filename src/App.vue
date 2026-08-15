<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useConfigProviderStore } from './stores/configProvider.store'

const configProviderStore = useConfigProviderStore()
</script>

<template>
  <ConfigProvider
    :locale="configProviderStore.locale"
    :direction="configProviderStore.direction"
    :component-size="configProviderStore.componentSize"
    :theme="configProviderStore.theme"
  >
    <AppLayout />
  </ConfigProvider>
</template>
