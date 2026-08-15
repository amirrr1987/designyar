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
  createEmptyPersona,
  personasAiSchema,
  type Persona,
} from '@/types/empathize'
import { personaAiExtraContext } from '@/constants/dt-ai-prompts'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<Persona[]>(
  store.state.personas.length > 0
    ? store.state.personas.map((item) => ({ ...item }))
    : [createEmptyPersona()],
)

const cardProps: CardProps = { size: 'small', bordered: true }

const filledCount = computed(
  () =>
    items.value.filter(
      (item) =>
        item.name.trim().length > 0 ||
        item.role.trim().length > 0 ||
        item.goals.trim().length > 0 ||
        item.pains.trim().length > 0 ||
        item.loves.trim().length > 0 ||
        item.fears.trim().length > 0 ||
        item.dailyJobs.trim().length > 0,
    ).length,
)

const pulseSummary = computed(() =>
  filledCount.value === 0
    ? 'هنوز پرسونایی پر نشده'
    : `${filledCount.value} پرسونا با محتوا`,
)

function persist(): void {
  store.setPersonas(items.value.map((item) => ({ ...item })))
}

function persistClean(): void {
  const cleaned = items.value.filter(
    (item) =>
      item.name.trim().length > 0 ||
      item.role.trim().length > 0 ||
      item.goals.trim().length > 0 ||
      item.pains.trim().length > 0 ||
      item.loves.trim().length > 0 ||
      item.fears.trim().length > 0 ||
      item.dailyJobs.trim().length > 0,
  )
  const next = cleaned.length > 0 ? cleaned : [createEmptyPersona()]
  store.setPersonas(next.map((item) => ({ ...item })))
  items.value = next.map((item) => ({ ...item }))
}

function addItem(): void {
  items.value = [...items.value, createEmptyPersona()]
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : [createEmptyPersona()]
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: personasAiSchema,
  formTitle: 'پرسونا',
  phase: 'empathize',
  getCurrentValue: () => ({ personas: items.value }),
  extraContext: () => personaAiExtraContext(store.state.researchGoal),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.personas
        .map(
          (p, i) =>
            `${i + 1}. ${p.name || 'بدون نام'} — ${p.role}\nهدف: ${p.goals}\nدرد: ${p.pains}\nعلاقه: ${p.loves}\nترس: ${p.fears}\nکار روزانه: ${p.dailyJobs}`,
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
    preview.value.personas.length > 0
      ? preview.value.personas.map((item) => ({
          ...item,
          id: item.id || createEmptyPersona().id,
        }))
      : [createEmptyPersona()]
  store.setPersonas(next)
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
        <template #title>پرسونا {{ index + 1 }}</template>
        <template #extra>
          <Button
            danger
            type="text"
            html-type="button"
            aria-label="حذف پرسونا"
            @click="removeItem(index)"
          >
            <template #icon><DeleteOutlined /></template>
          </Button>
        </template>
        <Form layout="vertical">
          <FormItem label="نام">
            <Input v-model:value="item.name" placeholder="مثلاً سارا" @blur="persist" />
          </FormItem>
          <FormItem label="نقش / شغل">
            <Input v-model:value="item.role" placeholder="طراح جونیور" @blur="persist" />
          </FormItem>
          <FormItem label="اهداف">
            <Input.TextArea v-model:value="item.goals" :rows="2" @blur="persist" />
          </FormItem>
          <FormItem label="دردها / موانع">
            <Input.TextArea v-model:value="item.pains" :rows="2" @blur="persist" />
          </FormItem>
          <FormItem label="چه چیزی دوست دارم؟">
            <Input.TextArea
              v-model:value="item.loves"
              :rows="2"
              placeholder="علاقه‌ها، چیزهایی که انرژی می‌دهد"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="از چه می‌ترسم؟">
            <Input.TextArea
              v-model:value="item.fears"
              :rows="2"
              placeholder="ترس‌ها و نگرانی‌ها"
              @blur="persist"
            />
          </FormItem>
          <FormItem label="کارهای روزمره دربارهٔ مسئله">
            <Input.TextArea
              v-model:value="item.dailyJobs"
              :rows="2"
              placeholder="وظایف روزانه مرتبط با موضوع"
              @blur="persist"
            />
          </FormItem>
        </Form>
      </Card>

      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن پرسونا
      </Button>
    </Space>
  </MicroFormShell>
</template>
