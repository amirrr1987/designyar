<script setup lang="ts">
import { computed } from 'vue'
import { Space, Typography } from 'ant-design-vue'
import ProjectSynthesisPanel from '@/components/synthesis/ProjectSynthesisPanel.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseHero from '@/components/shared/PhaseHero.vue'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const { Paragraph, Text } = Typography
const projectStore = useProjectStore()
const copy = fa.synthesis

const isJunior = computed(() => projectStore.isJuniorMode)
const description = computed(() =>
  isJunior.value ? copy.descriptionJunior : copy.descriptionFull,
)
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <PhaseHero
      :title="copy.title"
      :description="description"
      color="#722ed1"
      :badge="copy.badge"
    />

    <Paragraph v-if="isJunior" type="secondary">
      <Text strong>{{ fa.dodHeading }}</Text>
      {{ ' ' }}یک یادداشت جمع‌بندی یا تحلیل AI ذخیره شده باشد.
    </Paragraph>

    <ProjectSynthesisPanel />

    <PhaseFlowNav current-key="synthesis" />
  </Space>
</template>
