<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  Alert,
  Form,
  FormItem,
  Input,
  Space,
  Tag,
  Typography,
} from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import LiveStudioPreview from '@/components/shared/LiveStudioPreview.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useTestStore } from '@/stores/test'
import { contrastAiSchema, type ContrastPair } from '@/types/test'
import { contrastRatio, meetsWcagAa, meetsWcagAaa } from '@/utils/contrast'
import { normalizeHex } from '@/utils/color-harmony'

const store = useTestStore()
const { currentMeta, goNext, goPrev } = useFormWizard()
const draft = reactive<ContrastPair>({ ...store.state.contrast })

watch(
  () => store.state.contrast,
  (value) => Object.assign(draft, value),
)

function persist(): void {
  store.setContrast({ ...draft })
}

function hexInputValue(color: string): string {
  return normalizeHex(color, '#000000')
}

const ratio = computed(() => contrastRatio(draft.foreground, draft.background))
const aaOk = computed(() => (ratio.value === null ? false : meetsWcagAa(ratio.value)))
const aaaOk = computed(() => (ratio.value === null ? false : meetsWcagAaa(ratio.value)))

const statusMessage = computed(() => {
  if (ratio.value === null) return 'کد رنگ نامعتبر است (هگز ۶ رقمی مثل #1c1917).'
  if (aaaOk.value) return `نسبت ${ratio.value.toFixed(2)} — عالی (AAA)`
  if (aaOk.value) return `نسبت ${ratio.value.toFixed(2)} — مناسب WCAG AA`
  return `نسبت ${ratio.value.toFixed(2)} — کمتر از AA (۴٫۵)؛ رنگ را عوض کن`
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: contrastAiSchema,
  formTitle: 'کنتراست',
  phase: 'test',
  getCurrentValue: () => ({ ...draft }),
  extraContext: () =>
    'دو رنگ hex معتبر پیشنهاد بده که کنتراست متن روی پس‌زمینه حداقل AA (۴٫۵) باشد.',
})

const previewText = computed(() =>
  preview.value ? `متن ${preview.value.foreground} روی ${preview.value.background}` : '',
)

async function onAssist(): Promise<void> {
  persist()
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setContrast({ ...preview.value })
  Object.assign(draft, preview.value)
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
      <LiveStudioPreview title="پیش‌نمایش خوانایی">
        <div
          class="rounded-2xl p-6 shadow-sm ring-1 ring-black/5"
          :style="{ color: draft.foreground, backgroundColor: draft.background }"
        >
          <Typography.Title :level="4" :style="{ color: draft.foreground, margin: 0 }">
            عنوان نمونه
          </Typography.Title>
          <Typography.Paragraph :style="{ color: draft.foreground, marginBottom: 0 }" class="mt-2">
            این متن برای سنجش کنتراست است. اگر خواندنش سخت است، رنگ‌ها را عوض کن.
          </Typography.Paragraph>
        </div>
        <Space wrap class="mt-3" size="small">
          <Tag :color="aaOk ? 'success' : 'error'">AA {{ aaOk ? 'قبول' : 'رد' }}</Tag>
          <Tag :color="aaaOk ? 'success' : 'default'">AAA {{ aaaOk ? 'قبول' : '—' }}</Tag>
          <Tag>
            نسبت
            {{ ratio === null ? '—' : ratio.toFixed(2) }}
          </Tag>
        </Space>
      </LiveStudioPreview>

      <Alert
        :type="aaOk ? 'success' : 'warning'"
        show-icon
        :message="statusMessage"
        class="rounded-xl"
      />

      <Form layout="vertical">
        <FormItem label="رنگ متن">
          <div class="flex flex-wrap items-center gap-3">
            <label
              class="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
              :style="{ backgroundColor: hexInputValue(draft.foreground) }"
            >
              <span class="sr-only">رنگ متن</span>
              <input
                type="color"
                class="absolute inset-0 cursor-pointer opacity-0"
                :value="hexInputValue(draft.foreground)"
                @input="
                  draft.foreground = ($event.target as HTMLInputElement).value;
                  persist()
                "
              />
            </label>
            <Input
              v-model:value="draft.foreground"
              class="min-w-40 flex-1 font-mono"
              @blur="persist"
            />
          </div>
        </FormItem>
        <FormItem label="رنگ پس‌زمینه">
          <div class="flex flex-wrap items-center gap-3">
            <label
              class="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-2 ring-stone-200 ring-offset-2"
              :style="{ backgroundColor: hexInputValue(draft.background) }"
            >
              <span class="sr-only">رنگ پس‌زمینه</span>
              <input
                type="color"
                class="absolute inset-0 cursor-pointer opacity-0"
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
              @blur="persist"
            />
          </div>
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
