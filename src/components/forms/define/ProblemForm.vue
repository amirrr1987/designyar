<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import { useEmpathizeStore } from '@/stores/empathize'
import { problemAiSchema } from '@/types/define'
import type { AiAssistMode } from '@/types/ai'

const store = useDefineStore()
const empathize = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.problemStatement,
  set: (value: string) => store.setProblemStatement(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: problemAiSchema,
  formTitle: 'بیانیه مسئله',
  phase: 'define',
  getCurrentValue: () => ({ problemStatement: store.state.problemStatement }),
  extraContext: () => JSON.stringify(empathize.state),
})

const previewText = computed(() => (preview.value ? preview.value.problemStatement : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setProblemStatement(preview.value.problemStatement)
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
      <FormItem label="بیانیه مسئله">
        <Input.TextArea v-model:value="draft" :rows="5" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
