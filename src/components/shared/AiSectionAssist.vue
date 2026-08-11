<script setup lang="ts">
import { Space, Typography } from 'ant-design-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import type { AiActionId } from '@/utils/ai-prompts'

interface AiSectionAssistProps {
  action: AiActionId
  label?: string
  /** Short label for the current form/tab — injected into AI prompt as section hint. */
  section?: string
  secondaryAction?: AiActionId
  secondaryLabel?: string
}

const props = defineProps<AiSectionAssistProps>()

const { Text } = Typography
</script>

<template>
  <Space wrap align="center" size="middle">
    <AiAssistButton :action="action" :label="label" :section="section" />
    <AiAssistButton
      v-if="secondaryAction"
      :action="secondaryAction"
      :label="secondaryLabel ?? 'AI'"
      :section="section"
    />
    <Text type="secondary">
      AI از کل داده پروژه context می‌گیرد{{ section ? ` — ${section}` : '' }}
    </Text>
  </Space>
</template>
