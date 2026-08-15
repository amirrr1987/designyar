<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, Input, Typography } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { contrastAiSchema, type ContrastPair } from '@/types/test'
import { contrastRatio, meetsWcagAa } from '@/utils/contrast'
import type { AiAssistMode } from '@/types/ai'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<ContrastPair>({ ...store.state.contrast })

watch(
  () => store.state.contrast,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setContrast({ ...draft })
}

const ratio = computed(() => contrastRatio(draft.foreground, draft.background))
const aaOk = computed(() => (ratio.value === null ? false : meetsWcagAa(ratio.value)))

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: contrastAiSchema,
  formTitle: 'کنتراست',
  phase: 'test',
  getCurrentValue: () => ({ ...draft }),
})

const previewText = computed(() =>
  preview.value ? `متن ${preview.value.foreground} روی ${preview.value.background}` : '',
)

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setContrast({ ...preview.value })
  Object.assign(draft, preview.value)
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
    <Form layout="vertical">
      <FormItem label="رنگ متن">
        <Input v-model:value="draft.foreground" @blur="persist" />
      </FormItem>
      <FormItem label="رنگ پس‌زمینه">
        <Input v-model:value="draft.background" @blur="persist" />
      </FormItem>
    </Form>
    <div
      class="mt-2 rounded-lg p-4"
      :style="{ color: draft.foreground, backgroundColor: draft.background }"
    >
      نمونه متن برای بررسی کنتراست
    </div>
    <Typography.Paragraph class="!mt-3 !mb-0">
      نسبت:
      {{ ratio === null ? 'نامعتبر' : ratio.toFixed(2) }}
      —
      {{ aaOk ? 'قبول AA' : 'رد AA' }}
    </Typography.Paragraph>
  </MicroFormShell>
</template>
