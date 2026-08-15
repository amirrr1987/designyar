<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { colorsAiSchema } from '@/types/prototype'
import type { AiAssistMode } from '@/types/ai'

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const colors = ref<string[]>([...store.state.colors])

watch(
  () => store.state.colors,
  (value) => {
    colors.value = [...value]
  },
)

function persist(): void {
  store.setColors([...colors.value])
}

function addColor(): void {
  colors.value = [...colors.value, '#1677ff']
  persist()
}

function removeColor(index: number): void {
  colors.value = colors.value.filter((_, i) => i !== index)
  if (colors.value.length === 0) colors.value = ['#1677ff']
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: colorsAiSchema,
  formTitle: 'پالت رنگ',
  phase: 'prototype',
  getCurrentValue: () => ({ colors: colors.value }),
})

const previewText = computed(() => (preview.value ? preview.value.colors.join('، ') : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setColors([...preview.value.colors])
  colors.value = [...preview.value.colors]
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
    <Space direction="vertical" class="w-full">
      <Form v-for="(color, index) in colors" :key="index" layout="vertical">
        <FormItem :label="`رنگ ${index + 1}`">
          <Space>
            <Input
              :value="color"
              placeholder="#1677ff"
              @update:value="
                (value: string) => {
                  colors[index] = value
                }
              "
              @blur="persist"
            />
            <span
              class="inline-block h-8 w-8 rounded border border-neutral-300"
              :style="{ backgroundColor: color }"
            />
            <Button danger @click="removeColor(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block @click="addColor">
        <template #icon><PlusOutlined /></template>
        افزودن رنگ
      </Button>
    </Space>
  </MicroFormShell>
</template>
