import { normalizeProject } from '@/types/project'
import { createDefaultAiPrefs } from '@/types/ai-prefs'
import { isContrastCheckRecord } from '@/types/test-state'
import {
  exportDataToDocument,
  isUxFlowExport,
  type UxFlowExport,
} from '@/utils/project-export'
import { usePersistenceStore } from '@/stores/persistence'
import { fa } from '@/content/fa'

export type ImportResult = { ok: true; exportedAt: string } | { ok: false; error: string }

/** Apply a validated export payload into the single `ux-flow:v1` document (Pinia + LocalStorage). */
export function hydrateFromExport(payload: UxFlowExport): void {
  const d = payload.data
  const data: UxFlowExport['data'] = {
    project: normalizeProject(d.project),
    personas: d.personas,
    empathyMaps: d.empathyMaps,
    empathySelectedPersona: d.empathySelectedPersona,
    researchNotes: d.researchNotes,
    competitors: d.competitors,
    problem: d.problem,
    pov: d.pov,
    hmw: d.hmw,
    ideas: d.ideas,
    userflow: d.userflow,
    sitemap: d.sitemap,
    cardSort: d.cardSort,
    designSystem: d.designSystem,
    wireframeBlocks: d.wireframeBlocks,
    componentChecklist: d.componentChecklist,
    wcagChecked: d.wcagChecked,
    heuristicEval: d.heuristicEval,
    aiPrefs: d.aiPrefs ?? createDefaultAiPrefs(),
    usabilityReportSummary:
      'usabilityReportSummary' in d && typeof d.usabilityReportSummary === 'string'
        ? d.usabilityReportSummary
        : '',
    contrastCheck:
      'contrastCheck' in d &&
      (d.contrastCheck === null || isContrastCheckRecord(d.contrastCheck))
        ? d.contrastCheck
        : null,
    microcopyBank:
      'microcopyBank' in d && Array.isArray(d.microcopyBank) ? d.microcopyBank : [],
    aiHistory: 'aiHistory' in d && Array.isArray(d.aiHistory) ? d.aiHistory : [],
    projectSynthesis:
      'projectSynthesis' in d && typeof d.projectSynthesis === 'string'
        ? d.projectSynthesis
        : '',
  }

  const document = exportDataToDocument(data)
  usePersistenceStore().replaceDocument(document)
}

export async function importUxFlowFromFile(file: File): Promise<ImportResult> {
  let text: string
  try {
    text = await file.text()
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'خواندن فایل ناموفق بود',
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: fa.exportIo.importBadJson }
  }

  if (!isUxFlowExport(parsed)) {
    return {
      ok: false,
      error: fa.exportIo.importBadSchema,
    }
  }

  try {
    hydrateFromExport(parsed)
    return { ok: true, exportedAt: parsed.exportedAt }
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'ذخیره داده‌ها ناموفق بود',
    }
  }
}
