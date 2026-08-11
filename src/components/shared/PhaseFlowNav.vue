<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Space, Typography } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import type { DesignStepKey } from '@/types/project'
import { useProjectStore } from '@/stores/project'

interface PhaseFlowNavProps {
  currentKey: DesignStepKey | 'synthesis'
}

interface FlowTarget {
  key: string
  title: string
  route: string
  step?: number
}

const props = defineProps<PhaseFlowNavProps>()
const router = useRouter()
const projectStore = useProjectStore()
const { Text } = Typography

const index = computed(() => {
  if (props.currentKey === 'synthesis') return DESIGN_THINKING_STEPS.length
  return DESIGN_THINKING_STEPS.findIndex((s) => s.key === props.currentKey)
})

const prev = computed((): FlowTarget | undefined => {
  if (props.currentKey === 'synthesis') {
    const last = DESIGN_THINKING_STEPS[DESIGN_THINKING_STEPS.length - 1]
    if (!last) return undefined
    return { key: last.key, title: last.title, route: last.route, step: last.step }
  }
  const i = index.value
  if (i <= 0) return undefined
  const step = DESIGN_THINKING_STEPS[i - 1]
  if (!step) return undefined
  return { key: step.key, title: step.title, route: step.route, step: step.step }
})

const next = computed((): FlowTarget | undefined => {
  if (props.currentKey === 'synthesis') return undefined
  const i = index.value
  if (i < 0) return undefined
  if (i >= DESIGN_THINKING_STEPS.length - 1) {
    return { key: 'synthesis', title: 'جمع‌بندی', route: '/synthesis' }
  }
  const step = DESIGN_THINKING_STEPS[i + 1]
  if (!step) return undefined
  return { key: step.key, title: step.title, route: step.route, step: step.step }
})

const prevBtn: ButtonProps = { type: 'default' }
const nextBtn: ButtonProps = { type: 'primary' }

function goHome(): void {
  void router.push({ name: 'home' })
}

function goPrev(): void {
  const target = prev.value
  if (!target) return
  if (typeof target.step === 'number') {
    projectStore.setStep(target.step)
  }
  void router.push(target.route)
}

function goNext(): void {
  const target = next.value
  if (!target) return
  if (typeof target.step === 'number') {
    projectStore.setStep(target.step)
  }
  void router.push(target.route)
}
</script>

<template>
  <Card size="small">
    <Space direction="vertical" size="small">
      <Text type="secondary">ادامه مسیر Design Thinking</Text>
      <Space wrap>
        <Button v-bind="prevBtn" @click="goHome">
          <template #icon><HomeOutlined /></template>
          خانه
        </Button>
        <Button v-if="prev" v-bind="prevBtn" @click="goPrev">
          <template #icon><ArrowRightOutlined /></template>
          قبلی: {{ prev.title }}
        </Button>
        <Button v-if="next" v-bind="nextBtn" @click="goNext">
          بعدی: {{ next.title }}
          <template #icon><ArrowLeftOutlined /></template>
        </Button>
      </Space>
    </Space>
  </Card>
</template>
