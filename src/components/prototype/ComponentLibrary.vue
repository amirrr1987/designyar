<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Card, CheckboxGroup, Progress, Space, Typography } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import {
  COMPONENT_CHECKLIST_OPTIONS,
  DEFAULT_COMPONENT_CHECKLIST,
} from '@/constants/component-checklist'
import { usePrototypeStore } from '@/stores/prototype'

const { Paragraph } = Typography

const prototypeStore = usePrototypeStore()
const { componentChecklist: checked } = storeToRefs(prototypeStore)

onMounted(() => {
  if (checked.value.length === 0) {
    prototypeStore.setComponentChecklist([...DEFAULT_COMPONENT_CHECKLIST])
  }
})

const progress = computed(() => {
  if (COMPONENT_CHECKLIST_OPTIONS.length === 0) return 0
  return Math.round((checked.value.length / COMPONENT_CHECKLIST_OPTIONS.length) * 100)
})
</script>

<template>
  <Space direction="vertical" size="middle">
    <AiSectionAssist
      action="review-design-system"
      label="بازبینی UI kit با AI"
      section="چک‌لیست کامپوننت"
      secondary-action="wireframe-critique"
      secondary-label="نقد وایرفریم"
    />
    <Paragraph type="secondary">
      چک‌لیست کامپوننت‌های antdv استفاده‌شده در پروژه را علامت بزنید.
    </Paragraph>

    <Progress :percent="progress" status="active" />

    <Card size="small" title="کتابخانه کامپوننت">
      <CheckboxGroup v-model:value="checked" :options="[...COMPONENT_CHECKLIST_OPTIONS]" />
    </Card>
  </Space>
</template>
