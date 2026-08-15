import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultEmpathizeState,
  type Competitor,
  type EmpathyMap,
  type EmpathizeState,
  type Persona,
} from '@/types/empathize'

export const useEmpathizeStore = defineStore('empathize', () => {
  const state = useStorage<EmpathizeState>(
    STORAGE_KEYS.empathize,
    createDefaultEmpathizeState(),
  )

  function setResearchGoal(value: string): void {
    state.value = { ...state.value, researchGoal: value }
  }

  function setPersona(persona: Persona): void {
    state.value = { ...state.value, persona }
  }

  function setEmpathyMap(empathyMap: EmpathyMap): void {
    state.value = { ...state.value, empathyMap }
  }

  function setResearchNotes(value: string): void {
    state.value = { ...state.value, researchNotes: value }
  }

  function setCompetitors(competitors: Competitor[]): void {
    state.value = { ...state.value, competitors }
  }

  function hydrate(next: EmpathizeState): void {
    state.value = next
  }

  return {
    state,
    setResearchGoal,
    setPersona,
    setEmpathyMap,
    setResearchNotes,
    setCompetitors,
    hydrate,
  }
})
