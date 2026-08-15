<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { SegmentedProps, SelectProps } from 'ant-design-vue'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import { generate } from '@ant-design/colors'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { THEORY_SCHEME_OPTIONS, proposeSourceLabel } from '@/constants/color-starters'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { usePrototypeStore } from '@/stores/prototype'
import {
  colorsAiSchema,
  createDefaultColorPalette,
  createEmptySwatch,
  paletteModeLabel,
  theorySchemeLabel,
  type ColorPalette,
  type DesignSystemKey,
  type PaletteMode,
  type TheoryScheme,
} from '@/types/prototype'
import { normalizeHex, parseHexColor, rgbToHex, shadeRamp } from '@/utils/color-harmony'
import {
  APP_UI_FRAMEWORK,
  DESIGN_SYSTEM_STARTERS,
  buildPaletteFromDesignSystem,
  buildPaletteFromTheory,
  paletteSummary,
  syncRolesFromSwatches,
} from '@/utils/palette-from-harmony'
import { designSystemKeysForPrompt } from '@/constants/design-system-catalog'

const store = usePrototypeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = reactive<ColorPalette>({ ...store.state.palette })
const pendingPalette = ref<ColorPalette | null>(null)
const pendingSource = ref<'theory' | 'system' | 'custom' | null>(null)

watch(
  () => store.state.palette,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setPalette({ ...draft, swatches: draft.swatches.map((s) => ({ ...s })) })
}

const modeOptions: NonNullable<SegmentedProps['options']> = [
  { value: 'custom', label: 'سفارشی' },
  { value: 'theory', label: 'اصول رنگ' },
  { value: 'system', label: 'Design System' },
]

const theoryOptions: NonNullable<SegmentedProps['options']> = THEORY_SCHEME_OPTIONS.map(
  (item) => ({
    value: item.value,
    label: item.label,
  }),
)

const recommendedSystems = computed(() =>
  DESIGN_SYSTEM_STARTERS.filter((item) => item.recommended),
)
const otherSystems = computed(() =>
  DESIGN_SYSTEM_STARTERS.filter((item) => !item.recommended),
)

const systemSelectOptions = computed<NonNullable<SelectProps['options']>>(() => [
  {
    label: `پیشنهادی برای ${APP_UI_FRAMEWORK}`,
    options: recommendedSystems.value.map((item) => ({
      value: item.key,
      label: item.label,
      frameworks: item.frameworks.join(', '),
    })),
  },
  {
    label: 'سایر Design Systemها',
    options: otherSystems.value.map((item) => ({
      value: item.key,
      label: item.label,
      frameworks: item.frameworks.join(', '),
    })),
  },
])

const selectedSystemHint = computed(() => {
  const found = DESIGN_SYSTEM_STARTERS.find((item) => item.key === draft.systemKey)
  return found?.hint ?? 'یکی را انتخاب کن تا پیشنهاد پالت ساخته شود (نیاز به پذیرش).'
})

const selectedSystemFrameworks = computed(() => {
  const found = DESIGN_SYSTEM_STARTERS.find((item) => item.key === draft.systemKey)
  return found ? found.frameworks.join(', ') : ''
})

/** Fresh state per mode — logics must not leak across tabs. */
function blankPaletteForMode(mode: PaletteMode): ColorPalette {
  if (mode === 'theory') {
    return buildPaletteFromTheory('#0f766e', 'adjacent')
  }
  if (mode === 'system') {
    const base = createDefaultColorPalette()
    return {
      ...base,
      mode: 'system',
      systemKey: '',
      theoryScheme: 'adjacent',
      seed: '#1677ff',
      swatches: [createEmptySwatch('اصلی', '#94a3b8'), createEmptySwatch('تاکیدی', '#cbd5e1')],
      primary: '#94a3b8',
      accent: '#cbd5e1',
      tertiary: '#cbd5e1',
      quaternary: '#cbd5e1',
      background: '#f8fafc',
      text: '#1c1917',
      surface: '#f1f5f9',
      textMuted: '#78716c',
      border: '#e7e5e4',
    }
  }
  const base = createDefaultColorPalette()
  return {
    ...base,
    mode: 'custom',
    systemKey: '',
    theoryScheme: 'adjacent',
    seed: '#0f766e',
    swatches: [createEmptySwatch('رنگ ۱', '#0f766e')],
    primary: '#0f766e',
    accent: '#0f766e',
    tertiary: '#0f766e',
    quaternary: '#0f766e',
    background: '#ffffff',
    text: '#1c1917',
    surface: '#f8fafc',
    textMuted: '#78716c',
    border: '#e7e5e4',
  }
}

function onSystemSelect(value: SelectProps['value']): void {
  if (typeof value !== 'string' || value.length === 0) {
    draft.systemKey = ''
    persist()
    return
  }
  proposeSystem(value)
}

const primaryRamp = computed(() => {
  try {
    return generate(normalizeHex(draft.primary, '#0f766e'))
  } catch {
    return [] as string[]
  }
})

function setPending(next: ColorPalette, source: 'theory' | 'system' | 'custom'): void {
  pendingPalette.value = next
  pendingSource.value = source
}

function proposeSystem(key: DesignSystemKey): void {
  draft.systemKey = key
  setPending(buildPaletteFromDesignSystem(key), 'system')
}

function acceptPending(): void {
  if (!pendingPalette.value) return
  Object.assign(draft, pendingPalette.value)
  persist()
  pendingPalette.value = null
  pendingSource.value = null
}

function rejectPending(): void {
  pendingPalette.value = null
  pendingSource.value = null
}

function addSwatch(): void {
  draft.swatches = [...draft.swatches, createEmptySwatch('رنگ جدید', '#0f766e')]
  Object.assign(draft, syncRolesFromSwatches(draft))
  persist()
}

function removeSwatch(index: number): void {
  const next = draft.swatches.filter((_, i) => i !== index)
  draft.swatches = next.length > 0 ? next : [createEmptySwatch('اصلی', draft.primary)]
  Object.assign(draft, syncRolesFromSwatches(draft))
  persist()
}

function updateSwatchLabel(index: number, label: string): void {
  const row = draft.swatches[index]
  if (!row) return
  row.label = label
}

function updateSwatchValue(index: number, value: string): void {
  const row = draft.swatches[index]
  if (!row) return
  row.value = value
  Object.assign(draft, syncRolesFromSwatches(draft))
}

function hexInputValue(color: string): string {
  return normalizeHex(color, '#0f766e')
}

/** Keep AI suggestion inside the active tab — never jump modes. */
function coerceAiToCurrentTab(ai: ColorPalette): ColorPalette {
  if (draft.mode === 'custom') {
    const swatches =
      ai.swatches.length > 0
        ? ai.swatches.map((s) => ({ ...s }))
        : [
            createEmptySwatch('اصلی', ai.primary),
            createEmptySwatch('تاکیدی', ai.accent),
          ]
    const synced = syncRolesFromSwatches({
      ...ai,
      mode: 'custom',
      systemKey: '',
      theoryScheme: draft.theoryScheme,
      swatches,
    })
    return {
      ...synced,
      mode: 'custom',
      systemKey: '',
      background: ai.background,
      text: ai.text,
    }
  }

  if (draft.mode === 'theory') {
    const scheme = draft.theoryScheme
    const seed = normalizeHex(ai.seed || ai.primary || draft.seed, draft.seed)
    const built = buildPaletteFromTheory(seed, scheme)
    return {
      ...built,
      mode: 'theory',
      theoryScheme: scheme,
      systemKey: '',
      seed,
    }
  }

  // system tab
  const systemKey =
    draft.systemKey ||
    (typeof ai.systemKey === 'string' && ai.systemKey.length > 0 ? ai.systemKey : 'antd')
  const fromSystem = buildPaletteFromDesignSystem(systemKey)
  return {
    ...fromSystem,
    mode: 'system',
    systemKey,
    background: ai.background || fromSystem.background,
    text: ai.text || fromSystem.text,
    primary: ai.primary || fromSystem.primary,
    accent: ai.accent || fromSystem.accent,
    tertiary: ai.tertiary || fromSystem.tertiary,
    quaternary: ai.quaternary || fromSystem.quaternary,
    surface: ai.surface || fromSystem.surface,
    textMuted: ai.textMuted || fromSystem.textMuted,
    border: ai.border || fromSystem.border,
  }
}

function buildColorsAiExtraContext(): string {
  const lines = [
    `قفل حالت: mode باید دقیقاً «${draft.mode}» بماند — تب را عوض نکن.`,
    `framework پروژه: ${APP_UI_FRAMEWORK}`,
    'background و text همیشه جدا و hex معتبر.',
  ]

  if (draft.mode === 'custom') {
    lines.push(
      'حالت custom:',
      '- چند swatch با label فارسی + value هگز پیشنهاد بده (حداقل ۲).',
      '- primary/accent را با swatches هم‌خوان کن.',
      '- systemKey را خالی بگذار ("").',
      '- theoryScheme را عوض نکن؛ مهم نیست.',
    )
  } else if (draft.mode === 'theory') {
    lines.push(
      'حالت theory — سبک Paletton:',
      `- theoryScheme قفل است: ${draft.theoryScheme} (${theorySchemeLabel(draft.theoryScheme)})`,
      `- فقط seed / primary (رنگ اصلی) را پیشنهاد یا بهبود بده («${draft.seed}»)؛ accent/tertiary/quaternary را از اصول همان طرح بساز.`,
      '- monochromatic (1-color): یک فام + سایه‌های روشن/تیره.',
      '- adjacent (3-colors): فام اصلی + دو همسایه روی چرخه (±۳۰°).',
      '- triad (3-colors): سه فام با فاصله ۱۲۰°.',
      '- tetrad (4-colors): چهار فام مربعی (۰/۹۰/۱۸۰/۲۷۰)؛ quaternary لازم است.',
      '- systemKey را خالی بگذار ("").',
      `- mode: theory و theoryScheme: ${draft.theoryScheme}`,
      '- background و text را از seed مشتق کن (در UI فقط‌خواندنی‌اند).',
    )
  } else {
    const ds =
      DESIGN_SYSTEM_STARTERS.find((item) => item.key === draft.systemKey)?.label ??
      (draft.systemKey || 'antd')
    lines.push(
      'حالت system:',
      draft.systemKey
        ? `- systemKey قفل است: ${draft.systemKey} (${ds}) — پالت را در روح همین Design System بساز.`
        : `- systemKey خالی است؛ برای Vue یکی از پیشنهادی‌ها را بگذار (ترجیحاً antd) و در JSON بنویس.`,
      `- کلیدهای مجاز: ${designSystemKeysForPrompt()}`,
      '- mode: system',
      '- فقط توکن رنگ؛ کتابخانه UI را عوض نکن.',
    )
  }

  lines.push(
    'خروجی: همان کلیدهای JSON ورودی؛ مقادیر فنی انگلیسی (mode/theoryScheme/systemKey/hex).',
  )
  return lines.join('\n')
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: colorsAiSchema,
  formTitle: 'پالت رنگ',
  phase: 'prototype',
  getCurrentValue: () => ({
    ...draft,
    mode: draft.mode,
    theoryScheme: draft.theoryScheme,
    systemKey: draft.systemKey,
    swatches: draft.swatches.map((s) => ({ ...s })),
  }),
  extraContext: buildColorsAiExtraContext,
})

function clearModeEphemeral(): void {
  pendingPalette.value = null
  pendingSource.value = null
  clearPreview()
}

/** Rebuild all theory roles from seed — only seed is user-editable in theory mode. */
function applyTheoryFromSeed(rawSeed: string): void {
  const seed = normalizeHex(rawSeed, draft.seed || draft.primary || '#0f766e')
  clearModeEphemeral()
  Object.assign(draft, buildPaletteFromTheory(seed, draft.theoryScheme))
  persist()
}

/** Live update while typing only when hex is complete/valid. */
function onSeedTextUpdate(raw: string): void {
  draft.seed = raw
  const parsed = parseHexColor(raw)
  if (!parsed) return
  applyTheoryFromSeed(rgbToHex(parsed))
}

function onModeChange(value: string | number): void {
  const mode = value as PaletteMode
  if (mode === draft.mode) return
  clearModeEphemeral()
  Object.assign(draft, blankPaletteForMode(mode))
  persist()
}

function onTheoryChange(value: string | number): void {
  const scheme = value as TheoryScheme
  if (scheme === draft.theoryScheme) return
  clearModeEphemeral()
  const seed = normalizeHex(draft.seed || draft.primary, '#0f766e')
  Object.assign(draft, buildPaletteFromTheory(seed, scheme))
  persist()
}

const theoryDerivedSwatches = computed(() => {
  type Row = { key: string; label: string; value: string; shades: string[] }
  const withShades = (key: string, label: string, value: string): Row => ({
    key,
    label,
    value,
    shades: shadeRamp(value, 5),
  })

  if (draft.theoryScheme === 'monochromatic') {
    return [withShades('1', 'تک‌رنگ (اصلی)', draft.primary)]
  }

  const rows: Row[] = [
    withShades('1', 'رنگ ۱ (اصلی)', draft.primary),
    withShades('2', 'رنگ ۲', draft.accent),
    withShades('3', 'رنگ ۳', draft.tertiary),
  ]
  if (draft.theoryScheme === 'tetrad') {
    rows.push(withShades('4', 'رنگ ۴', draft.quaternary))
  }
  return rows
})

const previewText = computed(() => {
  if (!preview.value) return ''
  const coerced = coerceAiToCurrentTab(preview.value)
  return `${paletteModeLabel(coerced.mode)} · ${paletteSummary(coerced)}`
})

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
  if (preview.value) {
    preview.value = coerceAiToCurrentTab(preview.value)
  }
}

function onAcceptAi(): void {
  if (!preview.value) return
  const next = coerceAiToCurrentTab(preview.value)
  Object.assign(draft, next)
  store.setPalette({ ...next })
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
    @accept="onAcceptAi"
    @reject="clearPreview"
    @next="persist(); goNext()"
    @prev="persist(); goPrev()"
  >
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="پیش‌نمایش نقش‌ها">
        <div
          class="overflow-hidden rounded-xl shadow-sm"
          :style="{
            backgroundColor: draft.background,
            color: draft.text,
            border: `1px solid ${draft.border}`,
          }"
        >
          <div
            class="flex items-center justify-between px-4 py-3"
            :style="{ backgroundColor: draft.primary, color: '#fff' }"
          >
            <Typography.Text class="font-semibold text-white">دیزاین یار</Typography.Text>
            <Space size="small">
              <Tag :style="{ backgroundColor: draft.accent, color: draft.text, border: 'none' }">
                ۲
              </Tag>
              <Tag :style="{ backgroundColor: draft.tertiary, color: draft.text, border: 'none' }">
                ۳
              </Tag>
              <Tag
                v-if="draft.theoryScheme === 'tetrad'"
                :style="{ backgroundColor: draft.quaternary, color: draft.text, border: 'none' }"
              >
                ۴
              </Tag>
            </Space>
          </div>
          <div class="space-y-3 p-4" :style="{ backgroundColor: draft.surface }">
            <Typography.Title :level="4" :style="{ color: draft.text, margin: 0 }">
              نمونه کارت
            </Typography.Title>
            <Typography.Paragraph :style="{ color: draft.textMuted, marginBottom: 0 }">
              متن و پس‌زمینه همیشه جدا هستند.
            </Typography.Paragraph>
            <Button
              type="primary"
              :style="{ backgroundColor: draft.primary, borderColor: draft.primary }"
            >
              دکمه اصلی
            </Button>
          </div>
        </div>
        <Space v-if="primaryRamp.length" wrap class="mt-3" size="small">
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
        type="info"
        show-icon
        class="rounded-xl"
        message="کنتراست را در مرحلهٔ تست بررسی کن"
        description="اینجا فقط پالت را می‌سازی؛ سنجش خوانایی متن روی پس‌زمینه در فرم «کنتراست رنگ» مرحلهٔ تست است."
      />

      <div>
        <Typography.Text class="mb-2 block text-stone-600">حالت ساخت پالت</Typography.Text>
        <Segmented :value="draft.mode" block :options="modeOptions" @change="onModeChange" />
        <Typography.Paragraph type="secondary" class="mb-0! mt-2! text-xs">
          با تعویض حالت، مقادیر آن تب از نو شروع می‌شود — منطق‌ها قاطی نمی‌شوند.
        </Typography.Paragraph>
      </div>

      <!-- Theory -->
      <template v-if="draft.mode === 'theory'">
        <div>
          <Typography.Text class="mb-2 block text-stone-600">طرح رنگ‌شناسی</Typography.Text>
          <Segmented
            :value="draft.theoryScheme"
            block
            :options="theoryOptions"
            @change="onTheoryChange"
          />
          <Typography.Paragraph type="secondary" class="mb-2! mt-2! text-xs">
            {{ theorySchemeLabel(draft.theoryScheme) }} — فقط رنگ اصلی را عوض کن؛ بقیه از اصول ساخته
            می‌شوند.
          </Typography.Paragraph>
          <Form layout="vertical">
            <FormItem label="رنگ اصلی (قابل ویرایش)">
              <div class="flex flex-wrap items-center gap-3">
                <label
                  class="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
                  :style="{ backgroundColor: hexInputValue(draft.seed) }"
                >
                  <span class="sr-only">انتخاب رنگ اصلی</span>
                  <input
                    type="color"
                    class="absolute inset-0 cursor-pointer opacity-0"
                    :value="hexInputValue(draft.seed)"
                    @input="applyTheoryFromSeed(($event.target as HTMLInputElement).value)"
                  />
                </label>
                <Input
                  :value="draft.seed"
                  class="min-w-40 flex-1 font-mono"
                  placeholder="#0f766e"
                  @update:value="onSeedTextUpdate"
                  @blur="applyTheoryFromSeed(draft.seed)"
                />
              </div>
            </FormItem>
          </Form>
          <Typography.Text class="mb-2 block text-stone-600">
            رنگ‌های مشتق با سایه روشن/تیره (فقط نمایش)
          </Typography.Text>
          <Space wrap size="middle" class="w-full">
            <div
              v-for="item in theoryDerivedSwatches"
              :key="item.key"
              class="flex min-w-32 flex-col gap-1"
            >
              <div class="flex items-end gap-0.5" role="img" :aria-label="item.label">
                <span
                  v-for="(shade, shadeIndex) in item.shades"
                  :key="`${item.key}-${shadeIndex}`"
                  class="inline-block w-5 rounded-sm ring-1 ring-black/10"
                  :class="shadeIndex === 2 ? 'h-8' : 'h-5'"
                  :style="{ backgroundColor: shade }"
                  :title="shade"
                />
              </div>
              <Typography.Text class="text-xs text-stone-600">{{ item.label }}</Typography.Text>
              <Typography.Text class="font-mono text-xs text-stone-500">
                {{ hexInputValue(item.value) }}
              </Typography.Text>
            </div>
          </Space>
        </div>
      </template>

      <!-- System -->
      <template v-else-if="draft.mode === 'system'">
        <Alert
          type="info"
          show-icon
          class="rounded-xl"
          :message="`فریم‌ورک این پروژه: ${APP_UI_FRAMEWORK}`"
          :description="`از لیست انتخاب کن (${DESIGN_SYSTEM_STARTERS.length} مورد). فقط توکن رنگ پیشنهاد می‌شود.`"
        />
        <Form layout="vertical">
          <FormItem label="Design System">
            <Select
              show-search
              allow-clear
              class="w-full"
              placeholder="جستجو یا انتخاب…"
              :value="draft.systemKey || undefined"
              :options="systemSelectOptions"
              option-filter-prop="label"
              @update:value="onSystemSelect"
            >
              <template #option="{ label, frameworks }">
                <span>{{ label }}</span>
                <span v-if="frameworks" class="ms-1 text-stone-400">({{ frameworks }})</span>
              </template>
            </Select>
          </FormItem>
        </Form>
        <Typography.Paragraph type="secondary" class="mb-0! text-xs">
          {{ selectedSystemHint }}
          <span v-if="selectedSystemFrameworks" class="text-stone-400">
            ({{ selectedSystemFrameworks }})
          </span>
        </Typography.Paragraph>
        <Button
          v-if="draft.systemKey"
          type="default"
          block
          html-type="button"
          class="mt-2"
          @click="proposeSystem(draft.systemKey)"
        >
          <template #icon><ExperimentOutlined /></template>
          پیشنهاد دوباره از همین سیستم
        </Button>
      </template>

      <!-- Custom -->
      <template v-else>
        <Typography.Text class="mb-2 block text-stone-600">
          رنگ‌ها با برچسب و مقدار
        </Typography.Text>
        <Form
          v-for="(swatch, index) in draft.swatches"
          :key="swatch.id"
          layout="vertical"
          class="rounded-xl bg-stone-50/80 p-3 ring-1 ring-stone-100"
        >
          <Space class="w-full" align="start">
            <div class="min-w-0 flex-1">
              <FormItem label="برچسب (Label)" class="mb-2!">
                <Input
                  :value="swatch.label"
                  placeholder="مثلاً برند"
                  @update:value="updateSwatchLabel(index, $event)"
                  @blur="persist"
                />
              </FormItem>
              <FormItem label="مقدار (Value)" class="mb-0!">
                <div class="flex flex-wrap items-center gap-3">
                  <label
                    class="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
                    :style="{ backgroundColor: hexInputValue(swatch.value) }"
                  >
                    <span class="sr-only">انتخاب رنگ {{ swatch.label || index + 1 }}</span>
                    <input
                      type="color"
                      class="absolute inset-0 cursor-pointer opacity-0"
                      :value="hexInputValue(swatch.value)"
                      @input="
                        updateSwatchValue(index, ($event.target as HTMLInputElement).value);
                        persist()
                      "
                    />
                  </label>
                  <Input
                    :value="swatch.value"
                    class="min-w-32 flex-1 font-mono"
                    placeholder="#0f766e"
                    @update:value="updateSwatchValue(index, $event)"
                    @blur="persist"
                  />
                </div>
              </FormItem>
            </div>
            <Button
              danger
              html-type="button"
              class="mt-7"
              aria-label="حذف رنگ"
              @click="removeSwatch(index)"
            >
              <template #icon><DeleteOutlined /></template>
            </Button>
          </Space>
        </Form>
        <Button type="dashed" block html-type="button" @click="addSwatch">
          <template #icon><PlusOutlined /></template>
          افزودن رنگ
        </Button>
      </template>

      <Alert v-if="pendingPalette && pendingSource" type="info" show-icon class="rounded-xl">
        <template #message>
          پیشنهاد {{ proposeSourceLabel(pendingSource) }} — هنوز اعمال نشده
        </template>
        <template #description>
          <Typography.Paragraph class="mb-3!">
            {{ paletteSummary(pendingPalette) }}
          </Typography.Paragraph>
          <Space>
            <Button type="primary" html-type="button" @click="acceptPending">
              <template #icon><CheckOutlined /></template>
              پذیرش
            </Button>
            <Button html-type="button" @click="rejectPending">
              <template #icon><CloseOutlined /></template>
              رد
            </Button>
          </Space>
        </template>
      </Alert>

      <!-- Text + background: editable outside theory; derived in theory -->
      <Form layout="vertical">
        <Typography.Title :level="5" class="mb-3!">متن و پس‌زمینه (جدا)</Typography.Title>
        <Typography.Paragraph v-if="draft.mode === 'theory'" type="secondary" class="mb-3! text-xs">
          در اصول رنگ از بذر محاسبه می‌شوند و فقط‌خواندنی‌اند.
        </Typography.Paragraph>
        <FormItem label="پس‌زمینه (Background)">
          <div class="flex flex-wrap items-center gap-3">
            <label
              class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
              :class="draft.mode === 'theory' ? 'cursor-default' : 'cursor-pointer'"
              :style="{ backgroundColor: hexInputValue(draft.background) }"
            >
              <span class="sr-only">پس‌زمینه</span>
              <input
                type="color"
                class="absolute inset-0 opacity-0"
                :class="draft.mode === 'theory' ? 'pointer-events-none' : 'cursor-pointer'"
                :disabled="draft.mode === 'theory'"
                :value="hexInputValue(draft.background)"
                @input="
                  draft.background = ($event.target as HTMLInputElement).value;
                  persist()
                "
              />
            </label>
            <Input
              v-model:value="draft.background"
              class="min-w-40 flex-1 font-mono"
              :readonly="draft.mode === 'theory'"
              @blur="persist"
            />
          </div>
        </FormItem>
        <FormItem label="متن (Text)">
          <div class="flex flex-wrap items-center gap-3">
            <label
              class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
              :class="draft.mode === 'theory' ? 'cursor-default' : 'cursor-pointer'"
              :style="{ backgroundColor: hexInputValue(draft.text) }"
            >
              <span class="sr-only">متن</span>
              <input
                type="color"
                class="absolute inset-0 opacity-0"
                :class="draft.mode === 'theory' ? 'pointer-events-none' : 'cursor-pointer'"
                :disabled="draft.mode === 'theory'"
                :value="hexInputValue(draft.text)"
                @input="
                  draft.text = ($event.target as HTMLInputElement).value;
                  persist()
                "
              />
            </label>
            <Input
              v-model:value="draft.text"
              class="min-w-40 flex-1 font-mono"
              :readonly="draft.mode === 'theory'"
              @blur="persist"
            />
          </div>
        </FormItem>
      </Form>

      <Alert
        type="info"
        show-icon
        class="rounded-xl"
        message="کمک هوش مصنوعی"
        :description="`پیشنهاد AI فقط برای تب «${paletteModeLabel(draft.mode)}» است و تب را عوض نمی‌کند.`"
      />
    </Space>
  </MicroFormShell>
</template>
