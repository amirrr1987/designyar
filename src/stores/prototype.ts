import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultPrototypeState,
  type GridConfig,
  type PrototypeState,
  type TypographyScale,
} from '@/types/prototype'

export const usePrototypeStore = defineStore('prototype', () => {
  const state = useStorage<PrototypeState>(
    STORAGE_KEYS.prototype,
    createDefaultPrototypeState(),
  )

  function setColors(colors: string[]): void {
    state.value = { ...state.value, colors }
  }

  function setTypography(typography: TypographyScale): void {
    state.value = { ...state.value, typography }
  }

  function setGrid(grid: GridConfig): void {
    state.value = { ...state.value, grid }
  }

  function setSpacingBase(spacingBase: number): void {
    state.value = { ...state.value, spacingBase }
  }

  function setWireframeNotes(wireframeNotes: string): void {
    state.value = { ...state.value, wireframeNotes }
  }

  function hydrate(next: PrototypeState): void {
    state.value = next
  }

  return {
    state,
    setColors,
    setTypography,
    setGrid,
    setSpacingBase,
    setWireframeNotes,
    hydrate,
  }
})
