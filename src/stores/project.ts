import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import {
  createDefaultProject,
  normalizeProject,
  projectHasBrief,
  type Project,
} from '@/types/project'
import { getStepByNumber } from '@/constants/design-thinking-steps'
import {
  buildCompletionSnapshot,
  getProjectProgress,
  type ProjectProgress,
} from '@/domain/completion'

export const useProjectStore = defineStore('project', () => {
  const persistence = usePersistenceStore()

  const project = computed(() => normalizeProject(persistence.document.project))

  const name = computed(() => project.value.name)
  const briefTitle = computed(() => project.value.briefTitle)
  const briefDescription = computed(() => project.value.briefDescription)
  const currentStep = computed(() => project.value.currentStep)
  const experienceMode = computed(() => project.value.experienceMode)
  const isJuniorMode = computed(() => project.value.experienceMode === 'junior')
  const schemaVersion = computed(() => project.value.schemaVersion)
  const currentStepMeta = computed(() => getStepByNumber(project.value.currentStep))
  const hasBrief = computed(() => projectHasBrief(project.value))

  const completionProgress = computed((): ProjectProgress => {
    return getProjectProgress(buildCompletionSnapshot(persistence.document))
  })

  function writeProject(next: Project): void {
    persistence.patchProject(normalizeProject(next))
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

  function setExperienceMode(mode: Project['experienceMode']): void {
    writeProject({ ...project.value, experienceMode: mode })
  }

  function reset(): void {
    persistence.patchProject(createDefaultProject())
  }

  return {
    project,
    name,
    briefTitle,
    briefDescription,
    currentStep,
    experienceMode,
    isJuniorMode,
    schemaVersion,
    currentStepMeta,
    hasBrief,
    completionProgress,
    setName,
    setBriefTitle,
    setBriefDescription,
    patchBrief,
    setStep,
    setExperienceMode,
    reset,
  }
})
