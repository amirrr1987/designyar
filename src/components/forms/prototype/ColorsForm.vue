<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { SegmentedProps } from 'ant-design-vue'
import { CheckOutlined, CloseOutlined, ExperimentOutlined } from '@ant-design/icons-vue'
import { generate } from '@ant-design/colors'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import {
  colorsAiSchema,
  colorHarmonyModes,
  harmonyLabel,
  type ColorHarmonyMode,
  type ColorPalette,
} from '@/types/prototype'
import { contrastRatio, meetsWcagAa } from '@/utils/contrast'
import { buildPaletteFromHarmony, paletteSummary } from '@/utils/palette-from-harmony'
import { normalizeHex } from '@/utils/color-harmony'

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = reactive<ColorPalette>({ ...store.state.palette })
const harmonyPreview = ref<ColorPalette | null>(null)

watch(
  () => store.state.palette,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setPalette({ ...draft })
}

function updateRole(key: keyof Omit<ColorPalette, 'harmony'>, value: string): void {
  draft[key] = value
}

const harmonyOptions: NonNullable<SegmentedProps['options']> = colorHarmonyModes.map((mode) => ({
  value: mode,
  label: harmonyLabel(mode).split(' (')[0] ?? harmonyLabel(mode),
}))

const primaryRamp = computed(() => {
  try {
    return generate(normalizeHex(draft.primary, '#0f766e'))
  } catch {
    return [] as string[]
  }
})

const textOnBgRatio = computed(() => contrastRatio(draft.text, draft.background))
const textOnBgAa = computed(() =>
  textOnBgRatio.value === null ? false : meetsWcagAa(textOnBgRatio.value),
)

const contrastMessage = computed(() => {
  if (textOnBgRatio.value === null) {
    return 'کد رنگ متن یا پس‌زمینه نامعتبر است (هگز ۶ رقمی مثل #1c1917).'
  }
  const ratioText = textOnBgRatio.value.toFixed(2)
  return textOnBgAa.value
    ? `کنتراست متن روی پس‌زمینه: ${ratioText} — مناسب WCAG AA`
    : `کنتراست متن روی پس‌زمینه: ${ratioText} — کمتر از AA (۴٫۵)؛ متن یا پس‌زمینه را عوض کن`
})

function proposeHarmony(): void {
  const seed = normalizeHex(draft.primary, '#0f766e')
  harmonyPreview.value = buildPaletteFromHarmony(seed, draft.harmony)
}

function acceptHarmony(): void {
  if (!harmonyPreview.value) return
  Object.assign(draft, harmonyPreview.value)
  persist()
  harmonyPreview.value = null
}

function rejectHarmony(): void {
  harmonyPreview.value = null
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: colorsAiSchema,
  formTitle: 'پالت رنگ',
  phase: 'prototype',
  getCurrentValue: () => ({ ...draft }),
})

const previewText = computed(() => (preview.value ? paletteSummary(preview.value) : ''))

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAcceptAi(): void {
  if (!preview.value) return
  Object.assign(draft, preview.value)
  store.setPalette({ ...preview.value })
  clearPreview()
}

function hexInputValue(color: string): string {
  return normalizeHex(color, '#0f766e')
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
    @accept="onAcceptAi"
    @reject="clearPreview"
    @next="persist(); goNext()"
    @prev="persist(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="پیش‌نمایش نقش‌ها">
        <div
          class="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5"
          :style="{ backgroundColor: draft.background, color: draft.text }"
        >
          <div
            class="flex items-center justify-between px-4 py-3"
            :style="{ backgroundColor: draft.primary, color: '#fff' }"
          >
            <Typography.Text class="font-semibold text-white">دیزاین یار</Typography.Text>
            <Tag :style="{ backgroundColor: draft.accent, color: draft.text, border: 'none' }">
              تاکیدی
            </Tag>
          </div>
          <div class="space-y-3 p-4">
            <Typography.Title :level="4" :style="{ color: draft.text, margin: 0 }">
              نمونه کارت محصول
            </Typography.Title>
            <Typography.Paragraph :style="{ color: draft.text, opacity: 0.8, marginBottom: 0 }">
              متن و پس‌زمینه جدا هستند تا خوانایی حفظ شود.
            </Typography.Paragraph>
            <Button
              type="primary"
              :style="{ backgroundColor: draft.primary, borderColor: draft.primary }"
            >
              دکمه اصلی
            </Button>
          </div>
        </div>
        <Space v-if="primaryRamp.length > 0" wrap class="mt-3" size="small">
          <span
            v-for="(swatch, i) in primaryRamp"
            :key="i"
            class="inline-block h-7 w-7 rounded-md ring-1 ring-black/10"
            :style="{ backgroundColor: swatch }"
            role="img"
            :aria-label="`سایه ${i}`"
          />
        </Space>
      </LiveStudioPreview>

      <Alert
        :type="textOnBgAa ? 'success' : 'warning'"
        show-icon
        :message="contrastMessage"
        class="rounded-xl"
      />

      <div>
        <Typography.Text class="mb-2 block text-stone-600">
          هارمونی (پیشنهاد می‌دهد؛ تا Accept اعمال نمی‌شود)
        </Typography.Text>
        <Segmented
          :value="draft.harmony"
          block
          :options="harmonyOptions"
          @change="
            (value) => {
              draft.harmony = value as ColorHarmonyMode
              persist()
            }
          "
        />
        <Typography.Paragraph type="secondary" class="mb-2! mt-2! text-xs">
          {{ harmonyLabel(draft.harmony) }} — از رنگ اصلی به‌عنوان بذر استفاده می‌شود.
        </Typography.Paragraph>
        <Button type="default" block html-type="button" @click="proposeHarmony">
          <template #icon><ExperimentOutlined /></template>
          پیشنهاد پالت با این هارمونی
        </Button>
      </div>

      <Alert v-if="harmonyPreview" type="info" show-icon class="rounded-xl">
        <template #message>پیشنهاد هارمونی — هنوز اعمال نشده</template>
        <template #description>
          <Typography.Paragraph class="mb-3!">
            {{ paletteSummary(harmonyPreview) }}
          </Typography.Paragraph>
          <Space>
            <Button type="primary" html-type="button" @click="acceptHarmony">
              <template #icon><CheckOutlined /></template>
              پذیرش
            </Button>
            <Button html-type="button" @click="rejectHarmony">
              <template #icon><CloseOutlined /></template>
              رد
            </Button>
          </Space>
        </template>
      </Alert>

      <Form layout="vertical">
        <FormItem label="رنگ اصلی (Primary)">
          <Space class="w-full" align="center" wrap>
            <input
              type="color"
              class="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              :value="hexInputValue(draft.primary)"
              aria-label="انتخابگر رنگ اصلی"
              @input="
                updateRole('primary', ($event.target as HTMLInputElement).value);
                persist()
              "
            />
            <Input
              v-model:value="draft.primary"
              class="min-w-36 flex-1"
              placeholder="#0f766e"
              @blur="persist"
            />
          </Space>
        </FormItem>

        <FormItem label="رنگ تاکیدی (Accent)">
          <Space class="w-full" align="center" wrap>
            <input
              type="color"
              class="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              :value="hexInputValue(draft.accent)"
              aria-label="انتخابگر رنگ تاکیدی"
              @input="
                updateRole('accent', ($event.target as HTMLInputElement).value);
                persist()
              "
            />
            <Input
              v-model:value="draft.accent"
              class="min-w-36 flex-1"
              placeholder="#14b8a6"
              @blur="persist"
            />
          </Space>
        </FormItem>

        <FormItem label="پس‌زمینه (Background)">
          <Space class="w-full" align="center" wrap>
            <input
              type="color"
              class="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              :value="hexInputValue(draft.background)"
              aria-label="انتخابگر پس‌زمینه"
              @input="
                updateRole('background', ($event.target as HTMLInputElement).value);
                persist()
              "
            />
            <Input
              v-model:value="draft.background"
              class="min-w-36 flex-1"
              placeholder="#f8fafc"
              @blur="persist"
            />
          </Space>
        </FormItem>

        <FormItem label="متن (Text)">
          <Space class="w-full" align="center" wrap>
            <input
              type="color"
              class="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              :value="hexInputValue(draft.text)"
              aria-label="انتخابگر متن"
              @input="
                updateRole('text', ($event.target as HTMLInputElement).value);
                persist()
              "
            />
            <Input
              v-model:value="draft.text"
              class="min-w-36 flex-1"
              placeholder="#1c1917"
              @blur="persist"
            />
          </Space>
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
