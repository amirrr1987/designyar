/** Ant Design–style color ramp (typically 10 hex strings). */
export type ColorRamp = readonly string[]

export interface ColorPaletteConfig {
  seed: string
  primary: string[]
  accent: string[]
}

export interface TypographyConfig {
  /** Base font size in px. */
  baseSize: number
  /** Modular scale ratio (e.g. 1.25). */
  ratio: number
  /** Computed scale steps in px. */
  steps: number[]
  fontFamily: string
}

export interface GridConfig {
  columns: number
  gutter: number
  margin: number
  maxWidth: number
}

export interface SpacingConfig {
  /** Base unit in px (8pt grid → 8). */
  base: number
  scale: number[]
}

export interface DesignSystem {
  palette: ColorPaletteConfig
  typography: TypographyConfig
  grid: GridConfig
  spacing: SpacingConfig
}

export function createDefaultDesignSystem(): DesignSystem {
  return {
    palette: {
      seed: '#1677ff',
      primary: [],
      accent: [],
    },
    typography: {
      baseSize: 16,
      ratio: 1.25,
      steps: [12, 14, 16, 20, 25, 31],
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    },
    grid: {
      columns: 12,
      gutter: 16,
      margin: 24,
      maxWidth: 1200,
    },
    spacing: {
      base: 8,
      scale: [0, 8, 16, 24, 32, 40, 48, 64],
    },
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number')
}

function isColorPaletteConfig(value: unknown): value is ColorPaletteConfig {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.seed === 'string' && isStringArray(v.primary) && isStringArray(v.accent)
}

function isTypographyConfig(value: unknown): value is TypographyConfig {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.baseSize === 'number' &&
    typeof v.ratio === 'number' &&
    isNumberArray(v.steps) &&
    typeof v.fontFamily === 'string'
  )
}

function isGridConfig(value: unknown): value is GridConfig {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.columns === 'number' &&
    typeof v.gutter === 'number' &&
    typeof v.margin === 'number' &&
    typeof v.maxWidth === 'number'
  )
}

function isSpacingConfig(value: unknown): value is SpacingConfig {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.base === 'number' && isNumberArray(v.scale)
}

export function isDesignSystem(value: unknown): value is DesignSystem {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    isColorPaletteConfig(v.palette) &&
    isTypographyConfig(v.typography) &&
    isGridConfig(v.grid) &&
    isSpacingConfig(v.spacing)
  )
}
