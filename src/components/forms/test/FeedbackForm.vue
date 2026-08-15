<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Alert, Form, FormItem, Input, Space } from 'ant-design-vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import {
  createEmptyFeedback,
  feedbackAiSchema,
  type TestFeedback,
} from '@/types/test'
import { feedbackAiExtraContext } from '@/constants/dt-ai-prompts'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = reactive<TestFeedback>({
  ...createEmptyFeedback(),
  ...store.state.feedback,
})

watch(
  () => store.state.feedback,
  (value) => Object.assign(draft, value ?? createEmptyFeedback()),
)

function persist(): void {
  store.setFeedback({ ...draft })
}

const filled = computed(
  () => [draft.like, draft.wish, draft.give].filter((s) => s.trim().length > 0).length,
)

const pulseSummary = computed(() =>
  filled.value === 0
    ? 'Show, don’t tell — بازخورد تست را با سه لنز بنویس.'
    : `${filled.value} از ۳ لنز بازخورد پر شده`,
)

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: feedbackAiSchema,
  formTitle: 'بازخورد تست',
  phase: 'test',
  getCurrentValue: () => ({ feedback: { ...draft } }),
  extraContext: feedbackAiExtraContext,
})

const previewText = computed(() => {
  if (!preview.value) return ''
  const f = preview.value.feedback
  return `دوست داشتم: ${f.like}\nای کاش: ${f.wish}\nپیشنهاد: ${f.give}`
})

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  Object.assign(draft, preview.value.feedback)
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
      <FormPulseHeader :summary="pulseSummary" show-progress :percent="filled * 34" />
      <Alert
        type="info"
        show-icon
        class="rounded-xl"
        message="پروتوتایپ را نشان بده، نفروش — به واکنش واقعی گوش بده."
      />
      <Form layout="vertical">
        <FormItem label="دوست داشتم… (I like)">
          <Input.TextArea
            v-model:value="draft.like"
            :rows="3"
            placeholder="نکات مثبت از دید کاربر"
            @blur="persist"
          />
        </FormItem>
        <FormItem label="ای کاش… (I wish)">
          <Input.TextArea
            v-model:value="draft.wish"
            :rows="3"
            placeholder="چیزی که کم بود یا گیج‌کننده بود"
            @blur="persist"
          />
        </FormItem>
        <FormItem label="پیشنهاد می‌دهم… (I give)">
          <Input.TextArea
            v-model:value="draft.give"
            :rows="3"
            placeholder="یک پیشنهاد مشخص برای دور بعد"
            @blur="persist"
          />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
