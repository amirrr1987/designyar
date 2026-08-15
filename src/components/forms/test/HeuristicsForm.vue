<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Form, FormItem, Input, InputNumber, Space } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { heuristicsAiSchema, type HeuristicItem } from '@/types/test'
import type { AiAssistMode } from '@/types/ai'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<HeuristicItem[]>(store.state.heuristics.map((h) => ({ ...h })))

watch(
  () => store.state.heuristics,
  (value) => {
    items.value = value.map((h) => ({ ...h }))
  },
)

function persist(): void {
  store.setHeuristics(items.value.map((h) => ({ ...h })))
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: heuristicsAiSchema,
  formTitle: 'ارزیابی هیوریستیک',
  phase: 'test',
  getCurrentValue: () => ({ heuristics: items.value }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.heuristics
        .map((h) => `${h.title}: ${h.score}/5 — ${h.note}`)
        .join('\n')
    : '',
)

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setHeuristics(preview.value.heuristics.map((h) => ({ ...h })))
  items.value = preview.value.heuristics.map((h) => ({ ...h }))
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
    <Space direction="vertical" class="w-full" size="large">
      <Form v-for="item in items" :key="item.id" layout="vertical">
        <FormItem :label="item.title">
          <InputNumber
            v-model:value="item.score"
            :min="0"
            :max="5"
            class="mb-2"
            @change="persist"
          />
          <Input.TextArea v-model:value="item.note" :rows="2" @blur="persist" />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
