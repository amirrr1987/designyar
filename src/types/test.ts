import { z } from 'zod'
import { createDefaultHeuristicItems } from '@/constants/heuristic-pulse'

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
    heuristics: createDefaultHeuristicItems(),
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

export const reportNextActionSchema = z.object({
  title: z.string(),
  reason: z.string(),
  phase: z.string(),
  formKey: z.string(),
})

export const reportAiSchema = z.preprocess((raw: unknown) => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return raw
  const record = raw as Record<string, unknown>
  const reportValue = record.report
  const report =
    typeof reportValue === 'string'
      ? reportValue
      : reportValue === null || reportValue === undefined
        ? ''
        : String(reportValue)

  const actionsRaw = record.nextActions
  if (actionsRaw === null || actionsRaw === undefined) {
    return { report }
  }
  if (!Array.isArray(actionsRaw)) {
    return { report }
  }

  const nextActions = actionsRaw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      title: String(item.title ?? ''),
      reason: String(item.reason ?? ''),
      phase: String(item.phase ?? ''),
      formKey: String(item.formKey ?? ''),
    }))
    .filter(
      (item) =>
        item.title.length > 0 &&
        item.reason.length > 0 &&
        item.phase.length > 0 &&
        item.formKey.length > 0,
    )
    .slice(0, 5)

  return nextActions.length > 0 ? { report, nextActions } : { report }
}, z.object({
  report: z.string(),
  nextActions: z.array(reportNextActionSchema).max(5).optional(),
}))

export type ReportAiResult = z.infer<typeof reportAiSchema>
