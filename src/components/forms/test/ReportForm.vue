<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { reportAiSchema } from '@/types/test'
import type { AiAssistMode } from '@/types/ai'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.report,
  set: (value: string) => store.setReport(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: reportAiSchema,
  formTitle: 'گزارش کاربردپذیری',
  phase: 'test',
  getCurrentValue: () => ({ report: store.state.report }),
  extraContext: () =>
    JSON.stringify({
      contrast: store.state.contrast,
      wcag: store.state.wcag,
      heuristics: store.state.heuristics,
    }),
})

const previewText = computed(() => (preview.value ? preview.value.report : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setReport(preview.value.report)
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
    @next="goNext()"
    @prev="goPrev()"
  >
    <Form layout="vertical">
      <FormItem label="گزارش">
        <Input.TextArea v-model:value="draft" :rows="8" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
