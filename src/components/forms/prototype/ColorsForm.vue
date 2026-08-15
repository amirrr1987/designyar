<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Form, FormItem, Input, Space, Tag, Typography } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined, BgColorsOutlined } from '@ant-design/icons-vue'
import { cyan, generate, gold, geekblue } from '@ant-design/colors'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import { colorsAiSchema } from '@/types/prototype'

const ROLE_LABELS = ['اصلی', 'تاکیدی', 'پس‌زمینه', 'متن'] as const

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const colors = ref<string[]>([...store.state.colors])

watch(
  () => store.state.colors,
  (value) => {
    colors.value = [...value]
  },
)

function persist(): void {
  store.setColors([...colors.value])
}

function updateColor(index: number, value: string): void {
  const next = [...colors.value]
  next[index] = value
  colors.value = next
}

function addColor(): void {
  colors.value = [...colors.value, '#0f766e']
  persist()
}

function removeColor(index: number): void {
  const next = colors.value.filter((_, i) => i !== index)
  colors.value = next.length > 0 ? next : ['#0f766e']
  persist()
}

function applyPreset(seed: string): void {
  const ramp = generate(seed)
  const primary = ramp[5] ?? seed
  const accent = ramp[3] ?? seed
  colors.value = [primary, accent, '#f8fafc', '#1c1917']
  persist()
}

const primary = computed(() => colors.value[0] ?? '#0f766e')
const accent = computed(() => colors.value[1] ?? '#14b8a6')
const surface = computed(() => colors.value[2] ?? '#f8fafc')
const ink = computed(() => colors.value[3] ?? '#1c1917')

const primaryRamp = computed(() => {
  try {
    return generate(primary.value)
  } catch {
    return cyan
  }
})

const presetButtons: { label: string; seed: string; props: ButtonProps }[] = [
  { label: 'تیل', seed: '#0f766e', props: { size: 'small' } },
  { label: 'فیروزه‌ای', seed: cyan[5] ?? '#13c2c2', props: { size: 'small' } },
  { label: 'آبی طوسی', seed: geekblue[5] ?? '#2f54eb', props: { size: 'small' } },
  { label: 'طلایی', seed: gold[5] ?? '#faad14', props: { size: 'small' } },
]

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: colorsAiSchema,
  formTitle: 'پالت رنگ',
  phase: 'prototype',
  getCurrentValue: () => ({ colors: colors.value }),
})

const previewText = computed(() => (preview.value ? preview.value.colors.join('، ') : ''))

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setColors([...preview.value.colors])
  colors.value = [...preview.value.colors]
  clearPreview()
}

function roleLabel(index: number): string {
  return ROLE_LABELS[index] ?? `رنگ ${index + 1}`
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
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="پیش‌نمایش رابط">
        <div
          class="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5"
          :style="{ backgroundColor: surface, color: ink }"
        >
          <div
            class="flex items-center justify-between px-4 py-3"
            :style="{ backgroundColor: primary, color: '#fff' }"
          >
            <Typography.Text class="font-semibold text-white">دیزاین یار</Typography.Text>
            <Tag :style="{ backgroundColor: accent, color: ink, border: 'none' }">تاکید</Tag>
          </div>
          <div class="space-y-3 p-4">
            <Typography.Title :level="4" :style="{ color: ink, margin: 0 }">
              نمونه کارت محصول
            </Typography.Title>
            <Typography.Paragraph :style="{ color: ink, opacity: 0.75, marginBottom: 0 }">
              این پیش‌نمایش با رنگ‌های انتخابی تو زنده می‌شود.
            </Typography.Paragraph>
            <Button type="primary" :style="{ backgroundColor: primary, borderColor: primary }">
              دکمه اصلی
            </Button>
          </div>
        </div>
        <Space wrap class="mt-3" size="small">
          <span
            v-for="(swatch, i) in primaryRamp"
            :key="i"
            class="inline-block h-7 w-7 rounded-md ring-1 ring-black/10"
            :style="{ backgroundColor: swatch }"
            :title="`سایه ${i}`"
            role="img"
            :aria-label="`سایه رنگ ${i}`"
          />
        </Space>
      </LiveStudioPreview>

      <div>
        <Typography.Text class="mb-2 block text-stone-600">شروع سریع از پیش‌تنظیم</Typography.Text>
        <Space wrap>
          <Button
            v-for="preset in presetButtons"
            :key="preset.label"
            v-bind="preset.props"
            @click="applyPreset(preset.seed)"
          >
            <template #icon><BgColorsOutlined /></template>
            {{ preset.label }}
          </Button>
        </Space>
      </div>

      <Form v-for="(color, index) in colors" :key="index" layout="vertical">
        <FormItem :label="roleLabel(index)">
          <Space class="w-full" align="center" wrap>
            <input
              type="color"
              class="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              :value="color.length === 7 ? color : '#0f766e'"
              :aria-label="`انتخابگر ${roleLabel(index)}`"
              @input="
                updateColor(
                  index,
                  ($event.target as HTMLInputElement).value,
                );
                persist()
              "
            />
            <Input
              class="min-w-36 flex-1"
              :value="color"
              placeholder="#0f766e"
              @update:value="updateColor(index, $event)"
              @blur="persist"
            />
            <span
              class="inline-block h-10 w-10 shrink-0 rounded-xl ring-1 ring-stone-200"
              :style="{ backgroundColor: color }"
              aria-hidden="true"
            />
            <Button danger html-type="button" aria-label="حذف رنگ" @click="removeColor(index)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </FormItem>
      </Form>

      <Button type="dashed" block html-type="button" @click="addColor">
        <template #icon><PlusOutlined /></template>
        افزودن رنگ
      </Button>
    </Space>
  </MicroFormShell>
</template>
