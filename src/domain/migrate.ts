import { LEGACY_STORAGE_KEYS, UX_FLOW_DOCUMENT_KEY } from '@/constants/storage-keys'
import {
  createDefaultDocument,
  isUxFlowDocument,
  normalizeDocument,
  type UxFlowDocument,
} from '@/types/document'
import { createDefaultAiPrefs, isAiPrefs } from '@/types/ai-prefs'
import {
  createEmptyPOV,
  createEmptyProblemStatement,
  isHMWItemArray,
  isPOV,
  isProblemStatement,
} from '@/types/define'
import { createDefaultDesignSystem, isDesignSystem } from '@/types/design-system'
import { isCompetitorRowArray } from '@/types/competitor'
import { isPersonaArray } from '@/types/persona'
import { isMicrocopyEntryArray } from '@/types/microcopy'
import { isAiHistoryEntryArray } from '@/types/ai-history'
import { isHeuristicEvalMap } from '@/types/heuristic-eval'
import { normalizeProject, isProject, createDefaultProject } from '@/types/project'
import {
  createEmptyCardSortState,
  isFlowNode,
  isIdeaCard,
  isSitemapNodeArray,
} from '@/types/ideate'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isIdeaCardArray(value: unknown): value is UxFlowDocument['ideate']['ideas'] {
  return Array.isArray(value) && value.every(isIdeaCard)
}

function isFlowNodeArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(isFlowNode)
}

function isCardSortState(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    Array.isArray(value.cards) &&
    Array.isArray(value.categories) &&
    isStringArray(value.unassignedIds)
  )
}

function isEmpathyMaps(value: unknown): boolean {
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

function readLegacyJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return undefined
    return JSON.parse(raw) as unknown
  } catch {
    return undefined
  }
}

function hasAnyLegacyData(): boolean {
  return Object.values(LEGACY_STORAGE_KEYS).some((key) => localStorage.getItem(key) !== null)
}

function readDocumentFromStorage(): UxFlowDocument | null {
  try {
    const raw = localStorage.getItem(UX_FLOW_DOCUMENT_KEY)
    if (raw === null) return null
    const data: unknown = JSON.parse(raw)
    if (isUxFlowDocument(data)) return data
    return normalizeDocument(data)
  } catch {
    return null
  }
}

function writeDocument(doc: UxFlowDocument): void {
  localStorage.setItem(UX_FLOW_DOCUMENT_KEY, JSON.stringify(doc))
}

/** Assemble v1 document from pre-v1 multi-key LocalStorage. */
export function assembleDocumentFromLegacyKeys(): UxFlowDocument {
  const defaults = createDefaultDocument()
  const projectRaw = readLegacyJson(LEGACY_STORAGE_KEYS.project)
  const personasRaw = readLegacyJson(LEGACY_STORAGE_KEYS.personas)
  const empathyMapsRaw = readLegacyJson(LEGACY_STORAGE_KEYS.empathyMaps)
  const empathySelectedRaw = readLegacyJson(LEGACY_STORAGE_KEYS.empathySelectedPersona)
  const notesRaw = readLegacyJson(LEGACY_STORAGE_KEYS.researchNotes)
  const competitorsRaw = readLegacyJson(LEGACY_STORAGE_KEYS.competitors)
  const problemRaw = readLegacyJson(LEGACY_STORAGE_KEYS.problem)
  const povRaw = readLegacyJson(LEGACY_STORAGE_KEYS.pov)
  const hmwRaw = readLegacyJson(LEGACY_STORAGE_KEYS.hmw)
  const ideasRaw = readLegacyJson(LEGACY_STORAGE_KEYS.ideas)
  const userflowRaw = readLegacyJson(LEGACY_STORAGE_KEYS.userflow)
  const sitemapRaw = readLegacyJson(LEGACY_STORAGE_KEYS.sitemap)
  const cardSortRaw = readLegacyJson(LEGACY_STORAGE_KEYS.cardSort)
  const designSystemRaw = readLegacyJson(LEGACY_STORAGE_KEYS.designSystem)
  const wireframeRaw = readLegacyJson(LEGACY_STORAGE_KEYS.wireframeBlocks)
  const checklistRaw = readLegacyJson(LEGACY_STORAGE_KEYS.componentChecklist)
  const wcagRaw = readLegacyJson(LEGACY_STORAGE_KEYS.wcagChecked)
  const heuristicRaw = readLegacyJson(LEGACY_STORAGE_KEYS.heuristicEval)
  const aiPrefsRaw = readLegacyJson(LEGACY_STORAGE_KEYS.aiPrefs)
  const summaryRaw = readLegacyJson(LEGACY_STORAGE_KEYS.usabilityReportSummary)
  const microcopyRaw = readLegacyJson(LEGACY_STORAGE_KEYS.microcopyBank)
  const historyRaw = readLegacyJson(LEGACY_STORAGE_KEYS.aiHistory)
  const synthesisRaw = readLegacyJson(LEGACY_STORAGE_KEYS.projectSynthesis)

  const project = isProject(projectRaw)
    ? normalizeProject(projectRaw)
    : projectRaw !== undefined
      ? normalizeProject(projectRaw)
      : createDefaultProject()

  return {
    schemaVersion: 1,
    project: { ...project, schemaVersion: 1 },
    empathize: {
      researchNotes: isString(notesRaw) ? notesRaw : '',
      personas: isPersonaArray(personasRaw) ? personasRaw : [],
      empathyMaps: isEmpathyMaps(empathyMapsRaw)
        ? (empathyMapsRaw as UxFlowDocument['empathize']['empathyMaps'])
        : {},
      empathySelectedPersona: isString(empathySelectedRaw) ? empathySelectedRaw : 'general',
      competitors: isCompetitorRowArray(competitorsRaw) ? competitorsRaw : [],
    },
    define: {
      problem: isProblemStatement(problemRaw) ? problemRaw : createEmptyProblemStatement(),
      pov: isPOV(povRaw) ? povRaw : createEmptyPOV(),
      hmw: isHMWItemArray(hmwRaw) ? hmwRaw : [],
    },
    ideate: {
      ideas: isIdeaCardArray(ideasRaw) ? (ideasRaw as UxFlowDocument['ideate']['ideas']) : [],
      flowNodes: isFlowNodeArray(userflowRaw)
        ? (userflowRaw as UxFlowDocument['ideate']['flowNodes'])
        : [],
      sitemap: isSitemapNodeArray(sitemapRaw)
        ? sitemapRaw
        : defaults.ideate.sitemap,
      cardSort: isCardSortState(cardSortRaw)
        ? (cardSortRaw as UxFlowDocument['ideate']['cardSort'])
        : createEmptyCardSortState(),
    },
    prototype: {
      designSystem: isDesignSystem(designSystemRaw) ? designSystemRaw : createDefaultDesignSystem(),
      wireframeBlocks: isStringArray(wireframeRaw)
        ? wireframeRaw
        : defaults.prototype.wireframeBlocks,
      componentChecklist: isStringArray(checklistRaw) ? checklistRaw : [],
      microcopyBank: isMicrocopyEntryArray(microcopyRaw) ? microcopyRaw : [],
    },
    test: {
      wcagChecked: isStringArray(wcagRaw) ? wcagRaw : [],
      heuristicEval: isHeuristicEvalMap(heuristicRaw) ? heuristicRaw : {},
      usabilityReportSummary: isString(summaryRaw) ? summaryRaw : '',
      contrastCheck: null,
    },
    meta: {
      projectSynthesis: isString(synthesisRaw) ? synthesisRaw : '',
      aiHistory: isAiHistoryEntryArray(historyRaw) ? historyRaw : [],
    },
    aiPrefs: isAiPrefs(aiPrefsRaw) ? aiPrefsRaw : createDefaultAiPrefs(),
  }
}

export interface MigrateResult {
  document: UxFlowDocument
  /** True when legacy keys were copied into `ux-flow:v1`. */
  migratedFromLegacy: boolean
}

/**
 * Ensure `ux-flow:v1` exists. Prefer existing document; else migrate legacy keys.
 * Safe to call multiple times (idempotent).
 */
export function migrateToDocumentV1(): MigrateResult {
  const existing = readDocumentFromStorage()
  if (existing) {
    const normalized = normalizeDocument(existing)
    if (JSON.stringify(normalized) !== JSON.stringify(existing)) {
      writeDocument(normalized)
    }
    return { document: normalized, migratedFromLegacy: false }
  }

  if (hasAnyLegacyData()) {
    const assembled = assembleDocumentFromLegacyKeys()
    writeDocument(assembled)
    return { document: assembled, migratedFromLegacy: true }
  }

  const fresh = createDefaultDocument()
  writeDocument(fresh)
  return { document: fresh, migratedFromLegacy: false }
}
