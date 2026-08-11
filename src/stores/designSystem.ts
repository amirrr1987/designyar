import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import {
  createDefaultDesignSystem,
  type ColorPaletteConfig,
  type DesignSystem,
  type GridConfig,
  type SpacingConfig,
  type TypographyConfig,
} from '@/types/design-system'

export const useDesignSystemStore = defineStore('designSystem', () => {
  const designSystem = useStorage<DesignSystem>(
    'ux-flow-design-system',
    createDefaultDesignSystem(),
  )

  const palette = computed(() => designSystem.value.palette)
  const typography = computed(() => designSystem.value.typography)
  const grid = computed(() => designSystem.value.grid)
  const spacing = computed(() => designSystem.value.spacing)

  function setPalette(paletteConfig: ColorPaletteConfig): void {
    designSystem.value = { ...designSystem.value, palette: paletteConfig }
  }

  function setTypography(typographyConfig: TypographyConfig): void {
    designSystem.value = { ...designSystem.value, typography: typographyConfig }
  }

  function setGrid(gridConfig: GridConfig): void {
    designSystem.value = { ...designSystem.value, grid: gridConfig }
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
    setPalette,
    setTypography,
    setGrid,
    setSpacing,
    replace,
    reset,
  }
})
