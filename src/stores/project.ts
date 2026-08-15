import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultProject,
  type ProjectState,
  type PhaseKey,
} from '@/types/project'

export const useProjectStore = defineStore('project', () => {
  const project = useStorage<ProjectState>(STORAGE_KEYS.project, createDefaultProject())

  function setName(name: string): void {
    project.value = {
      ...project.value,
      name,
      updatedAt: new Date().toISOString(),
    }
  }

  function setPosition(phase: PhaseKey, formKey: string): void {
    project.value = {
      ...project.value,
      currentPhase: phase,
      currentFormKey: formKey,
      updatedAt: new Date().toISOString(),
    }
  }

  function touch(): void {
    project.value = {
      ...project.value,
      updatedAt: new Date().toISOString(),
    }
  }

  function hydrate(next: ProjectState): void {
    project.value = next
  }

  return { project, setName, setPosition, touch, hydrate }
})
