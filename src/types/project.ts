import { z } from 'zod'
import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

export const projectSchema = z.object({
  name: z.string(),
  currentPhase: z.enum(['empathize', 'define', 'ideate', 'prototype', 'test']),
  currentFormKey: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ProjectState = z.infer<typeof projectSchema>

export function createDefaultProject(): ProjectState {
  const now = new Date().toISOString()
  return {
    name: '',
    currentPhase: 'empathize',
    currentFormKey: 'research-goal',
    createdAt: now,
    updatedAt: now,
  }
}

export function isProjectState(data: unknown): data is ProjectState {
  return projectSchema.safeParse(data).success
}

export type PhaseKey = DesignThinkingStepKey
