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
  Tag,
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
  StopOutlined,
} from '@ant-design/icons-vue'
import { AI_CHAINS } from '@/constants/ai-chains'
import AiHistoryList from '@/components/shared/AiHistoryList.vue'
import { useAiApply, type AiApplyAudit } from '@/composables/useAiApply'
import { useAiPromptContext } from '@/composables/useAiPromptContext'
import { useGroq } from '@/composables/useGroq'
import { useAiStore } from '@/stores/ai'
import type { AiApplyPayload } from '@/types/ai-response'
import { getContextReadiness } from '@/utils/ai-context-readiness'
import { getProjectContextCoverage } from '@/utils/ai-context-coverage'
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
const { selectedModelId, isLoading, isReady, lastResponse, error, activeChainId } =
  storeToRefs(aiStore)
const { models, validateApiKey, chat } = useGroq()
const { buildContext } = useAiPromptContext()
const { applyPayload } = useAiApply()

const actionId = ref<AiActionId>('persona-suggest')
const prompt = ref('')
const applyPayloadResult = ref<AiApplyPayload | null>(null)
const chainRunning = ref(false)

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

const readiness = computed(() => getContextReadiness(actionId.value, contextPreview.value))

const projectCoverage = computed(() => getProjectContextCoverage(contextPreview.value))

const chainProgress = computed(() => aiStore.getChainProgress())

const canApply = computed(
  () => applyPayloadResult.value !== null && supportsApply(actionId.value),
)

const applyLabel = computed(() => selectedAction.value.applyLabel ?? 'اعمال در پروژه')

watch(
  () => aiStore.panelOpen,
  (open) => {
    if (!open) return
    validateApiKey()
    const pendingChain = aiStore.consumePendingChain()
    if (pendingChain) {
      void startChainRun(pendingChain)
      return
    }
    const pending = aiStore.consumePendingAction()
    if (pending) actionId.value = pending
    const sectionHint = aiStore.consumePendingSectionHint()
    if (sectionHint) {
      prompt.value = `بخش فعلی: ${sectionHint}`
    }
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
    home: 'شروع پروژه',
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
    aiStore.cancelChain()
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

function applySuccessMessage(payload: AiApplyPayload, count: number): void {
  if (count === 1 && payload.type === 'testSummary') {
    message.success('خلاصه در گزارش usability ذخیره شد')
    return
  }
  if (
    count === 1 &&
    (payload.type === 'problem' ||
      payload.type === 'pov' ||
      payload.type === 'projectBrief' ||
      payload.type === 'researchNotes')
  ) {
    message.success('در فرم اعمال شد')
    return
  }
  message.success(`${count} مورد به پروژه اضافه شد`)
}

async function runSend(): Promise<AiApplyPayload | null> {
  if (!validateApiKey()) return null

  const ctx = buildContext(prompt.value.trim() || undefined)
  const userPrompt = buildUserPrompt(actionId.value, ctx)
  const systemPrompt = buildSystemPrompt(actionId.value)

  try {
    await chat(userPrompt, systemPrompt)
    const parsed = parseApplyPayload(actionId.value, aiStore.lastResponse)
    applyPayloadResult.value = parsed
    if (parsed && !activeChainId.value) {
      message.info('داده ساخت‌یافته شناسایی شد — می‌توانید اعمال کنید')
    }
    return parsed
  } catch {
    return null
  }
}

async function onSend(): Promise<void> {
  applyPayloadResult.value = null
  await runSend()
}

function applyAudit(): AiApplyAudit {
  return {
    actionId: actionId.value,
    chainId: activeChainId.value ?? undefined,
  }
}

async function continueChainAfterApply(parsed: AiApplyPayload): Promise<void> {
  const count = applyPayload(parsed, applyAudit())
  if (count === 0) {
    aiStore.cancelChain()
    chainRunning.value = false
    message.warning('زنجیره متوقف شد — داده قابل اعمال نبود')
    return
  }

  applySuccessMessage(parsed, count)
  applyPayloadResult.value = null
  aiStore.clearSessionOutput()

  const nextAction = aiStore.advanceChain()
  if (!nextAction) {
    chainRunning.value = false
    message.success('زنجیره AI با موفقیت کامل شد')
    return
  }

  actionId.value = nextAction
  const parsedNext = await runSend()
  if (!parsedNext) {
    aiStore.cancelChain()
    chainRunning.value = false
    message.warning('زنجیره متوقف شد — خطا در مرحله بعد')
    return
  }

  await continueChainAfterApply(parsedNext)
}

async function startChainRun(chainId: typeof AI_CHAINS[number]['id']): Promise<void> {
  if (!validateApiKey()) return

  const first = aiStore.startChain(chainId)
  if (!first) return

  chainRunning.value = true
  actionId.value = first
  applyPayloadResult.value = null
  aiStore.clearSessionOutput()

  message.loading({ content: 'اجرای زنجیره AI…', key: 'chain', duration: 0 })

  const parsed = await runSend()
  message.destroy('chain')

  if (!parsed) {
    aiStore.cancelChain()
    chainRunning.value = false
    message.error('شروع زنجیره ناموفق بود')
    return
  }

  await continueChainAfterApply(parsed)
}

function onApply(): void {
  const payload = applyPayloadResult.value
  if (!payload) {
    message.warning('داده قابل اعمال یافت نشد')
    return
  }
  const count = applyPayload(payload, applyAudit())
  if (count === 0) {
    message.warning('مورد معتبری برای افزودن نبود')
    return
  }
  applySuccessMessage(payload, count)
  applyPayloadResult.value = null
}

function onStopChain(): void {
  aiStore.cancelChain()
  chainRunning.value = false
  message.info('زنجیره متوقف شد')
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
      description="هر اکشن از کل artifactهای پروژه (شرح، Empathize، Define، Ideate، Prototype، Test) context می‌گیرد — نه فقط همین صفحه."
    />

    <Card size="small" title="پوشش داده پروژه در AI">
      <Progress :percent="projectCoverage.percent" status="active" />
      <Space wrap>
        <Tag
          v-for="item in projectCoverage.items.filter((i) => i.filled)"
          :key="item.id"
          color="success"
        >
          ✓ {{ item.label }}
        </Tag>
      </Space>
    </Card>

    <Alert
      v-if="!isReady"
      type="warning"
      show-icon
      message="کلید API یافت نشد"
      description="فایل .env.local را با VITE_GROQ_API_KEY=... بسازید."
    >
      <template #action>
        <Button size="small" type="link" href="https://console.groq.com/keys" target="_blank">
          <template #icon><LinkOutlined /></template>
          دریافت کلید
        </Button>
      </template>
    </Alert>

    <Card v-if="chainProgress" size="small" title="زنجیره در حال اجرا">
      <Space direction="vertical">
        <Progress
          :percent="Math.round((chainProgress.current / chainProgress.total) * 100)"
          status="active"
        />
        <Text type="secondary">
          مرحله {{ chainProgress.current }} از {{ chainProgress.total }}
        </Text>
        <Button v-if="chainRunning" danger size="small" @click="onStopChain">
          <template #icon><StopOutlined /></template>
          توقف زنجیره
        </Button>
      </Space>
    </Card>

    <Card size="small" title="زنجیره‌های پیشنهادی">
      <Space wrap>
        <Button
          v-for="chain in AI_CHAINS"
          :key="chain.id"
          :loading="chainRunning"
          :disabled="!isReady || isLoading"
          @click="startChainRun(chain.id)"
        >
          {{ chain.label }}
        </Button>
      </Space>
      <Paragraph type="secondary">
        {{ AI_CHAINS.map((c) => c.description).join(' · ') }}
      </Paragraph>
    </Card>

    <Space wrap>
      <Select
        :value="selectedModelId"
        :options="modelOptions"
        :disabled="isLoading || chainRunning"
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
      :disabled="isLoading || chainRunning"
      @update:value="onActionChange"
    />
    <Paragraph v-if="selectedAction" type="secondary">
      {{ selectedAction.description }}
    </Paragraph>

    <Card size="small" title="آمادگی context">
      <Progress
        :percent="readiness.percent"
        :status="readiness.readyEnough ? 'success' : 'active'"
      />
      <Space wrap>
        <Tag v-for="item in readiness.items" :key="item.id" :color="item.met ? 'success' : 'default'">
          {{ item.met ? '✓' : '○' }} {{ item.label }}
        </Tag>
      </Space>
    </Card>

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
      :disabled="!isReady || isLoading || chainRunning"
      placeholder="مثلاً تمرکز روی کاربران موبایل…"
    />

    <Space wrap>
      <Button
        type="primary"
        :disabled="!isReady || chainRunning"
        :loading="isLoading"
        @click="onSend"
      >
        <template #icon><SendOutlined /></template>
        اجرای اکشن AI
      </Button>
      <Button :disabled="!lastResponse || isLoading || chainRunning" @click="onSend">
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
          <Button
            v-if="canApply && !chainRunning"
            type="primary"
            size="small"
            @click="onApply"
          >
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

    <AiHistoryList />
  </Space>
</template>
