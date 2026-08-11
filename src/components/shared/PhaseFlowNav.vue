<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Space, Typography } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import type { DesignStepKey } from '@/types/project'
import { useSoftGate, type SoftGateTarget } from '@/composables/useSoftGate'
import { fa } from '@/content/fa'
import { useProjectStore } from '@/stores/project'
import { useCompletion } from '@/composables/useCompletion'

interface PhaseFlowNavProps {
  currentKey: DesignStepKey | 'synthesis'
}

interface FlowTarget {
  key: SoftGateTarget | 'home'
  title: string
  step?: number
}

const props = defineProps<PhaseFlowNavProps>()
const router = useRouter()
const projectStore = useProjectStore()
const { requestNavigate } = useSoftGate()
const { phaseProgress } = useCompletion()
const { Text } = Typography

const index = computed(() => {
  if (props.currentKey === 'synthesis') return DESIGN_THINKING_STEPS.length
  return DESIGN_THINKING_STEPS.findIndex((s) => s.key === props.currentKey)
})

const prev = computed((): FlowTarget | undefined => {
  if (props.currentKey === 'synthesis') {
    const last = DESIGN_THINKING_STEPS[DESIGN_THINKING_STEPS.length - 1]
    if (!last) return undefined
    return { key: last.key, title: fa.phaseTitle(last.key, projectStore.experienceMode), step: last.step }
  }
  const i = index.value
  if (i <= 0) return { key: 'home', title: 'خانه' }
  const step = DESIGN_THINKING_STEPS[i - 1]
  if (!step) return undefined
  return {
    key: step.key,
    title: fa.phaseTitle(step.key, projectStore.experienceMode),
    step: step.step,
  }
})

const next = computed((): FlowTarget | undefined => {
  if (props.currentKey === 'synthesis') return undefined
  const i = index.value
  if (i < 0) return undefined
  if (i >= DESIGN_THINKING_STEPS.length - 1) {
    return { key: 'synthesis', title: 'جمع‌بندی' }
  }
  const step = DESIGN_THINKING_STEPS[i + 1]
  if (!step) return undefined
  return {
    key: step.key,
    title: fa.phaseTitle(step.key, projectStore.experienceMode),
    step: step.step,
  }
})

const phaseDone = computed(() => {
  if (props.currentKey === 'synthesis') return true
  return phaseProgress(props.currentKey).isComplete
})

const prevBtn: ButtonProps = { type: 'default' }
const nextBtn: ButtonProps = { type: 'primary' }

function goPrev(): void {
  const target = prev.value
  if (!target) return
  if (target.key === 'home') {
    void router.push({ name: 'home' })
    return
  }
  requestNavigate(target.key)
}

function goNext(): void {
  const target = next.value
  if (!target) return
  if (target.key === 'home') {
    void router.push({ name: 'home' })
    return
  }
  requestNavigate(target.key)
}
</script>

<template>
  <Space direction="vertical" size="small" style="width: 100%">
    <Text v-if="projectStore.isJuniorMode && currentKey !== 'synthesis' && !phaseDone" type="secondary">
      {{ fa.dodHeading }} {{ fa.phases[currentKey].definitionOfDone }}
      — می‌توانی رد شوی، ولی بهتر است اول تمام کنی.
    </Text>
    <Space wrap>
      <Button v-if="prev" v-bind="prevBtn" @click="goPrev">
        <template #icon><ArrowRightOutlined /></template>
        {{ fa.prev }}: {{ prev.title }}
      </Button>
      <Button v-if="next" v-bind="nextBtn" @click="goNext">
        {{ fa.next }}: {{ next.title }}
        <template #icon><ArrowLeftOutlined /></template>
      </Button>
    </Space>
  </Space>
</template>
