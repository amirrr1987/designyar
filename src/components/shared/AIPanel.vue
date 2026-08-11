<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Alert,
  Button,
  Card,
  Input,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { LinkOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons-vue'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useGroq } from '@/composables/useGroq'
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
const { selectedModelId, isLoading, isReady, lastResponse, error } = storeToRefs(aiStore)
const { models, validateApiKey, chat } = useGroq()
const { buildContext } = useAiPromptContext()

const actionId = ref<AiActionId>('persona-suggest')
const prompt = ref('')

const modelOptions = computed(() =>
  models.map((id) => ({
    value: id,
    label: id.replace(/^groq\//, ''),
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
    validateApiKey()
    const pending = aiStore.consumePendingAction()
    if (pending) actionId.value = pending
  },
  { immediate: true },
)

function onCheckConnection(): void {
  if (validateApiKey()) {
    message.success('کلید API یافت شد — آماده اجرا')
  }
}

function onActionChange(value: unknown): void {
  if (typeof value === 'string' && isAiActionId(value)) {
    actionId.value = value
  }
}

function onModelChange(value: unknown): void {
  if (typeof value === 'string') {
    aiStore.setSelectedModelId(value)
  }
}

async function onSend(): Promise<void> {
  if (!validateApiKey()) return

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
  <Spin :spinning="isLoading">
    <Space direction="vertical" size="middle">
      <Alert
        type="info"
        show-icon
        message="هوش مصنوعی Groq (compound-mini)"
        description="پاسخ از Groq Cloud با جست‌وجوی وب و ابزارهای compound — کلید API را در .env.local تنظیم کنید."
      />

      <Alert
        v-if="!isReady"
        type="warning"
        show-icon
        message="کلید API یافت نشد"
        description="فایل .env.local را با VITE_GROQ_API_KEY=... بسازید (از console.groq.com/keys)."
      >
        <template #action>
          <Button size="small" type="link" href="https://console.groq.com/keys" target="_blank">
            <template #icon><LinkOutlined /></template>
            دریافت کلید
          </Button>
        </template>
      </Alert>

      <Space wrap>
        <Select :value="selectedModelId" :options="modelOptions" @update:value="onModelChange" />
        <Button :loading="isLoading" @click="onCheckConnection">
          <template #icon><RobotOutlined /></template>
          بررسی اتصال
        </Button>
      </Space>

      <Alert
        v-if="error"
        type="error"
        show-icon
        :message="error"
        closable
        @close="aiStore.setError('')"
      />

      <Alert
        v-if="isReady"
        type="success"
        show-icon
        message="آماده — اکشن را انتخاب و اجرا کنید"
      />

      <Select :value="actionId" :options="actionOptions" @update:value="onActionChange" />
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
