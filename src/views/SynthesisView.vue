<script setup lang="ts">
import { Space } from 'ant-design-vue'
import ProjectSynthesisPanel from '@/components/synthesis/ProjectSynthesisPanel.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'

const description =
  'نمای یکپارچه از تمام داده‌های Design Thinking — با تحلیل AI از کل context پروژه.'
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      title="جمع‌بندی پروژه"
      :description="description"
      color="#722ed1"
      badge="پایان مسیر"
    />

    <ProjectSynthesisPanel />

    <PhaseFlowNav current-key="synthesis" />
  </Space>
</template>
