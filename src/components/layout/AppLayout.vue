<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Layout, Space } from 'ant-design-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'
import StepProgress from '@/components/shared/StepProgress.vue'

const { Content } = Layout
const route = useRoute()

const showStepProgress = computed(() => typeof route.meta.step === 'number')
</script>

<template>
  <Layout style="height: 100vh">
    <AppSider />
    <Layout>
      <AppHeader />
      <Content style="padding: 24px; overflow: auto">
        <Space direction="vertical" size="large" style="width: 100%">
          <StepProgress v-if="showStepProgress" />
          <RouterView />
        </Space>
      </Content>
    </Layout>
  </Layout>
</template>
