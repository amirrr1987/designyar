import { isHeuristicEvalMap, type HeuristicEvalMap } from './heuristic-eval'

/** Saved FG/BG pair from the contrast checker. */
export interface ContrastCheckRecord {
  foreground: string
  background: string
}

export interface TestState {
  wcagChecked: string[]
  heuristicEval: HeuristicEvalMap
  usabilityReportSummary: string
  /** Presence means the junior completed «بررسی کنتراست». */
  contrastCheck: ContrastCheckRecord | null
}

export function createDefaultTestState(): TestState {
  return {
    wcagChecked: [],
    heuristicEval: {},
    usabilityReportSummary: '',
    contrastCheck: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function isContrastCheckRecord(value: unknown): value is ContrastCheckRecord {
  if (!isRecord(value)) return false
  return typeof value.foreground === 'string' && typeof value.background === 'string'
}

export function isTestState(value: unknown): value is TestState {
  if (!isRecord(value)) return false
  return (
    isStringArray(value.wcagChecked) &&
    isHeuristicEvalMap(value.heuristicEval) &&
    typeof value.usabilityReportSummary === 'string' &&
    (value.contrastCheck === null || isContrastCheckRecord(value.contrastCheck))
  )
}

/** Soft-merge unknown / legacy test slices (missing `contrastCheck` → null). */
export function normalizeTestState(value: unknown): TestState {
  const defaults = createDefaultTestState()
  if (!isRecord(value)) return defaults

  let contrastCheck: ContrastCheckRecord | null = null
  if (isContrastCheckRecord(value.contrastCheck)) {
    contrastCheck = value.contrastCheck
  } else if (value.contrastCheck === null || value.contrastCheck === undefined) {
    contrastCheck = null
  }

  return {
    wcagChecked: isStringArray(value.wcagChecked) ? value.wcagChecked : defaults.wcagChecked,
    heuristicEval: isHeuristicEvalMap(value.heuristicEval)
      ? value.heuristicEval
      : defaults.heuristicEval,
    usabilityReportSummary:
      typeof value.usabilityReportSummary === 'string'
        ? value.usabilityReportSummary
        : defaults.usabilityReportSummary,
    contrastCheck,
  }
}
