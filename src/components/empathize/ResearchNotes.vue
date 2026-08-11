<script setup lang="ts">
import { Alert, Card, Input, Space } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
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
      description="متن را اینجا بنویسید؛ بعداً می‌توانید از پنل هوش مصنوعی برای تحلیل استفاده کنید."
    />
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
