<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Form, FormItem, Slider } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { spacingAiSchema } from '@/types/prototype'
import type { AiAssistMode } from '@/types/ai'

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = ref(store.state.spacingBase)

watch(
  () => store.state.spacingBase,
  (value) => {
    draft.value = value
  },
)

function persist(): void {
  store.setSpacingBase(draft.value)
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: spacingAiSchema,
  formTitle: 'فاصله‌گذاری',
  phase: 'prototype',
  getCurrentValue: () => ({ spacingBase: draft.value }),
})

const previewText = computed(() =>
  preview.value ? `پایه فاصله: ${preview.value.spacingBase}px` : '',
)

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setSpacingBase(preview.value.spacingBase)
  draft.value = preview.value.spacingBase
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
      <FormItem :label="`پایه ۸ نقطه‌ای: ${draft}px`">
        <Slider
          v-model:value="draft"
          :min="4"
          :max="16"
          :step="2"
          :marks="{ 4: '4', 8: '8', 12: '12', 16: '16' }"
          @change="persist"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
