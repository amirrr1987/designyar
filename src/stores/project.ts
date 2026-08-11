import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { createDefaultProject, type Project } from '@/types/project'
import { getStepByNumber } from '@/constants/design-thinking-steps'

export const useProjectStore = defineStore('project', () => {
  const project = useStorage<Project>(STORAGE_KEYS.project, createDefaultProject())

  const name = computed(() => project.value.name)
  const currentStep = computed(() => project.value.currentStep)
  const currentStepMeta = computed(() => getStepByNumber(project.value.currentStep))

  function setName(value: string): void {
    project.value = { ...project.value, name: value }
  }

  function setStep(step: number): void {
    if (step < 1 || step > 5) return
    project.value = { ...project.value, currentStep: step }
  }

  function reset(): void {
    project.value = createDefaultProject()
  }

  return {
    project,
    name,
    currentStep,
    currentStepMeta,
    setName,
    setStep,
    reset,
  }
})
