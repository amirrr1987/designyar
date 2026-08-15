<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import {
  createEmptyResearchNote,
  researchNotesAiSchema,
  type ResearchNote,
} from '@/types/empathize'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<ResearchNote[]>(
  store.state.researchNotes.length > 0
    ? store.state.researchNotes.map((item) => ({ ...item }))
    : [createEmptyResearchNote()],
)

function persist(): void {
  store.setResearchNotes(items.value.map((item) => ({ ...item })))
}

function persistClean(): void {
  const cleaned = items.value.filter((item) => item.text.trim().length > 0)
  const next = cleaned.length > 0 ? cleaned : [createEmptyResearchNote()]
  store.setResearchNotes(next.map((item) => ({ ...item })))
  items.value = next.map((item) => ({ ...item }))
}

function addItem(): void {
  items.value = [...items.value, createEmptyResearchNote()]
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : [createEmptyResearchNote()]
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: researchNotesAiSchema,
  formTitle: 'یادداشت پژوهش',
  phase: 'empathize',
  getCurrentValue: () => ({ researchNotes: items.value }),
  extraContext: () =>
    JSON.stringify({
      researchGoal: store.state.researchGoal,
      personas: store.state.personas,
    }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.researchNotes.map((n, i) => `${i + 1}. ${n.text}`).join('\n\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next =
    preview.value.researchNotes.length > 0
      ? preview.value.researchNotes.map((item) => ({
          ...item,
          id: item.id || createEmptyResearchNote().id,
        }))
      : [createEmptyResearchNote()]
  store.setResearchNotes(next)
  items.value = next.map((item) => ({ ...item }))
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
    <Space direction="vertical" class="w-full" size="middle">
      <Form v-for="(item, index) in items" :key="item.id" layout="vertical">
        <FormItem :label="`یادداشت ${index + 1}`">
          <Space class="w-full" align="start">
            <Input.TextArea
              v-model:value="item.text"
              class="flex-1"
              :rows="3"
              placeholder="نکات مصاحبه، مشاهده، نقل‌قول…"
              @blur="persist"
            />
            <Button
              danger
              html-type="button"
              aria-label="حذف یادداشت"
              @click="removeItem(index)"
            >
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن یادداشت
      </Button>
    </Space>
  </MicroFormShell>
</template>
