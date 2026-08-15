<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Form, FormItem, Input, Space } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import {
  createEmptyResearchNote,
  researchNotesAiSchema,
  type ResearchNote,
} from '@/types/empathize'
import { researchNotesAiExtraContext } from '@/constants/dt-ai-prompts'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<ResearchNote[]>(
  store.state.researchNotes.length > 0
    ? store.state.researchNotes.map((item) => ({ ...item }))
    : [createEmptyResearchNote()],
)

const cardProps: CardProps = { size: 'small', bordered: true }

function noteHasContent(item: ResearchNote): boolean {
  return (
    item.who.trim().length > 0 ||
    item.question.trim().length > 0 ||
    item.answer.trim().length > 0 ||
    item.insight.trim().length > 0 ||
    item.text.trim().length > 0
  )
}

const filledCount = computed(() => items.value.filter((item) => noteHasContent(item)).length)

const pulseSummary = computed(() =>
  filledCount.value === 0
    ? 'هنوز برگهٔ مصاحبه‌ای پر نشده — سؤال، پاسخ، بینش.'
    : `${filledCount.value} برگهٔ مصاحبه با محتوا`,
)

function persist(): void {
  store.setResearchNotes(
    items.value.map((item) => ({
      ...item,
      text: item.text.trim() || item.insight.trim() || item.answer.trim(),
    })),
  )
}

function persistClean(): void {
  const cleaned = items.value.filter((item) => noteHasContent(item))
  const next = cleaned.length > 0 ? cleaned : [createEmptyResearchNote()]
  store.setResearchNotes(
    next.map((item) => ({
      ...item,
      text: item.text.trim() || item.insight.trim() || item.answer.trim(),
    })),
  )
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
    researchNotesAiExtraContext(
      JSON.stringify({
        researchGoal: store.state.researchGoal,
        personas: store.state.personas,
      }),
    ),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.researchNotes
        .map(
          (n, i) =>
            `${i + 1}. ${n.who || 'مصاحبه‌شونده'}\nس: ${n.question}\nج: ${n.answer}\nبینش: ${n.insight}`,
        )
        .join('\n\n')
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
      <FormPulseHeader :summary="pulseSummary" />

      <Card
        v-for="(item, index) in items"
        :key="item.id"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
      >
        <template #title>مصاحبه {{ index + 1 }}</template>
        <template #extra>
          <Button
            danger
            type="text"
            html-type="button"
            aria-label="حذف یادداشت"
            @click="removeItem(index)"
          >
            <template #icon><DeleteOutlined /></template>
          </Button>
        </template>
        <Form layout="vertical">
          <FormItem label="چه کسی؟ (Who)">
            <Input
              v-model:value="item.who"
              placeholder="نام / نقش مصاحبه‌شونده"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="سؤال">
            <Input.TextArea
              v-model:value="item.question"
              :rows="2"
              placeholder="سؤال اصلی مصاحبه"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="پاسخ و مشاهده">
            <Input.TextArea
              v-model:value="item.answer"
              :rows="3"
              placeholder="جواب، نقل‌قول، زبان بدن…"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="بینش کلیدی (Key Insight)">
            <Input.TextArea
              v-model:value="item.insight"
              :rows="2"
              placeholder="چیزی که قبلاً نمی‌دانستی"
              @blur="persist"
            />
          </FormItem>
        </Form>
      </Card>

      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن برگهٔ مصاحبه
      </Button>
    </Space>
  </MicroFormShell>
</template>
