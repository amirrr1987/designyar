import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Persona } from '@/types/persona'

export type PersonaDraft = Omit<Persona, 'id' | 'createdAt'> & {
  id?: string
  createdAt?: string
}

function createId(): string {
  return crypto.randomUUID()
}

export const usePersonaStore = defineStore('persona', () => {
  const personas = useStorage<Persona[]>('ux-flow-personas', [])

  const count = computed(() => personas.value.length)

  function getById(id: string): Persona | undefined {
    return personas.value.find((p) => p.id === id)
  }

  function add(draft: PersonaDraft): Persona {
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
    personas.value = [...personas.value, persona]
    return persona
  }

  function update(id: string, patch: Partial<Omit<Persona, 'id' | 'createdAt'>>): boolean {
    const index = personas.value.findIndex((p) => p.id === id)
    if (index < 0) return false
    const current = personas.value[index]
    if (!current) return false
    const next: Persona = { ...current, ...patch, id: current.id, createdAt: current.createdAt }
    const copy = [...personas.value]
    copy[index] = next
    personas.value = copy
    return true
  }

  function remove(id: string): void {
    personas.value = personas.value.filter((p) => p.id !== id)
  }

  function clear(): void {
    personas.value = []
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
