<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import { researchNotesAiSchema } from '@/types/empathize'
import type { AiAssistMode } from '@/types/ai'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.researchNotes,
  set: (value: string) => store.setResearchNotes(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: researchNotesAiSchema,
  formTitle: 'یادداشت پژوهش',
  phase: 'empathize',
  getCurrentValue: () => ({ researchNotes: store.state.researchNotes }),
  extraContext: () =>
    JSON.stringify({
      researchGoal: store.state.researchGoal,
      persona: store.state.persona,
    }),
})

const previewText = computed(() => (preview.value ? preview.value.researchNotes : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setResearchNotes(preview.value.researchNotes)
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
      <FormItem label="یادداشت‌ها">
        <Input.TextArea
          v-model:value="draft"
          :rows="6"
          placeholder="نکات مصاحبه، مشاهده، نقل‌قول‌ها…"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
