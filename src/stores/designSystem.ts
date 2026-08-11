import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultDesignSystem,
  rampFromSeed,
  type ColorPaletteConfig,
  type DesignSystem,
  type GridConfig,
  type SpacingConfig,
  type TypographyConfig,
} from '@/types/design-system'

export const useDesignSystemStore = defineStore('designSystem', () => {
  const designSystem = useStorage<DesignSystem>(
    STORAGE_KEYS.designSystem,
    createDefaultDesignSystem(),
  )

  const palette = computed(() => designSystem.value.palette)
  const typography = computed(() => designSystem.value.typography)
  const grid = computed(() => designSystem.value.grid)
  const spacing = computed(() => designSystem.value.spacing)
  const primaryColor = computed(() => palette.value.primary[5] ?? palette.value.seed)

  function setPalette(paletteConfig: ColorPaletteConfig): void {
    designSystem.value = { ...designSystem.value, palette: paletteConfig }
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
    designSystem.value = { ...designSystem.value, typography: typographyConfig }
  }

  function patchTypography(patch: Partial<TypographyConfig>): void {
    designSystem.value = {
      ...designSystem.value,
      typography: { ...designSystem.value.typography, ...patch },
    }
  }

  function setGrid(gridConfig: GridConfig): void {
    designSystem.value = { ...designSystem.value, grid: gridConfig }
  }

  function patchGrid(patch: Partial<GridConfig>): void {
    designSystem.value = {
      ...designSystem.value,
      grid: { ...designSystem.value.grid, ...patch },
    }
  }

  function setSpacing(spacingConfig: SpacingConfig): void {
    designSystem.value = { ...designSystem.value, spacing: spacingConfig }
  }

  function replace(next: DesignSystem): void {
    designSystem.value = next
  }

  function reset(): void {
    designSystem.value = createDefaultDesignSystem()
  }

  return {
    designSystem,
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
    replace,
    reset,
  }
})
