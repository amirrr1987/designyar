<script setup lang="ts">
import { computed } from 'vue'
import { Card, CheckboxGroup, Progress, Space, Typography } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import {
  COMPONENT_CHECKLIST_OPTIONS,
  DEFAULT_COMPONENT_CHECKLIST,
} from '@/constants/component-checklist'
import { STORAGE_KEYS } from '@/constants/storage-keys'

const { Paragraph } = Typography

const checked = useStorage<string[]>(STORAGE_KEYS.componentChecklist, [...DEFAULT_COMPONENT_CHECKLIST])

const progress = computed(() => {
  if (COMPONENT_CHECKLIST_OPTIONS.length === 0) return 0
  return Math.round((checked.value.length / COMPONENT_CHECKLIST_OPTIONS.length) * 100)
})
</script>

<template>
  <Space direction="vertical" size="middle">
    <Paragraph type="secondary">
      چک‌لیست کامپوننت‌های antdv استفاده‌شده در پروژه را علامت بزنید.
    </Paragraph>

    <Progress :percent="progress" status="active" />

    <Card size="small" title="کتابخانه کامپوننت">
      <CheckboxGroup v-model:value="checked" :options="[...COMPONENT_CHECKLIST_OPTIONS]" />
    </Card>
  </Space>
</template>
