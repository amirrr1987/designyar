import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { AiActionId } from '@/utils/ai-prompts'

export interface AiPrefs {
  /** Groq model id preference. */
  selectedModelId: string
}

const DEFAULT_MODEL_ID = 'groq/compound-mini'

function createDefaultAiPrefs(): AiPrefs {
  return {
    selectedModelId: DEFAULT_MODEL_ID,
  }
}

export const useAiStore = defineStore('ai', () => {
  const prefs = useStorage<AiPrefs>(STORAGE_KEYS.aiPrefs, createDefaultAiPrefs())

  /** Runtime only — not persisted. */
  const isLoading = ref(false)
  const isReady = ref(false)
  const progress = ref(0)
  const lastResponse = ref('')
  const error = ref('')
  const panelOpen = ref(false)
  const pendingAction = ref<AiActionId | null>(null)

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

  function openPanel(action?: AiActionId): void {
    if (action) pendingAction.value = action
    panelOpen.value = true
  }

  function closePanel(): void {
    panelOpen.value = false
  }

  function setPanelOpen(value: boolean): void {
    panelOpen.value = value
  }

  function consumePendingAction(): AiActionId | null {
    const action = pendingAction.value
    pendingAction.value = null
    return action
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
    panelOpen.value = false
    pendingAction.value = null
  }

  return {
    prefs,
    selectedModelId,
    isLoading,
    isReady,
    progress,
    lastResponse,
    error,
    panelOpen,
    pendingAction,
    setSelectedModelId,
    setLoading,
    setReady,
    setProgress,
    setLastResponse,
    setError,
    openPanel,
    closePanel,
    setPanelOpen,
    consumePendingAction,
    clearSessionOutput,
    reset,
  }
})
