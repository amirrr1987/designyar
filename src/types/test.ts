import { z } from 'zod'

export const contrastPairSchema = z.object({
  foreground: z.string(),
  background: z.string(),
})

export const heuristicItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  score: z.number().min(0).max(5),
  note: z.string(),
})

export const testStateSchema = z.object({
  contrast: contrastPairSchema,
  wcag: z.record(z.string(), z.boolean()),
  heuristics: z.array(heuristicItemSchema),
  report: z.string(),
})

export type ContrastPair = z.infer<typeof contrastPairSchema>
export type HeuristicItem = z.infer<typeof heuristicItemSchema>
export type TestState = z.infer<typeof testStateSchema>

export const DEFAULT_WCAG_KEYS = [
  'alt-text',
  'keyboard',
  'labels',
  'contrast',
  'focus-visible',
] as const

export function createDefaultTestState(): TestState {
  const wcag: Record<string, boolean> = {}
  for (const key of DEFAULT_WCAG_KEYS) {
    wcag[key] = false
  }
  return {
    contrast: { foreground: '#000000', background: '#ffffff' },
    wcag,
    heuristics: [
      {
        id: 'visibility',
        title: 'وضعیت سیستم قابل مشاهده است',
        score: 0,
        note: '',
      },
      {
        id: 'match',
        title: 'هم‌خوانی با دنیای واقعی',
        score: 0,
        note: '',
      },
      {
        id: 'control',
        title: 'کنترل و آزادی کاربر',
        score: 0,
        note: '',
      },
    ],
    report: '',
  }
}

export const contrastAiSchema = contrastPairSchema

export const wcagAiSchema = z.object({
  wcag: z.record(z.string(), z.boolean()),
})

export const heuristicsAiSchema = z.object({
  heuristics: z.array(heuristicItemSchema).min(1),
})

export const reportAiSchema = z.object({
  report: z.string(),
})
