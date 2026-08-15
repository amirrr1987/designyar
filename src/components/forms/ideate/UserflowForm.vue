<script setup lang="ts">
import { computed } from 'vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import MicroFormShell from '@/components/shared/MicroFormShell.vue'
import { useFormWizard } from '@/composables/useFormWizard'
import { useMicroFormAi } from '@/composables/useMicroFormAi'
import { useIdeateStore } from '@/stores/ideate'
import { userflowAiSchema } from '@/types/ideate'
import type { AiAssistMode } from '@/types/ai'

const store = useIdeateStore()
const { currentMeta, goNext, goPrev } = useFormWizard()

const draft = computed({
  get: () => store.state.userflow,
  set: (value: string) => store.setUserflow(value),
})

const { loading, errorMessage, preview, requestAssist, clearPreview } = useMicroFormAi({
  schema: userflowAiSchema,
  formTitle: 'مسیر کاربر',
  phase: 'ideate',
  getCurrentValue: () => ({ userflow: store.state.userflow }),
  extraContext: () => JSON.stringify({ ideas: store.state.ideas }),
})

const previewText = computed(() => (preview.value ? preview.value.userflow : ''))

async function onAssist(mode: AiAssistMode): Promise<void> {
  await requestAssist(mode)
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
    :ai-improve-label="currentMeta.aiImproveLabel"
    :ai-complete-label="currentMeta.aiCompleteLabel"
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
    <Form layout="vertical">
      <FormItem label="مراحل جریان">
        <Input.TextArea
          v-model:value="draft"
          :rows="6"
          placeholder="۱. ورود&#10;۲. …"
        />
      </FormItem>
    </Form>
  </MicroFormShell>
</template>
