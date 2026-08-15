<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Result } from 'ant-design-vue'
import { useFormWizard } from '@/composables/useFormWizard'
import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

import ResearchGoalForm from '@/components/forms/empathize/ResearchGoalForm.vue'
import PersonaForm from '@/components/forms/empathize/PersonaForm.vue'
import EmpathyMapForm from '@/components/forms/empathize/EmpathyMapForm.vue'
import ResearchNotesForm from '@/components/forms/empathize/ResearchNotesForm.vue'
import CompetitorsForm from '@/components/forms/empathize/CompetitorsForm.vue'

import ProblemForm from '@/components/forms/define/ProblemForm.vue'
import PovForm from '@/components/forms/define/PovForm.vue'
import HmwForm from '@/components/forms/define/HmwForm.vue'

import BrainstormForm from '@/components/forms/ideate/BrainstormForm.vue'
import UserflowForm from '@/components/forms/ideate/UserflowForm.vue'
import SitemapForm from '@/components/forms/ideate/SitemapForm.vue'
import CardSortForm from '@/components/forms/ideate/CardSortForm.vue'

import ColorsForm from '@/components/forms/prototype/ColorsForm.vue'
import TypographyForm from '@/components/forms/prototype/TypographyForm.vue'
import GridForm from '@/components/forms/prototype/GridForm.vue'
import SpacingForm from '@/components/forms/prototype/SpacingForm.vue'
import WireframeForm from '@/components/forms/prototype/WireframeForm.vue'

import ContrastForm from '@/components/forms/test/ContrastForm.vue'
import WcagForm from '@/components/forms/test/WcagForm.vue'
import HeuristicsForm from '@/components/forms/test/HeuristicsForm.vue'
import ReportForm from '@/components/forms/test/ReportForm.vue'

const FORM_MAP: Record<DesignThinkingStepKey, Record<string, Component>> = {
  empathize: {
    'research-goal': ResearchGoalForm,
    persona: PersonaForm,
    'empathy-map': EmpathyMapForm,
    'research-notes': ResearchNotesForm,
    competitors: CompetitorsForm,
  },
  define: {
    problem: ProblemForm,
    pov: PovForm,
    hmw: HmwForm,
  },
  ideate: {
    brainstorm: BrainstormForm,
    userflow: UserflowForm,
    sitemap: SitemapForm,
    'card-sort': CardSortForm,
  },
  prototype: {
    colors: ColorsForm,
    typography: TypographyForm,
    grid: GridForm,
    spacing: SpacingForm,
    wireframe: WireframeForm,
  },
  test: {
    contrast: ContrastForm,
    wcag: WcagForm,
    heuristics: HeuristicsForm,
    report: ReportForm,
  },
}

const { phase, formKey } = useFormWizard()

const activeForm = computed<Component | null>(() => {
  if (!phase.value || !formKey.value) return null
  const phaseMap = FORM_MAP[phase.value]
  const form = phaseMap[formKey.value]
  return form ?? null
})
</script>

<template>
  <component :is="activeForm" v-if="activeForm" />
  <Result v-else status="404" title="فرم پیدا نشد" sub-title="این مرحله در رجیستری نیست." />
</template>
