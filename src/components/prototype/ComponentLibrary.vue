<script setup lang="ts">
import { computed } from 'vue'
import { Card, CheckboxGroup, Progress, Space, Typography } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'

const { Paragraph } = Typography

const COMPONENT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Button', value: 'Button' },
  { label: 'Form / FormItem', value: 'Form' },
  { label: 'Input / Textarea', value: 'Input' },
  { label: 'Select', value: 'Select' },
  { label: 'Table', value: 'Table' },
  { label: 'Card', value: 'Card' },
  { label: 'Tabs', value: 'Tabs' },
  { label: 'Menu / Layout', value: 'Layout' },
  { label: 'Steps', value: 'Steps' },
  { label: 'Tree', value: 'Tree' },
  { label: 'Modal / Drawer', value: 'Modal' },
  { label: 'Alert / message', value: 'Alert' },
]

const checked = useStorage<string[]>(STORAGE_KEYS.componentChecklist, [
  'Button',
  'Form',
  'Input',
  'Card',
  'Layout',
  'Tabs',
])

const progress = computed(() => {
  if (COMPONENT_OPTIONS.length === 0) return 0
  return Math.round((checked.value.length / COMPONENT_OPTIONS.length) * 100)
})
</script>

<template>
  <Space direction="vertical" size="middle">
    <Paragraph type="secondary">
      چک‌لیست کامپوننت‌های antdv استفاده‌شده در پروژه را علامت بزنید.
    </Paragraph>

    <Progress :percent="progress" status="active" />

    <Card size="small" title="کتابخانه کامپوننت">
      <CheckboxGroup v-model:value="checked" :options="COMPONENT_OPTIONS" />
    </Card>
  </Space>
</template>
