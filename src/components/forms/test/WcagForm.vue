<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Checkbox, Space } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { DEFAULT_WCAG_KEYS, wcagAiSchema } from '@/types/test'
import type { AiAssistMode } from '@/types/ai'

const LABELS: Record<(typeof DEFAULT_WCAG_KEYS)[number], string> = {
  'alt-text': 'متن جایگزین تصاویر',
  keyboard: 'قابل استفاده با صفحه‌کلید',
  labels: 'برچسب فیلدها',
  contrast: 'کنتراست متن',
  'focus-visible': 'نمایان بودن فوکوس',
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

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: wcagAiSchema,
  formTitle: 'چک‌لیست WCAG',
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

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
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
    :ai-improve-label="currentMeta.aiImproveLabel"
    :ai-complete-label="currentMeta.aiCompleteLabel"
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
    <Space direction="vertical">
      <Checkbox
        v-for="key in DEFAULT_WCAG_KEYS"
        :key="key"
        :checked="Boolean(draft[key])"
        @update:checked="
          (checked: boolean) => {
            draft[key] = checked
            persist()
          }
        "
      >
        {{ LABELS[key] }}
      </Checkbox>
    </Space>
  </MicroFormShell>
</template>
