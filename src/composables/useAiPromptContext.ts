import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storeToRefs } from 'pinia'
import { usePersona } from '@/composables/usePersona'
import { useWCAG } from '@/composables/useWCAG'
import { HEURISTIC_RULES, type HeuristicEvalMap } from '@/constants/heuristic-rules'
import { useDefineStore } from '@/stores/define'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useIdeateStore } from '@/stores/ideate'
import { useProjectStore } from '@/stores/project'
import { evaluateContrast } from '@/utils/contrast'
import type { AiPromptContext } from '@/utils/ai-prompts'

export function useAiPromptContext(): { buildContext: (userHint?: string) => AiPromptContext } {
  const projectStore = useProjectStore()
  const defineStore = useDefineStore()
  const ideateStore = useIdeateStore()
  const designStore = useDesignSystemStore()
  const { personas } = usePersona()
  const { progress: wcagProgress } = useWCAG()
  const { problemSentence, povSentence } = storeToRefs(defineStore)
  const { ideas } = storeToRefs(ideateStore)
  const { palette } = storeToRefs(designStore)
  const researchNotes = useStorage<string>(STORAGE_KEYS.researchNotes, '')
  const evaluations = useStorage<HeuristicEvalMap>(STORAGE_KEYS.heuristicEval, {})

  function buildContext(userHint?: string): AiPromptContext {
    const personasSummary = personas.value
      .map((p) => `- ${p.name} (${p.role}): اهداف=${p.goals}; دردها=${p.pains}`)
      .join('\n')

    const ideasSummary = ideas.value
      .slice(0, 8)
      .map((i) => `- ${i.title}: ${i.detail}`)
      .join('\n')

    const ratings = HEURISTIC_RULES.map((r) => evaluations.value[r.id]?.rating ?? 0).filter(
      (n) => n > 0,
    )
    const heuristicAverage =
      ratings.length === 0
        ? undefined
        : Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10

    const fg = palette.value.primary[7] ?? '#000000'
    const bg = palette.value.primary[0] ?? '#ffffff'
    const contrast = evaluateContrast(fg, bg)
    const contrastSummary = contrast ? `${contrast.ratio}:1 (${contrast.level})` : undefined

    return {
      projectName: projectStore.name,
      personasSummary: personasSummary || undefined,
      researchNotes: researchNotes.value || undefined,
      problemSentence: problemSentence.value,
      povSentence: povSentence.value,
      ideasSummary: ideasSummary || undefined,
      wcagProgress: wcagProgress.value,
      heuristicAverage,
      contrastSummary,
      userHint,
    }
  }

  return { buildContext }
}
