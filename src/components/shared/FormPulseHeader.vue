<script setup lang="ts">
import { Progress, Space, Typography } from 'ant-design-vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'

interface Props {
  title?: string
  summary: string
  percent?: number
  showProgress?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'نبض این فرم',
  percent: 0,
  showProgress: false,
})
</script>

<template>
  <LiveStudioPreview :title="title">
    <div class="flex flex-wrap items-center gap-4">
      <Progress
        v-if="showProgress"
        type="dashboard"
        :percent="percent"
        :size="80"
      />
      <div class="min-w-0 flex-1">
        <Typography.Paragraph class="mb-0! text-sm text-stone-700">
          {{ summary }}
        </Typography.Paragraph>
        <Space v-if="$slots.extra" class="mt-2" wrap size="small">
          <slot name="extra" />
        </Space>
      </div>
    </div>
  </LiveStudioPreview>
</template>
