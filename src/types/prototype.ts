import { z } from 'zod'
import { isDesignSystemKey } from '@/constants/design-system-catalog'

export const typographySchema = z.object({
  baseSize: z.number(),
  scale: z.number(),
})

export const gridSchema = z.object({
  columns: z.number(),
  gutter: z.number(),
})

/** How the user builds the palette */
export const paletteModes = ['custom', 'theory', 'system'] as const
export type PaletteMode = (typeof paletteModes)[number]

/** Paletton-style color schemes: https://paletton.com */
export const theorySchemes = ['monochromatic', 'adjacent', 'triad', 'tetrad'] as const
export type TheoryScheme = (typeof theorySchemes)[number]

/** Token starters from known design systems (colors only — not swapping UI libs) */
export type DesignSystemKey = string

export const colorSwatchSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
})

export type ColorSwatch = z.infer<typeof colorSwatchSchema>

export const colorPaletteSchema = z.object({
  mode: z.enum(paletteModes),
  theoryScheme: z.enum(theorySchemes),
  systemKey: z.string(),
  /** Seed for theory generation */
  seed: z.string(),
  /** User-defined label/value pairs (custom mode) */
  swatches: z.array(colorSwatchSchema),
  primary: z.string(),
  accent: z.string(),
  /** Third hue (adjacent / triad / tetrad) */
  tertiary: z.string(),
  /** Fourth hue (tetrad); otherwise mirrors tertiary */
  quaternary: z.string(),
  background: z.string(),
  text: z.string(),
  surface: z.string(),
  textMuted: z.string(),
  border: z.string(),
})

export type ColorPalette = z.infer<typeof colorPaletteSchema>

export const wireframeBlockKinds = [
  'header',
  'nav',
  'hero',
  'content',
  'aside',
  'cta',
  'footer',
] as const

export type WireframeBlockKind = (typeof wireframeBlockKinds)[number]

export const wireframeBlockSchema = z.object({
  id: z.string(),
  kind: z.enum(wireframeBlockKinds),
  title: z.string(),
})

export type WireframeBlock = z.infer<typeof wireframeBlockSchema>

export const prototypeStateSchema = z.object({
  palette: colorPaletteSchema,
  typography: typographySchema,
  grid: gridSchema,
  spacingBase: z.number(),
  wireframeNotes: z.string(),
  wireframeBlocks: z.array(wireframeBlockSchema),
})

export type TypographyScale = z.infer<typeof typographySchema>
export type GridConfig = z.infer<typeof gridSchema>
export type PrototypeState = z.infer<typeof prototypeStateSchema>

export function createEntityId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createEmptyWireframeBlock(
  kind: WireframeBlockKind = 'content',
  title = '',
): WireframeBlock {
  return {
    id: createEntityId(),
    kind,
    title,
  }
}

export function createEmptySwatch(label = '', value = '#0f766e'): ColorSwatch {
  return { id: createEntityId(), label, value }
}

export function wireframeBlocksToNotes(blocks: WireframeBlock[]): string {
  return blocks
    .map((block) => {
      const label = block.title.trim() || kindLabel(block.kind)
      return `• [${kindLabel(block.kind)}] ${label}`
    })
    .join('\n')
}

export function kindLabel(kind: WireframeBlockKind): string {
  const labels: Record<WireframeBlockKind, string> = {
    header: 'سربرگ',
    nav: 'ناوبری',
    hero: 'هیرو',
    content: 'محتوا',
    aside: 'کناری',
    cta: 'فراخوان',
    footer: 'پاورقی',
  }
  return labels[kind]
}

export function paletteModeLabel(mode: PaletteMode): string {
  const labels: Record<PaletteMode, string> = {
    custom: 'سفارشی (برچسب + مقدار)',
    theory: 'اصول رنگ‌شناسی',
    system: 'Design System',
  }
  return labels[mode]
}

export function theorySchemeLabel(scheme: TheoryScheme): string {
  const labels: Record<TheoryScheme, string> = {
    monochromatic: 'تک‌رنگ — Monochromatic (1-color)',
    adjacent: 'مجاور — Adjacent (3-colors)',
    triad: 'سه‌تایی — Triad (3-colors)',
    tetrad: 'چهارتایی — Tetrad (4-colors)',
  }
  return labels[scheme]
}

export function normalizePaletteMode(raw: unknown, fallback: PaletteMode = 'theory'): PaletteMode {
  if (typeof raw !== 'string') return fallback
  const t = raw.trim().toLowerCase()
  if ((paletteModes as readonly string[]).includes(t)) return t as PaletteMode
  if (t.includes('custom') || t.includes('سفارش')) return 'custom'
  if (t.includes('system') || t.includes('antd') || t.includes('material')) return 'system'
  if (t.includes('theory') || t.includes('اصل') || t.includes('هارمون')) return 'theory'
  return fallback
}

export function normalizeTheoryScheme(
  raw: unknown,
  fallback: TheoryScheme = 'adjacent',
): TheoryScheme {
  if (typeof raw !== 'string') return fallback
  const trimmed = raw.trim()
  if ((theorySchemes as readonly string[]).includes(trimmed)) {
    return trimmed as TheoryScheme
  }

  const compact = trimmed.toLowerCase().replace(/[\s_\-()]+/g, '')
  const aliases: Record<string, TheoryScheme> = {
    monochromatic: 'monochromatic',
    mono: 'monochromatic',
    onecolor: 'monochromatic',
    تکرنگ: 'monochromatic',
    تک‌رنگ: 'monochromatic',
    adjacent: 'adjacent',
    analogous: 'adjacent',
    adjacentcolors: 'adjacent',
    duotone: 'adjacent',
    twocolor: 'adjacent',
    complementary: 'adjacent',
    دورنگ: 'adjacent',
    مجاور: 'adjacent',
    triad: 'triad',
    triadic: 'triad',
    tricolor: 'triad',
    threecolor: 'triad',
    سه‌رنگ: 'triad',
    سهرنگ: 'triad',
    سه‌تایی: 'triad',
    سهتایی: 'triad',
    سه‌گانه: 'triad',
    سهگانه: 'triad',
    tetrad: 'tetrad',
    tetradic: 'tetrad',
    fourcolor: 'tetrad',
    چهاررنگ: 'tetrad',
    چهارتایی: 'tetrad',
  }

  const direct = aliases[compact]
  if (direct) return direct

  if (trimmed.includes('tetra') || trimmed.includes('چهار') || trimmed.includes('4-color')) {
    return 'tetrad'
  }
  if (
    trimmed.includes('adjacent') ||
    trimmed.includes('analog') ||
    trimmed.includes('مجاور')
  ) {
    return 'adjacent'
  }
  if (
    trimmed.includes('triad') ||
    trimmed.includes('سه‌تایی') ||
    trimmed.includes('سه‌گانه') ||
    trimmed.includes('سه‌') ||
    trimmed.includes('tri')
  ) {
    return 'triad'
  }
  if (trimmed.includes('تک') || trimmed.includes('مونو') || trimmed.includes('mono')) {
    return 'monochromatic'
  }
  if (trimmed.includes('duo') || trimmed.includes('دو')) return 'adjacent'
  return fallback
}

export function normalizeDesignSystemKey(
  raw: unknown,
  fallback: DesignSystemKey | '' = '',
): DesignSystemKey | '' {
  if (typeof raw !== 'string') return fallback
  const t = raw.trim().toLowerCase().replace(/\s+/g, '-')
  if (t === '' || t === 'none' || t === 'null') return ''
  if (isDesignSystemKey(t)) return t

  // Aliases AI / users might send
  const aliases: Record<string, string> = {
    antdesign: 'antd',
    'ant-design': 'antd',
    ant: 'antd',
    antdv: 'antd',
    materialdesign: 'material',
    material3: 'material',
    m3: 'material',
    'material-ui': 'mui',
    materialui: 'mui',
    element: 'element-plus',
    elementplus: 'element-plus',
    naive: 'naive-ui',
    naiveui: 'naive-ui',
    shopify: 'polaris',
    github: 'primer',
    adobe: 'spectrum',
    salesforce: 'lightning',
    ibm: 'carbon',
    microsoft: 'fluent',
    nextui: 'nextui',
    heroui: 'nextui',
    apple: 'apple-hig',
    ios: 'apple-hig',
  }
  const mapped = aliases[t.replace(/_/g, '')] ?? aliases[t]
  if (mapped && isDesignSystemKey(mapped)) return mapped

  // Fuzzy contains
  if (t.includes('element')) return 'element-plus'
  if (t.includes('naive')) return 'naive-ui'
  if (t.includes('vuetify')) return 'vuetify'
  if (t.includes('quasar')) return 'quasar'
  if (t.includes('prime')) return 'primevue'
  if (t.includes('fluent')) return 'fluent'
  if (t.includes('carbon')) return 'carbon'
  if (t.includes('polaris') || t.includes('shopify')) return 'polaris'
  if (t.includes('material') || t.includes('مادریال')) return 'material'
  if (t.includes('ant')) return 'antd'
  if (t.includes('bootstrap')) return 'bootstrap'
  if (t.includes('tailwind')) return 'tailwind'
  if (t.includes('shadcn')) return 'shadcn'

  return fallback
}

/** Map legacy harmony field → theory scheme */
function theoryFromLegacyHarmony(harmony: unknown): TheoryScheme {
  if (typeof harmony !== 'string') return 'adjacent'
  const h = harmony.toLowerCase()
  if (h.includes('mono')) return 'monochromatic'
  if (h.includes('tetra') || h.includes('چهار')) return 'tetrad'
  if (h.includes('analog') || h.includes('adjacent') || h.includes('مجاور')) return 'adjacent'
  if (h.includes('triad') || h.includes('سه‌')) return 'triad'
  return normalizeTheoryScheme(harmony, 'adjacent')
}

export function createDefaultColorPalette(): ColorPalette {
  return {
    mode: 'theory',
    theoryScheme: 'adjacent',
    systemKey: '',
    seed: '#0f766e',
    swatches: [
      createEmptySwatch('اصلی', '#0f766e'),
      createEmptySwatch('مجاور ۱', '#14b8a6'),
      createEmptySwatch('مجاور ۲', '#0d9488'),
    ],
    primary: '#0f766e',
    accent: '#14b8a6',
    tertiary: '#0d9488',
    quaternary: '#0d9488',
    background: '#f8fafc',
    text: '#1c1917',
    surface: '#f1f5f9',
    textMuted: '#57534e',
    border: '#e7e5e4',
  }
}

export function paletteFromLegacyColors(colors: string[]): ColorPalette {
  const defaults = createDefaultColorPalette()
  const primary = colors[0] ?? defaults.primary
  const accent = colors[1] ?? defaults.accent
  const background = colors[2] ?? defaults.background
  const text = colors[3] ?? defaults.text
  const tertiary = colors[4] ?? accent
  const quaternary = colors[5] ?? tertiary
  return {
    ...defaults,
    mode: 'custom',
    seed: primary,
    primary,
    accent,
    tertiary,
    quaternary,
    background,
    text,
    surface: colors[6] ?? defaults.surface,
    textMuted: colors[7] ?? defaults.textMuted,
    border: colors[8] ?? defaults.border,
    swatches: [
      createEmptySwatch('اصلی', primary),
      createEmptySwatch('تاکیدی', accent),
    ],
  }
}

export function createDefaultPrototypeState(): PrototypeState {
  const blocks: WireframeBlock[] = [
    createEmptyWireframeBlock('header', 'لوگو و عنوان محصول'),
    createEmptyWireframeBlock('hero', 'پیام اصلی + دکمه شروع'),
    createEmptyWireframeBlock('content', 'سه ستون ویژگی'),
    createEmptyWireframeBlock('cta', 'فراخوان ثانویه'),
    createEmptyWireframeBlock('footer', 'لینک‌ها و کپی‌رایت'),
  ]
  return {
    palette: createDefaultColorPalette(),
    typography: { baseSize: 16, scale: 1.25 },
    grid: { columns: 12, gutter: 16 },
    spacingBase: 8,
    wireframeBlocks: blocks,
    wireframeNotes: wireframeBlocksToNotes(blocks),
  }
}

function parseSwatches(raw: unknown): ColorSwatch[] {
  if (!Array.isArray(raw)) return createDefaultColorPalette().swatches
  const list = raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const s = item as Record<string, unknown>
      return {
        id: typeof s.id === 'string' ? s.id : createEntityId(),
        label: typeof s.label === 'string' ? s.label : '',
        value: typeof s.value === 'string' ? s.value : '#0f766e',
      } satisfies ColorSwatch
    })
    .filter((item): item is ColorSwatch => item !== null)
  return list.length > 0 ? list : createDefaultColorPalette().swatches
}

function parsePalette(raw: unknown): ColorPalette | null {
  const parsed = colorPaletteSchema.safeParse(raw)
  if (parsed.success) {
    return {
      ...parsed.data,
      swatches:
        parsed.data.swatches.length > 0
          ? parsed.data.swatches
          : createDefaultColorPalette().swatches,
    }
  }
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  if (typeof record.primary !== 'string') return null
  const defaults = createDefaultColorPalette()
  return {
    mode: normalizePaletteMode(record.mode, defaults.mode),
    theoryScheme: record.theoryScheme
      ? normalizeTheoryScheme(record.theoryScheme, defaults.theoryScheme)
      : theoryFromLegacyHarmony(record.harmony),
    systemKey: normalizeDesignSystemKey(record.systemKey, defaults.systemKey),
    seed: typeof record.seed === 'string' ? record.seed : record.primary,
    swatches: parseSwatches(record.swatches),
    primary: record.primary,
    accent: typeof record.accent === 'string' ? record.accent : defaults.accent,
    tertiary:
      typeof record.tertiary === 'string'
        ? record.tertiary
        : typeof record.accent === 'string'
          ? record.accent
          : defaults.tertiary,
    quaternary:
      typeof record.quaternary === 'string'
        ? record.quaternary
        : typeof record.tertiary === 'string'
          ? record.tertiary
          : defaults.quaternary,
    background: typeof record.background === 'string' ? record.background : defaults.background,
    text: typeof record.text === 'string' ? record.text : defaults.text,
    surface: typeof record.surface === 'string' ? record.surface : defaults.surface,
    textMuted: typeof record.textMuted === 'string' ? record.textMuted : defaults.textMuted,
    border: typeof record.border === 'string' ? record.border : defaults.border,
  }
}

export function normalizePrototypeState(raw: unknown): PrototypeState {
  const parsed = prototypeStateSchema.safeParse(raw)
  if (parsed.success) {
    const blocks =
      parsed.data.wireframeBlocks.length > 0
        ? parsed.data.wireframeBlocks
        : createDefaultPrototypeState().wireframeBlocks
    return {
      ...parsed.data,
      palette: {
        ...parsed.data.palette,
        swatches:
          parsed.data.palette.swatches.length > 0
            ? parsed.data.palette.swatches
            : createDefaultColorPalette().swatches,
      },
      wireframeBlocks: blocks,
      wireframeNotes:
        parsed.data.wireframeNotes.trim().length > 0
          ? parsed.data.wireframeNotes
          : wireframeBlocksToNotes(blocks),
    }
  }

  if (!raw || typeof raw !== 'object') {
    return createDefaultPrototypeState()
  }

  const record = raw as Record<string, unknown>
  const defaults = createDefaultPrototypeState()

  let palette = defaults.palette
  const fromObject = parsePalette(record.palette)
  if (fromObject) {
    palette = fromObject
  } else if (Array.isArray(record.colors) && record.colors.every((c) => typeof c === 'string')) {
    palette = paletteFromLegacyColors(record.colors as string[])
  }

  const typography =
    record.typography && typeof record.typography === 'object'
      ? {
          baseSize:
            typeof (record.typography as Record<string, unknown>).baseSize === 'number'
              ? ((record.typography as Record<string, unknown>).baseSize as number)
              : defaults.typography.baseSize,
          scale:
            typeof (record.typography as Record<string, unknown>).scale === 'number'
              ? ((record.typography as Record<string, unknown>).scale as number)
              : defaults.typography.scale,
        }
      : defaults.typography

  const grid =
    record.grid && typeof record.grid === 'object'
      ? {
          columns:
            typeof (record.grid as Record<string, unknown>).columns === 'number'
              ? ((record.grid as Record<string, unknown>).columns as number)
              : defaults.grid.columns,
          gutter:
            typeof (record.grid as Record<string, unknown>).gutter === 'number'
              ? ((record.grid as Record<string, unknown>).gutter as number)
              : defaults.grid.gutter,
        }
      : defaults.grid

  const spacingBase =
    typeof record.spacingBase === 'number' ? record.spacingBase : defaults.spacingBase

  let wireframeBlocks = defaults.wireframeBlocks
  if (Array.isArray(record.wireframeBlocks)) {
    const list = record.wireframeBlocks
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const b = item as Record<string, unknown>
        const kind =
          typeof b.kind === 'string' &&
          (wireframeBlockKinds as readonly string[]).includes(b.kind)
            ? (b.kind as WireframeBlockKind)
            : 'content'
        return {
          id: typeof b.id === 'string' ? b.id : createEntityId(),
          kind,
          title: typeof b.title === 'string' ? b.title : '',
        } satisfies WireframeBlock
      })
      .filter((item): item is WireframeBlock => item !== null)
    if (list.length > 0) wireframeBlocks = list
  } else if (typeof record.wireframeNotes === 'string' && record.wireframeNotes.trim().length > 0) {
    wireframeBlocks = record.wireframeNotes
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => createEmptyWireframeBlock('content', line.replace(/^•\s*/, '')))
    if (wireframeBlocks.length === 0) wireframeBlocks = defaults.wireframeBlocks
  }

  const wireframeNotes =
    typeof record.wireframeNotes === 'string' && record.wireframeNotes.trim().length > 0
      ? record.wireframeNotes
      : wireframeBlocksToNotes(wireframeBlocks)

  return {
    palette,
    typography,
    grid,
    spacingBase,
    wireframeBlocks,
    wireframeNotes,
  }
}

const swatchAiItemSchema = z
  .object({
    id: z.string().optional(),
    label: z.string(),
    value: z.string(),
  })
  .transform(
    (item): ColorSwatch => ({
      id: item.id && item.id.trim().length > 0 ? item.id : createEntityId(),
      label: item.label,
      value: item.value,
    }),
  )

export const colorsAiSchema = z
  .object({
    mode: z.union([z.enum(paletteModes), z.string()]).optional(),
    theoryScheme: z.union([z.enum(theorySchemes), z.string()]).optional(),
    systemKey: z.union([z.string(), z.literal('')]).optional(),
    seed: z.string().optional(),
    swatches: z.array(swatchAiItemSchema).optional(),
    primary: z.string(),
    accent: z.string(),
    tertiary: z.string().optional(),
    quaternary: z.string().optional(),
    background: z.string(),
    text: z.string(),
    surface: z.string().optional(),
    textMuted: z.string().optional(),
    border: z.string().optional(),
    /** Legacy AI field */
    harmony: z.string().optional(),
  })
  .transform((data): ColorPalette => {
    const defaults = createDefaultColorPalette()
    const theoryScheme = data.theoryScheme
      ? normalizeTheoryScheme(data.theoryScheme, defaults.theoryScheme)
      : data.harmony
        ? theoryFromLegacyHarmony(data.harmony)
        : defaults.theoryScheme
    const tertiary = data.tertiary ?? data.accent
    return {
      mode: normalizePaletteMode(data.mode, defaults.mode),
      theoryScheme,
      systemKey: normalizeDesignSystemKey(data.systemKey, defaults.systemKey),
      seed: data.seed ?? data.primary,
      swatches:
        data.swatches && data.swatches.length > 0
          ? data.swatches
          : [
              createEmptySwatch('اصلی', data.primary),
              createEmptySwatch('تاکیدی', data.accent),
            ],
      primary: data.primary,
      accent: data.accent,
      tertiary,
      quaternary: data.quaternary ?? tertiary,
      background: data.background,
      text: data.text,
      surface: data.surface ?? defaults.surface,
      textMuted: data.textMuted ?? defaults.textMuted,
      border: data.border ?? defaults.border,
    }
  })

export const typographyAiSchema = typographySchema

export const gridAiSchema = gridSchema

export const spacingAiSchema = z.object({
  spacingBase: z.number(),
})

const wireframeBlockAiItemSchema = z
  .object({
    id: z.string().optional(),
    kind: z.enum(wireframeBlockKinds).optional(),
    title: z.string(),
  })
  .transform(
    (item): WireframeBlock => ({
      id: item.id && item.id.trim().length > 0 ? item.id : createEntityId(),
      kind: item.kind ?? 'content',
      title: item.title,
    }),
  )

export const wireframeAiSchema = z
  .object({
    wireframeBlocks: z.array(wireframeBlockAiItemSchema).min(1).optional(),
    wireframeNotes: z.string().optional(),
  })
  .transform((data) => {
    if (data.wireframeBlocks && data.wireframeBlocks.length > 0) {
      return {
        wireframeBlocks: data.wireframeBlocks,
        wireframeNotes: wireframeBlocksToNotes(data.wireframeBlocks),
      }
    }
    const notes = data.wireframeNotes?.trim() ?? ''
    if (notes.length > 0) {
      const blocks = notes
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => createEmptyWireframeBlock('content', line.replace(/^•\s*/, '')))
      return {
        wireframeBlocks: blocks.length > 0 ? blocks : [createEmptyWireframeBlock()],
        wireframeNotes: notes,
      }
    }
    const fallback = [createEmptyWireframeBlock('hero', 'پیام اصلی صفحه')]
    return {
      wireframeBlocks: fallback,
      wireframeNotes: wireframeBlocksToNotes(fallback),
    }
  })
