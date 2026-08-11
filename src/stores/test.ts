import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import type { HeuristicEvalMap } from '@/types/heuristic-eval'
import type { ContrastCheckRecord } from '@/types/test-state'
import { createDefaultTestState } from '@/types/test-state'

export const useTestStore = defineStore('test', () => {
  const persistence = usePersistenceStore()

  const wcagChecked = computed({
    get: () => persistence.document.test.wcagChecked,
    set: (value: string[]) => {
      persistence.patchTest({ wcagChecked: value })
    },
  })

  const heuristicEval = computed({
    get: () => persistence.document.test.heuristicEval,
    set: (value: HeuristicEvalMap) => {
      persistence.patchTest({ heuristicEval: value })
    },
  })

  const usabilityReportSummary = computed({
    get: () => persistence.document.test.usabilityReportSummary,
    set: (value: string) => {
      persistence.patchTest({ usabilityReportSummary: value })
    },
  })

  const contrastCheck = computed({
    get: () => {
      const value = persistence.document.test.contrastCheck
      return value !== null && value !== undefined ? value : null
    },
    set: (value: ContrastCheckRecord | null) => {
      persistence.patchTest({ contrastCheck: value })
    },
  })

  function setWcagChecked(ids: string[]): void {
    persistence.patchTest({ wcagChecked: ids })
  }

  function toggleWcag(id: string, checked: boolean): void {
    if (checked) {
      if (wcagChecked.value.includes(id)) return
      persistence.patchTest({ wcagChecked: [...wcagChecked.value, id] })
      return
    }
    persistence.patchTest({
      wcagChecked: wcagChecked.value.filter((x) => x !== id),
    })
  }

  function setHeuristicEval(map: HeuristicEvalMap): void {
    persistence.patchTest({ heuristicEval: map })
  }

  function setUsabilityReportSummary(value: string): void {
    persistence.patchTest({ usabilityReportSummary: value })
  }

  function saveContrastCheck(record: ContrastCheckRecord): void {
    persistence.patchTest({ contrastCheck: record })
  }

  function clearContrastCheck(): void {
    persistence.patchTest({ contrastCheck: null })
  }

  function reset(): void {
    persistence.setTest(createDefaultTestState())
  }

  return {
    wcagChecked,
    heuristicEval,
    usabilityReportSummary,
    contrastCheck,
    setWcagChecked,
    toggleWcag,
    setHeuristicEval,
    setUsabilityReportSummary,
    saveContrastCheck,
    clearContrastCheck,
    reset,
  }
})
