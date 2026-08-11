<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Alert,
  Button,
  Card,
  Input,
  Progress,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { RobotOutlined, SendOutlined } from '@ant-design/icons-vue'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useWebLLM } from '@/composables/useWebLLM'
import { useAiStore } from '@/stores/ai'
import {
  AI_ACTIONS,
  buildSystemPrompt,
  buildUserPrompt,
  isAiActionId,
  type AiActionId,
} from '@/utils/ai-prompts'

const Textarea = Input.TextArea
const { Text, Paragraph } = Typography
const aiStore = useAiStore()
const { selectedModelId, isLoading, isReady, progress, lastResponse, error } =
  storeToRefs(aiStore)
const { models, initModel, chat } = useWebLLM()
const { buildContext } = useAiPromptContext()

const actionId = ref<AiActionId>('persona-suggest')
const prompt = ref('')

const modelOptions = computed(() =>
  models.map((id) => ({
    value: id,
    label: id.replace(/-MLC$/, ''),
  })),
)

const actionOptions = computed(() =>
  AI_ACTIONS.map((a) => ({
    value: a.id,
    label: a.label,
  })),
)

const selectedAction = computed(() => AI_ACTIONS.find((a) => a.id === actionId.value))

watch(
  () => aiStore.panelOpen,
  (open) => {
    if (!open) return
    const pending = aiStore.consumePendingAction()
    if (pending) actionId.value = pending
  },
  { immediate: true },
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

function onActionChange(value: unknown): void {
  if (typeof value === 'string' && isAiActionId(value)) {
    actionId.value = value
  }
}

async function onSend(): Promise<void> {
  const ctx = buildContext(prompt.value.trim() || undefined)
  const userPrompt = buildUserPrompt(actionId.value, ctx)
  const systemPrompt = buildSystemPrompt(actionId.value)

  try {
    await chat(userPrompt, systemPrompt)
  } catch {
    // error in store
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
        message="مدل آماده است — اکشن را انتخاب و اجرا کنید"
      />

      <Select
        :value="actionId"
        :options="actionOptions"
        @update:value="onActionChange"
      />
      <Paragraph v-if="selectedAction" type="secondary">
        {{ selectedAction.description }}
      </Paragraph>

      <Text strong>نکته اختیاری برای مدل</Text>
      <Textarea
        v-model:value="prompt"
        :rows="3"
        :disabled="!isReady"
        placeholder="مثلاً تمرکز روی کاربران موبایل…"
      />

      <Button type="primary" :disabled="!isReady" :loading="isLoading" @click="onSend">
        <template #icon><SendOutlined /></template>
        اجرای اکشن AI
      </Button>

      <Card v-if="lastResponse" size="small" title="پاسخ">
        {{ lastResponse }}
      </Card>
    </Space>
  </Spin>
</template>
