import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultTestState,
  type ContrastPair,
  type HeuristicItem,
  type TestState,
} from '@/types/test'

export const useTestStore = defineStore('test', () => {
  const state = useStorage<TestState>(STORAGE_KEYS.test, createDefaultTestState())

  function setContrast(contrast: ContrastPair): void {
    state.value = { ...state.value, contrast }
  }

  function setWcag(wcag: Record<string, boolean>): void {
    state.value = { ...state.value, wcag }
  }

  function setHeuristics(heuristics: HeuristicItem[]): void {
    state.value = { ...state.value, heuristics }
  }

  function setReport(report: string): void {
    state.value = { ...state.value, report }
  }

  function hydrate(next: TestState): void {
    state.value = next
  }

  return { state, setContrast, setWcag, setHeuristics, setReport, hydrate }
})
