<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Steps } from 'ant-design-vue'
import type { StepProps } from 'ant-design-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { useProjectStore } from '@/stores/project'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

/** 0-based index for antdv Steps `current`. */
const current = computed(() => {
  const metaStep = route.meta.step
  if (typeof metaStep === 'number' && metaStep >= 1) return metaStep - 1
  const fromStore = projectStore.currentStep
  if (fromStore >= 1 && fromStore <= 5) return fromStore - 1
  return 0
})

const items = computed((): StepProps[] =>
  DESIGN_THINKING_STEPS.map((step) => ({
    title: step.title,
    description: step.description,
    icon: h(resolveStepIcon(step.icon)),
  })),
)

function onChange(next: number): void {
  const step = DESIGN_THINKING_STEPS[next]
  if (!step) return
  projectStore.setStep(step.step)
  void router.push(step.route)
}
</script>

<template>
  <Steps type="navigation" size="small" :current="current" :items="items" @change="onChange" />
</template>
