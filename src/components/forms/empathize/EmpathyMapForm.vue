<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import { empathyMapAiSchema, type EmpathyMap } from '@/types/empathize'
import type { AiAssistMode } from '@/types/ai'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<EmpathyMap>({ ...store.state.empathyMap })

watch(
  () => store.state.empathyMap,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setEmpathyMap({ ...draft })
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: empathyMapAiSchema,
  formTitle: 'نقشه همدلی',
  phase: 'empathize',
  getCurrentValue: () => ({ ...draft }),
  extraContext: () =>
    JSON.stringify({ persona: store.state.persona, researchGoal: store.state.researchGoal }),
})

const previewText = computed(() =>
  preview.value
    ? `می‌گوید: ${preview.value.says}\nفکر می‌کند: ${preview.value.thinks}\nمی‌کند: ${preview.value.does}\nاحساس: ${preview.value.feels}`
    : '',
)

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setEmpathyMap({ ...preview.value })
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
      <FormItem label="می‌گوید">
        <Input.TextArea v-model:value="draft.says" :rows="2" @blur="persist" />
      </FormItem>
      <FormItem label="فکر می‌کند">
        <Input.TextArea v-model:value="draft.thinks" :rows="2" @blur="persist" />
      </FormItem>
      <FormItem label="انجام می‌دهد">
        <Input.TextArea v-model:value="draft.does" :rows="2" @blur="persist" />
      </FormItem>
      <FormItem label="احساس می‌کند">
        <Input.TextArea v-model:value="draft.feels" :rows="2" @blur="persist" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
