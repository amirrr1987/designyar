import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { getAiChain, type AiChainId } from '@/constants/ai-chains'
import type { AiActionId } from '@/utils/ai-prompts'

function getChainStepCount(chainId: AiChainId): number {
  return getAiChain(chainId).steps.length
}

function getChainStep(chainId: AiChainId, index: number): AiActionId | null {
  const step = getAiChain(chainId).steps[index]
  return step ?? null
}

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
  const pendingSectionHint = ref('')
  const pendingChain = ref<AiChainId | null>(null)
  const activeChainId = ref<AiChainId | null>(null)
  const chainStepIndex = ref(0)

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

  function openPanel(action?: AiActionId, sectionHint?: string): void {
    if (action) pendingAction.value = action
    pendingSectionHint.value = sectionHint?.trim() ?? ''
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

  function consumePendingSectionHint(): string {
    const hint = pendingSectionHint.value
    pendingSectionHint.value = ''
    return hint
  }

  function clearSessionOutput(): void {
    lastResponse.value = ''
    error.value = ''
  }

  function openChain(chainId: AiChainId): void {
    pendingChain.value = chainId
    panelOpen.value = true
  }

  function consumePendingChain(): AiChainId | null {
    const chain = pendingChain.value
    pendingChain.value = null
    return chain
  }

  function startChain(chainId: AiChainId): AiActionId | null {
    activeChainId.value = chainId
    chainStepIndex.value = 0
    return getChainStep(chainId, 0)
  }

  function advanceChain(): AiActionId | null {
    if (!activeChainId.value) return null
    const nextIndex = chainStepIndex.value + 1
    const next = getChainStep(activeChainId.value, nextIndex)
    if (!next) {
      cancelChain()
      return null
    }
    chainStepIndex.value = nextIndex
    return next
  }

  function cancelChain(): void {
    activeChainId.value = null
    chainStepIndex.value = 0
  }

  function getChainProgress(): { chainId: AiChainId; current: number; total: number } | null {
    if (!activeChainId.value) return null
    const total = getChainStepCount(activeChainId.value)
    return {
      chainId: activeChainId.value,
      current: chainStepIndex.value + 1,
      total,
    }
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
    pendingSectionHint.value = ''
    pendingChain.value = null
    activeChainId.value = null
    chainStepIndex.value = 0
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
    pendingChain,
    activeChainId,
    chainStepIndex,
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
    consumePendingSectionHint,
    openChain,
    consumePendingChain,
    startChain,
    advanceChain,
    cancelChain,
    getChainProgress,
    clearSessionOutput,
    reset,
  }
})
