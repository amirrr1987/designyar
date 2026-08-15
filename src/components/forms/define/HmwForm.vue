<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import { hmwAiSchema } from '@/types/define'
const store = useDefineStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>(store.state.hmw.length > 0 ? [...store.state.hmw] : [''])

/** Keep empty rows so «افزودن» visibly works while editing. */
function persist(): void {
  store.setHmw(items.value.length > 0 ? [...items.value] : [''])
}

/** Drop blank rows when leaving the form / calling AI. */
function persistClean(): void {
  const cleaned = items.value.map((item) => item.trim()).filter((item) => item.length > 0)
  const next = cleaned.length > 0 ? cleaned : ['']
  store.setHmw(next)
  items.value = [...next]
}

function addItem(): void {
  items.value = [...items.value, '']
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : ['']
  persist()
}

function updateItem(index: number, value: string): void {
  const next = [...items.value]
  next[index] = value
  items.value = next
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: hmwAiSchema,
  formTitle: 'سؤال‌های چطور می‌توانیم',
  phase: 'define',
  getCurrentValue: () => ({
    hmw: items.value.map((item) => item.trim()).filter((item) => item.length > 0),
  }),
  extraContext: () =>
    JSON.stringify({ problems: store.state.problems, povs: store.state.povs }),
})

const previewText = computed(() =>
  preview.value ? preview.value.hmw.map((q, i) => `${i + 1}. ${q}`).join('\n') : '',
)

async function onAssist(): Promise<void> {
  persistClean()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next = preview.value.hmw.length > 0 ? [...preview.value.hmw] : ['']
  store.setHmw(next)
  items.value = [...next]
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
    @next="persistClean(); goNext()"
    @prev="persistClean(); goPrev()"
  >
    <Space direction="vertical" class="w-full">
      <Form v-for="(item, index) in items" :key="index" layout="vertical">
        <FormItem :label="`سؤال ${index + 1}`">
          <Space class="w-full" align="start">
            <Input
              :value="item"
              class="flex-1"
              placeholder="چطور می‌توانیم …؟"
              @update:value="updateItem(index, $event)"
              @blur="persist"
            />
            <Button danger html-type="button" aria-label="حذف سؤال" @click="removeItem(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن سؤال
      </Button>
    </Space>
  </MicroFormShell>
</template>
