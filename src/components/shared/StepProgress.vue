<script setup lang="ts">
import { computed } from 'vue'
import { Steps } from 'ant-design-vue'
import {
  DESIGN_THINKING_STEPS,
  type DesignThinkingStepKey,
} from '@/constants/design-thinking-steps'

interface Props {
  currentPhaseIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [phase: DesignThinkingStepKey]
}>()

const items = computed(() =>
  DESIGN_THINKING_STEPS.map((step) => ({
    title: step.title,
  })),
)

function onChange(index: number): void {
  const step = DESIGN_THINKING_STEPS[index]
  if (!step) return
  emit('select', step.key)
}
</script>

<template>
  <Steps
    size="small"
    :current="Math.max(props.currentPhaseIndex, 0)"
    :items="items"
    responsive
    class="w-full cursor-pointer"
    @change="onChange"
  />
</template>
