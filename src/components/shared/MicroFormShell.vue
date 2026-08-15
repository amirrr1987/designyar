<script setup lang="ts">
import { Alert, Space, Typography } from 'ant-design-vue'
import AiFormAssist from '@/components/shared/AiFormAssist.vue'
import FormStepNav from '@/components/shared/FormStepNav.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import type { AiAssistMode } from '@/types/ai'

interface Props {
  title: string
  hint: string
  aiImproveLabel: string
  aiCompleteLabel: string
  loading?: boolean
  errorMessage?: string
  previewText?: string
  hasPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errorMessage: '',
  previewText: '',
  hasPreview: false,
})

const emit = defineEmits<{
  assist: [mode: AiAssistMode]
  accept: []
  reject: []
  next: []
  prev: []
}>()

const { isFirstStep, isLastStep } = useFormWizard()
</script>

<template>
  <Space direction="vertical" size="large" class="w-full" role="main">
    <header>
      <Typography.Title :level="3" class="mb-1!">{{ props.title }}</Typography.Title>
      <Typography.Paragraph type="secondary" class="mb-0!">
        {{ props.hint }}
      </Typography.Paragraph>
      <Typography.Text type="secondary" class="text-xs">
        اگر هنوز آماده نیستی، می‌توانی با «{{ isLastStep ? 'پایان' : 'بعدی' }}» رد شوی.
      </Typography.Text>
    </header>

    <section :aria-label="props.title">
      <slot />
    </section>

    <AiFormAssist
      :improve-label="props.aiImproveLabel"
      :complete-label="props.aiCompleteLabel"
      :loading="props.loading"
      :error-message="props.errorMessage"
      :preview-text="props.previewText"
      :has-preview="props.hasPreview"
      @assist="emit('assist', $event)"
      @accept="emit('accept')"
      @reject="emit('reject')"
    />

    <Alert
      v-if="props.errorMessage"
      type="error"
      show-icon
      role="alert"
      aria-live="assertive"
      :message="props.errorMessage"
    />

    <FormStepNav
      :is-first="isFirstStep"
      :is-last="isLastStep"
      @prev="emit('prev')"
      @next="emit('next')"
    />
  </Space>
</template>
