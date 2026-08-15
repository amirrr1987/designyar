import type { DesignStepKey } from '@/types/project'
import type { UxFlowDocument } from '@/types/document'
import { isContrastCheckRecord } from '@/types/test-state'

/** Flat facts used by completion + coach + soft gates. */
export interface CompletionSnapshot {
  hasBrief: boolean
  hasResearchNotes: boolean
  personaCount: number
  competitorCount: number
  hasEmpathy: boolean
  hasProblem: boolean
  hasPov: boolean
  hmwCount: number
  ideaCount: number
  flowNodeCount: number
  sitemapNodeCount: number
  cardSortCardCount: number
  hasCustomPalette: boolean
  wireframeBlockCount: number
  hasTypography: boolean
  microcopyCount: number
  checklistCount: number
  hasContrastCheck: boolean
  wcagCheckedCount: number
  hasTestSummary: boolean
  hasSynthesis: boolean
}

export type JobId =
  | 'home.brief'
  | 'empathize.notes'
  | 'empathize.persona'
  | 'define.problem'
  | 'define.pov'
  | 'define.hmw'
  | 'ideate.brainstorm'
  | 'ideate.userflow'
  | 'prototype.color'
  | 'prototype.wireframe'
  | 'prototype.type'
  | 'test.contrast'
  | 'test.wcag'
  | 'test.report'
  | 'synthesis.wrap'

export interface NextJob {
  id: JobId
  phase: DesignStepKey | 'home' | 'synthesis'
  /** Route path for CTA */
  route: string
}

export interface PhaseProgress {
  phase: DesignStepKey
  percent: number
  missing: JobId[]
  nextJob: NextJob | null
  isComplete: boolean
}

export interface ProjectProgress {
  overallPercent: number
  phases: PhaseProgress[]
  nextJob: NextJob
  missing: JobId[]
}

function countSitemapNodes(nodes: { children?: unknown[] }[]): number {
  let count = 0
  for (const node of nodes) {
    count += 1
    if (Array.isArray(node.children) && node.children.length > 0) {
      count += countSitemapNodes(node.children as { children?: unknown[] }[])
    }
  }
  return count
}

function isProblemFilled(user: string, need: string, insight: string): boolean {
  return Boolean(user.trim() && need.trim() && insight.trim())
}

/** Build completion facts from the single document. */
export function buildCompletionSnapshot(doc: UxFlowDocument): CompletionSnapshot {
  const { project, empathize, define, ideate, prototype, test, meta } = doc
  const empathyValues = Object.values(empathize.empathyMaps)
  const hasEmpathy = empathyValues.some((entry) => {
    const q = entry.quadrants
    return Boolean(q.says.trim() || q.thinks.trim() || q.does.trim() || q.feels.trim())
  })

  return {
    hasBrief: Boolean(project.briefTitle.trim() || project.briefDescription.trim() || project.name.trim()),
    hasResearchNotes: Boolean(empathize.researchNotes.trim()),
    personaCount: empathize.personas.length,
    competitorCount: empathize.competitors.length,
    hasEmpathy,
    hasProblem: isProblemFilled(define.problem.user, define.problem.need, define.problem.insight),
    hasPov: isProblemFilled(define.pov.user, define.pov.need, define.pov.insight),
    hmwCount: define.hmw.filter((h) => h.question.trim()).length,
    ideaCount: ideate.ideas.length,
    flowNodeCount: ideate.flowNodes.length,
    sitemapNodeCount: countSitemapNodes(ideate.sitemap),
    cardSortCardCount: ideate.cardSort.cards.length,
    hasCustomPalette: Boolean(prototype.designSystem.palette.seed.trim()),
    wireframeBlockCount: prototype.wireframeBlocks.length,
    hasTypography: prototype.designSystem.typography.baseSize > 0,
    microcopyCount: prototype.microcopyBank.length,
    checklistCount: prototype.componentChecklist.length,
    hasContrastCheck: isContrastCheckRecord(test.contrastCheck),
    wcagCheckedCount: test.wcagChecked.length,
    hasTestSummary: Boolean(test.usabilityReportSummary.trim()),
    hasSynthesis: Boolean(meta.projectSynthesis.trim()),
  }
}

function job(
  id: JobId,
  phase: NextJob['phase'],
  route: string,
): NextJob {
  return { id, phase, route }
}

const PHASE_JOBS: Record<DesignStepKey, JobId[]> = {
  empathize: ['empathize.notes', 'empathize.persona'],
  define: ['define.problem', 'define.pov', 'define.hmw'],
  ideate: ['ideate.brainstorm', 'ideate.userflow'],
  prototype: ['prototype.color', 'prototype.wireframe', 'prototype.type'],
  test: ['test.contrast', 'test.wcag', 'test.report'],
}

function isJobDone(id: JobId, s: CompletionSnapshot): boolean {
  switch (id) {
    case 'home.brief':
      return s.hasBrief
    case 'empathize.notes':
      return s.hasResearchNotes
    case 'empathize.persona':
      return s.personaCount >= 1
    case 'define.problem':
      return s.hasProblem
    case 'define.pov':
      return s.hasPov
    case 'define.hmw':
      return s.hmwCount >= 1
    case 'ideate.brainstorm':
      return s.ideaCount >= 3
    case 'ideate.userflow':
      return s.flowNodeCount >= 2
    case 'prototype.color':
      return s.hasCustomPalette
    case 'prototype.wireframe':
      return s.wireframeBlockCount >= 2
    case 'prototype.type':
      return s.hasTypography
    case 'test.contrast':
      return s.hasContrastCheck
    case 'test.wcag':
      return s.wcagCheckedCount >= 3
    case 'test.report':
      return s.hasTestSummary
    case 'synthesis.wrap':
      return s.hasSynthesis
  }
}

function routeForJob(id: JobId): NextJob {
  switch (id) {
    case 'home.brief':
      return job(id, 'home', '/setup')
    case 'empathize.notes':
    case 'empathize.persona':
      return job(id, 'empathize', '/empathize')
    case 'define.problem':
    case 'define.pov':
    case 'define.hmw':
      return job(id, 'define', '/define')
    case 'ideate.brainstorm':
    case 'ideate.userflow':
      return job(id, 'ideate', '/ideate')
    case 'prototype.color':
    case 'prototype.wireframe':
    case 'prototype.type':
      return job(id, 'prototype', '/prototype')
    case 'test.contrast':
    case 'test.wcag':
    case 'test.report':
      return job(id, 'test', '/test')
    case 'synthesis.wrap':
      return job(id, 'synthesis', '/synthesis')
  }
}

export function getPhaseProgress(
  snapshot: CompletionSnapshot,
  phase: DesignStepKey,
): PhaseProgress {
  const required = PHASE_JOBS[phase]
  const missing = required.filter((id) => !isJobDone(id, snapshot))
  const doneCount = required.length - missing.length
  const percent =
    required.length === 0 ? 100 : Math.round((doneCount / required.length) * 100)
  const firstMissing = missing[0]
  return {
    phase,
    percent,
    missing,
    nextJob: firstMissing ? routeForJob(firstMissing) : null,
    isComplete: missing.length === 0,
  }
}

export function getProjectProgress(snapshot: CompletionSnapshot): ProjectProgress {
  const phaseKeys: DesignStepKey[] = [
    'empathize',
    'define',
    'ideate',
    'prototype',
    'test',
  ]
  const phases = phaseKeys.map((p) => getPhaseProgress(snapshot, p))
  const missing: JobId[] = []

  if (!isJobDone('home.brief', snapshot)) {
    missing.push('home.brief')
  }
  for (const p of phases) {
    missing.push(...p.missing)
  }

  const allRequired = (['home.brief', ...phaseKeys.flatMap((k) => PHASE_JOBS[k])] as JobId[])
  const done = allRequired.filter((id) => isJobDone(id, snapshot)).length
  const overallPercent = Math.round((done / allRequired.length) * 100)

  const firstMissing = missing[0]
  const nextJob = firstMissing ? routeForJob(firstMissing) : routeForJob('synthesis.wrap')

  return {
    overallPercent,
    phases,
    nextJob,
    missing,
  }
}

/** Soft gate: recommended previous incomplete phase for junior mode. */
export function getSoftGateRecommendation(
  targetPhase: DesignStepKey,
  snapshot: CompletionSnapshot,
): DesignStepKey | null {
  const order: DesignStepKey[] = [
    'empathize',
    'define',
    'ideate',
    'prototype',
    'test',
  ]
  const targetIndex = order.indexOf(targetPhase)
  if (targetIndex <= 0) return null
  for (let i = 0; i < targetIndex; i++) {
    const key = order[i]
    if (!key) continue
    const progress = getPhaseProgress(snapshot, key)
    if (!progress.isComplete) return key
  }
  return null
}
