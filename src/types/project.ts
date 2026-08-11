/** Design Thinking step keys (order-independent identity). */
export type DesignStepKey = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'

export interface Project {
  name: string
  /** 1-based index into DESIGN_THINKING_STEPS (1 = empathize … 5 = test). */
  currentStep: number
  createdAt: string
}

export function createDefaultProject(): Project {
  return {
    name: '',
    currentStep: 1,
    createdAt: new Date().toISOString(),
  }
}

export function isDesignStepKey(value: unknown): value is DesignStepKey {
  return (
    value === 'empathize' ||
    value === 'define' ||
    value === 'ideate' ||
    value === 'prototype' ||
    value === 'test'
  )
}

export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === 'string' &&
    typeof v.currentStep === 'number' &&
    Number.isFinite(v.currentStep) &&
    v.currentStep >= 1 &&
    v.currentStep <= 5 &&
    typeof v.createdAt === 'string'
  )
}
