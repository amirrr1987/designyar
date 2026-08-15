<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  Card,
  Checkbox,
  Progress,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { DEFAULT_WCAG_KEYS, wcagAiSchema } from '@/types/test'

const LABELS: Record<(typeof DEFAULT_WCAG_KEYS)[number], string> = {
  'alt-text': 'متن جایگزین تصاویر',
  keyboard: 'قابل استفاده با صفحه‌کلید',
  labels: 'برچسب فیلدها',
  contrast: 'کنتراست متن',
  'focus-visible': 'نمایان بودن فوکوس',
}

const HINTS: Record<(typeof DEFAULT_WCAG_KEYS)[number], string> = {
  'alt-text': 'تصاویر معنادار توضیح کوتاه دارند؟',
  keyboard: 'همهٔ کارها با Tab / Enter ممکن است؟',
  labels: 'هر فیلد برچسب واضح دارد؟',
  contrast: 'متن روی پس‌زمینه خوانا است؟',
  'focus-visible': 'فوکوس کیبورد دیده می‌شود؟',
}

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<Record<string, boolean>>({ ...store.state.wcag })

watch(
  () => store.state.wcag,
  (value) => {
    for (const key of Object.keys(draft)) {
      delete draft[key]
    }
    Object.assign(draft, value)
  },
)

function persist(): void {
  store.setWcag({ ...draft })
}

const doneCount = computed(
  () => DEFAULT_WCAG_KEYS.filter((key) => draft[key] === true).length,
)
const percent = computed(() =>
  Math.round((doneCount.value / DEFAULT_WCAG_KEYS.length) * 100),
)
const remaining = computed(() => DEFAULT_WCAG_KEYS.length - doneCount.value)

const cardProps: CardProps = { size: 'small', bordered: true }

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: wcagAiSchema,
  formTitle: 'چک‌لیست دسترس‌پذیری',
  phase: 'test',
  getCurrentValue: () => ({ wcag: { ...draft } }),
})

const previewText = computed(() =>
  preview.value
    ? Object.entries(preview.value.wcag)
        .map(([k, v]) => `${k}: ${v ? 'بله' : 'خیر'}`)
        .join('\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setWcag({ ...preview.value.wcag })
  for (const key of Object.keys(draft)) {
    delete draft[key]
  }
  Object.assign(draft, preview.value.wcag)
  clearPreview()
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
    @next="persist(); goNext()"
    @prev="persist(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="پیشرفت دسترس‌پذیری">
        <div class="flex flex-wrap items-center gap-6">
          <Progress type="dashboard" :percent="percent" :size="96" />
          <div class="min-w-40 flex-1">
            <Statistic title="موارد تأییدشده" :value="doneCount" :suffix="`/ ${DEFAULT_WCAG_KEYS.length}`" />
            <Typography.Paragraph class="mb-0! mt-2! text-sm text-stone-600">
              {{
                remaining === 0
                  ? 'همهٔ موارد پایه علامت خورده‌اند'
                  : `${remaining} مورد مانده — رد کردن آزاد است`
              }}
            </Typography.Paragraph>
          </div>
        </div>
      </LiveStudioPreview>

      <Card
        v-for="key in DEFAULT_WCAG_KEYS"
        :key="key"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <Checkbox
            :checked="Boolean(draft[key])"
            @update:checked="
              (checked: boolean) => {
                draft[key] = checked
                persist()
              }
            "
          >
            <span class="font-medium text-stone-800">{{ LABELS[key] }}</span>
          </Checkbox>
          <Tag :color="draft[key] ? 'success' : 'default'">
            {{ draft[key] ? 'انجام' : 'باز' }}
          </Tag>
        </div>
        <Typography.Paragraph type="secondary" class="mb-0! mt-2! text-xs">
          {{ HINTS[key] }}
        </Typography.Paragraph>
      </Card>
    </Space>
  </MicroFormShell>
</template>
