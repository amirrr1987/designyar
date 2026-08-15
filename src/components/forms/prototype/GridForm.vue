<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Col, Form, FormItem, InputNumber, Row, Segmented, Space, Typography } from 'ant-design-vue'
import type { SegmentedProps } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
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

const columnOptions: NonNullable<SegmentedProps['options']> = [
  { label: '۴', value: 4 },
  { label: '۸', value: 8 },
  { label: '۱۲', value: 12 },
  { label: '۱۶', value: 16 },
]

const columnSpan = computed(() => Math.max(1, Math.floor(24 / Math.max(draft.columns, 1))))

const demoCells = computed(() =>
  Array.from({ length: Math.min(draft.columns, 12) }, (_, i) => i + 1),
)

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
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="شبکهٔ صفحه">
        <Row :gutter="[draft.gutter, draft.gutter]">
          <Col v-for="cell in demoCells" :key="cell" :span="columnSpan">
            <div
              class="flex h-14 items-center justify-center rounded-lg bg-teal-600/15 text-sm font-medium text-teal-900 ring-1 ring-teal-600/20"
            >
              {{ cell }}
            </div>
          </Col>
        </Row>
        <Typography.Text type="secondary" class="mt-3 block text-xs">
          {{ draft.columns }} ستون · فاصله {{ draft.gutter }}px
          <template v-if="draft.columns > 12"> (نمایش تا ۱۲ ستون)</template>
        </Typography.Text>
      </LiveStudioPreview>

      <Form layout="vertical">
        <FormItem label="تعداد ستون">
          <Segmented
            :value="draft.columns"
            block
            :options="columnOptions"
            @change="
              (value) => {
                draft.columns = Number(value)
                persist()
              }
            "
          />
        </FormItem>
        <FormItem label="یا مقدار سفارشی">
          <InputNumber
            v-model:value="draft.columns"
            class="w-full"
            :min="4"
            :max="24"
            @change="persist"
          />
        </FormItem>
        <FormItem label="فاصله بین ستون‌ها (گاتر)">
          <InputNumber
            v-model:value="draft.gutter"
            class="w-full"
            :min="4"
            :max="48"
            :step="4"
            @change="persist"
          />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
