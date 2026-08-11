<script setup lang="ts">
import { Layout, Space } from 'ant-design-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'
import StepProgress from '@/components/shared/StepProgress.vue'

const { Content } = Layout
</script>

<template>
  <Layout style="min-height: 100vh">
    <AppSider />
    <Layout>
      <AppHeader />
      <Content>
        <Space direction="vertical" size="middle">
          <StepProgress />
          <RouterView />
        </Space>
      </Content>
    </Layout>
  </Layout>
</template>
