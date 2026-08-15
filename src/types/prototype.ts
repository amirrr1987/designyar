import { z } from 'zod'

export const typographySchema = z.object({
  baseSize: z.number(),
  scale: z.number(),
})

export const gridSchema = z.object({
  columns: z.number(),
  gutter: z.number(),
})

export const prototypeStateSchema = z.object({
  colors: z.array(z.string()),
  typography: typographySchema,
  grid: gridSchema,
  spacingBase: z.number(),
  wireframeNotes: z.string(),
})

export type TypographyScale = z.infer<typeof typographySchema>
export type GridConfig = z.infer<typeof gridSchema>
export type PrototypeState = z.infer<typeof prototypeStateSchema>

export function createDefaultPrototypeState(): PrototypeState {
  return {
    colors: ['#1677ff', '#52c41a', '#ffffff', '#000000'],
    typography: { baseSize: 16, scale: 1.25 },
    grid: { columns: 12, gutter: 16 },
    spacingBase: 8,
    wireframeNotes: '',
  }
}

export const colorsAiSchema = z.object({
  colors: z.array(z.string()).min(2),
})

export const typographyAiSchema = typographySchema

export const gridAiSchema = gridSchema

export const spacingAiSchema = z.object({
  spacingBase: z.number(),
})

export const wireframeAiSchema = z.object({
  wireframeNotes: z.string(),
})
