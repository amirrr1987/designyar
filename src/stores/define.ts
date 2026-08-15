import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultDefineState,
  normalizeDefineState,
  type DefineState,
} from '@/types/define'

export const useDefineStore = defineStore('define', () => {
  const state = useStorage<DefineState>(STORAGE_KEYS.define, createDefaultDefineState())

  state.value = normalizeDefineState(state.value)

  function setProblems(problems: string[]): void {
    state.value = {
      ...state.value,
      problems: problems.length > 0 ? problems : [''],
    }
  }

  function setPovs(povs: string[]): void {
    state.value = {
      ...state.value,
      povs: povs.length > 0 ? povs : [''],
    }
  }

  function setHmw(hmw: string[]): void {
    state.value = {
      ...state.value,
      hmw: hmw.length > 0 ? hmw : [''],
    }
  }

  function hydrate(next: DefineState): void {
    state.value = normalizeDefineState(next)
  }

  return { state, setProblems, setPovs, setHmw, hydrate }
})
