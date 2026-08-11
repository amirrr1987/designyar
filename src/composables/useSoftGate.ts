import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DESIGN_THINKING_STEPS, getStepByKey } from '@/constants/design-thinking-steps'
import { useCompletion } from '@/composables/useCompletion'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'
import type { DesignStepKey } from '@/types/project'

export type SoftGateTarget = DesignStepKey | 'synthesis'

export interface SoftGatePending {
  target: SoftGateTarget
  recommended: DesignStepKey
  recommendedTitle: string
  targetTitle: string
  body: string
}

/** Session-only skips (not persisted). */
const skippedTargets = ref<Set<string>>(new Set())

const pending = ref<SoftGatePending | null>(null)

export function useSoftGate() {
  const router = useRouter()
  const projectStore = useProjectStore()
  const { softGateFor, phaseProgress } = useCompletion()

  const isOpen = computed(() => pending.value !== null)
  const gate = computed(() => pending.value)

  function titleOf(target: SoftGateTarget): string {
    if (target === 'synthesis') return 'جمع‌بندی'
    return fa.phaseTitle(target, projectStore.experienceMode)
  }

  function navigateTo(target: SoftGateTarget): void {
    if (target === 'synthesis') {
      void router.push({ name: 'synthesis' })
      return
    }
    const step = getStepByKey(target)
    projectStore.setStep(step.step)
    void router.push(step.route)
  }

  function firstIncompletePhase(): DesignStepKey | null {
    for (const step of DESIGN_THINKING_STEPS) {
      if (!phaseProgress(step.key).isComplete) return step.key
    }
    return null
  }

  function openGate(target: SoftGateTarget, recommended: DesignStepKey): void {
    pending.value = {
      target,
      recommended,
      recommendedTitle: titleOf(recommended),
      targetTitle: titleOf(target),
      body: fa.softGateBody(titleOf(recommended)),
    }
  }

  /**
   * Attempt navigation. Returns false when soft gate interstitial is shown instead.
   */
  function requestNavigate(target: SoftGateTarget): boolean {
    if (!projectStore.isJuniorMode) {
      navigateTo(target)
      return true
    }

    if (skippedTargets.value.has(target)) {
      navigateTo(target)
      return true
    }

    if (target === 'synthesis') {
      const incomplete = firstIncompletePhase()
      if (incomplete) {
        openGate(target, incomplete)
        return false
      }
      navigateTo(target)
      return true
    }

    const recommended = softGateFor(target)
    if (!recommended) {
      navigateTo(target)
      return true
    }

    openGate(target, recommended)
    return false
  }

  function skipAndContinue(): void {
    const current = pending.value
    if (!current) return
    skippedTargets.value = new Set([...skippedTargets.value, current.target])
    pending.value = null
    navigateTo(current.target)
  }

  function goRecommended(): void {
    const current = pending.value
    if (!current) return
    pending.value = null
    navigateTo(current.recommended)
  }

  function dismiss(): void {
    pending.value = null
  }

  return {
    isOpen,
    gate,
    requestNavigate,
    skipAndContinue,
    goRecommended,
    dismiss,
    navigateTo,
  }
}
