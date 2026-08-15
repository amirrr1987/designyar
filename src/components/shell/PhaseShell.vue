<script setup lang="ts">
import { computed } from 'vue'
import { Card, Space, Tag, Typography } from 'ant-design-vue'
import PrimaryTaskCard from '@/components/shell/PrimaryTaskCard.vue'
import PhaseFlowNav from '@/components/shared/PhaseFlowNav.vue'
import PhaseAiActions from '@/components/shared/PhaseAiActions.vue'
import { fa } from '@/content/fa'
import { getStepByKey } from '@/constants/design-thinking-steps'
import { useProjectStore } from '@/stores/project'
import type { DesignStepKey } from '@/types/project'

interface PhaseShellProps {
  phase: DesignStepKey
}

defineProps<PhaseShellProps>()

const projectStore = useProjectStore()
const { Title, Paragraph, Text } = Typography

const isJunior = computed(() => projectStore.isJuniorMode)

function title(phase: DesignStepKey): string {
  return fa.phaseTitle(phase, projectStore.experienceMode)
}

function description(phase: DesignStepKey): string {
  return fa.phaseDescription(phase, projectStore.experienceMode)
}

function badge(phase: DesignStepKey): string {
  return fa.phases[phase].badge
}

function stepColor(phase: DesignStepKey): string {
  return getStepByKey(phase).color
}
</script>

<template>
  <Space direction="vertical" size="large" style="width: 100%">
    <Card size="small">
      <Space direction="vertical" size="small">
        <Space wrap align="center">
          <Tag color="processing">{{ badge(phase) }}</Tag>
          <Tag :color="stepColor(phase)">{{ title(phase) }}</Tag>
        </Space>
        <Title :level="3" style="margin: 0">{{ title(phase) }}</Title>
        <Paragraph type="secondary" style="margin-bottom: 0">
          {{ description(phase) }}
        </Paragraph>
        <Paragraph v-if="isJunior" type="secondary" style="margin-bottom: 0">
          <Text strong>{{ fa.dodHeading }}</Text>
          {{ ' ' }}{{ fa.phases[phase].definitionOfDone }}
        </Paragraph>
      </Space>
    </Card>

    <PrimaryTaskCard :phase="phase" />

    <Card v-if="$slots.ai" size="small" :title="isJunior ? 'کمک AI (یک کار)' : 'کمک AI'">
      <PhaseAiActions>
        <template #primary>
          <slot name="ai" />
        </template>
        <template v-if="$slots['ai-more']" #more>
          <slot name="ai-more" />
        </template>
      </PhaseAiActions>
    </Card>

    <slot />

    <PhaseFlowNav :current-key="phase" />
  </Space>
</template>
