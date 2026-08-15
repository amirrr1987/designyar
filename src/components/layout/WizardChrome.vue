<script setup lang="ts">
import { computed, watch } from 'vue'
import { Button, Space, Tag, Typography } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import StepProgress from '@/components/shared/StepProgress.vue'
import FormStepDots from '@/components/shared/FormStepDots.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { getFormsForPhase } from '@/constants/form-registry'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

const router = useRouter()
const {
  phase,
  formKey,
  formIndex,
  phaseIndex,
  forms,
  syncProjectPosition,
  goToPhase,
  goToForm,
} = useFormWizard()

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
  return `گام ${formIndex.value + 1} از ${total}`
})

const phaseTitle = computed(() => {
  if (!phase.value) return ''
  return DESIGN_THINKING_STEPS.find((s) => s.key === phase.value)?.title ?? ''
})

const currentFormTitle = computed(() => {
  if (formIndex.value < 0) return ''
  return forms.value[formIndex.value]?.title ?? ''
})

async function onSelectPhase(nextPhase: DesignThinkingStepKey): Promise<void> {
  await goToPhase(nextPhase)
}

async function onSelectForm(nextFormKey: string): Promise<void> {
  if (!phase.value) return
  await goToForm(phase.value, nextFormKey)
}
</script>

<template>
  <Space direction="vertical" size="middle" class="w-full">
    <header
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-stone-200/70 backdrop-blur"
    >
      <div class="min-w-0">
        <Typography.Text class="text-sm text-teal-800">دیزاین یار</Typography.Text>
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <Typography.Title :level="4" class="mb-0! text-stone-800">
            {{ phaseTitle }}
          </Typography.Title>
          <Tag v-if="formCountLabel" color="cyan">{{ formCountLabel }}</Tag>
        </div>
        <Typography.Text
          v-if="currentFormTitle"
          class="text-stone-500"
          aria-live="polite"
        >
          {{ currentFormTitle }}
        </Typography.Text>
      </div>
      <Button
        type="text"
        aria-label="بازگشت به صفحهٔ خانه"
        @click="router.push({ name: 'home' })"
      >
        <template #icon>
          <HomeOutlined aria-hidden="true" />
        </template>
        خانه
      </Button>
    </header>

    <div class="rounded-2xl bg-white/70 px-3 py-4 shadow-sm ring-1 ring-stone-200/60">
      <nav aria-label="پیشرفت فازهای طراحی">
        <StepProgress
          :current-phase-index="phaseIndex"
          @select="onSelectPhase"
        />
      </nav>

      <FormStepDots
        v-if="forms.length > 0"
        class="mt-4"
        :forms="forms"
        :current-index="formIndex"
        @select="onSelectForm"
      />
    </div>

    <RouterView />
  </Space>
</template>
