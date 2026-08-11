import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import {
  buildCompletionSnapshot,
  getPhaseProgress,
  getProjectProgress,
  getSoftGateRecommendation,
  type CompletionSnapshot,
  type JobId,
  type NextJob,
  type PhaseProgress,
  type ProjectProgress,
} from '@/domain/completion'
import type { DesignStepKey } from '@/types/project'
import { fa } from '@/content/fa'
import type { AiActionId } from '@/utils/ai-prompts'

/** Contextual primary AI for the current job (junior: one assist). */
const JOB_PRIMARY_AI: Partial<Record<JobId, { action: AiActionId; label: string }>> = {
  'home.brief': { action: 'improve-project-brief', label: 'بهبود شرح با AI' },
  'empathize.notes': { action: 'seed-research-notes', label: 'پیشنهاد اسکلت یادداشت' },
  'empathize.persona': { action: 'persona-suggest', label: 'پیشنهاد پرسونا' },
  'define.problem': { action: 'refine-problem', label: 'پیشنهاد بیان مسئله' },
  'define.pov': { action: 'refine-pov', label: 'پیشنهاد دیدگاه کاربر' },
  'define.hmw': { action: 'generate-hmw', label: 'پیشنهاد سوالات' },
  'ideate.brainstorm': { action: 'brainstorm-ideas', label: 'پیشنهاد ایده' },
  'ideate.userflow': { action: 'suggest-userflow', label: 'پیشنهاد مسیر کاربر' },
  'prototype.color': { action: 'review-design-system', label: 'بازبینی دیزاین سیستم' },
  'prototype.wireframe': { action: 'suggest-wireframe-blocks', label: 'پیشنهاد وایرفریم' },
  'test.report': { action: 'summarize-test', label: 'خلاصه یافته‌های تست' },
  'synthesis.wrap': { action: 'analyze-project', label: 'تحلیل جامع پروژه' },
}

export function useCompletion() {
  const persistence = usePersistenceStore()
  const { document } = storeToRefs(persistence)

  const snapshot = computed((): CompletionSnapshot => buildCompletionSnapshot(document.value))

  const projectProgress = computed((): ProjectProgress => getProjectProgress(snapshot.value))

  const nextJob = computed((): NextJob => projectProgress.value.nextJob)

  function phaseProgress(phase: DesignStepKey): PhaseProgress {
    return getPhaseProgress(snapshot.value, phase)
  }

  function softGateFor(target: DesignStepKey): DesignStepKey | null {
    return getSoftGateRecommendation(target, snapshot.value)
  }

  function jobCopy(jobId: JobId) {
    return fa.getJob(jobId)
  }

  function primaryAiFor(jobId: JobId): { action: AiActionId; label: string } | null {
    return JOB_PRIMARY_AI[jobId] ?? null
  }

  return {
    snapshot,
    projectProgress,
    nextJob,
    phaseProgress,
    softGateFor,
    jobCopy,
    primaryAiFor,
  }
}
