import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWCAG } from '@/composables/useWCAG'
import { usePersona } from '@/composables/usePersona'
import { getStepByNumber } from '@/constants/design-thinking-steps'
import { useDefineStore } from '@/stores/define'
import { useEmpathizeStore } from '@/stores/empathize'
import { useIdeateStore } from '@/stores/ideate'
import { usePrototypeStore } from '@/stores/prototype'
import { useProjectStore } from '@/stores/project'
import { useTestStore } from '@/stores/test'
import { useAiStore } from '@/stores/ai'
import type { DesignStepKey } from '@/types/project'
import { isAiActionId } from '@/utils/ai-prompts'
import {
  buildPhaseCoachSnapshot,
  getPhaseCoachHint,
  type PhaseCoachResult,
} from '@/utils/phase-coach'

function isDesignStepKey(value: unknown): value is DesignStepKey {
  return (
    value === 'empathize' ||
    value === 'define' ||
    value === 'ideate' ||
    value === 'prototype' ||
    value === 'test'
  )
}

export function usePhaseCoach(): {
  coach: ComputedRef<PhaseCoachResult | null>
  runCoachAction: () => void
} {
  const route = useRoute()
  const projectStore = useProjectStore()
  const defineStore = useDefineStore()
  const ideateStore = useIdeateStore()
  const empathizeStore = useEmpathizeStore()
  const prototypeStore = usePrototypeStore()
  const testStore = useTestStore()
  const aiStore = useAiStore()
  const { count: personaCount } = usePersona()
  const { progress: wcagProgress } = useWCAG()
  const { problem, pov, hmw } = storeToRefs(defineStore)
  const { ideas, flowNodes, sitemap, cardSort } = storeToRefs(ideateStore)
  const { researchNotes, empathyMaps, competitors } = storeToRefs(empathizeStore)
  const { wireframeBlocks, microcopyBank } = storeToRefs(prototypeStore)
  const { usabilityReportSummary: testSummary } = storeToRefs(testStore)

  const stepKey = computed((): DesignStepKey | 'home' => {
    const name = route.name
    if (name === 'home') return 'home'
    if (isDesignStepKey(name)) return name
    const meta = getStepByNumber(projectStore.currentStep)
    return meta?.key ?? 'home'
  })

  const coach = computed(() => {
    const snapshot = buildPhaseCoachSnapshot({
      briefTitle: projectStore.briefTitle,
      briefDescription: projectStore.briefDescription,
      researchNotes: researchNotes.value,
      personaCount: personaCount.value,
      competitorCount: competitors.value.length,
      empathyMapCount: Object.keys(empathyMaps.value).length,
      problemFilled:
        Boolean(problem.value.user.trim()) &&
        Boolean(problem.value.need.trim()) &&
        Boolean(problem.value.insight.trim()),
      povFilled:
        Boolean(pov.value.user.trim()) &&
        Boolean(pov.value.need.trim()) &&
        Boolean(pov.value.insight.trim()),
      hmwCount: hmw.value.length,
      ideaCount: ideas.value.length,
      flowNodeCount: flowNodes.value.length,
      sitemap: sitemap.value,
      cardSortCardCount: cardSort.value.cards.length,
      testSummary: testSummary.value,
      wireframeBlockCount: wireframeBlocks.value.length,
      microcopyCount: microcopyBank.value.length,
      wcagProgress: wcagProgress.value,
    })
    return getPhaseCoachHint(stepKey.value, snapshot)
  })

  function runCoachAction(): void {
    const actionId = coach.value?.actionId
    if (actionId && isAiActionId(actionId)) {
      aiStore.openPanel(actionId)
    }
  }

  return { coach, runCoachAction }
}
