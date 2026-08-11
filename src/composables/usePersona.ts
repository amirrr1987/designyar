import { storeToRefs } from 'pinia'
import { usePersonaStore, type PersonaDraft } from '@/stores/persona'
import type { Persona } from '@/types/persona'
import {
  PERSONA_TEMPLATES,
  createPersonaFromTemplate,
  getPersonaTemplate,
  type PersonaTemplate,
} from '@/utils/persona-templates'

export function usePersona() {
  const store = usePersonaStore()
  const { personas, count } = storeToRefs(store)

  function addPersona(draft: PersonaDraft): Persona {
    return store.add(draft)
  }

  function addFromTemplate(templateId: string): Persona | null {
    const persona = createPersonaFromTemplate(templateId)
    if (!persona) return null
    return store.add(persona)
  }

  function updatePersona(
    id: string,
    patch: Partial<Omit<Persona, 'id' | 'createdAt'>>,
  ): boolean {
    return store.update(id, patch)
  }

  function removePersona(id: string): void {
    store.remove(id)
  }

  function findPersona(id: string): Persona | undefined {
    return store.getById(id)
  }

  return {
    personas,
    count,
    templates: PERSONA_TEMPLATES as readonly PersonaTemplate[],
    getPersonaTemplate,
    addPersona,
    addFromTemplate,
    updatePersona,
    removePersona,
    findPersona,
  }
}
