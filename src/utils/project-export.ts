import { UX_FLOW_DOCUMENT_KEY } from '@/constants/storage-keys'
import type { AiPrefs } from '@/types/ai-prefs'
import { createDefaultAiPrefs, isAiPrefs } from '@/types/ai-prefs'
import type { AiHistoryEntry } from '@/types/ai-history'
import { isAiHistoryEntryArray } from '@/types/ai-history'
import type { HeuristicEvalMap } from '@/types/heuristic-eval'
import { isHeuristicEvalMap } from '@/types/heuristic-eval'
import type { ContrastCheckRecord } from '@/types/test-state'
import { isContrastCheckRecord } from '@/types/test-state'
import type { CompetitorRow } from '@/types/competitor'
import type { HMWItem, POV, ProblemStatement } from '@/types/define'
import type { DesignSystem } from '@/types/design-system'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type { CardSortState, FlowNode, IdeaCard, SitemapNode } from '@/types/ideate'
import type { Persona } from '@/types/persona'
import type { MicrocopyEntry } from '@/types/microcopy'
import type { Project } from '@/types/project'
import type { UxFlowDocument } from '@/types/document'
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
  normalizeProject,
} from '@/types'
import {
  createEmptyCardSortState,
  isFlowNode,
  isIdeaCard,
  isSitemapNodeArray,
} from '@/types/ideate'
import { isMicrocopyEntryArray } from '@/types/microcopy'
import { createDefaultDocument, normalizeDocument, isUxFlowDocument } from '@/types/document'
import { migrateToDocumentV1 } from '@/domain/migrate'

/** Export file format version (flat payload for round-trip + legacy imports). */
export const UX_FLOW_EXPORT_VERSION = 6 as const

export interface UxFlowExport {
  version: typeof UX_FLOW_EXPORT_VERSION | 5 | 4 | 3 | 2 | 1
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
    usabilityReportSummary: string
    /** Always written on v6+; optional on older imports. */
    contrastCheck: ContrastCheckRecord | null
    microcopyBank: MicrocopyEntry[]
    aiHistory: AiHistoryEntry[]
    projectSynthesis: string
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

function readDocument(): UxFlowDocument {
  try {
    const raw = localStorage.getItem(UX_FLOW_DOCUMENT_KEY)
    if (raw === null) {
      return migrateToDocumentV1().document
    }
    const data: unknown = JSON.parse(raw)
    if (isUxFlowDocument(data)) return data
    return normalizeDocument(data)
  } catch {
    return createDefaultDocument()
  }
}

export function documentToExportData(doc: UxFlowDocument): UxFlowExport['data'] {
  return {
    project: normalizeProject(doc.project),
    personas: doc.empathize.personas,
    empathyMaps: doc.empathize.empathyMaps,
    empathySelectedPersona: doc.empathize.empathySelectedPersona,
    researchNotes: doc.empathize.researchNotes,
    competitors: doc.empathize.competitors,
    problem: doc.define.problem,
    pov: doc.define.pov,
    hmw: doc.define.hmw,
    ideas: doc.ideate.ideas,
    userflow: doc.ideate.flowNodes,
    sitemap: doc.ideate.sitemap,
    cardSort: doc.ideate.cardSort,
    designSystem: doc.prototype.designSystem,
    wireframeBlocks: doc.prototype.wireframeBlocks,
    componentChecklist: doc.prototype.componentChecklist,
    wcagChecked: doc.test.wcagChecked,
    heuristicEval: doc.test.heuristicEval,
    aiPrefs: doc.aiPrefs,
    usabilityReportSummary: doc.test.usabilityReportSummary,
    contrastCheck: doc.test.contrastCheck,
    microcopyBank: doc.prototype.microcopyBank,
    aiHistory: doc.meta.aiHistory,
    projectSynthesis: doc.meta.projectSynthesis,
  }
}

export function exportDataToDocument(data: UxFlowExport['data']): UxFlowDocument {
  return normalizeDocument({
    schemaVersion: 1,
    project: { ...normalizeProject(data.project), schemaVersion: 1 },
    empathize: {
      researchNotes: data.researchNotes,
      personas: data.personas,
      empathyMaps: data.empathyMaps,
      empathySelectedPersona: data.empathySelectedPersona,
      competitors: data.competitors,
    },
    define: {
      problem: data.problem,
      pov: data.pov,
      hmw: data.hmw,
    },
    ideate: {
      ideas: data.ideas,
      flowNodes: data.userflow,
      sitemap: data.sitemap,
      cardSort: data.cardSort,
    },
    prototype: {
      designSystem: data.designSystem,
      wireframeBlocks: data.wireframeBlocks,
      componentChecklist: data.componentChecklist,
      microcopyBank: data.microcopyBank,
    },
    test: {
      wcagChecked: data.wcagChecked,
      heuristicEval: data.heuristicEval,
      usabilityReportSummary: data.usabilityReportSummary,
      contrastCheck:
        data.contrastCheck === undefined
          ? null
          : data.contrastCheck === null || isContrastCheckRecord(data.contrastCheck)
            ? data.contrastCheck
            : null,
    },
    meta: {
      projectSynthesis: data.projectSynthesis,
      aiHistory: data.aiHistory,
    },
    aiPrefs: data.aiPrefs,
  })
}

export function isUxFlowExport(value: unknown): value is UxFlowExport {
  if (!isRecord(value)) return false
  if (
    value.version !== UX_FLOW_EXPORT_VERSION &&
    value.version !== 5 &&
    value.version !== 4 &&
    value.version !== 3 &&
    value.version !== 2 &&
    value.version !== 1
  ) {
    return false
  }
  if (typeof value.exportedAt !== 'string') return false
  if (!isRecord(value.data)) return false
  const d = value.data
  const summaryOk = value.version === 1 || typeof d.usabilityReportSummary === 'string'
  const microcopyOk =
    value.version <= 2 || isMicrocopyEntryArray(d.microcopyBank) || d.microcopyBank === undefined
  const historyOk =
    value.version <= 2 || isAiHistoryEntryArray(d.aiHistory) || d.aiHistory === undefined
  const synthesisOk =
    value.version <= 3 ||
    typeof d.projectSynthesis === 'string' ||
    d.projectSynthesis === undefined
  const contrastOk =
    value.version < 6 ||
    d.contrastCheck === null ||
    isContrastCheckRecord(d.contrastCheck) ||
    d.contrastCheck === undefined
  return (
    summaryOk &&
    microcopyOk &&
    historyOk &&
    synthesisOk &&
    contrastOk &&
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

/** Pure round-trip: document → export data → document (for sanity / tests). */
export function roundTripDocument(doc: UxFlowDocument): UxFlowDocument {
  return exportDataToDocument(documentToExportData(doc))
}

export function buildUxFlowExport(): UxFlowExport {
  const doc = readDocument()
  return {
    version: UX_FLOW_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: documentToExportData(doc),
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

/** @deprecated Defaults kept for type-check of old call sites during rebuild. */
export const _exportDefaults = {
  createDefaultProject,
  createDefaultDesignSystem,
  createEmptyProblemStatement,
  createEmptyPOV,
  createEmptyCardSortState,
  createDefaultAiPrefs,
}
