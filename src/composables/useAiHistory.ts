import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  isAiHistoryEntry,
  trimHistoryEntries,
  type AiHistoryEntry,
} from '@/types/ai-history'

export function useAiHistory() {
  const entries = useStorage<AiHistoryEntry[]>(STORAGE_KEYS.aiHistory, [])

  const sortedEntries = computed(() =>
    [...entries.value].sort(
      (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    ),
  )

  function addEntry(entry: AiHistoryEntry): void {
    if (!isAiHistoryEntry(entry)) return
    entries.value = trimHistoryEntries([entry, ...entries.value])
  }

  function removeEntry(id: string): void {
    entries.value = entries.value.filter((entry) => entry.id !== id)
  }

  function clearHistory(): void {
    entries.value = []
  }

  return {
    entries: sortedEntries,
    addEntry,
    removeEntry,
    clearHistory,
  }
}
