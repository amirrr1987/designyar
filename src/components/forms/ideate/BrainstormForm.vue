<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { useDefineStore } from '@/stores/define'
import { brainstormAiSchema } from '@/types/ideate'
const store = useIdeateStore()
const defineStore = useDefineStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>(store.state.ideas.length > 0 ? [...store.state.ideas] : [''])

function persist(): void {
  store.setIdeas(items.value.length > 0 ? [...items.value] : [''])
}

function persistClean(): void {
  const cleaned = items.value.map((item) => item.trim()).filter((item) => item.length > 0)
  const next = cleaned.length > 0 ? cleaned : ['']
  store.setIdeas(next)
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
  schema: brainstormAiSchema,
  formTitle: 'طوفان فکری',
  phase: 'ideate',
  getCurrentValue: () => ({
    ideas: items.value.map((item) => item.trim()).filter((item) => item.length > 0),
  }),
  extraContext: () => JSON.stringify(defineStore.state),
})

const previewText = computed(() => (preview.value ? preview.value.ideas.join('\n') : ''))

async function onAssist(): Promise<void> {
  persistClean()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next = preview.value.ideas.length > 0 ? [...preview.value.ideas] : ['']
  store.setIdeas(next)
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
        <FormItem :label="`ایده ${index + 1}`">
          <Space class="w-full">
            <Input
              :value="item"
              class="flex-1"
              @update:value="updateItem(index, $event)"
              @blur="persist"
            />
            <Button danger html-type="button" aria-label="حذف ایده" @click="removeItem(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن ایده
      </Button>
    </Space>
  </MicroFormShell>
</template>
