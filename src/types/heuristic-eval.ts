/** Persisted heuristic evaluation entry (Nielsen rules). */
export interface HeuristicEvalEntry {
  ruleId: string
  rating: number
  notes: string
}

export type HeuristicEvalMap = Record<string, HeuristicEvalEntry>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isHeuristicEvalEntry(value: unknown): value is HeuristicEvalEntry {
  if (!isRecord(value)) return false
  return (
    typeof value.ruleId === 'string' &&
    typeof value.rating === 'number' &&
    Number.isFinite(value.rating) &&
    typeof value.notes === 'string'
  )
}

export function isHeuristicEvalMap(value: unknown): value is HeuristicEvalMap {
  if (!isRecord(value)) return false
  return Object.values(value).every(isHeuristicEvalEntry)
}
