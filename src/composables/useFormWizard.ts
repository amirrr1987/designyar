import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DESIGN_THINKING_STEPS,
  isDesignThinkingStepKey,
  type DesignThinkingStepKey,
} from '@/constants/design-thinking-steps'
import {
  getDefaultFormKey,
  getFormMeta,
  getFormsForPhase,
} from '@/constants/form-registry'
import { useProjectStore } from '@/stores/project'

function narrowFormKey(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === 'string' && raw.length > 0) return raw
  if (Array.isArray(raw)) {
    const first = raw[0]
    return typeof first === 'string' && first.length > 0 ? first : undefined
  }
  return undefined
}

export function useFormWizard() {
  const route = useRoute()
  const router = useRouter()
  const projectStore = useProjectStore()

  const phase = computed<DesignThinkingStepKey | undefined>(() => {
    const raw = route.params.phase
    const key = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined
    if (!key || !isDesignThinkingStepKey(key)) return undefined
    return key
  })

  const formKey = computed(() => {
    const fromRoute = narrowFormKey(route.params.formKey)
    if (fromRoute) return fromRoute
    if (phase.value) return getDefaultFormKey(phase.value)
    return undefined
  })

  const forms = computed(() => {
    if (!phase.value) return []
    return getFormsForPhase(phase.value)
  })

  const currentMeta = computed(() => {
    if (!phase.value || !formKey.value) return undefined
    return getFormMeta(phase.value, formKey.value)
  })

  const formIndex = computed(() => {
    if (!formKey.value) return -1
    return forms.value.findIndex((form) => form.key === formKey.value)
  })

  const phaseIndex = computed(() => {
    if (!phase.value) return -1
    return DESIGN_THINKING_STEPS.findIndex((step) => step.key === phase.value)
  })

  const isFirstStep = computed(
    () => phaseIndex.value === 0 && formIndex.value === 0,
  )

  const isLastStep = computed(() => {
    if (phaseIndex.value < 0 || formIndex.value < 0) return false
    const lastPhaseIndex = DESIGN_THINKING_STEPS.length - 1
    const lastFormIndex = forms.value.length - 1
    return phaseIndex.value === lastPhaseIndex && formIndex.value === lastFormIndex
  })

  function syncProjectPosition(): void {
    if (!phase.value || !formKey.value) return
    projectStore.setPosition(phase.value, formKey.value)
  }

  async function goToForm(nextPhase: DesignThinkingStepKey, nextFormKey: string): Promise<void> {
    projectStore.setPosition(nextPhase, nextFormKey)
    await router.push({
      name: 'micro-form',
      params: { phase: nextPhase, formKey: nextFormKey },
    })
  }

  async function goToPhase(nextPhase: DesignThinkingStepKey): Promise<void> {
    await goToForm(nextPhase, getDefaultFormKey(nextPhase))
  }

  async function goDone(): Promise<void> {
    await router.push({ name: 'done' })
  }

  async function goNext(): Promise<boolean> {
    if (!phase.value || formIndex.value < 0) return false

    const nextForm = forms.value[formIndex.value + 1]
    if (nextForm) {
      await goToForm(phase.value, nextForm.key)
      return true
    }

    const nextPhase = DESIGN_THINKING_STEPS[phaseIndex.value + 1]
    if (!nextPhase) {
      await goDone()
      return true
    }
    await goToForm(nextPhase.key, getDefaultFormKey(nextPhase.key))
    return true
  }

  async function goPrev(): Promise<boolean> {
    if (!phase.value || formIndex.value < 0) return false

    const prevForm = forms.value[formIndex.value - 1]
    if (prevForm) {
      await goToForm(phase.value, prevForm.key)
      return true
    }

    const prevPhase = DESIGN_THINKING_STEPS[phaseIndex.value - 1]
    if (!prevPhase) {
      await router.push({ name: 'home' })
      return true
    }
    const prevForms = getFormsForPhase(prevPhase.key)
    const last = prevForms[prevForms.length - 1]
    if (!last) return false
    await goToForm(prevPhase.key, last.key)
    return true
  }

  return {
    phase,
    formKey,
    forms,
    currentMeta,
    formIndex,
    phaseIndex,
    isFirstStep,
    isLastStep,
    syncProjectPosition,
    goToForm,
    goToPhase,
    goDone,
    goNext,
    goPrev,
  }
}
