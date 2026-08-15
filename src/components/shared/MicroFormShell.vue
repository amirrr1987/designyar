<script setup lang="ts">
import { Alert, Space, Typography } from 'ant-design-vue'
import AiFormAssist from '@/components/shared/AiFormAssist.vue'
import FormStepNav from '@/components/shared/FormStepNav.vue'
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
</script>

<template>
  <Space direction="vertical" size="large" class="w-full">
    <div>
      <Typography.Title :level="3" class="mb-1!">{{ props.title }}</Typography.Title>
      <Typography.Paragraph type="secondary" class="mb-0!">
        {{ props.hint }}
      </Typography.Paragraph>
    </div>

    <slot />

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
      :message="props.errorMessage"
    />

    <FormStepNav @prev="emit('prev')" @next="emit('next')" />
  </Space>
</template>
