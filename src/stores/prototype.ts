import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultColorPalette,
  createDefaultPrototypeState,
  normalizePrototypeState,
  wireframeBlocksToNotes,
  type ColorPalette,
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

  function setPalette(palette: ColorPalette): void {
    const parsed = {
      ...createDefaultColorPalette(),
      ...palette,
      primary: palette.primary.trim() || createDefaultColorPalette().primary,
      accent: palette.accent.trim() || createDefaultColorPalette().accent,
      background: palette.background.trim() || createDefaultColorPalette().background,
      text: palette.text.trim() || createDefaultColorPalette().text,
    }
    state.value = { ...state.value, palette: parsed }
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
    setPalette,
    setTypography,
    setGrid,
    setSpacingBase,
    setWireframeBlocks,
    setWireframeNotes,
    hydrate,
  }
})
