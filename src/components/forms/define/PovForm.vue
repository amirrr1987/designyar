<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import { useEmpathizeStore } from '@/stores/empathize'
import { povAiSchema } from '@/types/define'
import type { AiAssistMode } from '@/types/ai'

const store = useDefineStore()
const empathize = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.pov,
  set: (value: string) => store.setPov(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: povAiSchema,
  formTitle: 'جملهٔ دیدگاه',
  phase: 'define',
  getCurrentValue: () => ({ pov: store.state.pov }),
  extraContext: () =>
    JSON.stringify({
      problemStatement: store.state.problemStatement,
      persona: empathize.state.persona,
    }),
})

const previewText = computed(() => (preview.value ? preview.value.pov : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setPov(preview.value.pov)
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
      <FormItem label="جملهٔ دیدگاه">
        <Input.TextArea
          v-model:value="draft"
          :rows="4"
          placeholder="کاربر … نیاز دارد … چون …"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
