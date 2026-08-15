<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import { hmwAiSchema } from '@/types/define'
import type { AiAssistMode } from '@/types/ai'

const store = useDefineStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>([...store.state.hmw])

watch(
  () => store.state.hmw,
  (value) => {
    items.value = [...value]
  },
)

function persist(): void {
  store.setHmw(items.value.map((item) => item.trim()).filter((item) => item.length > 0))
  if (store.state.hmw.length === 0) store.setHmw([''])
  items.value = [...store.state.hmw]
}

function addItem(): void {
  items.value = [...items.value, '']
  persist()
}

function removeItem(index: number): void {
  items.value = items.value.filter((_, i) => i !== index)
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: hmwAiSchema,
  formTitle: 'سؤالات HMW',
  phase: 'define',
  getCurrentValue: () => ({ hmw: items.value }),
  extraContext: () =>
    JSON.stringify({ problemStatement: store.state.problemStatement, pov: store.state.pov }),
})

const previewText = computed(() => (preview.value ? preview.value.hmw.join('\n') : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setHmw([...preview.value.hmw])
  items.value = [...preview.value.hmw]
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
      <Form v-for="(item, index) in items" :key="index" layout="vertical">
        <FormItem :label="`HMW ${index + 1}`">
          <Space class="w-full" align="start">
            <Input
              :value="item"
              class="flex-1"
              placeholder="چطور می‌توانیم …؟"
              @update:value="
                (value: string) => {
                  items[index] = value
                }
              "
              @blur="persist"
            />
            <Button danger @click="removeItem(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن سؤال
      </Button>
    </Space>
  </MicroFormShell>
</template>
