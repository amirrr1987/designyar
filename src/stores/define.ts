import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { createDefaultDefineState, type DefineState } from '@/types/define'

export const useDefineStore = defineStore('define', () => {
  const state = useStorage<DefineState>(STORAGE_KEYS.define, createDefaultDefineState())

  function setProblemStatement(value: string): void {
    state.value = { ...state.value, problemStatement: value }
  }

  function setPov(value: string): void {
    state.value = { ...state.value, pov: value }
  }

  function setHmw(hmw: string[]): void {
    state.value = { ...state.value, hmw }
  }

  function hydrate(next: DefineState): void {
    state.value = next
  }

  return { state, setProblemStatement, setPov, setHmw, hydrate }
})
