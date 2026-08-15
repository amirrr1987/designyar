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
  type ProtoChecklist,
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
    const defaults = createDefaultColorPalette()
    const parsed: ColorPalette = {
      ...defaults,
      ...palette,
      mode: palette.mode,
      theoryScheme: palette.theoryScheme,
      systemKey: palette.systemKey,
      seed: palette.seed.trim() || defaults.seed,
      swatches: palette.swatches.length > 0 ? palette.swatches : defaults.swatches,
      primary: palette.primary.trim() || defaults.primary,
      accent: palette.accent.trim() || defaults.accent,
      tertiary: palette.tertiary.trim() || defaults.tertiary,
      quaternary: palette.quaternary.trim() || defaults.quaternary,
      background: palette.background.trim() || defaults.background,
      text: palette.text.trim() || defaults.text,
      surface: palette.surface.trim() || defaults.surface,
      textMuted: palette.textMuted.trim() || defaults.textMuted,
      border: palette.border.trim() || defaults.border,
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

  function setProtoChecklist(protoChecklist: ProtoChecklist): void {
    state.value = { ...state.value, protoChecklist: { ...protoChecklist } }
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
    setProtoChecklist,
    setWireframeBlocks,
    setWireframeNotes,
    hydrate,
  }
})
