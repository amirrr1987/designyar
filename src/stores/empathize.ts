import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultEmpathizeState,
  normalizeEmpathizeState,
  type Competitor,
  type EmpathyMapEntry,
  type EmpathizeState,
  type Persona,
  type ResearchNote,
} from '@/types/empathize'

export const useEmpathizeStore = defineStore('empathize', () => {
  const state = useStorage<EmpathizeState>(
    STORAGE_KEYS.empathize,
    createDefaultEmpathizeState(),
  )

  state.value = normalizeEmpathizeState(state.value)

  function setResearchGoal(value: string): void {
    state.value = { ...state.value, researchGoal: value }
  }

  function setPersonas(personas: Persona[]): void {
    state.value = {
      ...state.value,
      personas: personas.length > 0 ? personas : createDefaultEmpathizeState().personas,
    }
  }

  function setEmpathyMaps(empathyMaps: EmpathyMapEntry[]): void {
    state.value = {
      ...state.value,
      empathyMaps:
        empathyMaps.length > 0 ? empathyMaps : createDefaultEmpathizeState().empathyMaps,
    }
  }

  function setResearchNotes(researchNotes: ResearchNote[]): void {
    state.value = {
      ...state.value,
      researchNotes:
        researchNotes.length > 0
          ? researchNotes
          : createDefaultEmpathizeState().researchNotes,
    }
  }

  function setCompetitors(competitors: Competitor[]): void {
    state.value = {
      ...state.value,
      competitors:
        competitors.length > 0
          ? competitors
          : createDefaultEmpathizeState().competitors,
    }
  }

  function hydrate(next: EmpathizeState): void {
    state.value = normalizeEmpathizeState(next)
  }

  return {
    state,
    setResearchGoal,
    setPersonas,
    setEmpathyMaps,
    setResearchNotes,
    setCompetitors,
    hydrate,
  }
})
