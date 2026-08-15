<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Form, FormItem, Segmented, Slider, Space, Typography } from 'ant-design-vue'
import type { SegmentedProps } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { spacingAiSchema } from '@/types/prototype'

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

const multipliers = [1, 2, 3, 4, 6, 8] as const

const scale = computed(() =>
  multipliers.map((m) => ({
    multiplier: m,
    px: draft.value * m,
  })),
)

const presetOptions: NonNullable<SegmentedProps['options']> = [
  { label: 'فشرده ۴', value: 4 },
  { label: 'استاندارد ۸', value: 8 },
  { label: 'باز ۱۲', value: 12 },
]

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: spacingAiSchema,
  formTitle: 'فاصله‌گذاری',
  phase: 'prototype',
  getCurrentValue: () => ({ spacingBase: draft.value }),
})

const previewText = computed(() =>
  preview.value ? `پایه فاصله: ${preview.value.spacingBase}px` : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
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
      <LiveStudioPreview title="مقیاس فاصله">
        <Space direction="vertical" class="w-full" :size="8">
          <div
            v-for="step in scale"
            :key="step.multiplier"
            class="flex items-center gap-3"
          >
            <Typography.Text class="w-16 shrink-0 text-xs text-stone-500">
              {{ step.multiplier }}× · {{ step.px }}px
            </Typography.Text>
            <div
              class="h-8 rounded-md bg-gradient-to-l from-teal-600 to-teal-400 shadow-sm"
              :style="{ width: `${Math.min(step.px * 4, 280)}px` }"
              :aria-label="`فاصله ${step.px} پیکسل`"
            />
          </div>
        </Space>
        <div
          class="mt-4 rounded-xl bg-white p-3 ring-1 ring-stone-200"
          :style="{ display: 'flex', flexDirection: 'column', gap: `${draft}px` }"
        >
          <div class="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">بلوک اول</div>
          <div class="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">بلوک دوم</div>
          <div class="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">بلوک سوم</div>
        </div>
      </LiveStudioPreview>

      <Form layout="vertical">
        <FormItem label="پیش‌تنظیم">
          <Segmented
            :value="draft"
            block
            :options="presetOptions"
            @change="
              (value) => {
                draft.value = Number(value)
                persist()
              }
            "
          />
        </FormItem>
        <FormItem :label="`واحد پایه: ${draft}px`">
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
    </Space>
  </MicroFormShell>
</template>
