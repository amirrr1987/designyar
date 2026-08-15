import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'
import { getFormMeta } from '@/constants/form-registry'
import { DEFAULT_WCAG_KEYS, type TestState } from '@/types/test'
import { contrastRatio, meetsWcagAa } from '@/utils/contrast'

export interface TestNextAction {
  id: string
  title: string
  reason: string
  phase: DesignThinkingStepKey
  formKey: string
}

const WCAG_LABELS: Record<(typeof DEFAULT_WCAG_KEYS)[number], string> = {
  'alt-text': 'متن جایگزین تصاویر',
  keyboard: 'قابل استفاده با صفحه‌کلید',
  labels: 'برچسب فیلدها',
  contrast: 'کنتراست متن',
  'focus-visible': 'نمایان بودن فوکوس',
}

function formTitle(phase: DesignThinkingStepKey, formKey: string): string {
  return getFormMeta(phase, formKey)?.title ?? formKey
}

/** Deterministic soft-loop actions from test findings (max 5). */
export function buildTestNextActions(state: TestState): TestNextAction[] {
  const actions: TestNextAction[] = []

  const ratio = contrastRatio(state.contrast.foreground, state.contrast.background)
  if (ratio === null || !meetsWcagAa(ratio)) {
    actions.push({
      id: 'contrast-fail',
      title: formTitle('test', 'contrast'),
      reason:
        ratio === null
          ? 'کد رنگ کنتراست نامعتبر است'
          : `نسبت کنتراست ${ratio.toFixed(2)} کمتر از AA است`,
      phase: 'test',
      formKey: 'contrast',
    })
    actions.push({
      id: 'colors-retune',
      title: formTitle('prototype', 'colors'),
      reason: 'پالت رنگ را برای متن و پس‌زمینه بازبینی کن',
      phase: 'prototype',
      formKey: 'colors',
    })
  }

  for (const key of DEFAULT_WCAG_KEYS) {
    if (actions.length >= 5) break
    if (state.wcag[key] === true) continue
    actions.push({
      id: `wcag-${key}`,
      title: formTitle('test', 'wcag'),
      reason: `مورد باز: ${WCAG_LABELS[key]}`,
      phase: 'test',
      formKey: 'wcag',
    })
    break
  }

  const weak = [...state.heuristics]
    .filter((item) => item.score > 0 && item.score <= 2)
    .sort((a, b) => a.score - b.score)

  for (const item of weak) {
    if (actions.length >= 5) break
    const target =
      item.id === 'h8' || item.id === 'h1'
        ? ({ phase: 'prototype' as const, formKey: 'wireframe' })
        : item.id === 'h2' || item.id === 'h10'
          ? ({ phase: 'define' as const, formKey: 'hmw' })
          : ({ phase: 'prototype' as const, formKey: 'colors' })
    actions.push({
      id: `heur-${item.id}`,
      title: formTitle(target.phase, target.formKey),
      reason: `هیوریستیک ضعیف: ${item.title} (${item.score}/۵)`,
      phase: target.phase,
      formKey: target.formKey,
    })
  }

  if (actions.length === 0 && state.report.trim().length === 0) {
    actions.push({
      id: 'fill-heuristics',
      title: formTitle('test', 'heuristics'),
      reason: 'هنوز یافتهٔ تست ثبت نشده؛ نبض‌ها را امتیاز بده',
      phase: 'test',
      formKey: 'heuristics',
    })
  }

  return actions.slice(0, 5)
}
