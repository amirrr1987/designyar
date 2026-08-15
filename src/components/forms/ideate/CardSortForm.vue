<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, Form, FormItem, Input, Space } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { cardSortAiSchema, type CardGroup } from '@/types/ideate'

const store = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const groups = ref<CardGroup[]>(store.state.cardSort.map((g) => ({ ...g, items: [...g.items] })))

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const namedGroupCount = computed(
  () => groups.value.filter((g) => g.name.trim().length > 0).length,
)

const itemCount = computed(() =>
  groups.value.reduce(
    (sum, g) => sum + g.items.map((item) => item.trim()).filter((item) => item.length > 0).length,
    0,
  ),
)

const pulsePercent = computed(() => {
  if (groups.value.length === 0) return 0
  const namedRatio = namedGroupCount.value / groups.value.length
  const hasItems = itemCount.value > 0 ? 1 : 0
  return Math.round(((namedRatio + hasItems) / 2) * 100)
})

const pulseSummary = computed(() =>
  namedGroupCount.value === 0 && itemCount.value === 0
    ? 'هنوز گروهی ساخته نشده — نام گروه و آیتم‌ها را با ویرگول بنویس.'
    : `${namedGroupCount.value} گروه · ${itemCount.value} آیتم.`,
)

watch(
  () => store.state.cardSort,
  (value) => {
    groups.value = value.map((g) => ({ ...g, items: [...g.items] }))
  },
)

function persist(): void {
  store.setCardSort(groups.value.map((g) => ({ name: g.name, items: [...g.items] })))
}

function addGroup(): void {
  groups.value = [...groups.value, { name: `گروه ${groups.value.length + 1}`, items: [''] }]
  persist()
}

function removeGroup(index: number): void {
  groups.value = groups.value.filter((_, i) => i !== index)
  if (groups.value.length === 0) {
    groups.value = [{ name: 'گروه ۱', items: [''] }]
  }
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: cardSortAiSchema,
  formTitle: 'مرتب‌سازی کارت‌ها',
  phase: 'ideate',
  getCurrentValue: () => ({ cardSort: groups.value }),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.cardSort
        .map((g) => `${g.name}: ${g.items.join('، ')}`)
        .join('\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setCardSort(preview.value.cardSort.map((g) => ({ ...g, items: [...g.items] })))
  groups.value = preview.value.cardSort.map((g) => ({ ...g, items: [...g.items] }))
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
      <FormPulseHeader
        :summary="pulseSummary"
        show-progress
        :percent="pulsePercent"
      />
      <Card
        v-for="(group, index) in groups"
        :key="index"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
      >
        <Form layout="vertical">
          <FormItem label="نام گروه">
            <Space class="w-full">
              <Input v-model:value="group.name" class="flex-1" @blur="persist" />
              <Button danger @click="removeGroup(index)">
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Space>
          </FormItem>
          <FormItem label="آیتم‌ها (با ویرگول)" class="mb-0!">
            <Input
              :value="group.items.join('، ')"
              @update:value="
                (v: string) => {
                  group.items = v.split(/،|,/).map((s) => s.trim()).filter(Boolean)
                  persist()
                }
              "
            />
          </FormItem>
        </Form>
      </Card>
      <Button type="dashed" block @click="addGroup">
        <template #icon><PlusOutlined /></template>
        افزودن گروه
      </Button>
    </Space>
  </MicroFormShell>
</template>
