import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import type { AiHistoryEntry } from '@/types/ai-history'
import { createDefaultMetaState } from '@/types/meta-state'

const MAX_HISTORY = 40

export const useMetaStore = defineStore('meta', () => {
  const persistence = usePersistenceStore()

  const projectSynthesis = computed({
    get: () => persistence.document.meta.projectSynthesis,
    set: (value: string) => {
      persistence.patchMeta({ projectSynthesis: value })
    },
  })

  const aiHistory = computed(() => persistence.document.meta.aiHistory)

  function setProjectSynthesis(value: string): void {
    persistence.patchMeta({ projectSynthesis: value })
  }

  function prependAiHistory(entry: AiHistoryEntry): void {
    const next = [entry, ...aiHistory.value].slice(0, MAX_HISTORY)
    persistence.patchMeta({ aiHistory: next })
  }

  function setAiHistory(entries: AiHistoryEntry[]): void {
    persistence.patchMeta({ aiHistory: entries.slice(0, MAX_HISTORY) })
  }

  function clearAiHistory(): void {
    persistence.patchMeta({ aiHistory: [] })
  }

  function reset(): void {
    persistence.setMeta(createDefaultMetaState())
  }

  return {
    projectSynthesis,
    aiHistory,
    setProjectSynthesis,
    prependAiHistory,
    setAiHistory,
    clearAiHistory,
    reset,
  }
})
