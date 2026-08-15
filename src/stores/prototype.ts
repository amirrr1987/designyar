import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultPrototypeState,
  normalizePrototypeState,
  wireframeBlocksToNotes,
  type GridConfig,
  type PrototypeState,
  type TypographyScale,
  type WireframeBlock,
} from '@/types/prototype'

export const usePrototypeStore = defineStore('prototype', () => {
  const state = useStorage<PrototypeState>(
    STORAGE_KEYS.prototype,
    createDefaultPrototypeState(),
  )

  state.value = normalizePrototypeState(state.value)

  function setColors(colors: string[]): void {
    state.value = {
      ...state.value,
      colors: colors.length > 0 ? colors : createDefaultPrototypeState().colors,
    }
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

  function setWireframeBlocks(wireframeBlocks: WireframeBlock[]): void {
    const blocks =
      wireframeBlocks.length > 0
        ? wireframeBlocks
        : createDefaultPrototypeState().wireframeBlocks
    state.value = {
      ...state.value,
      wireframeBlocks: blocks,
      wireframeNotes: wireframeBlocksToNotes(blocks),
    }
  }

  function setWireframeNotes(wireframeNotes: string): void {
    state.value = { ...state.value, wireframeNotes }
  }

  function hydrate(next: PrototypeState): void {
    state.value = normalizePrototypeState(next)
  }

  return {
    state,
    setColors,
    setTypography,
    setGrid,
    setSpacingBase,
    setWireframeBlocks,
    setWireframeNotes,
    hydrate,
  }
})
