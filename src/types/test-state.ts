import { isHeuristicEvalMap, type HeuristicEvalMap } from './heuristic-eval'

export interface TestState {
  wcagChecked: string[]
  heuristicEval: HeuristicEvalMap
  usabilityReportSummary: string
}

export function createDefaultTestState(): TestState {
  return {
    wcagChecked: [],
    heuristicEval: {},
    usabilityReportSummary: '',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function isTestState(value: unknown): value is TestState {
  if (!isRecord(value)) return false
  return (
    isStringArray(value.wcagChecked) &&
    isHeuristicEvalMap(value.heuristicEval) &&
    typeof value.usabilityReportSummary === 'string'
  )
}
