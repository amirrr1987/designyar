import type { AiPrefs } from '@/stores/ai'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { HeuristicEvalMap } from '@/constants/heuristic-rules'
import type { CompetitorRow } from '@/types/competitor'
import type { HMWItem, POV, ProblemStatement } from '@/types/define'
import type { DesignSystem } from '@/types/design-system'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type {
  CardSortState,
  FlowNode,
  IdeaCard,
  SitemapNode,
} from '@/types/ideate'
import type { Persona } from '@/types/persona'
import type { Project } from '@/types/project'
import {
  createDefaultDesignSystem,
  createDefaultProject,
  createEmptyPOV,
  createEmptyProblemStatement,
  isCompetitorRowArray,
  isDesignSystem,
  isHMWItemArray,
  isPersonaArray,
  isPOV,
  isProblemStatement,
  isProject,
} from '@/types'
import {
  createEmptyCardSortState,
  isFlowNode,
  isIdeaCard,
  isSitemapNodeArray,
} from '@/types/ideate'

export const UX_FLOW_EXPORT_VERSION = 1 as const

export interface UxFlowExport {
  version: typeof UX_FLOW_EXPORT_VERSION
  exportedAt: string
  data: {
    project: Project
    personas: Persona[]
    empathyMaps: EmpathyMapsByPersona
    empathySelectedPersona: string
    researchNotes: string
    competitors: CompetitorRow[]
    problem: ProblemStatement
    pov: POV
    hmw: HMWItem[]
    ideas: IdeaCard[]
    userflow: FlowNode[]
    sitemap: SitemapNode[]
    cardSort: CardSortState
    designSystem: DesignSystem
    wireframeBlocks: string[]
    componentChecklist: string[]
    wcagChecked: string[]
    heuristicEval: HeuristicEvalMap
    aiPrefs: AiPrefs
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isIdeaCardArray(value: unknown): value is IdeaCard[] {
  return Array.isArray(value) && value.every(isIdeaCard)
}

function isFlowNodeArray(value: unknown): value is FlowNode[] {
  return Array.isArray(value) && value.every(isFlowNode)
}

function isCardSortState(value: unknown): value is CardSortState {
  if (!isRecord(value)) return false
  return (
    Array.isArray(value.cards) &&
    Array.isArray(value.categories) &&
    isStringArray(value.unassignedIds)
  )
}

function isAiPrefs(value: unknown): value is AiPrefs {
  if (!isRecord(value)) return false
  return typeof value.selectedModelId === 'string'
}

function isHeuristicEvalMap(value: unknown): value is HeuristicEvalMap {
  if (!isRecord(value)) return false
  return Object.values(value).every((entry) => {
    if (!isRecord(entry)) return false
    return (
      typeof entry.ruleId === 'string' &&
      typeof entry.rating === 'number' &&
      typeof entry.notes === 'string'
    )
  })
}

function isEmpathyMaps(value: unknown): value is EmpathyMapsByPersona {
  if (!isRecord(value)) return false
  return Object.values(value).every((entry) => {
    if (!isRecord(entry)) return false
    const q = entry.quadrants
    if (!isRecord(q)) return false
    return (
      typeof entry.personaId === 'string' &&
      typeof entry.updatedAt === 'string' &&
      typeof q.says === 'string' &&
      typeof q.thinks === 'string' &&
      typeof q.does === 'string' &&
      typeof q.feels === 'string'
    )
  })
}

function readOr<T>(key: string, fallback: T, guard: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const data: unknown = JSON.parse(raw)
    return guard(data) ? data : fallback
  } catch {
    return fallback
  }
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isUxFlowExport(value: unknown): value is UxFlowExport {
  if (!isRecord(value)) return false
  if (value.version !== UX_FLOW_EXPORT_VERSION) return false
  if (typeof value.exportedAt !== 'string') return false
  if (!isRecord(value.data)) return false
  const d = value.data
  return (
    isProject(d.project) &&
    isPersonaArray(d.personas) &&
    isEmpathyMaps(d.empathyMaps) &&
    typeof d.empathySelectedPersona === 'string' &&
    typeof d.researchNotes === 'string' &&
    isCompetitorRowArray(d.competitors) &&
    isProblemStatement(d.problem) &&
    isPOV(d.pov) &&
    isHMWItemArray(d.hmw) &&
    isIdeaCardArray(d.ideas) &&
    isFlowNodeArray(d.userflow) &&
    isSitemapNodeArray(d.sitemap) &&
    isCardSortState(d.cardSort) &&
    isDesignSystem(d.designSystem) &&
    isStringArray(d.wireframeBlocks) &&
    isStringArray(d.componentChecklist) &&
    isStringArray(d.wcagChecked) &&
    isHeuristicEvalMap(d.heuristicEval) &&
    isAiPrefs(d.aiPrefs)
  )
}

export function buildUxFlowExport(): UxFlowExport {
  return {
    version: UX_FLOW_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      project: readOr(STORAGE_KEYS.project, createDefaultProject(), isProject),
      personas: readOr(STORAGE_KEYS.personas, [], isPersonaArray),
      empathyMaps: readOr(STORAGE_KEYS.empathyMaps, {}, isEmpathyMaps),
      empathySelectedPersona: readOr(
        STORAGE_KEYS.empathySelectedPersona,
        'general',
        isString,
      ),
      researchNotes: readOr(STORAGE_KEYS.researchNotes, '', isString),
      competitors: readOr(STORAGE_KEYS.competitors, [], isCompetitorRowArray),
      problem: readOr(
        STORAGE_KEYS.problem,
        createEmptyProblemStatement(),
        isProblemStatement,
      ),
      pov: readOr(STORAGE_KEYS.pov, createEmptyPOV(), isPOV),
      hmw: readOr(STORAGE_KEYS.hmw, [], isHMWItemArray),
      ideas: readOr(STORAGE_KEYS.ideas, [], isIdeaCardArray),
      userflow: readOr(STORAGE_KEYS.userflow, [], isFlowNodeArray),
      sitemap: readOr(STORAGE_KEYS.sitemap, [], isSitemapNodeArray),
      cardSort: readOr(
        STORAGE_KEYS.cardSort,
        createEmptyCardSortState(),
        isCardSortState,
      ),
      designSystem: readOr(
        STORAGE_KEYS.designSystem,
        createDefaultDesignSystem(),
        isDesignSystem,
      ),
      wireframeBlocks: readOr(STORAGE_KEYS.wireframeBlocks, [], isStringArray),
      componentChecklist: readOr(STORAGE_KEYS.componentChecklist, [], isStringArray),
      wcagChecked: readOr(STORAGE_KEYS.wcagChecked, [], isStringArray),
      heuristicEval: readOr(STORAGE_KEYS.heuristicEval, {}, isHeuristicEvalMap),
      aiPrefs: readOr(
        STORAGE_KEYS.aiPrefs,
        { selectedModelId: 'SmolLM2-360M-Instruct-q4f16_1-MLC' },
        isAiPrefs,
      ),
    },
  }
}

export function downloadUxFlowExport(filename = 'designyar-export.json'): void {
  const payload = buildUxFlowExport()
  const text = JSON.stringify(payload, null, 2)
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
