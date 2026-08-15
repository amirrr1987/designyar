import { z } from 'zod'

export const typographySchema = z.object({
  baseSize: z.number(),
  scale: z.number(),
})

export const gridSchema = z.object({
  columns: z.number(),
  gutter: z.number(),
})

export const colorHarmonyModes = [
  'monochromatic',
  'primaryAccent',
  'complementary',
  'analogous',
  'triadic',
] as const

export type ColorHarmonyMode = (typeof colorHarmonyModes)[number]

export const colorPaletteSchema = z.object({
  primary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  harmony: z.enum(colorHarmonyModes),
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
  /** Legacy free-text notes — kept in sync with blocks for export/AI context */
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

export function harmonyLabel(mode: ColorHarmonyMode): string {
  const labels: Record<ColorHarmonyMode, string> = {
    monochromatic: 'تک‌رنگ (Monochromatic)',
    primaryAccent: 'اصلی + تاکیدی',
    complementary: 'مکمل (Complementary)',
    analogous: 'هم‌خانواده (Analogous)',
    triadic: 'سه‌گانه (Triadic)',
  }
  return labels[mode]
}

export function createDefaultColorPalette(): ColorPalette {
  return {
    primary: '#0f766e',
    accent: '#14b8a6',
    background: '#f8fafc',
    text: '#1c1917',
    harmony: 'primaryAccent',
  }
}

export function paletteFromLegacyColors(colors: string[]): ColorPalette {
  const defaults = createDefaultColorPalette()
  return {
    primary: colors[0] ?? defaults.primary,
    accent: colors[1] ?? defaults.accent,
    background: colors[2] ?? defaults.background,
    text: colors[3] ?? defaults.text,
    harmony: defaults.harmony,
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

function parsePalette(raw: unknown): ColorPalette | null {
  const parsed = colorPaletteSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
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

export const colorsAiSchema = colorPaletteSchema

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
