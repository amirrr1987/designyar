import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface AiPrefs {
  /** WebLLM model id preference (engine loads in Phase 7). */
  selectedModelId: string
}

const DEFAULT_MODEL_ID = 'SmolLM2-1.7B-Instruct-q4f16_1-MLC'

function createDefaultAiPrefs(): AiPrefs {
  return {
    selectedModelId: DEFAULT_MODEL_ID,
  }
}

export const useAiStore = defineStore('ai', () => {
  const prefs = useStorage<AiPrefs>('ux-flow-ai-prefs', createDefaultAiPrefs())

  const selectedModelId = computed(() => prefs.value.selectedModelId)

  function setSelectedModelId(modelId: string): void {
    if (!modelId.trim()) return
    prefs.value = { ...prefs.value, selectedModelId: modelId }
  }

  function reset(): void {
    prefs.value = createDefaultAiPrefs()
  }

  return {
    prefs,
    selectedModelId,
    setSelectedModelId,
    reset,
  }
})
