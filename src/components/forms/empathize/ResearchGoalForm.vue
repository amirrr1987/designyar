<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input, Space } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import FormPulseHeader from '@/components/shared/FormPulseHeader.vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useEmpathizeStore } from '@/stores/empathize'
import { researchGoalAiSchema } from '@/types/empathize'

const store = useEmpathizeStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.researchGoal,
  set: (value: string) => store.setResearchGoal(value),
})

const pulseSummary = computed(() =>
  draft.value.trim().length > 0
    ? 'هدف پژوهش نوشته شده — آمادهٔ ادامه'
    : 'هنوز هدف پژوهش خالی است',
)

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: researchGoalAiSchema,
  formTitle: 'هدف پژوهش',
  phase: 'empathize',
  getCurrentValue: () => ({ researchGoal: store.state.researchGoal }),
})

const rules: Rule[] = [{ required: true, message: 'هدف پژوهش را بنویسید' }]

const previewText = computed(() => (preview.value ? preview.value.researchGoal : ''))

async function onAssist(): Promise<void> {
  await requestAssist()
}

function onAccept(): void {
  if (!preview.value) return
  store.setResearchGoal(preview.value.researchGoal)
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
      <FormPulseHeader :summary="pulseSummary" />
      <Form layout="vertical">
        <FormItem label="هدف پژوهش" name="researchGoal" :rules="rules">
          <Input.TextArea
            v-model:value="draft"
            :rows="4"
            placeholder="مثلاً: می‌خواهم بفهمم مبتدی‌ها چطور ابزار را یاد می‌گیرند"
          />
        </FormItem>
      </Form>
    </Space>
  </MicroFormShell>
</template>
