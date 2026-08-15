<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import { competitorsAiSchema, type Competitor } from '@/types/empathize'
const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const rows = ref<Competitor[]>(store.state.competitors.map((item) => ({ ...item })))

watch(
  () => store.state.competitors,
  (value) => {
    rows.value = value.map((item) => ({ ...item }))
  },
)

function persist(): void {
  store.setCompetitors(rows.value.map((item) => ({ ...item })))
}

function addRow(): void {
  rows.value = [...rows.value, { name: '', strength: '', weakness: '' }]
  persist()
}

function removeRow(index: number): void {
  rows.value = rows.value.filter((_, i) => i !== index)
  if (rows.value.length === 0) {
    rows.value = [{ name: '', strength: '', weakness: '' }]
  }
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: competitorsAiSchema,
  formTitle: 'رقبا',
  phase: 'empathize',
  getCurrentValue: () => ({ competitors: rows.value }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.competitors
        .map((c) => `${c.name}: قوت ${c.strength} / ضعف ${c.weakness}`)
        .join('\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setCompetitors(preview.value.competitors.map((item) => ({ ...item })))
  rows.value = preview.value.competitors.map((item) => ({ ...item }))
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
    <Space direction="vertical" class="w-full" size="middle">
      <Form v-for="(row, index) in rows" :key="index" layout="vertical">
        <FormItem :label="`رقیب ${index + 1}`">
          <Input v-model:value="row.name" placeholder="نام" @blur="persist" />
        </FormItem>
        <FormItem label="نقطه قوت">
          <Input v-model:value="row.strength" @blur="persist" />
        </FormItem>
        <FormItem label="نقطه ضعف">
          <Space class="w-full" align="start">
            <Input v-model:value="row.weakness" class="flex-1" @blur="persist" />
            <Button danger @click="removeRow(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>
      <Button type="dashed" block @click="addRow">
        <template #icon><PlusOutlined /></template>
        افزودن رقیب
      </Button>
    </Space>
  </MicroFormShell>
</template>
