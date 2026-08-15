<script setup lang="ts">
import { computed, watch } from 'vue'
import { Button, Space, Typography } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import StepProgress from '@/components/shared/StepProgress.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { getFormsForPhase } from '@/constants/form-registry'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'

const router = useRouter()
const { phase, formKey, formIndex, phaseIndex, syncProjectPosition } = useFormWizard()

watch(
  [phase, formKey],
  () => {
    syncProjectPosition()
  },
  { immediate: true },
)

const formCountLabel = computed(() => {
  if (!phase.value || formIndex.value < 0) return ''
  const total = getFormsForPhase(phase.value).length
  return `فرم ${formIndex.value + 1} از ${total}`
})

const phaseTitle = computed(() => {
  if (!phase.value) return ''
  return DESIGN_THINKING_STEPS.find((s) => s.key === phase.value)?.title ?? ''
})
</script>

<template>
  <Space direction="vertical" size="large" class="w-full">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <Typography.Text type="secondary">دیزاین یار</Typography.Text>
        <Typography.Title :level="4" class="!mb-0 !mt-1">
          {{ phaseTitle }}
        </Typography.Title>
        <Typography.Text type="secondary">{{ formCountLabel }}</Typography.Text>
      </div>
      <Button type="link" @click="router.push({ name: 'home' })">خانه</Button>
    </div>

    <StepProgress :current-phase-index="phaseIndex" />

    <RouterView />
  </Space>
</template>
