import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultTestState,
  normalizeTestState,
  type ContrastPair,
  type HeuristicItem,
  type TestFeedback,
  type TestState,
} from '@/types/test'

export const useTestStore = defineStore('test', () => {
  const state = useStorage<TestState>(STORAGE_KEYS.test, createDefaultTestState())
  state.value = normalizeTestState(state.value)

  function setContrast(contrast: ContrastPair): void {
    state.value = { ...state.value, contrast }
  }

  function setWcag(wcag: Record<string, boolean>): void {
    state.value = { ...state.value, wcag }
  }

  function setHeuristics(heuristics: HeuristicItem[]): void {
    state.value = { ...state.value, heuristics }
  }

  function setFeedback(feedback: TestFeedback): void {
    state.value = { ...state.value, feedback: { ...feedback } }
  }

  function setReport(report: string): void {
    state.value = { ...state.value, report }
  }

  function hydrate(next: TestState): void {
    state.value = normalizeTestState(next)
  }

  return {
    state,
    setContrast,
    setWcag,
    setHeuristics,
    setFeedback,
    setReport,
    hydrate,
  }
})
