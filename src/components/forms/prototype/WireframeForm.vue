<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Form, FormItem, Input, Select, Space, Typography } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { useIdeateStore } from '@/stores/ideate'
import {
  createEmptyWireframeBlock,
  kindLabel,
  wireframeAiSchema,
  wireframeBlockKinds,
  type WireframeBlock,
  type WireframeBlockKind,
} from '@/types/prototype'

const store = usePrototypeStore()
const ideate = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const items = ref<WireframeBlock[]>(
  store.state.wireframeBlocks.length > 0
    ? store.state.wireframeBlocks.map((b) => ({ ...b }))
    : [createEmptyWireframeBlock()],
)

const kindOptions: NonNullable<SelectProps['options']> = wireframeBlockKinds.map((kind) => ({
  value: kind,
  label: kindLabel(kind),
}))

const kindHeight: Record<WireframeBlockKind, string> = {
  header: 'h-10',
  nav: 'h-8',
  hero: 'h-24',
  content: 'h-16',
  aside: 'h-20',
  cta: 'h-12',
  footer: 'h-10',
}

const kindTone: Record<WireframeBlockKind, string> = {
  header: 'bg-stone-800 text-white',
  nav: 'bg-stone-200 text-stone-700',
  hero: 'bg-teal-100 text-teal-900 ring-1 ring-teal-200',
  content: 'bg-white text-stone-700 ring-1 ring-stone-200',
  aside: 'bg-amber-50 text-amber-900 ring-1 ring-amber-100',
  cta: 'bg-teal-600 text-white',
  footer: 'bg-stone-100 text-stone-500',
}

function persist(): void {
  store.setWireframeBlocks(items.value.map((item) => ({ ...item })))
}

function persistClean(): void {
  const cleaned = items.value.filter((item) => item.title.trim().length > 0)
  const next = cleaned.length > 0 ? cleaned : [createEmptyWireframeBlock('hero', '')]
  store.setWireframeBlocks(next.map((item) => ({ ...item })))
  items.value = next.map((item) => ({ ...item }))
}

function addItem(): void {
  items.value = [...items.value, createEmptyWireframeBlock('content', '')]
  persist()
}

function removeItem(index: number): void {
  const next = items.value.filter((_, i) => i !== index)
  items.value = next.length > 0 ? next : [createEmptyWireframeBlock()]
  persist()
}

function updateTitle(index: number, title: string): void {
  const row = items.value[index]
  if (!row) return
  row.title = title
}

function updateKind(index: number, kind: WireframeBlockKind): void {
  const row = items.value[index]
  if (!row) return
  row.kind = kind
  persist()
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: wireframeAiSchema,
  formTitle: 'اسکچ صفحه',
  phase: 'prototype',
  getCurrentValue: () => ({
    wireframeBlocks: items.value,
    wireframeNotes: store.state.wireframeNotes,
  }),
  extraContext: () =>
    JSON.stringify({
      sitemap: ideate.state.sitemap,
      userflow: ideate.state.userflow,
      colors: store.state.palette,
    }),
})

const previewText = computed(() => {
  if (!preview.value) return ''
  return preview.value.wireframeBlocks
    .map((b, i) => `${i + 1}. [${kindLabel(b.kind)}] ${b.title}`)
    .join('\n')
})

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  const next =
    preview.value.wireframeBlocks.length > 0
      ? preview.value.wireframeBlocks.map((item) => ({ ...item }))
      : [createEmptyWireframeBlock()]
  store.setWireframeBlocks(next)
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
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="اسکچ سیمی صفحه">
        <div class="mx-auto max-w-md space-y-2 rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200">
          <div
            v-for="block in items"
            :key="block.id"
            class="flex items-center justify-center rounded-lg px-3 text-center text-xs font-medium"
            :class="[kindHeight[block.kind], kindTone[block.kind]]"
          >
            {{ block.title.trim() || kindLabel(block.kind) }}
          </div>
          <Typography.Text
            v-if="items.length === 0"
            type="secondary"
            class="block text-center text-xs"
          >
            هنوز بلوکی نیست
          </Typography.Text>
        </div>
      </LiveStudioPreview>

      <Space direction="vertical" class="w-full" size="middle">
        <Form v-for="(item, index) in items" :key="item.id" layout="vertical" class="rounded-xl bg-stone-50/80 p-3 ring-1 ring-stone-100">
          <Space class="w-full" align="start">
            <FormItem :label="`بلوک ${index + 1}`" class="mb-0! flex-1">
              <Space direction="vertical" class="w-full" size="small">
                <Select
                  :value="item.kind"
                  class="w-full"
                  :options="kindOptions"
                  @update:value="(value) => updateKind(index, value as WireframeBlockKind)"
                />
                <Input
                  :value="item.title"
                  placeholder="مثلاً هیرو با دکمه شروع"
                  @update:value="updateTitle(index, $event)"
                  @blur="persist"
                />
              </Space>
            </FormItem>
            <Button
              danger
              html-type="button"
              class="mt-7"
              aria-label="حذف بلوک"
              @click="removeItem(index)"
            >
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </Form>

        <Button type="dashed" block html-type="button" @click="addItem">
          <template #icon><PlusOutlined /></template>
          افزودن بلوک اسکچ
        </Button>
      </Space>
    </Space>
  </MicroFormShell>
</template>
