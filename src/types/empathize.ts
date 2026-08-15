import type { CompetitorRow } from './competitor'
import { isCompetitorRowArray } from './competitor'
import type { EmpathyMapsByPersona } from './empathy-map'
import type { Persona } from './persona'
import { isPersonaArray } from './persona'

export interface EmpathizeState {
  researchNotes: string
  personas: Persona[]
  empathyMaps: EmpathyMapsByPersona
  empathySelectedPersona: string
  competitors: CompetitorRow[]
}

export function createDefaultEmpathizeState(): EmpathizeState {
  return {
    researchNotes: '',
    personas: [],
    empathyMaps: {},
    empathySelectedPersona: 'general',
    competitors: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEmpathyMaps(value: unknown): value is EmpathyMapsByPersona {
  if (!isRecord(value)) return false
  return Object.values(value).every((entry) => {
    if (!isRecord(entry)) return false
    const q = entry.quadrants
    if (!isRecord(q)) return false
    return (
      typeof entry.personaId === 'string' &&
      typeof entry.updatedAt === 'string' &&
      typeof q.says === 'string' &&
      typeof q.thinks === 'string' &&
      typeof q.does === 'string' &&
      typeof q.feels === 'string'
    )
  })
}

export function isEmpathizeState(value: unknown): value is EmpathizeState {
  if (!isRecord(value)) return false
  return (
    typeof value.researchNotes === 'string' &&
    isPersonaArray(value.personas) &&
    isEmpathyMaps(value.empathyMaps) &&
    typeof value.empathySelectedPersona === 'string' &&
    isCompetitorRowArray(value.competitors)
  )
}
