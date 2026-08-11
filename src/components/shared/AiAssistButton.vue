<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import { useAiStore } from '@/stores/ai'
import type { AiActionId } from '@/utils/ai-prompts'

interface AiAssistButtonProps {
  action: AiActionId
  label?: string
  /** Current form/section name — added to AI user hint alongside full project context. */
  section?: string
}

const props = withDefaults(defineProps<AiAssistButtonProps>(), {
  label: 'کمک AI',
})

const aiStore = useAiStore()

function onClick(): void {
  aiStore.openPanel(props.action, props.section)
}
</script>

<template>
  <Button type="dashed" @click="onClick">
    <template #icon><RobotOutlined /></template>
    {{ label }}
  </Button>
</template>
