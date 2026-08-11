import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { createDefaultProject, normalizeProject, type Project } from '@/types/project'
import { getStepByNumber } from '@/constants/design-thinking-steps'

export const useProjectStore = defineStore('project', () => {
  const rawProject = useStorage<Project>(STORAGE_KEYS.project, createDefaultProject())

  const project = computed(() => normalizeProject(rawProject.value))

  const name = computed(() => project.value.name)
  const briefTitle = computed(() => project.value.briefTitle)
  const briefDescription = computed(() => project.value.briefDescription)
  const currentStep = computed(() => project.value.currentStep)
  const currentStepMeta = computed(() => getStepByNumber(project.value.currentStep))

  function writeProject(next: Project): void {
    rawProject.value = normalizeProject(next)
  }

  function setName(value: string): void {
    writeProject({ ...project.value, name: value })
  }

  function setBriefTitle(value: string): void {
    writeProject({ ...project.value, briefTitle: value })
  }

  function setBriefDescription(value: string): void {
    writeProject({ ...project.value, briefDescription: value })
  }

  function patchBrief(patch: Partial<Pick<Project, 'briefTitle' | 'briefDescription'>>): void {
    writeProject({ ...project.value, ...patch })
  }

  function setStep(step: number): void {
    if (step < 1 || step > 5) return
    writeProject({ ...project.value, currentStep: step })
  }

  function reset(): void {
    rawProject.value = createDefaultProject()
  }

  return {
    project,
    rawProject,
    name,
    briefTitle,
    briefDescription,
    currentStep,
    currentStepMeta,
    setName,
    setBriefTitle,
    setBriefDescription,
    patchBrief,
    setStep,
    reset,
  }
})
