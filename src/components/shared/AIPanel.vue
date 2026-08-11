<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Alert,
  Button,
  Card,
  Input,
  Select,
  Space,
  Typography,
  message,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import {
  CheckOutlined,
  CopyOutlined,
  LinkOutlined,
  ReloadOutlined,
  RobotOutlined,
  SendOutlined,
} from '@ant-design/icons-vue'
import { useAiApply } from '@/composables/useAiApply'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useGroq } from '@/composables/useGroq'
import { useAiStore } from '@/stores/ai'
import type { AiApplyPayload } from '@/types/ai-response'
import { parseApplyPayload, supportsApply } from '@/utils/ai-response-parse'
import {
  AI_ACTIONS_BY_PHASE,
  buildSystemPrompt,
  buildUserPrompt,
  getAiActionDef,
  getContextHints,
  isAiActionId,
  type AiActionId,
} from '@/utils/ai-prompts'

const Textarea = Input.TextArea
const { Text, Paragraph } = Typography
const aiStore = useAiStore()
const { selectedModelId, isLoading, isReady, lastResponse, error } = storeToRefs(aiStore)
const { models, validateApiKey, chat } = useGroq()
const { buildContext } = useAiPromptContext()
const { applyPayload } = useAiApply()

const actionId = ref<AiActionId>('persona-suggest')
const prompt = ref('')
const applyPayloadResult = ref<AiApplyPayload | null>(null)

const modelOptions = computed(() =>
  models.map((id) => ({
    value: id,
    label: id.replace(/^groq\//, ''),
  })),
)

const actionOptions = computed(() =>
  AI_ACTIONS_BY_PHASE.map((group) => ({
    label: groupLabel(group.phase),
    options: group.actions.map((a) => ({
      value: a.id,
      label: a.label,
    })),
  })),
)

const selectedAction = computed(() => getAiActionDef(actionId.value))

const contextPreview = computed(() => buildContext(prompt.value.trim() || undefined))

const contextHints = computed(() => getContextHints(actionId.value, contextPreview.value))

const canApply = computed(
  () => applyPayloadResult.value !== null && supportsApply(actionId.value),
)

const applyLabel = computed(() => selectedAction.value.applyLabel ?? 'اعمال در پروژه')

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

watch(actionId, () => {
  applyPayloadResult.value = null
})

watch(lastResponse, (text) => {
  if (!text.trim() || !supportsApply(actionId.value)) {
    applyPayloadResult.value = null
    return
  }
  applyPayloadResult.value = parseApplyPayload(actionId.value, text)
})

function groupLabel(phase: string): string {
  const labels: Record<string, string> = {
    empathize: 'همدلی',
    define: 'تعریف',
    ideate: 'ایده‌پردازی',
    prototype: 'نمونه اولیه',
    test: 'آزمون',
  }
  return labels[phase] ?? phase
}

function onCheckConnection(): void {
  if (validateApiKey()) {
    message.success('کلید API یافت شد — آماده اجرا')
  }
}

function onActionChange(value: unknown): void {
  if (typeof value === 'string' && isAiActionId(value)) {
    actionId.value = value
    aiStore.clearSessionOutput()
    applyPayloadResult.value = null
  }
}

function onModelChange(value: unknown): void {
  if (typeof value === 'string') {
    aiStore.setSelectedModelId(value)
  }
}

async function onSend(): Promise<void> {
  if (!validateApiKey()) return

  applyPayloadResult.value = null
  const ctx = buildContext(prompt.value.trim() || undefined)
  const userPrompt = buildUserPrompt(actionId.value, ctx)
  const systemPrompt = buildSystemPrompt(actionId.value)

  try {
    await chat(userPrompt, systemPrompt)
    const parsed = parseApplyPayload(actionId.value, aiStore.lastResponse)
    applyPayloadResult.value = parsed
    if (parsed) {
      message.info('داده ساخت‌یافته شناسایی شد — می‌توانید اعمال کنید')
    }
  } catch {
    // error in store
  }
}

function onApply(): void {
  const payload = applyPayloadResult.value
  if (!payload) {
    message.warning('داده قابل اعمال یافت نشد')
    return
  }
  const count = applyPayload(payload)
  if (count === 0) {
    message.warning('مورد معتبری برای افزودن نبود')
    return
  }
  message.success(`${count} مورد به پروژه اضافه شد`)
  applyPayloadResult.value = null
}

async function onCopyResponse(): Promise<void> {
  const text = lastResponse.value.trim()
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    message.success('پاسخ کپی شد')
  } catch (e: unknown) {
    message.error(e instanceof Error ? e.message : 'کپی ناموفق')
  }
}

function onClearResponse(): void {
  aiStore.clearSessionOutput()
  applyPayloadResult.value = null
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Alert
      type="info"
      show-icon
      message="دستیار Design Thinking (Groq)"
      description="اکشن را انتخاب کنید؛ AI از داده‌های ذخیره‌شده پروژه context می‌گیرد. برخی اکشن‌ها قابل «اعمال مستقیم» در فرم هستند."
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
      <Select
        :value="selectedModelId"
        :options="modelOptions"
        :disabled="isLoading"
        @update:value="onModelChange"
      />
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

    <Select
      :value="actionId"
      :options="actionOptions"
      :disabled="isLoading"
      @update:value="onActionChange"
    />
    <Paragraph v-if="selectedAction" type="secondary">
      {{ selectedAction.description }}
    </Paragraph>

    <Alert
      v-for="(hint, index) in contextHints"
      :key="index"
      type="warning"
      show-icon
      :message="hint"
    />

    <Text strong>نکته اختیاری برای مدل</Text>
    <Textarea
      v-model:value="prompt"
      :rows="3"
      :disabled="!isReady || isLoading"
      placeholder="مثلاً تمرکز روی کاربران موبایل…"
    />

    <Space wrap>
      <Button type="primary" :disabled="!isReady" :loading="isLoading" @click="onSend">
        <template #icon><SendOutlined /></template>
        اجرای اکشن AI
      </Button>
      <Button :disabled="!lastResponse || isLoading" @click="onSend">
        <template #icon><ReloadOutlined /></template>
        تکرار
      </Button>
    </Space>

    <Card v-if="lastResponse" size="small">
      <template #title>
        <Space>
          <span>پاسخ</span>
          <Text v-if="isLoading" type="secondary">در حال دریافت…</Text>
        </Space>
      </template>
      <template #extra>
        <Space>
          <Button v-if="canApply" type="primary" size="small" @click="onApply">
            <template #icon><CheckOutlined /></template>
            {{ applyLabel }}
          </Button>
          <Button size="small" @click="onCopyResponse">
            <template #icon><CopyOutlined /></template>
            کپی
          </Button>
          <Button size="small" @click="onClearResponse">پاک</Button>
        </Space>
      </template>
      <Paragraph style="white-space: pre-wrap; margin-bottom: 0">
        {{ lastResponse }}
      </Paragraph>
    </Card>
  </Space>
</template>
