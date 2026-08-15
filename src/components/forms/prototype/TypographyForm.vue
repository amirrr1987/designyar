<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Form, FormItem, InputNumber, Slider, Space, Typography } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
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

const scaleSteps = computed(() => {
  const base = draft.baseSize > 0 ? draft.baseSize : 16
  const ratio = draft.scale > 1 ? draft.scale : 1.25
  const levels = [
    { key: 'display', label: 'نمایشی', power: 3 },
    { key: 'h1', label: 'تیتر ۱', power: 2 },
    { key: 'h2', label: 'تیتر ۲', power: 1 },
    { key: 'body', label: 'متن', power: 0 },
    { key: 'caption', label: 'کپشن', power: -0.5 },
  ] as const
  return levels.map((level) => ({
    ...level,
    size: Math.round(base * ratio ** level.power),
  }))
})

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
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="نردبان تایپ (Vazirmatn)">
        <Space direction="vertical" class="w-full" :size="12">
          <div
            v-for="step in scaleSteps"
            :key="step.key"
            class="border-b border-dashed border-stone-200 pb-2 last:border-0"
          >
            <Typography.Text type="secondary" class="text-xs">
              {{ step.label }} · {{ step.size }}px
            </Typography.Text>
            <div
              class="leading-snug text-stone-800"
              :style="{ fontSize: `${step.size}px`, fontFamily: 'Vazirmatn, sans-serif' }"
            >
              طراحی برای انسان، نه فقط برای پیکسل
            </div>
          </div>
        </Space>
      </LiveStudioPreview>

      <Form layout="vertical">
        <FormItem label="اندازه پایه (px)">
          <InputNumber
            v-model:value="draft.baseSize"
            class="w-full"
            :min="12"
            :max="24"
            @change="persist"
          />
        </FormItem>
        <FormItem :label="`نسبت مقیاس — ${draft.scale.toFixed(2)}`">
          <Slider
            v-model:value="draft.scale"
            :min="1.1"
            :max="1.5"
            :step="0.05"
            :marks="{ 1.125: 'ریز', 1.25: 'استاندارد', 1.333: 'متعادل', 1.5: 'پهن' }"
            @change="persist"
          />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
