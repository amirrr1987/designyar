export interface CompetitorRow {
  id: string
  name: string
  strength: string
  weakness: string
  url?: string
}

export function isCompetitorRow(value: unknown): value is CompetitorRow {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  const urlOk = v.url === undefined || typeof v.url === 'string'
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.strength === 'string' &&
    typeof v.weakness === 'string' &&
    urlOk
  )
}

export function isCompetitorRowArray(value: unknown): value is CompetitorRow[] {
  return Array.isArray(value) && value.every(isCompetitorRow)
}
