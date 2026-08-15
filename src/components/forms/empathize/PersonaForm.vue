<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import { personaAiSchema, type Persona } from '@/types/empathize'
import type { AiAssistMode } from '@/types/ai'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = reactive<Persona>({ ...store.state.persona })

watch(
  () => store.state.persona,
  (value) => {
    Object.assign(draft, value)
  },
)

function persist(): void {
  store.setPersona({ ...draft })
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: personaAiSchema,
  formTitle: 'پرسونا',
  phase: 'empathize',
  getCurrentValue: () => ({ ...draft }),
})

const previewText = computed(() =>
  preview.value
    ? `${preview.value.name} — ${preview.value.role}\nهدف: ${preview.value.goals}\nدرد: ${preview.value.pains}`
    : '',
)

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setPersona({ ...preview.value })
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
      <FormItem label="نام">
        <Input v-model:value="draft.name" placeholder="مثلاً سارا" @blur="persist" />
      </FormItem>
      <FormItem label="نقش">
        <Input v-model:value="draft.role" placeholder="طراح جونیور" @blur="persist" />
      </FormItem>
      <FormItem label="اهداف">
        <Input.TextArea v-model:value="draft.goals" :rows="2" @blur="persist" />
      </FormItem>
      <FormItem label="دردها / موانع">
        <Input.TextArea v-model:value="draft.pains" :rows="2" @blur="persist" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
