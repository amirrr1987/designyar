<script setup lang="ts">
import { Alert, Card, Input, Space } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { STORAGE_KEYS } from '@/constants/storage-keys'

const Textarea = Input.TextArea
const notes = useStorage<string>(STORAGE_KEYS.researchNotes, '')
</script>

<template>
  <Space direction="vertical" size="middle">
    <Alert
      type="info"
      show-icon
      message="یادداشت تحقیق"
      description="متن را بنویسید؛ سپس با AI تحلیل کنید یا از آن برای پیشنهاد پرسونا استفاده کنید."
    />
    <Space wrap>
      <AiAssistButton action="seed-research-notes" label="پیشنهاد اسکلت یادداشت" />
      <AiAssistButton action="analyze-notes" label="تحلیل این یادداشت" />
      <AiAssistButton action="persona-suggest" label="پیشنهاد پرسونا از یادداشت" />
    </Space>
    <Card size="small" title="یادداشت‌ها">
      <Textarea
        v-model:value="notes"
        :rows="10"
        placeholder="مشاهدات مصاحبه، نقل‌قول‌ها، بینش‌های اولیه…"
        allow-clear
      />
    </Card>
  </Space>
</template>
