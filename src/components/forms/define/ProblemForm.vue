<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Form, FormItem, Input, Space } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useDefineStore } from '@/stores/define'
import { useEmpathizeStore } from '@/stores/empathize'
import { problemsAiSchema } from '@/types/define'

const store = useDefineStore()
const empathize = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>(
  store.state.problems.length > 0 ? [...store.state.problems] : [''],
)

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const filledCount = computed(
  () => items.value.map((item) => item.trim()).filter((item) => item.length > 0).length,
)

const totalCount = computed(() => items.value.length)

const pulsePercent = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((filledCount.value / totalCount.value) * 100),
)

const pulseSummary = computed(() =>
  filledCount.value === 0
    ? 'هنوز بیانیهٔ مسئله‌ای نوشته نشده — از اولین ردیف شروع کن.'
    : `${filledCount.value} از ${totalCount.value} بیانیه پر شده.`,
)

function persist(): void {
  store.setProblems(items.value.length > 0 ? [...items.value] : [''])
}

function persistClean(): void {
  const cleaned = items.value.map((item) => item.trim()).filter((item) => item.length > 0)
  const next = cleaned.length > 0 ? cleaned : ['']
  store.setProblems(next)
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
  schema: problemsAiSchema,
  formTitle: 'بیانیه مسئله',
  phase: 'define',
  getCurrentValue: () => ({
    problems: items.value.map((item) => item.trim()).filter((item) => item.length > 0),
  }),
  extraContext: () => JSON.stringify(empathize.state),
})

const previewText = computed(() =>
  preview.value ? preview.value.problems.map((p, i) => `${i + 1}. ${p}`).join('\n') : '',
)

async function onAssist(): Promise<void> {
  persistClean()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next = preview.value.problems.length > 0 ? [...preview.value.problems] : ['']
  store.setProblems(next)
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
    <Space direction="vertical" class="w-full" size="middle">
      <FormPulseHeader
        :summary="pulseSummary"
        show-progress
        :percent="pulsePercent"
      />
      <Card
        v-for="(item, index) in items"
        :key="index"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
      >
        <Form layout="vertical">
          <FormItem :label="`بیانیه ${index + 1}`" class="mb-0!">
            <Space class="w-full" align="start">
              <Input.TextArea
                :value="item"
                class="flex-1"
                :rows="3"
                @update:value="updateItem(index, $event)"
                @blur="persist"
              />
              <Button danger html-type="button" aria-label="حذف بیانیه" @click="removeItem(index)">
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Space>
          </FormItem>
        </Form>
      </Card>
      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن بیانیه مسئله
      </Button>
    </Space>
  </MicroFormShell>
</template>
