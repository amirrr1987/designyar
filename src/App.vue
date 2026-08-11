<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import faIR from 'ant-design-vue/es/locale/fa_IR'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <ConfigProvider :locale="faIR" direction="rtl" component-size="middle">
    <AppLayout />
  </ConfigProvider>
</template>
