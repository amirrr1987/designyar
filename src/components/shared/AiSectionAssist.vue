<script setup lang="ts">
import { computed } from 'vue'
import { Space, Typography } from 'ant-design-vue'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useProjectStore } from '@/stores/project'
import type { AiActionId } from '@/utils/ai-prompts'
import { fa } from '@/content/fa'

interface AiSectionAssistProps {
  action: AiActionId
  label?: string
  /** Short label for the current form/tab — injected into AI prompt as section hint. */
  section?: string
  secondaryAction?: AiActionId
  secondaryLabel?: string
}

defineProps<AiSectionAssistProps>()

const { Text } = Typography
const projectStore = useProjectStore()
const isJunior = computed(() => projectStore.isJuniorMode)
</script>

<template>
  <Space wrap align="center" size="middle">
    <AiAssistButton :action="action" :label="label" :section="section" />
    <AiAssistButton
      v-if="secondaryAction && !isJunior"
      :action="secondaryAction"
      :label="secondaryLabel ?? 'AI'"
      :section="section"
    />
    <Text v-if="!isJunior" type="secondary">
      {{ fa.ai.sectionHint }}{{ section ? ` — ${section}` : '' }}
    </Text>
  </Space>
</template>
