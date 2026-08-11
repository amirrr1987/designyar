<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Alert,
  Button,
  Card,
  Input,
  Progress,
  Select,
  Space,
  Spin,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { RobotOutlined, SendOutlined } from '@ant-design/icons-vue'
import { useWebLLM } from '@/composables/useWebLLM'
import { useAiStore } from '@/stores/ai'

const Textarea = Input.TextArea
const aiStore = useAiStore()
const { selectedModelId, isLoading, isReady, progress, lastResponse, error } =
  storeToRefs(aiStore)
const { models, initModel, chat } = useWebLLM()

const prompt = ref('')

const modelOptions = computed(() =>
  models.map((id) => ({
    value: id,
    label: id.replace(/-MLC$/, ''),
  })),
)

async function onLoadModel(): Promise<void> {
  message.loading({ content: 'در حال بارگذاری مدل…', key: 'llm', duration: 0 })
  await initModel(selectedModelId.value)
  if (aiStore.error) {
    message.error({ content: 'بارگذاری ناموفق', key: 'llm' })
    return
  }
  message.success({ content: 'مدل آماده است', key: 'llm' })
}

async function onSend(): Promise<void> {
  const text = prompt.value.trim()
  if (!text) {
    message.warning('پیام را وارد کنید')
    return
  }
  try {
    await chat(
      text,
      'تو دستیار UX و دیزاین تینکینگ هستی. پاسخ‌ها را کوتاه، عملی و به فارسی بده.',
    )
  } catch {
    // error already in store
  }
}
</script>

<template>
  <Spin :spinning="isLoading && !isReady">
    <Space direction="vertical" size="middle">
      <Alert
        type="info"
        show-icon
        message="هوش مصنوعی داخل مرورگر (WebLLM)"
        description="مدل روی دستگاه شما اجرا می‌شود؛ اولین بار ممکن است دانلود طول بکشد."
      />

      <Space wrap>
        <Select
          :value="selectedModelId"
          :options="modelOptions"
          @update:value="(v: string) => aiStore.setSelectedModelId(v)"
        />
        <Button type="primary" :loading="isLoading" @click="onLoadModel">
          <template #icon><RobotOutlined /></template>
          بارگذاری مدل
        </Button>
      </Space>

      <Progress v-if="isLoading || progress > 0" :percent="progress" status="active" />

      <Alert v-if="error" type="error" show-icon :message="error" closable @close="aiStore.setError('')" />

      <Alert
        v-if="isReady"
        type="success"
        show-icon
        message="مدل آماده است — می‌توانید سوال بپرسید"
      />

      <Textarea
        v-model:value="prompt"
        :rows="4"
        :disabled="!isReady"
        placeholder="مثلاً سه ایده برای بهبود onboarding پیشنهاد بده"
      />

      <Button type="primary" :disabled="!isReady" :loading="isLoading" @click="onSend">
        <template #icon><SendOutlined /></template>
        ارسال
      </Button>

      <Card v-if="lastResponse" size="small" title="پاسخ">
        {{ lastResponse }}
      </Card>
    </Space>
  </Spin>
</template>
