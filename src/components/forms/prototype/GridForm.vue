<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, InputNumber } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { gridAiSchema, type GridConfig } from '@/types/prototype'
const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<GridConfig>({ ...store.state.grid })

watch(
  () => store.state.grid,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setGrid({ ...draft })
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: gridAiSchema,
  formTitle: 'گرید',
  phase: 'prototype',
  getCurrentValue: () => ({ ...draft }),
})

const previewText = computed(() =>
  preview.value ? `${preview.value.columns} ستون — گاتر ${preview.value.gutter}px` : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setGrid({ ...preview.value })
  Object.assign(draft, preview.value)
  clearPreview()
}
</script>

<template>
  <MicroFormShell
    v-if="currentMeta"
    :title="currentMeta.title"
    :hint="currentMeta.hint"
    :ai-assist-label="currentMeta.aiAssistLabel"
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
      <FormItem label="تعداد ستون">
        <InputNumber v-model:value="draft.columns" :min="4" :max="24" @change="persist" />
      </FormItem>
      <FormItem label="گاتر (px)">
        <InputNumber v-model:value="draft.gutter" :min="4" :max="48" @change="persist" />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
