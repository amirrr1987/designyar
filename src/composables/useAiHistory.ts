import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMetaStore } from '@/stores/meta'
import {
  isAiHistoryEntry,
  trimHistoryEntries,
  type AiHistoryEntry,
} from '@/types/ai-history'

export function useAiHistory() {
  const metaStore = useMetaStore()
  const { aiHistory } = storeToRefs(metaStore)

  const sortedEntries = computed(() =>
    [...aiHistory.value].sort(
      (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    ),
  )

  function addEntry(entry: AiHistoryEntry): void {
    if (!isAiHistoryEntry(entry)) return
    metaStore.setAiHistory(trimHistoryEntries([entry, ...aiHistory.value]))
  }

  function removeEntry(id: string): void {
    metaStore.setAiHistory(aiHistory.value.filter((entry) => entry.id !== id))
  }

  function clearHistory(): void {
    metaStore.clearAiHistory()
  }

  return {
    entries: sortedEntries,
    addEntry,
    removeEntry,
    clearHistory,
  }
}
