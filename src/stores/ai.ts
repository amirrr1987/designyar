import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { createDefaultAiPrefs, type AiPrefs } from '@/types/ai'

export const useAiStore = defineStore('ai', () => {
  const prefs = useStorage<AiPrefs>(STORAGE_KEYS.ai, createDefaultAiPrefs())

  function setLastError(message: string): void {
    prefs.value = { ...prefs.value, lastError: message }
  }

  function clearLastError(): void {
    prefs.value = { ...prefs.value, lastError: '' }
  }

  return { prefs, setLastError, clearLastError }
})
