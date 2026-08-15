<script setup lang="ts">
import { computed } from 'vue'
import { Steps } from 'ant-design-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'

interface Props {
  currentPhaseIndex: number
}

const props = defineProps<Props>()

const items = computed(() =>
  DESIGN_THINKING_STEPS.map((step) => ({
    title: step.title,
    description: step.description,
  })),
)
</script>

<template>
  <Steps
    size="small"
    :current="Math.max(props.currentPhaseIndex, 0)"
    :items="items"
    label-placement="vertical"
    class="w-full"
  />
</template>
