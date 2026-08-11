<script setup lang="ts">
import { Layout, Space } from 'ant-design-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'
import SoftGateModal from '@/components/shell/SoftGateModal.vue'

const { Content } = Layout
</script>

<template>
  <Layout style="height: 100vh">
    <AppSider />
    <Layout>
      <AppHeader />
      <Content style="padding: 24px; overflow: auto">
        <Space direction="vertical" size="large" style="width: 100%">
          <RouterView />
        </Space>
      </Content>
    </Layout>
    <SoftGateModal />
  </Layout>
</template>
