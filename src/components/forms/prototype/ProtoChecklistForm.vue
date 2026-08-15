<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Alert, Form, FormItem, Input, Space } from 'ant-design-vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import {
  createEmptyProtoChecklist,
  protoChecklistAiSchema,
  type ProtoChecklist,
} from '@/types/prototype'
import { protoChecklistAiExtraContext } from '@/constants/dt-ai-prompts'

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = reactive<ProtoChecklist>({
  ...createEmptyProtoChecklist(),
  ...store.state.protoChecklist,
})

watch(
  () => store.state.protoChecklist,
  (value) => Object.assign(draft, value ?? createEmptyProtoChecklist()),
)

function persist(): void {
  store.setProtoChecklist({ ...draft })
}

const filled = computed(
  () =>
    [draft.mainFunction, draft.audience, draft.mainAssumption, draft.testIdea].filter(
      (s) => s.trim().length > 0,
    ).length,
)

const pulseSummary = computed(() =>
  filled.value === 0
    ? 'قبل از اسکچ: عملکرد، مخاطب، فرض شکست را بنویس.'
    : `${filled.value} از ۴ بخش پر شده — بساز ارزان، فقط فرض اصلی را تست کن.`,
)

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: protoChecklistAiSchema,
  formTitle: 'چک‌لیست پروتوتایپ',
  phase: 'prototype',
  getCurrentValue: () => ({ protoChecklist: { ...draft } }),
  extraContext: protoChecklistAiExtraContext,
})

const previewText = computed(() => {
  if (!preview.value) return ''
  const c = preview.value.protoChecklist
  return `عملکرد: ${c.mainFunction}\nمخاطب: ${c.audience}\nفرض: ${c.mainAssumption}\nتست: ${c.testIdea}`
})

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  Object.assign(draft, preview.value.protoChecklist)
  persist()
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
    <Space direction="vertical" class="w-full" size="large">
      <FormPulseHeader :summary="pulseSummary" show-progress :percent="filled * 25" />
      <Alert
        type="info"
        show-icon
        class="rounded-xl"
        message="فقط به اندازهٔ لازم پیچیده بساز — فرض اصلی را سریع و ارزان بیازما."
      />
      <Form layout="vertical">
        <FormItem label="عملکرد اصلی ایده چیست؟">
          <Input.TextArea v-model:value="draft.mainFunction" :rows="2" @blur="persist" />
        </FormItem>
        <FormItem label="گروه هدف (با چه کسی تست می‌کنی؟)">
          <Input v-model:value="draft.audience" @blur="persist" />
        </FormItem>
        <FormItem label="فرض اصلی (اگر غلط باشد ایده شکست می‌خورد)">
          <Input.TextArea v-model:value="draft.mainAssumption" :rows="2" @blur="persist" />
        </FormItem>
        <FormItem label="چطور این فرض را سریع و ارزان تست می‌کنی؟">
          <Input.TextArea v-model:value="draft.testIdea" :rows="2" @blur="persist" />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
