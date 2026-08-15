<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { useDefineStore } from '@/stores/define'
import { brainstormAiSchema } from '@/types/ideate'
import type { AiAssistMode } from '@/types/ai'

const store = useIdeateStore()
const defineStore = useDefineStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>([...store.state.ideas])

watch(
  () => store.state.ideas,
  (value) => {
    items.value = [...value]
  },
)

function persist(): void {
  const next = items.value.map((item) => item.trim()).filter((item) => item.length > 0)
  store.setIdeas(next.length > 0 ? next : [''])
  items.value = [...store.state.ideas]
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
  schema: brainstormAiSchema,
  formTitle: 'طوفان فکری',
  phase: 'ideate',
  getCurrentValue: () => ({ ideas: items.value }),
  extraContext: () => JSON.stringify(defineStore.state),
})

const previewText = computed(() => (preview.value ? preview.value.ideas.join('\n') : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  persist()
  await requestAssist(mode)
}

function onAccept(): void {
  if (!preview.value) return
  store.setIdeas([...preview.value.ideas])
  items.value = [...preview.value.ideas]
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
        <FormItem :label="`ایده ${index + 1}`">
          <Space class="w-full">
            <Input
              :value="item"
              class="flex-1"
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
        افزودن ایده
      </Button>
    </Space>
  </MicroFormShell>
</template>
