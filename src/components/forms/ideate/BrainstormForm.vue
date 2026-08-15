<script setup lang="ts">
import { computed, ref } from 'vue'
import { Alert, Button, Card, Form, FormItem, Input, Space, Tag } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { useDefineStore } from '@/stores/define'
import { brainstormAiSchema } from '@/types/ideate'
import { brainstormAiExtraContext } from '@/constants/dt-ai-prompts'

const store = useIdeateStore()
const defineStore = useDefineStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const items = ref<string[]>(store.state.ideas.length > 0 ? [...store.state.ideas] : [''])
const selectedIndex = ref(store.state.selectedIdeaIndex)

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
    ? 'اول کمیت — بعد با سه سؤال انتخاب کن.'
    : selectedIndex.value >= 0 && items.value[selectedIndex.value]?.trim()
      ? `${filledCount.value} ایده · منتخب: «${items.value[selectedIndex.value]}»`
      : `${filledCount.value} از ${totalCount.value} ایده — هنوز منتخب نداری.`,
)

function persist(): void {
  store.setIdeas(items.value.length > 0 ? [...items.value] : [''])
  store.setSelectedIdeaIndex(selectedIndex.value)
}

function persistClean(): void {
  const cleaned = items.value.map((item) => item.trim()).filter((item) => item.length > 0)
  const next = cleaned.length > 0 ? cleaned : ['']
  if (selectedIndex.value >= next.length) selectedIndex.value = -1
  store.setIdeas(next)
  store.setSelectedIdeaIndex(selectedIndex.value)
  items.value = [...next]
}

function addItem(): void {
  items.value = [...items.value, '']
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : ['']
  if (selectedIndex.value === index) selectedIndex.value = -1
  else if (selectedIndex.value > index) selectedIndex.value -= 1
  persist()
}

function updateItem(index: number, value: string): void {
  const next = [...items.value]
  next[index] = value
  items.value = next
}

function selectIdea(index: number): void {
  selectedIndex.value = selectedIndex.value === index ? -1 : index
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: brainstormAiSchema,
  formTitle: 'طوفان فکری',
  phase: 'ideate',
  getCurrentValue: () => ({
    ideas: items.value.map((item) => item.trim()).filter((item) => item.length > 0),
    selectedIdeaIndex: selectedIndex.value,
  }),
  extraContext: () => brainstormAiExtraContext(JSON.stringify(defineStore.state)),
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
  if (
    typeof preview.value.selectedIdeaIndex === 'number' &&
    preview.value.selectedIdeaIndex >= 0 &&
    preview.value.selectedIdeaIndex < next.length
  ) {
    selectedIndex.value = preview.value.selectedIdeaIndex
    store.setSelectedIdeaIndex(selectedIndex.value)
  }
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

      <Alert
        type="info"
        show-icon
        class="rounded-xl"
        message="انتخاب ساخت‌یافته"
        description="کدام ایده اثرگذارتر است؟ کدام زودتر قابل اجراست؟ کدام در سازمانت شانس بیشتری دارد؟ بعد یکی را به‌عنوان منتخب علامت بزن."
      />

      <Card
        v-for="(item, index) in items"
        :key="index"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
        :class="selectedIndex === index ? 'ring-2! ring-teal-400!' : ''"
      >
        <Form layout="vertical">
          <FormItem :label="`ایده ${index + 1}`" class="mb-0!">
            <Space class="w-full" align="start">
              <Input
                :value="item"
                class="flex-1"
                @update:value="updateItem(index, $event)"
                @blur="persist"
              />
              <Button
                :type="selectedIndex === index ? 'primary' : 'default'"
                html-type="button"
                aria-label="انتخاب به‌عنوان ایده منتخب"
                @click="selectIdea(index)"
              >
                <template #icon><CheckOutlined /></template>
              </Button>
              <Button danger html-type="button" aria-label="حذف ایده" @click="removeItem(index)">
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Space>
            <Tag v-if="selectedIndex === index" color="success" class="mt-2">ایدهٔ منتخب</Tag>
          </FormItem>
        </Form>
      </Card>
      <Button type="dashed" block html-type="button" @click="addItem">
        <template #icon><PlusOutlined /></template>
        افزودن ایده
      </Button>
    </Space>
  </MicroFormShell>
</template>
