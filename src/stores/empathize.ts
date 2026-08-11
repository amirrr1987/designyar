import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import type { CompetitorRow } from '@/types/competitor'
import type { EmpathyMapsByPersona, EmpathyQuadrants } from '@/types/empathy-map'
import { createEmptyQuadrants } from '@/types/empathy-map'
import type { Persona } from '@/types/persona'
import type { EmpathizeState } from '@/types/empathize'

export type PersonaDraft = Omit<Persona, 'id' | 'createdAt'> & {
  id?: string
  createdAt?: string
}

function createId(): string {
  return crypto.randomUUID()
}

export const useEmpathizeStore = defineStore('empathize', () => {
  const persistence = usePersistenceStore()

  const state = computed(() => persistence.document.empathize)
  const researchNotes = computed({
    get: () => state.value.researchNotes,
    set: (value: string) => {
      persistence.patchEmpathize({ researchNotes: value })
    },
  })
  const personas = computed(() => state.value.personas)
  const empathyMaps = computed(() => state.value.empathyMaps)
  const empathySelectedPersona = computed({
    get: () => state.value.empathySelectedPersona,
    set: (value: string) => {
      persistence.patchEmpathize({ empathySelectedPersona: value })
    },
  })
  const competitors = computed(() => state.value.competitors)
  const personaCount = computed(() => personas.value.length)

  function setResearchNotes(value: string): void {
    persistence.patchEmpathize({ researchNotes: value })
  }

  function getPersonaById(id: string): Persona | undefined {
    return personas.value.find((p) => p.id === id)
  }

  function addPersona(draft: PersonaDraft): Persona {
    const persona: Persona = {
      id: draft.id ?? createId(),
      name: draft.name,
      role: draft.role,
      age: draft.age,
      goals: draft.goals,
      pains: draft.pains,
      bio: draft.bio,
      avatarColor: draft.avatarColor,
      createdAt: draft.createdAt ?? new Date().toISOString(),
    }
    persistence.patchEmpathize({ personas: [...personas.value, persona] })
    return persona
  }

  function updatePersona(id: string, patch: Partial<Omit<Persona, 'id' | 'createdAt'>>): boolean {
    const index = personas.value.findIndex((p) => p.id === id)
    if (index < 0) return false
    const current = personas.value[index]
    if (!current) return false
    const next: Persona = { ...current, ...patch, id: current.id, createdAt: current.createdAt }
    const copy = [...personas.value]
    copy[index] = next
    persistence.patchEmpathize({ personas: copy })
    return true
  }

  function removePersona(id: string): void {
    persistence.patchEmpathize({ personas: personas.value.filter((p) => p.id !== id) })
  }

  function clearPersonas(): void {
    persistence.patchEmpathize({ personas: [] })
  }

  function setEmpathyMaps(maps: EmpathyMapsByPersona): void {
    persistence.patchEmpathize({ empathyMaps: maps })
  }

  function upsertEmpathyMap(personaId: string, quadrants: EmpathyQuadrants): void {
    const next: EmpathyMapsByPersona = {
      ...empathyMaps.value,
      [personaId]: {
        personaId,
        quadrants,
        updatedAt: new Date().toISOString(),
      },
    }
    persistence.patchEmpathize({ empathyMaps: next })
  }

  function ensureEmpathyMap(personaId: string): void {
    if (empathyMaps.value[personaId]) return
    upsertEmpathyMap(personaId, createEmptyQuadrants())
  }

  function setCompetitors(rows: CompetitorRow[]): void {
    persistence.patchEmpathize({ competitors: rows })
  }

  function addCompetitor(row: Omit<CompetitorRow, 'id'> & { id?: string }): CompetitorRow {
    const competitor: CompetitorRow = {
      id: row.id ?? createId(),
      name: row.name,
      strength: row.strength,
      weakness: row.weakness,
      url: row.url,
    }
    persistence.patchEmpathize({ competitors: [...competitors.value, competitor] })
    return competitor
  }

  function removeCompetitor(id: string): void {
    persistence.patchEmpathize({
      competitors: competitors.value.filter((c) => c.id !== id),
    })
  }

  function replaceAll(next: EmpathizeState): void {
    persistence.setEmpathize(next)
  }

  return {
    researchNotes,
    personas,
    empathyMaps,
    empathySelectedPersona,
    competitors,
    personaCount,
    setResearchNotes,
    getPersonaById,
    addPersona,
    updatePersona,
    removePersona,
    clearPersonas,
    setEmpathyMaps,
    upsertEmpathyMap,
    ensureEmpathyMap,
    setCompetitors,
    addCompetitor,
    removeCompetitor,
    replaceAll,
  }
})
