<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, InputNumber, Slider } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { typographyAiSchema, type TypographyScale } from '@/types/prototype'
const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<TypographyScale>({ ...store.state.typography })

watch(
  () => store.state.typography,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setTypography({ ...draft })
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: typographyAiSchema,
  formTitle: 'تایپوگرافی',
  phase: 'prototype',
  getCurrentValue: () => ({ ...draft }),
})

const previewText = computed(() =>
  preview.value ? `پایه ${preview.value.baseSize}px — مقیاس ${preview.value.scale}` : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setTypography({ ...preview.value })
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
      <FormItem label="اندازه پایه (px)">
        <InputNumber v-model:value="draft.baseSize" :min="12" :max="24" @change="persist" />
      </FormItem>
      <FormItem :label="`مقیاس (${draft.scale})`">
        <Slider
          v-model:value="draft.scale"
          :min="1.1"
          :max="1.5"
          :step="0.05"
          @change="persist"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
