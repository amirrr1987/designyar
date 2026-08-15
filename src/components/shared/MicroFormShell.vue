<script setup lang="ts">
import { Alert, Card, Divider, Space, Typography } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import AiFormAssist from '@/components/shared/AiFormAssist.vue'
import FormStepNav from '@/components/shared/FormStepNav.vue'
import { useFormWizard } from '@/composables/useFormWizard'

interface Props {
  title: string
  hint: string
  aiAssistLabel: string
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
  assist: []
  accept: []
  reject: []
  next: []
  prev: []
}>()

const { isFirstStep, isLastStep } = useFormWizard()

const formCard: CardProps = {
  bordered: true,
}
</script>

<template>
  <Space direction="vertical" size="middle" class="w-full" role="main">
    <header class="rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-stone-200/80 backdrop-blur">
      <Typography.Title :level="3" class="mb-2! text-stone-800">
        {{ props.title }}
      </Typography.Title>
      <Typography.Paragraph class="mb-2! text-base text-stone-600">
        {{ props.hint }}
      </Typography.Paragraph>
      <Typography.Text class="text-sm text-stone-500">
        اجباری نیست — می‌توانی با «{{ isLastStep ? 'پایان' : 'بعدی' }}» رد شوی.
      </Typography.Text>
    </header>

    <Card v-bind="formCard" class="shadow-sm ring-1 ring-stone-200/60" :aria-label="props.title">
      <slot />
    </Card>

    <AiFormAssist
      :assist-label="props.aiAssistLabel"
      :loading="props.loading"
      :error-message="props.errorMessage"
      :preview-text="props.previewText"
      :has-preview="props.hasPreview"
      @assist="emit('assist')"
      @accept="emit('accept')"
      @reject="emit('reject')"
    />

    <Alert
      v-if="props.errorMessage"
      type="error"
      show-icon
      role="alert"
      aria-live="assertive"
      class="rounded-xl"
      :message="props.errorMessage"
    />

    <Divider class="my-1!" />

    <FormStepNav
      :is-first="isFirstStep"
      :is-last="isLastStep"
      @prev="emit('prev')"
      @next="emit('next')"
    />
  </Space>
</template>
