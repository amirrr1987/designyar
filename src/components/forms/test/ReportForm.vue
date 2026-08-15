<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  message,
  Space,
  Tag,
  Typography,
} from 'ant-design-vue'
import {
  CopyOutlined,
  DownloadOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue'
import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'
import { isDesignThinkingStepKey } from '@/constants/design-thinking-steps'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { useTestStore } from '@/stores/test'
import { reportAiSchema } from '@/types/test'
import {
  buildHandoffMarkdown,
  buildHandoffPayload,
  copyTextToClipboard,
  downloadJsonFile,
} from '@/utils/test-handoff'
import {
  buildTestNextActions,
  type TestNextAction,
} from '@/utils/test-next-actions'
import { contrastRatio, meetsWcagAa } from '@/utils/contrast'

const store = useTestStore()
const prototypeStore = usePrototypeStore()
const { currentMeta, goNext, goPrev, goToForm } = useFormWizard()

const draft = computed({
  get: () => store.state.report,
  set: (value: string) => store.setReport(value),
})

const handoffNote = ref('')

const deterministicActions = computed(() => buildTestNextActions(store.state))
const aiActions = ref<TestNextAction[]>([])

const displayActions = computed(() =>
  aiActions.value.length > 0 ? aiActions.value : deterministicActions.value,
)

const ratedHeuristics = computed(() =>
  store.state.heuristics.filter((item) => item.score > 0),
)
const wcagDone = computed(
  () => Object.values(store.state.wcag).filter(Boolean).length,
)
const wcagTotal = computed(() => Object.keys(store.state.wcag).length)
const contrastRatioValue = computed(() =>
  contrastRatio(store.state.contrast.foreground, store.state.contrast.background),
)
const contrastOk = computed(() =>
  contrastRatioValue.value === null
    ? false
    : meetsWcagAa(contrastRatioValue.value),
)

const handoffPayload = computed(() =>
  buildHandoffPayload(store.state, prototypeStore.state.palette),
)
const handoffMarkdown = computed(() => buildHandoffMarkdown(handoffPayload.value))

function parseAiActions(
  raw: { title: string; reason: string; phase: string; formKey: string }[] | undefined,
): TestNextAction[] {
  if (!raw || raw.length === 0) return []
  const out: TestNextAction[] = []
  for (const item of raw) {
    if (!isDesignThinkingStepKey(item.phase)) continue
    out.push({
      id: `ai-${item.phase}-${item.formKey}-${out.length}`,
      title: item.title,
      reason: item.reason,
      phase: item.phase,
      formKey: item.formKey,
    })
  }
  return out.slice(0, 5)
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: reportAiSchema,
  formTitle: 'گزارش کاربردپذیری',
  phase: 'test',
  getCurrentValue: () => ({
    report: store.state.report,
    nextActions: deterministicActions.value.map((a) => ({
      title: a.title,
      reason: a.reason,
      phase: a.phase,
      formKey: a.formKey,
    })),
  }),
  extraContext: () =>
    [
      'خروجی: گزارش فارسی کوتاه + حداکثر ۵ nextActions با phase/formKey واقعی اپ.',
      'phase یکی از: empathize | define | ideate | prototype | test',
      'هر اقدام باید از یافتهٔ تست بیاید (کنتراست، WCAG، هیوریستیک ضعیف) — کلی‌گویی ممنوع.',
      `یافته‌ها: ${JSON.stringify({
        contrast: store.state.contrast,
        contrastOk: contrastOk.value,
        wcag: store.state.wcag,
        heuristics: store.state.heuristics.filter((h) => h.score > 0),
        suggested: deterministicActions.value,
      })}`,
    ].join('\n'),
})

const previewText = computed(() => {
  if (!preview.value) return ''
  const actions = preview.value.nextActions ?? []
  const actionLines = actions
    .map((a) => `→ ${a.title}: ${a.reason} (/${a.phase}/${a.formKey})`)
    .join('\n')
  return actionLines ? `${preview.value.report}\n\n${actionLines}` : preview.value.report
})

async function onAssist(): Promise<void> {
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setReport(preview.value.report)
  aiActions.value = parseAiActions(preview.value.nextActions)
  clearPreview()
}

async function copyMarkdown(): Promise<void> {
  const ok = await copyTextToClipboard(handoffMarkdown.value)
  handoffNote.value = ok ? 'Markdown در کلیپ‌بورد کپی شد.' : 'کپی ناموفق بود؛ دستی کپی کن.'
  if (ok) message.success('کپی شد')
}

function downloadJson(): void {
  downloadJsonFile('designyar-test-handoff.json', handoffPayload.value)
  handoffNote.value = 'فایل JSON دانلود شد.'
  message.success('دانلود شد')
}

async function openAction(action: TestNextAction): Promise<void> {
  await goToForm(action.phase as DesignThinkingStepKey, action.formKey)
}
</script>

<template>
  <MicroFormShell
    v-if="currentMeta"
    :title="currentMeta.title"
    :hint="currentMeta.hint"
    :ai-assist-label="currentMeta.aiAssistLabel"
    :loading="loading"
    :error-message="errorMessage"
    :preview-text="previewText"
    :has-preview="preview !== null"
    @assist="onAssist"
    @accept="onAccept"
    @reject="clearPreview"
    @next="goNext()"
    @prev="goPrev()"
  >
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="خلاصهٔ تست">
        <Space wrap size="middle">
          <Tag :color="contrastOk ? 'success' : 'error'">
            کنتراست:
            {{
              contrastRatioValue === null ? 'نامعتبر' : contrastRatioValue.toFixed(2)
            }}
            —
            {{ contrastOk ? 'AA' : 'رد AA' }}
          </Tag>
          <Tag color="processing">WCAG: {{ wcagDone }}/{{ wcagTotal }}</Tag>
          <Tag color="default">هیوریستیک امتیازدار: {{ ratedHeuristics.length }}</Tag>
        </Space>
      </LiveStudioPreview>

      <div>
        <Typography.Text class="mb-2 block text-stone-600">کار بعدی (حلقهٔ نرم)</Typography.Text>
        <Typography.Paragraph type="secondary" class="mb-2! text-xs">
          از یافته‌های تست پیشنهاد شده — برو و اصلاح کن، بعد برگرد به گزارش.
        </Typography.Paragraph>
        <Space direction="vertical" class="w-full" size="small">
          <Alert
            v-if="displayActions.length === 0"
            type="success"
            show-icon
            message="فعلاً اقدام فوری پیشنهاد نشده؛ می‌توانی گزارش را بنویسی یا AI کمک بگیرد."
          />
          <Button
            v-for="action in displayActions"
            :key="action.id"
            block
            class="text-start!"
            html-type="button"
            @click="openAction(action)"
          >
            <template #icon><LinkOutlined /></template>
            <span class="font-medium">{{ action.title }}</span>
            <span class="ms-2 text-stone-500">— {{ action.reason }}</span>
          </Button>
        </Space>
      </div>

      <div>
        <Typography.Text class="mb-2 block text-stone-600">Handoff سبک</Typography.Text>
        <Space wrap>
          <Button html-type="button" @click="copyMarkdown">
            <template #icon><CopyOutlined /></template>
            کپی Markdown
          </Button>
          <Button html-type="button" @click="downloadJson">
            <template #icon><DownloadOutlined /></template>
            دانلود JSON
          </Button>
        </Space>
        <Typography.Paragraph v-if="handoffNote" type="secondary" class="mb-0! mt-2! text-xs">
          {{ handoffNote }}
        </Typography.Paragraph>
      </div>

      <Form layout="vertical">
        <FormItem label="گزارش نهایی">
          <Input.TextArea
            v-model:value="draft"
            :rows="8"
            placeholder="یافته‌ها، نقاط قوت، و کار بعدی را کوتاه بنویس…"
          />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
