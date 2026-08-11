<script setup lang="ts">
import { computed, h } from 'vue'
import { Card, Space, Tag, Typography } from 'ant-design-vue'
import { resolveStepIcon } from '@/constants/step-icons'

interface PhaseHeroProps {
  title: string
  description: string
  /** Hex from design-thinking step `color`. */
  color?: string
  /** Icon name from `@ant-design/icons-vue` (same as step.icon). */
  icon?: string
  /** Optional badge e.g. «مرحله ۱ از ۵». */
  badge?: string
}

const props = defineProps<PhaseHeroProps>()

const { Title, Paragraph, Text } = Typography

const titleIcon = computed(() => {
  if (!props.icon) return undefined
  return h(resolveStepIcon(props.icon))
})
</script>

<template>
  <Card>
    <Space direction="vertical" size="middle">
      <Space wrap align="center">
        <Tag v-if="badge" color="processing">{{ badge }}</Tag>
        <Tag v-if="color" :color="color" :icon="titleIcon">{{ title }}</Tag>
      </Space>

      <Title :level="3" style="margin: 0">{{ title }}</Title>
      <Paragraph type="secondary" style="margin-bottom: 0">
        {{ description }}
      </Paragraph>

      <Space v-if="$slots.actions" wrap align="center">
        <Text type="secondary">دستیار این مرحله:</Text>
        <slot name="actions" />
      </Space>
    </Space>
  </Card>
</template>
