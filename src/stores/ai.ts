import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import { getAiChain, type AiChainId } from '@/constants/ai-chains'
import type { AiActionId } from '@/utils/ai-prompts'
import { createDefaultAiPrefs, type AiPrefs } from '@/types/ai-prefs'
import { getAiProvider } from '@/ai'
import { AiProviderError } from '@/ai/types'

function getChainStepCount(chainId: AiChainId): number {
  return getAiChain(chainId).steps.length
}

function getChainStep(chainId: AiChainId, index: number): AiActionId | null {
  const step = getAiChain(chainId).steps[index]
  return step ?? null
}

export type { AiPrefs }

export const useAiStore = defineStore('ai', () => {
  const persistence = usePersistenceStore()

  const prefs = computed({
    get: () => persistence.document.aiPrefs,
    set: (value: AiPrefs) => {
      persistence.patchAiPrefs(value)
    },
  })

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

  const provider = computed(() =>
    getAiProvider({
      getDefaultModelId: () => prefs.value.selectedModelId,
    }),
  )

  function setSelectedModelId(modelId: string): void {
    if (!modelId.trim()) return
    persistence.patchAiPrefs({ selectedModelId: modelId })
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

  function validateProvider(): boolean {
    if (!provider.value.isAvailable()) {
      setError(
        'کلید API تنظیم نشده — در .env.local مقدار VITE_GROQ_API_KEY را از console.groq.com/keys قرار دهید',
      )
      setReady(false)
      return false
    }
    setError('')
    setReady(true)
    return true
  }

  async function completeAssist(prompt: string, systemPrompt?: string): Promise<string> {
    if (!validateProvider()) {
      throw new AiProviderError(
        'missing_key',
        'کلید API یافت نشد — VITE_GROQ_API_KEY را در .env.local تنظیم کنید',
      )
    }

    setLoading(true)
    setLastResponse('')
    setError('')

    try {
      const messages = [
        ...(systemPrompt
          ? [{ role: 'system' as const, content: systemPrompt }]
          : []),
        { role: 'user' as const, content: prompt },
      ]
      const result = await provider.value.complete({
        messages,
        modelId: selectedModelId.value,
        onDelta: (_chunk, full) => {
          setLastResponse(full)
        },
      })
      setLastResponse(result.text)
      return result.text
    } catch (e: unknown) {
      const message =
        e instanceof AiProviderError
          ? e.message
          : e instanceof Error
            ? e.message
            : String(e)
      setError(message)
      throw e instanceof Error ? e : new Error(message)
    } finally {
      setLoading(false)
    }
  }

  function reset(): void {
    persistence.patchAiPrefs(createDefaultAiPrefs())
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
    provider,
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
    validateProvider,
    completeAssist,
    reset,
  }
})
