<script setup lang="ts">
import { Layout } from 'ant-design-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'
import StepProgress from '@/components/shared/StepProgress.vue'

const { Content } = Layout
</script>

<template>
  <Layout style="height: 100vh">
    <AppSider />
    <Layout>
      <AppHeader />
      <Content style="overflow: auto; padding: 16px">
        <StepProgress />
        <RouterView />
      </Content>
    </Layout>
  </Layout>
</template>
