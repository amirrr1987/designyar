<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Card,
  Input,
  Progress,
  Rate,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import {
  createDefaultHeuristicItems,
  heuristicMoodLabel,
  pulsePromptFor,
  scoreTone,
} from '@/constants/heuristic-pulse'
import { HEURISTIC_RULES } from '@/constants/heuristic-rules'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { heuristicsAiSchema, type HeuristicItem } from '@/types/test'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

function mergeWithDefaults(saved: HeuristicItem[]): HeuristicItem[] {
  const byId = new Map(saved.map((item) => [item.id, item]))
  const defaults = createDefaultHeuristicItems()
  const merged = defaults.map((base) => {
    const existing = byId.get(base.id)
    if (!existing) return { ...base }
    return {
      ...base,
      title: existing.title || base.title,
      score: existing.score,
      note: existing.note,
    }
  })
  // Keep any custom AI-added rows not in Nielsen set
  for (const item of saved) {
    if (!defaults.some((d) => d.id === item.id)) {
      merged.push({ ...item })
    }
  }
  return merged
}

const items = ref<HeuristicItem[]>(mergeWithDefaults(store.state.heuristics))

watch(
  () => store.state.heuristics,
  (value) => {
    items.value = mergeWithDefaults(value)
  },
)

function persist(): void {
  store.setHeuristics(items.value.map((h) => ({ ...h })))
}

function setScore(id: string, score: number): void {
  const row = items.value.find((item) => item.id === id)
  if (!row) return
  row.score = score
  persist()
}

function setNote(id: string, note: string): void {
  const row = items.value.find((item) => item.id === id)
  if (!row) return
  row.note = note
}

const ratedItems = computed(() => items.value.filter((item) => item.score > 0))
const averageScore = computed(() => {
  if (ratedItems.value.length === 0) return 0
  const sum = ratedItems.value.reduce((acc, item) => acc + item.score, 0)
  return sum / ratedItems.value.length
})
const progressPercent = computed(() =>
  Math.round((ratedItems.value.length / Math.max(items.value.length, 1)) * 100),
)
const moodLabel = computed(() =>
  heuristicMoodLabel(averageScore.value, ratedItems.value.length),
)
const weakest = computed(() => {
  const rated = [...ratedItems.value].sort((a, b) => a.score - b.score)
  return rated.slice(0, 3)
})

const ruleMeta = computed(() => {
  const map = new Map(HEURISTIC_RULES.map((rule) => [rule.id, rule]))
  return map
})

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: heuristicsAiSchema,
  formTitle: 'ارزیابی هیوریستیک',
  phase: 'test',
  getCurrentValue: () => ({ heuristics: items.value }),
  extraContext: () =>
    [
      'ده اصل Nielsen را با امتیاز ۰–۵ و یادداشت کوتاه فارسی پر کن.',
      'برای هر اصل یک «نبض» واقعی از محصول پیشنهاد بده؛ کلی‌گویی نکن.',
      'idها را عوض نکن اگر از قبل h1…h10 هستند.',
    ].join('\n'),
})

const previewText = computed(() =>
  preview.value
    ? preview.value.heuristics
        .map((h) => `${h.title}: ${h.score}/5 — ${h.note}`)
        .join('\n')
    : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  items.value = mergeWithDefaults(preview.value.heuristics)
  store.setHeuristics(items.value.map((h) => ({ ...h })))
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
    <Space direction="vertical" class="w-full" size="large">
      <LiveStudioPreview title="تابلوی نبض کاربردپذیری">
        <div class="flex flex-wrap items-center gap-6">
          <Progress
            type="dashboard"
            :percent="progressPercent"
            :size="96"
            :format="() => `${ratedItems.length}/${items.length}`"
          />
          <div class="min-w-40 flex-1">
            <Statistic
              title="میانگین امتیازهای ثبت‌شده"
              :value="averageScore"
              :precision="1"
              suffix="/ ۵"
            />
            <Typography.Paragraph class="mb-0! mt-2! text-sm text-stone-600">
              {{ moodLabel }}
            </Typography.Paragraph>
          </div>
        </div>
        <Space v-if="weakest.length" wrap class="mt-4" size="small">
          <Typography.Text class="text-xs text-stone-500">ضعیف‌ترین نبض‌ها:</Typography.Text>
          <Tag v-for="item in weakest" :key="item.id" :color="scoreTone(item.score)">
            {{ item.title }} · {{ item.score }}
          </Tag>
        </Space>
      </LiveStudioPreview>

      <Typography.Paragraph type="secondary" class="mb-0! text-xs">
        هر اصل یک سؤال سریع است — ستاره بده (۱ ضعیف … ۵ عالی). صفر یعنی هنوز امتیاز ندادی.
      </Typography.Paragraph>

      <Card
        v-for="(item, index) in items"
        :key="item.id"
        v-bind="cardProps"
        class="rounded-2xl ring-1 ring-stone-100"
      >
        <Space direction="vertical" class="w-full" size="small">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <Space align="start" size="middle">
              <Tag color="processing" class="ms-0!">
                {{ ruleMeta.get(item.id)?.number ?? index + 1 }}
              </Tag>
              <div>
                <Typography.Text class="font-medium text-stone-800">
                  {{ item.title }}
                </Typography.Text>
                <Typography.Paragraph class="mb-0! mt-1! text-xs text-stone-500">
                  {{ pulsePromptFor(item.id) }}
                </Typography.Paragraph>
              </div>
            </Space>
            <Tag :color="scoreTone(item.score)">
              {{ item.score > 0 ? `${item.score} از ۵` : 'بدون امتیاز' }}
            </Tag>
          </div>

          <Rate
            :value="item.score"
            :count="5"
            allow-clear
            :aria-label="`امتیاز ${item.title}`"
            @change="(value) => setScore(item.id, typeof value === 'number' ? value : 0)"
          />

          <Input.TextArea
            :value="item.note"
            :rows="2"
            placeholder="یک شاهد کوتاه از محصول… (اختیاری)"
            @update:value="setNote(item.id, $event)"
            @blur="persist"
          />
        </Space>
      </Card>
    </Space>
  </MicroFormShell>
</template>
