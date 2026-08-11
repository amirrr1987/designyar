export interface EmpathyQuadrants {
  says: string
  thinks: string
  does: string
  feels: string
}

export interface EmpathyMapEntry {
  /** Linked persona id, or `general` when not tied to one persona. */
  personaId: string
  quadrants: EmpathyQuadrants
  updatedAt: string
}

export type EmpathyMapsByPersona = Record<string, EmpathyMapEntry>

export function createEmptyQuadrants(): EmpathyQuadrants {
  return {
    says: '',
    thinks: '',
    does: '',
    feels: '',
  }
}

export function isEmpathyQuadrants(value: unknown): value is EmpathyQuadrants {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.says === 'string' &&
    typeof v.thinks === 'string' &&
    typeof v.does === 'string' &&
    typeof v.feels === 'string'
  )
}

export function isEmpathyMapEntry(value: unknown): value is EmpathyMapEntry {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.personaId === 'string' &&
    typeof v.updatedAt === 'string' &&
    isEmpathyQuadrants(v.quadrants)
  )
}
