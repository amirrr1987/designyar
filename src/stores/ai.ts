import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface AiPrefs {
  /** WebLLM model id preference (engine loads at runtime). */
  selectedModelId: string
}

const DEFAULT_MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC'

function createDefaultAiPrefs(): AiPrefs {
  return {
    selectedModelId: DEFAULT_MODEL_ID,
  }
}

export const useAiStore = defineStore('ai', () => {
  const prefs = useStorage<AiPrefs>('ux-flow-ai-prefs', createDefaultAiPrefs())

  /** Runtime only — not persisted. */
  const isLoading = ref(false)
  const isReady = ref(false)
  const progress = ref(0)
  const lastResponse = ref('')
  const error = ref('')

  const selectedModelId = computed(() => prefs.value.selectedModelId)

  function setSelectedModelId(modelId: string): void {
    if (!modelId.trim()) return
    prefs.value = { ...prefs.value, selectedModelId: modelId }
  }

  function setLoading(value: boolean): void {
    isLoading.value = value
  }

  function setReady(value: boolean): void {
    isReady.value = value
  }

  function setProgress(value: number): void {
    progress.value = Math.min(100, Math.max(0, value))
  }

  function setLastResponse(value: string): void {
    lastResponse.value = value
  }

  function setError(value: string): void {
    error.value = value
  }

  function clearSessionOutput(): void {
    lastResponse.value = ''
    error.value = ''
  }

  function reset(): void {
    prefs.value = createDefaultAiPrefs()
    isLoading.value = false
    isReady.value = false
    progress.value = 0
    lastResponse.value = ''
    error.value = ''
  }

  return {
    prefs,
    selectedModelId,
    isLoading,
    isReady,
    progress,
    lastResponse,
    error,
    setSelectedModelId,
    setLoading,
    setReady,
    setProgress,
    setLastResponse,
    setError,
    clearSessionOutput,
    reset,
  }
})
