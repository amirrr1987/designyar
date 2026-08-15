import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  useEmpathizeStore,
  type PersonaDraft,
} from '@/stores/empathize'
import type { Persona } from '@/types/persona'

/**
 * Backward-compatible facade — personas live in `empathize` store / document slice.
 * Prefer `useEmpathizeStore` in new code.
 */
export const usePersonaStore = defineStore('persona', () => {
  const empathize = useEmpathizeStore()

  const personas = computed({
    get: () => empathize.personas,
    set: (value: Persona[]) => {
      empathize.replaceAll({
        researchNotes: empathize.researchNotes,
        personas: value,
        empathyMaps: empathize.empathyMaps,
        empathySelectedPersona: empathize.empathySelectedPersona,
        competitors: empathize.competitors,
      })
    },
  })

  const count = computed(() => empathize.personaCount)

  function getById(id: string): Persona | undefined {
    return empathize.getPersonaById(id)
  }

  function add(draft: PersonaDraft): Persona {
    return empathize.addPersona(draft)
  }

  function update(id: string, patch: Partial<Omit<Persona, 'id' | 'createdAt'>>): boolean {
    return empathize.updatePersona(id, patch)
  }

  function remove(id: string): void {
    empathize.removePersona(id)
  }

  function clear(): void {
    empathize.clearPersonas()
  }

  return {
    personas,
    count,
    getById,
    add,
    update,
    remove,
    clear,
  }
})

export type { PersonaDraft }
