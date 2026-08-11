import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import {
  createDefaultDesignSystem,
  rampFromSeed,
  type ColorPaletteConfig,
  type DesignSystem,
  type GridConfig,
  type SpacingConfig,
  type TypographyConfig,
} from '@/types/design-system'
import type { MicrocopyEntry } from '@/types/microcopy'
import { createDefaultPrototypeState } from '@/types/prototype-state'

export const usePrototypeStore = defineStore('prototype', () => {
  const persistence = usePersistenceStore()

  const designSystem = computed({
    get: () => persistence.document.prototype.designSystem,
    set: (value: DesignSystem) => {
      persistence.patchPrototype({ designSystem: value })
    },
  })

  const wireframeBlocks = computed({
    get: () => persistence.document.prototype.wireframeBlocks,
    set: (value: string[]) => {
      persistence.patchPrototype({ wireframeBlocks: value })
    },
  })

  const componentChecklist = computed({
    get: () => persistence.document.prototype.componentChecklist,
    set: (value: string[]) => {
      persistence.patchPrototype({ componentChecklist: value })
    },
  })

  const microcopyBank = computed({
    get: () => persistence.document.prototype.microcopyBank,
    set: (value: MicrocopyEntry[]) => {
      persistence.patchPrototype({ microcopyBank: value })
    },
  })

  const palette = computed(() => designSystem.value.palette)
  const typography = computed(() => designSystem.value.typography)
  const grid = computed(() => designSystem.value.grid)
  const spacing = computed(() => designSystem.value.spacing)
  const primaryColor = computed(() => palette.value.primary[5] ?? palette.value.seed)

  function setPalette(paletteConfig: ColorPaletteConfig): void {
    persistence.patchPrototype({
      designSystem: { ...designSystem.value, palette: paletteConfig },
    })
  }

  function generatePrimaryFromSeed(seed: string): void {
    const primary = rampFromSeed(seed)
    setPalette({
      ...designSystem.value.palette,
      seed,
      primary,
    })
  }

  function setAccentFromSeed(seed: string): void {
    setPalette({
      ...designSystem.value.palette,
      accent: rampFromSeed(seed),
    })
  }

  function setTypography(typographyConfig: TypographyConfig): void {
    persistence.patchPrototype({
      designSystem: { ...designSystem.value, typography: typographyConfig },
    })
  }

  function patchTypography(patch: Partial<TypographyConfig>): void {
    persistence.patchPrototype({
      designSystem: {
        ...designSystem.value,
        typography: { ...designSystem.value.typography, ...patch },
      },
    })
  }

  function setGrid(gridConfig: GridConfig): void {
    persistence.patchPrototype({
      designSystem: { ...designSystem.value, grid: gridConfig },
    })
  }

  function patchGrid(patch: Partial<GridConfig>): void {
    persistence.patchPrototype({
      designSystem: {
        ...designSystem.value,
        grid: { ...designSystem.value.grid, ...patch },
      },
    })
  }

  function setSpacing(spacingConfig: SpacingConfig): void {
    persistence.patchPrototype({
      designSystem: { ...designSystem.value, spacing: spacingConfig },
    })
  }

  function replaceDesignSystem(next: DesignSystem): void {
    persistence.patchPrototype({ designSystem: next })
  }

  function setWireframeBlocks(ids: string[]): void {
    persistence.patchPrototype({ wireframeBlocks: ids })
  }

  function setComponentChecklist(ids: string[]): void {
    persistence.patchPrototype({ componentChecklist: ids })
  }

  function setMicrocopyBank(entries: MicrocopyEntry[]): void {
    persistence.patchPrototype({ microcopyBank: entries })
  }

  function addMicrocopy(entry: Omit<MicrocopyEntry, 'id' | 'createdAt'> & { id?: string }): MicrocopyEntry {
    const next: MicrocopyEntry = {
      id: entry.id ?? crypto.randomUUID(),
      category: entry.category,
      text: entry.text,
      context: entry.context,
      createdAt: new Date().toISOString(),
    }
    persistence.patchPrototype({ microcopyBank: [...microcopyBank.value, next] })
    return next
  }

  function removeMicrocopy(id: string): void {
    persistence.patchPrototype({
      microcopyBank: microcopyBank.value.filter((e) => e.id !== id),
    })
  }

  function reset(): void {
    persistence.setPrototype(createDefaultPrototypeState())
  }

  function resetDesignSystem(): void {
    persistence.patchPrototype({ designSystem: createDefaultDesignSystem() })
  }

  return {
    designSystem,
    wireframeBlocks,
    componentChecklist,
    microcopyBank,
    palette,
    typography,
    grid,
    spacing,
    primaryColor,
    setPalette,
    generatePrimaryFromSeed,
    setAccentFromSeed,
    setTypography,
    patchTypography,
    setGrid,
    patchGrid,
    setSpacing,
    replaceDesignSystem,
    setWireframeBlocks,
    setComponentChecklist,
    setMicrocopyBank,
    addMicrocopy,
    removeMicrocopy,
    reset,
    resetDesignSystem,
  }
})
