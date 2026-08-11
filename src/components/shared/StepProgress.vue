<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Alert, Button, Space, Steps } from 'ant-design-vue'
import type { StepProps } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { resolveStepIcon } from '@/constants/step-icons'
import { usePhaseCoach } from '@/composables/usePhaseCoach'
import { useProjectStore } from '@/stores/project'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { coach, runCoachAction } = usePhaseCoach()

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
  <Space direction="vertical" size="middle" style="width: 100%; margin-bottom: 16px">
    <Steps type="navigation" size="small" :current="current" :items="items" @change="onChange" />

    <Alert v-if="coach" type="info" show-icon>
      <template #message>
        <Space wrap>
          <span>{{ coach.hint }}</span>
          <Button
            v-if="coach.actionId"
            type="link"
            size="small"
            @click="runCoachAction"
          >
            <template #icon><RobotOutlined /></template>
            {{ coach.actionLabel ?? 'باز کردن AI' }}
          </Button>
        </Space>
      </template>
    </Alert>
  </Space>
</template>
