<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { useIdeateStore } from '@/stores/ideate'
import { wireframeAiSchema } from '@/types/prototype'
import type { AiAssistMode } from '@/types/ai'

const store = usePrototypeStore()
const ideate = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.wireframeNotes,
  set: (value: string) => store.setWireframeNotes(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: wireframeAiSchema,
  formTitle: 'وایرفریم',
  phase: 'prototype',
  getCurrentValue: () => ({ wireframeNotes: store.state.wireframeNotes }),
  extraContext: () =>
    JSON.stringify({
      sitemap: ideate.state.sitemap,
      userflow: ideate.state.userflow,
    }),
})

const previewText = computed(() => (preview.value ? preview.value.wireframeNotes : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setWireframeNotes(preview.value.wireframeNotes)
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
      <FormItem label="یادداشت وایرفریم">
        <Input.TextArea v-model:value="draft" :rows="6" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
