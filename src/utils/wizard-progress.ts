import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { FORM_REGISTRY, getFormMeta } from '@/constants/form-registry'
import type { PhaseKey } from '@/types/project'

export interface WizardProgress {
  totalForms: number
  completedForms: number
  percent: number
  phaseTitle: string
  formTitle: string
}

export function getWizardProgress(
  phase: PhaseKey,
  formKey: string,
): WizardProgress {
  let totalForms = 0
  let completedForms = 0
  let reachedCurrent = false

  for (const step of DESIGN_THINKING_STEPS) {
    const forms = FORM_REGISTRY[step.key]
    for (const form of forms) {
      totalForms += 1
      if (!reachedCurrent) {
        if (step.key === phase && form.key === formKey) {
          reachedCurrent = true
        } else {
          completedForms += 1
        }
      }
    }
  }

  const phaseMeta = DESIGN_THINKING_STEPS.find((s) => s.key === phase)
  const formMeta = getFormMeta(phase, formKey)

  const percent =
    totalForms === 0 ? 0 : Math.round((completedForms / totalForms) * 100)

  return {
    totalForms,
    completedForms,
    percent,
    phaseTitle: phaseMeta?.title ?? phase,
    formTitle: formMeta?.title ?? formKey,
  }
}
