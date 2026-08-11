<script setup lang="ts">
import { Alert, Card, Input, Space } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useEmpathizeStore } from '@/stores/empathize'

const Textarea = Input.TextArea
const empathizeStore = useEmpathizeStore()
const { researchNotes: notes } = storeToRefs(empathizeStore)
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
      <AiAssistButton action="seed-research-notes" label="پیشنهاد اسکلت یادداشت" section="یادداشت تحقیق" />
      <AiAssistButton action="analyze-notes" label="تحلیل این یادداشت" section="یادداشت تحقیق" />
      <AiAssistButton action="persona-suggest" label="پیشنهاد پرسونا از یادداشت" section="یادداشت تحقیق" />
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
