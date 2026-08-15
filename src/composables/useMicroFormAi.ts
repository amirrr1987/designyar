import { computed, ref, type Ref } from 'vue'
import type { z } from 'zod'
import { runAiFormAssist } from '@/composables/useAiFormAssist'
import { useAiStore } from '@/stores/ai'
import { useProjectStore } from '@/stores/project'
import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'

export interface UseMicroFormAiOptions<TSchema extends z.ZodType> {
  schema: TSchema
  formTitle: string
  phase: DesignThinkingStepKey
  getCurrentValue: () => z.infer<TSchema>
  extraContext?: () => string
}

export function useMicroFormAi<TSchema extends z.ZodType>(
  options: UseMicroFormAiOptions<TSchema>,
) {
  const projectStore = useProjectStore()
  const aiStore = useAiStore()

  const loading = ref(false)
  const errorMessage = ref('')
  const preview = ref<z.infer<TSchema> | null>(null) as Ref<z.infer<TSchema> | null>

  const phaseTitle = computed(() => {
    const step = DESIGN_THINKING_STEPS.find((item) => item.key === options.phase)
    return step?.title ?? options.phase
  })

  async function requestAssist(): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    preview.value = null
    aiStore.clearLastError()

    try {
      const current = options.getCurrentValue()
      const { data } = await runAiFormAssist({
        schema: options.schema,
        formTitle: options.formTitle,
        phaseTitle: phaseTitle.value,
        projectName: projectStore.project.name,
        currentJson: JSON.stringify(current, null, 2),
        extraContext: options.extraContext?.(),
      })
      preview.value = data
    } catch (e: unknown) {
      let message = e instanceof Error ? e.message : String(e)
      if (message.includes('json_schema') || message.includes('Structured Outputs')) {
        message =
          'مدل فعلی Groq از خروجی ساخت‌یافتهٔ سخت پشتیبانی نمی‌کند. صفحه را سخت‌رفرش کن (Ctrl+Shift+R) یا dev server را یک‌بار ری‌استارت کن.'
      }
      errorMessage.value = message
      aiStore.setLastError(message)
    } finally {
      loading.value = false
    }
  }

  function clearPreview(): void {
    preview.value = null
  }

  return {
    loading,
    errorMessage,
    preview,
    requestAssist,
    clearPreview,
  }
}
