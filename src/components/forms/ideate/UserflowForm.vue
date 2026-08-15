<script setup lang="ts">
import { computed } from 'vue'
import { Card, Form, FormItem, Input, Space } from 'ant-design-vue'
import type { CardProps } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { userflowAiSchema } from '@/types/ideate'

const store = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const draft = computed({
  get: () => store.state.userflow,
  set: (value: string) => store.setUserflow(value),
})

const charCount = computed(() => draft.value.trim().length)

const pulsePercent = computed(() => (charCount.value > 0 ? 100 : 0))

const pulseSummary = computed(() =>
  charCount.value === 0
    ? 'هنوز مسیری ثبت نشده — مراحل را به ترتیب شماره بزن.'
    : `مسیر نوشته شده (${charCount.value} نویسه).`,
)

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: userflowAiSchema,
  formTitle: 'مسیر کاربر',
  phase: 'ideate',
  getCurrentValue: () => ({ userflow: store.state.userflow }),
  extraContext: () => JSON.stringify({ ideas: store.state.ideas }),
})

const previewText = computed(() => (preview.value ? preview.value.userflow : ''))

async function onAssist(): Promise<void> {
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setUserflow(preview.value.userflow)
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
    @next="goNext()"
    @prev="goPrev()"
  >
    <Space direction="vertical" class="w-full" size="middle">
      <FormPulseHeader
        :summary="pulseSummary"
        show-progress
        :percent="pulsePercent"
      />
      <Card v-bind="cardProps" class="rounded-2xl ring-1 ring-stone-100">
        <Form layout="vertical">
          <FormItem label="مراحل جریان" class="mb-0!">
            <Input.TextArea
              v-model:value="draft"
              :rows="6"
              placeholder="۱. ورود&#10;۲. …"
            />
          </FormItem>
        </Form>
      </Card>
    </Space>
  </MicroFormShell>
</template>
