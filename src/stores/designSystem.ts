import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePrototypeStore } from '@/stores/prototype'
import type {
  ColorPaletteConfig,
  DesignSystem,
  GridConfig,
  SpacingConfig,
  TypographyConfig,
} from '@/types/design-system'

/**
 * Backward-compatible facade — design tokens live in `prototype` document slice.
 * Prefer `usePrototypeStore` in new code.
 */
export const useDesignSystemStore = defineStore('designSystem', () => {
  const prototype = usePrototypeStore()

  const designSystem = computed({
    get: () => prototype.designSystem,
    set: (value: DesignSystem) => {
      prototype.replaceDesignSystem(value)
    },
  })

  const palette = computed(() => prototype.palette)
  const typography = computed(() => prototype.typography)
  const grid = computed(() => prototype.grid)
  const spacing = computed(() => prototype.spacing)
  const primaryColor = computed(() => prototype.primaryColor)

  function setPalette(paletteConfig: ColorPaletteConfig): void {
    prototype.setPalette(paletteConfig)
  }

  function generatePrimaryFromSeed(seed: string): void {
    prototype.generatePrimaryFromSeed(seed)
  }

  function setAccentFromSeed(seed: string): void {
    prototype.setAccentFromSeed(seed)
  }

  function setTypography(typographyConfig: TypographyConfig): void {
    prototype.setTypography(typographyConfig)
  }

  function patchTypography(patch: Partial<TypographyConfig>): void {
    prototype.patchTypography(patch)
  }

  function setGrid(gridConfig: GridConfig): void {
    prototype.setGrid(gridConfig)
  }

  function patchGrid(patch: Partial<GridConfig>): void {
    prototype.patchGrid(patch)
  }

  function setSpacing(spacingConfig: SpacingConfig): void {
    prototype.setSpacing(spacingConfig)
  }

  function replace(next: DesignSystem): void {
    prototype.replaceDesignSystem(next)
  }

  function reset(): void {
    prototype.resetDesignSystem()
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
